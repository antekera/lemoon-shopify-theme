#!/usr/bin/env python3
"""Deploy the checked main revision without replacing merchant theme settings."""

import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import tempfile


STORE = "lemoon-8277.myshopify.com"
MARKER = "assets/lemoon-deployment.json"
BOOTSTRAP_SHA = "3264927f5e4129cca605469acbe7007e95747208"
THEME_DIRECTORIES = {"assets", "config", "layout", "locales", "sections", "snippets", "templates", "blocks"}
SETTINGS = "config/settings_data.json"


def normalize_store(value):
    if not isinstance(value, str):
        raise ValueError("Production store must be a hostname")
    host = value.strip().removeprefix("https://").rstrip("/").lower()
    if host != STORE:
        raise ValueError("Production store must be lemoon-8277.myshopify.com")
    return host


def deployment_allowed(event, ref):
    return event == "push" and ref == "refs/heads/main"


def select_live_theme(payload, expected_id):
    if isinstance(payload, dict) and (payload.get("errors") or payload.get("error")):
        raise ValueError("Theme list returned an error")
    themes = payload if isinstance(payload, list) else payload.get("themes") if isinstance(payload, dict) else None
    if not isinstance(themes, list) or not all(isinstance(t, dict) for t in themes):
        raise ValueError("Unexpected theme list response")
    live = [t for t in themes if t.get("role") in {"main", "live"}]
    if len(live) != 1:
        raise ValueError("Exactly one published theme is required")
    theme = live[0]
    if not re.fullmatch(r"[0-9]+", str(theme.get("id", ""))):
        raise ValueError("Published theme ID must be numeric")
    if str(theme["id"]) != str(expected_id):
        raise ValueError("Published theme differs from SHOPIFY_PRODUCTION_THEME_ID")
    if theme.get("processing"):
        raise ValueError("Published theme is still processing")
    return theme


def theme_path(filename):
    parts = filename.split("/")
    return (len(parts) >= 2 and parts[0] in THEME_DIRECTORIES
            and all(re.fullmatch(r"[A-Za-z0-9_.-]+", part) and part not in {".", ".."} for part in parts)
            and filename != SETTINGS)


def push_command(store, theme_id, files, directory=None):
    if not re.fullmatch(r"[1-9][0-9]*", str(theme_id)):
        raise ValueError("Theme ID must be a positive numeric ID")
    if not files or not all(theme_path(filename) for filename in files):
        raise ValueError("Upload requires an explicit safe theme-file allowlist")
    command = ["shopify", "theme", "push", "--store", normalize_store(store),
               "--theme", str(theme_id), "--allow-live", "--nodelete",
               "--ignore", SETTINGS, "--json"]
    if directory:
        command.extend(["--path", str(directory)])
    for filename in sorted(set(files)):
        command.extend(["--only", filename])
    return command


def select_push_result(payload, expected_id):
    if not isinstance(payload, dict) or payload.get("error") or payload.get("errors"):
        raise ValueError("Theme upload returned an invalid or failed result")
    if payload.get("status") in {"cancelled", "canceled", "failed", "error"}:
        raise ValueError("Theme upload did not complete")
    theme = payload.get("theme")
    if not isinstance(theme, dict) or not re.fullmatch(r"[1-9][0-9]*", str(theme.get("id", ""))):
        raise ValueError("Theme upload returned no valid theme identity")
    if str(theme["id"]) != str(expected_id):
        raise ValueError("Theme upload receipt identifies another theme")
    if theme.get("warning") or theme.get("errors") or theme.get("error"):
        raise ValueError("Theme upload was partial or reported file errors; deployment is not successful")
    if theme.get("status") in {"cancelled", "canceled", "failed", "error"}:
        raise ValueError("Theme upload did not complete")
    if "shop" in theme:
        normalize_store(theme["shop"])
    return theme


def run(command):
    result = subprocess.run(command, text=True, capture_output=True)
    if result.returncode:
        message = result.stderr or result.stdout or "Command failed"
        token = os.environ.get("SHOPIFY_CLI_THEME_TOKEN", "")
        if token:
            message = message.replace(token, "[redacted]")
        raise ValueError(message[:4000])
    return result.stdout


def assert_current_main():
    expected = os.environ.get("GITHUB_SHA", "")
    if not re.fullmatch(r"[0-9a-f]{40}", expected):
        raise ValueError("A full CI commit SHA is required")
    if run(["git", "rev-parse", "HEAD"]).strip() != expected:
        raise ValueError("Checkout differs from the checked CI revision")
    remote = run(["git", "ls-remote", "origin", "refs/heads/main"]).split()
    if not remote or remote[0] != expected:
        raise ValueError("Main advanced; obsolete deployment stopped before upload")


def pull(store, theme_id, directory, files):
    command = ["shopify", "theme", "pull", "--store", store, "--theme", str(theme_id),
               "--path", str(directory), "--nodelete"]
    for filename in files:
        command.extend(["--only", filename])
    run(command)


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def canonical_json(content):
    def unique_pairs(pairs):
        result = {}
        for key, value in pairs:
            if key in result:
                raise ValueError("Duplicate JSON key")
            result[key] = value
        return result

    def invalid_constant(_value):
        raise ValueError("Invalid JSON constant")

    text = content.decode("utf-8")
    # Shopify may prepend its generated-file notice and reindent JSON.
    text = re.sub(r"^\s*/\*.*?\*/\s*", "", text, count=1, flags=re.DOTALL)
    return json.dumps(json.loads(text, object_pairs_hook=unique_pairs, parse_constant=invalid_constant),
                      ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False)


def same_content(filename, left, right):
    if left == right:
        return True
    if left is None or right is None or not filename.endswith(".json"):
        return False
    try:
        return canonical_json(left) == canonical_json(right)
    except (ValueError, UnicodeError):
        return False


def parse_marker(content):
    try:
        marker = json.loads(canonical_json(content))
    except (ValueError, UnicodeError) as error:
        raise ValueError("Deployment marker is invalid") from error
    if (not isinstance(marker, dict) or set(marker) != {"schema", "sha"}
            or type(marker["schema"]) is not int or marker["schema"] != 1
            or not isinstance(marker["sha"], str) or not re.fullmatch(r"[0-9a-f]{40}", marker["sha"])):
        raise ValueError("Deployment marker is invalid")
    return marker["sha"]


def git_bytes(arguments):
    result = subprocess.run(["git", *arguments], capture_output=True)
    if result.returncode:
        raise ValueError("Git deployment history is unavailable")
    return result.stdout


def snapshot(revision):
    entries = {}
    for entry in git_bytes(["ls-tree", "-r", "-z", revision]).split(b"\0"):
        if not entry:
            continue
        metadata, raw_name = entry.split(b"\t", 1)
        filename = raw_name.decode("utf-8")
        if filename == SETTINGS or filename.split("/", 1)[0] not in THEME_DIRECTORIES:
            continue
        if not theme_path(filename):
            raise ValueError("Theme source contains an unsupported filename")
        mode, kind, blob = metadata.split()
        if kind != b"blob" or mode not in {b"100644", b"100755"}:
            raise ValueError("Theme source includes a non-regular file")
        if filename == MARKER:
            raise ValueError("Deployment marker must not be committed as theme source")
        entries[filename] = blob.decode("ascii")
    return entries


def deployment_baseline(marker_content, target):
    if marker_content is None:
        # A missing marker is permitted once, immediately after the verified rollout.
        parent = git_bytes(["rev-parse", target + "^1"]).decode().strip()
        if parent != BOOTSTRAP_SHA:
            raise ValueError("Deployment marker missing outside the reviewed bootstrap release")
        baseline = BOOTSTRAP_SHA
    else:
        baseline = parse_marker(marker_content)
    git_bytes(["merge-base", "--is-ancestor", BOOTSTRAP_SHA, baseline])
    git_bytes(["merge-base", "--is-ancestor", baseline, target])
    return baseline


def read_optional(directory, filename):
    path = directory / filename
    return path.read_bytes() if path.is_file() else None


def verify_remote(filename, baseline, target, remote):
    if not same_content(filename, remote, baseline) and not same_content(filename, remote, target):
        raise ValueError(f"Production conflict in {filename}; reconcile the deployed change before release")


def verify_candidates(directory, files, old, new):
    for filename in files:
        baseline = git_bytes(["cat-file", "blob", old[filename]]) if filename in old else None
        target = git_bytes(["cat-file", "blob", new[filename]])
        verify_remote(filename, baseline, target, read_optional(directory, filename))


def verify_readback(directory, files, new):
    for filename in files:
        if not same_content(filename, read_optional(directory, filename), git_bytes(["cat-file", "blob", new[filename]])):
            raise ValueError(f"Published file readback differs from checked revision: {filename}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--preflight", action="store_true", help="Read published theme; never upload")
    args = parser.parse_args()
    try:
        store = normalize_store(os.environ.get("SHOPIFY_PRODUCTION_STORE", STORE))
        expected_id = os.environ.get("SHOPIFY_PRODUCTION_THEME_ID", "")
        if not expected_id or not os.environ.get("SHOPIFY_CLI_THEME_TOKEN"):
            raise ValueError("Theme credentials and expected production theme ID are required")
        if not args.preflight and not deployment_allowed(os.environ.get("GITHUB_EVENT_NAME"), os.environ.get("GITHUB_REF")):
            raise ValueError("Production upload is restricted to CI pushes on main")
        theme = select_live_theme(json.loads(run(["shopify", "theme", "list", "--store", store, "--json"])), expected_id)
        print(f"Verified {store}: published theme {theme['id']} ({theme.get('name', '')})")
        if args.preflight:
            print("Read-only preflight passed; no upload performed")
            return 0
        target = os.environ.get("GITHUB_SHA", "")
        assert_current_main()
        with tempfile.TemporaryDirectory(prefix="lemoon-production-") as tmp:
            before, recheck, after, receipt = [Path(tmp) / name for name in ("before", "recheck", "after", "receipt")]
            for directory in (before, recheck, after, receipt):
                directory.mkdir()
            pull(store, theme["id"], before, [SETTINGS, MARKER])
            settings = digest(before / SETTINGS)
            marker_content = read_optional(before, MARKER)
            baseline = deployment_baseline(marker_content, target)
            old, new = snapshot(baseline), snapshot(target)
            files = sorted(filename for filename in new if new[filename] != old.get(filename))
            deleted = sorted(set(old) - set(new))
            if deleted:
                print(f"Preserving {len(deleted)} removed source files remotely; no deletions performed")
            if files:
                pull(store, theme["id"], before, files)
                verify_candidates(before, files, old, new)
            # Fresh directories ensure missing remote files cannot be masked by an older pull.
            pull(store, theme["id"], recheck, [SETTINGS, MARKER, *files])
            if digest(recheck / SETTINGS) != settings or read_optional(recheck, MARKER) != marker_content:
                raise ValueError("Production configuration or release marker changed during preflight")
            verify_candidates(recheck, files, old, new)
            assert_current_main()
            select_live_theme(json.loads(run(["shopify", "theme", "list", "--store", store, "--json"])), expected_id)
            if files:
                select_push_result(json.loads(run(push_command(store, theme["id"], files))), expected_id)
            pull(store, theme["id"], after, [SETTINGS, MARKER, *files])
            if digest(after / SETTINGS) != settings:
                raise ValueError("Merchant settings changed during deployment; inspect concurrent editor activity")
            if read_optional(after, MARKER) != marker_content:
                raise ValueError("Deployment marker changed concurrently")
            verify_readback(after, files, new)
            select_live_theme(json.loads(run(["shopify", "theme", "list", "--store", store, "--json"])), expected_id)
            assert_current_main()
            # Write only a public revision identifier after every payload readback passed.
            for folder in ("assets", "config", "layout", "templates"):
                (receipt / folder).mkdir()
            (receipt / MARKER).write_text(json.dumps({"schema": 1, "sha": target}) + "\n")
            select_push_result(json.loads(run(push_command(store, theme["id"], [MARKER], receipt))), expected_id)
            final = Path(tmp) / "final"
            final.mkdir()
            pull(store, theme["id"], final, [SETTINGS, MARKER])
            if digest(final / SETTINGS) != settings or parse_marker((final / MARKER).read_bytes()) != target:
                raise ValueError("Deployment receipt or preserved settings failed final readback")
            select_live_theme(json.loads(run(["shopify", "theme", "list", "--store", store, "--json"])), expected_id)
        print(f"Deployed {target} to live theme {theme['id']}; {len(files)} changed files verified, settings preserved")
        return 0
    except (ValueError, OSError, json.JSONDecodeError) as error:
        print(f"Deployment stopped: {error}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
