#!/usr/bin/env python3
"""Regression tests for workflow validation using disposable repository fixtures."""

import shutil
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import test_codex_workflows as validator


class WorkflowValidatorTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        sources = [validator.ROOT / "AGENTS.md"]
        sources.extend((validator.ROOT / ".codex/agents").glob("*.toml"))
        sources.extend((validator.ROOT / ".agents/skills").glob("*/SKILL.md"))
        sources.extend((validator.ROOT / ".claude/rules").glob("*.md"))
        sources.append(validator.ROOT / "docs/superpowers/specs/2026-10-10-codex-workflow-port-design.md")
        for source in sources:
            target = self.root / source.relative_to(validator.ROOT)
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(source, target)
        root_patch = patch.object(validator, "ROOT", self.root)
        root_patch.start()
        self.addCleanup(root_patch.stop)

    def assert_rejected_edit(self, relative, original, replacement, group, message):
        path = self.root / relative
        content = path.read_text()
        self.assertIn(original, content)
        path.write_text(content.replace(original, replacement))
        try:
            with self.assertRaisesRegex(AssertionError, message):
                validator.validate_group(group)
        finally:
            path.write_text(content)

    def test_current_repository_and_every_group(self):
        for group in validator.GROUPS:
            with self.subTest(group=group):
                validator.validate_group(group)

    def test_all_roles_have_validated_metadata(self):
        for path in (self.root / ".codex/agents").glob("*.toml"):
            for field, message in (
                (f'name = "{path.stem}"', "name is missing or mismatched"),
                ("description = ", "description is empty"),
                ("developer_instructions = ", "developer_instructions is empty"),
            ):
                with self.subTest(role=path.stem, field=field):
                    self.assert_rejected_edit(
                        path.relative_to(self.root), field, "removed_" + field,
                        "all", message,
                    )

    def test_every_read_only_role_requires_each_permission_limit(self):
        for name in validator.READ_ONLY_AGENTS:
            for clause in (
                "Read-only is this role's behavioral scope",
                "inherit the parent session permissions",
                "separately configured read-only parent session",
                "verify effective permissions",
                "Mutating connectors must be unavailable",
                "report the limitation",
                "never describe prompt instructions as enforced capability isolation",
            ):
                with self.subTest(role=name, clause=clause):
                    self.assert_rejected_edit(
                        f".codex/agents/{name}.toml", clause, "REMOVED",
                        "all", "missing read-only contract",
                    )

    def test_role_sandbox_metadata_cannot_substitute_for_behavior(self):
        relative = ".codex/agents/theme-code-reviewer.toml"
        path = self.root / relative
        path.write_text('sandbox_mode = "read-only"\n' + path.read_text())
        validator.validate_group("delivery")
        self.assert_rejected_edit(
            relative, "verify effective permissions", "REMOVED",
            "delivery", "missing read-only contract",
        )

    def test_editorial_and_integration_responsibilities_are_separate(self):
        cases = (
            ("theme-code-reviewer", "copy integration"),
            ("theme-code-reviewer", "legal-source review belongs to lemoon-copy-reviewer"),
            ("theme-code-reviewer", "instead of treating code approval as copy approval"),
            ("lemoon-copy-reviewer", "Open cited sources independently"),
            ("lemoon-copy-reviewer", "current official Chilean sources"),
            ("lemoon-copy-reviewer", "confirmed business information"),
            ("lemoon-copy-reviewer", "Keep files, Linear states/comments, and PR state unchanged"),
            ("theme-developer", "lemoon-copy-reviewer"),
            ("lemoon-design-lead", "Review mode is read-only"),
            ("linear-delivery-coordinator", "independent editorial/source review to lemoon-copy-reviewer"),
            ("linear-delivery-coordinator", "sandbox_mode does not enforce isolation"),
        )
        for name, clause in cases:
            with self.subTest(role=name, clause=clause):
                self.assert_rejected_edit(
                    f".codex/agents/{name}.toml", clause, "REMOVED",
                    "delivery", "missing responsibility",
                )

    def test_root_review_permission_guidance_is_required(self):
        self.assert_rejected_edit(
            "AGENTS.md", "role-level `sandbox_mode` does not enforce read-only access",
            "REMOVED", "delivery", "lacks review permission guidance",
        )

    def test_token_auditor_uses_documented_typography_and_resolution(self):
        for clause in ("heading/body families and weights", "Trace variable/settings resolution"):
            with self.subTest(clause=clause):
                self.assert_rejected_edit(
                    ".codex/agents/design-token-auditor.toml", clause, "REMOVED",
                    "all", "missing responsibility",
                )

    def test_unmapped_agent_cannot_escape_all_validation(self):
        (self.root / ".codex/agents/unmapped.toml").write_text(
            'name = "unmapped"\ndescription = "New role"\ndeveloper_instructions = "Review"\n'
        )
        with self.assertRaisesRegex(AssertionError, "agent inventory mismatch: unmapped=.*unmapped"):
            validator.validate_group("all")

    def test_delivery_includes_previously_unmapped_roles(self):
        for name in ("theme-developer", "lemoon-design-lead", "lemoon-copy-reviewer"):
            with self.subTest(role=name):
                self.assert_rejected_edit(
                    f".codex/agents/{name}.toml", f'name = "{name}"',
                    'name = "wrong"', "delivery", "name is missing or mismatched",
                )


if __name__ == "__main__":
    unittest.main()
