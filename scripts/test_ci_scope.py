#!/usr/bin/env python3
"""Behavioral CI-routing regressions using disposable Git repositories."""

import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

import ci_scope


SCRIPT = Path(ci_scope.__file__).resolve()


class ScopeTests(unittest.TestCase):
    def setUp(self):
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        self.root = Path(temporary.name)
        self.env = {
            **os.environ,
            "GIT_AUTHOR_NAME": "CI fixture", "GIT_COMMITTER_NAME": "CI fixture",
            "GIT_AUTHOR_EMAIL": "ci@example.invalid", "GIT_COMMITTER_EMAIL": "ci@example.invalid",
        }
        self.git("init", "-q")
        self.git("commit", "-qm", "empty base", "--allow-empty")
        self.base = self.git("rev-parse", "HEAD").strip()

    def git(self, *args):
        return subprocess.run(
            ["git", *args], cwd=self.root, env=self.env, check=True,
            capture_output=True, text=True,
        ).stdout

    def write(self, path):
        target = self.root / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text("fixture\n")

    def commit(self):
        self.git("add", "--all")
        self.git("commit", "-qm", "fixture change", "--allow-empty")
        return self.git("rev-parse", "HEAD").strip()

    def scope(self, base=None):
        return ci_scope.determine_scope(
            "pull_request", base or self.base, self.git("rev-parse", "HEAD").strip(), self.root,
        )

    def cli(self, event="pull_request", base=None, head=None, output=None):
        return subprocess.run(
            [sys.executable, "-B", str(SCRIPT)], cwd=self.root,
            env={**self.env, "CI_EVENT_NAME": event, "PR_BASE_SHA": base or self.base,
                 "PR_HEAD_SHA": head or self.git("rev-parse", "HEAD").strip(),
                 "GITHUB_OUTPUT": str(output or self.root / "output")},
            capture_output=True, text=True,
        )

    def test_docs_and_selected_python_only_skip(self):
        for path in (
            "docs/design/test.md", ".codex/agents/test.toml", ".agents/skills/a/SKILL.md",
            ".claude/rules/test.md", "AGENTS.md", "README.MD",
            ".github/workflows/ci.yml", "scripts/ci_scope.py", "scripts/test_ci_scope.py",
            "scripts/test_codex_workflows.py", "scripts/test_codex_workflow_validator.py",
        ):
            self.write(path)
        self.commit()
        self.assertEqual(self.scope(), (False, "known-non-runtime-only"))

    def test_each_runtime_root_and_unknown_path_require_audit(self):
        for path in (
            "assets/test.css", "blocks/test.liquid", "config/test.json", "layout/test.liquid",
            "locales/test.json", "sections/test.liquid", "snippets/test.liquid",
            "templates/test.json", "package.json", "package-lock.json", "yarn.lock",
            "pnpm-lock.yaml", ".nvmrc", ".shopifyignore", "unknown", "scripts/fix-store.ts",
            "scripts/unknown.py", ".github/actions/test/action.yml", ".github/workflows/other.yml",
            "nested/readme.md", "assets/$(touch injected)\nreason=false.css",
        ):
            with self.subTest(path=path):
                base = self.git("rev-parse", "HEAD").strip()
                self.write(path)
                self.commit()
                self.assertEqual(self.scope(base), (True, "runtime-or-unknown-path"))
        self.assertFalse((self.root / "injected").exists())

    def test_mixed_docs_and_runtime_require_audit(self):
        self.write("docs/test.md")
        self.write("assets/test.css")
        self.commit()
        self.assertTrue(self.scope()[0])

    def test_empty_diff_skips(self):
        self.assertEqual(self.scope(), (False, "known-non-runtime-only"))

    def test_push_and_manual_always_full_without_refs_or_repository(self):
        for event in ("push", "workflow_dispatch"):
            with self.subTest(event=event):
                self.assertEqual(ci_scope.determine_scope(event, cwd="/does-not-exist"),
                                 (True, "full-audit-event"))
                result = self.cli(event, base="invalid", head="invalid")
                self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual((self.root / "output").read_text(),
                         "runtime_changed=true\nreason=full-audit-event\n" * 2)

    def test_invalid_or_missing_refs_fail(self):
        for bad in ("", "main", "a" * 39, "g" * 40, "a" * 41, "a" * 40 + "\n", "$(touch injected)"):
            for base, head in ((bad, self.base), (self.base, bad)):
                with self.subTest(base=base, head=head):
                    with self.assertRaises(ValueError):
                        ci_scope.determine_scope("pull_request", base, head, self.root)

    def test_missing_commit_and_missing_merge_base_fail(self):
        with self.assertRaises(subprocess.CalledProcessError):
            ci_scope.determine_scope("pull_request", self.base, "0" * 40, self.root)
        self.git("checkout", "--orphan", "unrelated")
        unrelated = self.commit()
        with self.assertRaises(subprocess.CalledProcessError):
            ci_scope.determine_scope("pull_request", self.base, unrelated, self.root)

    def test_merge_base_excludes_base_branch_only_changes(self):
        self.git("checkout", "-b", "feature")
        self.write("docs/feature.md")
        head = self.commit()
        self.git("checkout", "-b", "base-advanced", self.base)
        self.write("assets/base-only.css")
        base = self.commit()
        self.assertEqual(ci_scope.determine_scope("pull_request", base, head, self.root),
                         (False, "known-non-runtime-only"))

    def test_rename_checks_both_old_and_new_paths(self):
        for old, new, expected in (
            ("assets/old.css", "docs/new.md", True),
            ("docs/old.md", "assets/new.css", True),
            ("docs/a.md", "docs/b.md", False),
        ):
            with self.subTest(old=old, new=new):
                self.write(old)
                base = self.commit()
                (self.root / new).parent.mkdir(parents=True, exist_ok=True)
                self.git("mv", old, new)
                self.commit()
                self.assertEqual(self.scope(base)[0], expected)

    def test_deletions_check_deleted_paths(self):
        for path, expected in (("assets/deleted.css", True), ("docs/deleted.md", False)):
            self.write(path)
            base = self.commit()
            self.git("rm", path)
            self.commit()
            self.assertEqual(self.scope(base)[0], expected)

    def test_cli_output_is_exact_and_appended(self):
        output = self.root / "output"
        output.write_text("previous=value\n")
        result = self.cli(output=output)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(output.read_text(),
                         "previous=value\nruntime_changed=false\nreason=known-non-runtime-only\n")
        self.assertIn("not applicable", result.stdout)
        self.write("assets/evil\nreason=false.css")
        self.commit()
        output.write_text("")
        result = self.cli()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(output.read_text(), "runtime_changed=true\nreason=runtime-or-unknown-path\n")

    def test_cli_failures_emit_no_skip_outputs(self):
        for event, base, head in (
            ("pull_request", "bad", self.base),
            ("pull_request", self.base, "0" * 40),
            ("unknown", self.base, self.base),
        ):
            with self.subTest(event=event, base=base, head=head):
                output = self.root / "output"
                output.write_text("")
                result = self.cli(event, base, head)
                self.assertNotEqual(result.returncode, 0)
                self.assertEqual(output.read_text(), "")
                self.assertIn("failing rather than skipping", result.stderr)

    def test_output_write_failure_fails_ci(self):
        result = self.cli(output=self.root / "absent/output")
        self.assertNotEqual(result.returncode, 0)


if __name__ == "__main__":
    unittest.main()
