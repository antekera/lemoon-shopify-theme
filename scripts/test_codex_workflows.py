#!/usr/bin/env python3
"""Validate repository-level Codex skill and custom-agent metadata."""

from __future__ import annotations

import argparse
import re
import sys
import tomllib
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SKILLS = {
    "git": {
        "theme-commit",
        "open-theme-pr",
        "start-theme-feature",
        "theme-status",
    },
    "shopify": {"push-theme-dev", "push-theme-production"},
    "design": {"design-interpreter"},
    "scaffold": {"new-theme-section", "scaffold-theme-snippet"},
    "builder": {"build-theme-section"},
    "reviews": {"theme-code-review", "theme-conventions-review"},
    "tokens": {"audit-design-tokens"},
    "translator": {"translate-theme-locales"},
}
AGENTS = {
    "design": {"design-interpreter"},
    "builder": {"section-builder"},
    "reviews": {"theme-code-reviewer", "theme-conventions-reviewer"},
    "tokens": {"design-token-auditor"},
    "translator": {"chilean-spanish-translator"},
}
GROUPS = {
    "core": set(),
    "git": {"git"},
    "shopify": {"shopify"},
    "design": {"design"},
    "scaffold": {"scaffold"},
    "builder": {"builder"},
    "reviews": {"reviews"},
    "tokens": {"tokens"},
    "translator": {"translator"},
    "authoring": {"design", "scaffold", "builder"},
    "quality": {"reviews", "tokens", "translator"},
    "all": set(SKILLS),
}


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def validate_skill(name: str) -> None:
    path = ROOT / ".agents" / "skills" / name / "SKILL.md"
    require(path.is_file(), f"missing skill file: {path.relative_to(ROOT)}")
    content = path.read_text(encoding="utf-8")
    parts = content.split("---", maxsplit=2)
    require(len(parts) == 3 and not parts[0].strip(), f"{name}: missing YAML frontmatter")
    frontmatter = parts[1]
    skill_name = re.search(r"(?m)^name:\s*(\S+)\s*$", frontmatter)
    description = re.search(r"(?m)^description:\s*(.+?)\s*$", frontmatter)
    require(skill_name is not None, f"{name}: frontmatter has no name")
    require(skill_name.group(1) == name, f"{name}: frontmatter name does not match directory")
    require(description is not None and description.group(1).strip(), f"{name}: description is empty")


def validate_agent(name: str) -> None:
    path = ROOT / ".codex" / "agents" / f"{name}.toml"
    require(path.is_file(), f"missing agent file: {path.relative_to(ROOT)}")
    with path.open("rb") as agent_file:
        config = tomllib.load(agent_file)
    require(config.get("name") == name, f"{name}: TOML name is missing or mismatched")
    require(bool(config.get("description", "").strip()), f"{name}: description is empty")
    require(bool(config.get("developer_instructions", "").strip()), f"{name}: developer_instructions is empty")


def validate_group(group: str) -> None:
    if group == "core":
        path = ROOT / "AGENTS.md"
        require(path.is_file(), "missing root AGENTS.md")
        content = path.read_text(encoding="utf-8").lower()
        for required in ("shopify liquid", "main", ".env", "config/settings_data.json", "theme check", "production", "confirmation"):
            require(required in content, f"AGENTS.md is missing required guidance: {required}")
        for reference in (".claude/rules/liquid-conventions.md", ".claude/rules/section-schema.md", ".claude/rules/git-conventions.md", ".claude/rules/theme-workflow.md"):
            require((ROOT / reference).is_file(), f"AGENTS.md references missing file: {reference}")

    selected = GROUPS[group]
    skill_names = set().union(*(SKILLS[item] for item in selected)) if selected else set()
    agent_names = set().union(*(AGENTS.get(item, set()) for item in selected)) if selected else set()
    for name in sorted(skill_names):
        validate_skill(name)
    for name in sorted(agent_names):
        validate_agent(name)

    if group == "shopify":
        dev = (ROOT / ".agents/skills/push-theme-dev/SKILL.md").read_text(encoding="utf-8")
        prod = (ROOT / ".agents/skills/push-theme-production/SKILL.md").read_text(encoding="utf-8").lower()
        require("155925381288" in dev, "dev publishing skill must target theme 155925381288")
        require("shopify theme list" in prod and "confirm" in prod, "production publishing must inspect the live theme and require confirmation")
        confirmation_index = prod.find("only after confirmation")
        allow_live_index = prod.find("--allow-live")
        require(confirmation_index >= 0 and allow_live_index >= 0 and confirmation_index < allow_live_index, "production publishing must add --allow-live only after confirmation")

    if group == "git":
        commit = (ROOT / ".agents/skills/theme-commit/SKILL.md").read_text(encoding="utf-8")
        for path in ("AGENTS.md", ".agents/skills/", ".codex/agents/"):
            require(path in commit, f"commit workflow must allow selected Codex files: {path}")

    if group == "all":
        require(sum(map(len, SKILLS.values())) == 14, "workflow map must contain exactly 14 skills")
        require(len(set().union(*AGENTS.values())) == 6, "workflow map must contain exactly six custom agents")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("group", choices=sorted(GROUPS))
    args = parser.parse_args()
    try:
        validate_group(args.group)
    except (AssertionError, OSError, tomllib.TOMLDecodeError) as error:
        print(f"FAIL [{args.group}]: {error}", file=sys.stderr)
        return 1
    print(f"PASS [{args.group}]")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
