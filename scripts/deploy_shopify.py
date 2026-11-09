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


def push_command(store, theme_id):
    if not re.fullmatch(r"[1-9][0-9]*", str(theme_id)):
        raise ValueError("Theme ID must be a positive numeric ID")
    return ["shopify", "theme", "push", "--store", normalize_store(store),
            "--theme", str(theme_id), "--allow-live", "--nodelete",
            "--ignore", "config/settings_data.json", "--json"]


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
        root = Path.cwd()
        with tempfile.TemporaryDirectory(prefix="lemoon-production-") as tmp:
            before, after = Path(tmp) / "before", Path(tmp) / "after"
            before.mkdir()
            after.mkdir()
            pull(store, theme["id"], before, ["config/settings_data.json"])
            settings = digest(before / "config/settings_data.json")
            assert_current_main()
            # Recheck role immediately before writing; a changed live theme is a failure.
            select_live_theme(json.loads(run(["shopify", "theme", "list", "--store", store, "--json"])), expected_id)
            select_push_result(json.loads(run(push_command(store, theme["id"]))), expected_id)
            pull(store, theme["id"], after, ["config/settings_data.json", "layout/theme.liquid"])
            if digest(after / "config/settings_data.json") != settings:
                raise ValueError("Merchant settings changed during deployment; inspect concurrent editor activity")
            if digest(after / "layout/theme.liquid") != digest(root / "layout/theme.liquid"):
                raise ValueError("Published layout readback differs from the checked revision")
            select_live_theme(json.loads(run(["shopify", "theme", "list", "--store", store, "--json"])), expected_id)
        print(f"Deployed {os.environ['GITHUB_SHA']} to live theme {theme['id']}; settings preserved and layout read back")
        return 0
    except (ValueError, OSError, json.JSONDecodeError) as error:
        print(f"Deployment stopped: {error}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
