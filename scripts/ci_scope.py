#!/usr/bin/env python3
"""Route Lighthouse by PR impact; unknown paths require the full audit."""

import os
from pathlib import Path
import re
import subprocess
import sys


NON_RUNTIME_PREFIXES = ("docs/", ".codex/", ".agents/", ".claude/")
NON_RUNTIME_FILES = frozenset({
    ".github/workflows/ci.yml",
    "scripts/test_codex_workflows.py",
    "scripts/test_codex_workflow_validator.py",
    "scripts/ci_scope.py",
    "scripts/test_ci_scope.py",
})
SHA = re.compile(r"[0-9a-fA-F]{40}")


def is_non_runtime(path):
    return (
        path.startswith(NON_RUNTIME_PREFIXES)
        or path in NON_RUNTIME_FILES
        or ("/" not in path and path.lower().endswith(".md"))
    )


def determine_scope(event, base="", head="", cwd=None):
    if event in {"push", "workflow_dispatch"}:
        return True, "full-audit-event"
    if event != "pull_request":
        raise ValueError("Unsupported CI event")
    if not SHA.fullmatch(base) or not SHA.fullmatch(head):
        raise ValueError("PR base and head must be 40-character hexadecimal SHAs")
    # No rename detection: both the deleted old path and added new path matter.
    result = subprocess.run(
        ["git", "diff", "--no-renames", "--name-only", "-z", f"{base}...{head}"],
        cwd=cwd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
    )
    paths = os.fsdecode(result.stdout).split("\0")
    runtime = any(not is_non_runtime(path) for path in paths if path)
    return runtime, "runtime-or-unknown-path" if runtime else "known-non-runtime-only"


def main():
    try:
        runtime, reason = determine_scope(
            os.environ.get("CI_EVENT_NAME", ""),
            os.environ.get("PR_BASE_SHA", ""),
            os.environ.get("PR_HEAD_SHA", ""),
        )
        output = f"runtime_changed={str(runtime).lower()}\nreason={reason}\n"
        with Path(os.environ["GITHUB_OUTPUT"]).open("a", encoding="utf-8") as target:
            target.write(output)
        print(f"Lighthouse scope: {reason}")
        if not runtime:
            print("Lighthouse is not applicable to this PR; no performance result was measured.")
    except (ValueError, subprocess.CalledProcessError, OSError, KeyError):
        print("CI scope could not be determined; failing rather than skipping the audit.", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
