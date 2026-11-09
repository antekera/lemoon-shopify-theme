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
    "delivery": set(),
}
AGENTS = {
    "design": {"design-interpreter"},
    "builder": {"section-builder"},
    "reviews": {"theme-code-reviewer", "theme-conventions-reviewer", "lemoon-copy-reviewer"},
    "tokens": {"design-token-auditor"},
    "translator": {"chilean-spanish-translator"},
    "delivery": {
        "lemoon-copywriter", "lemoon-copy-reviewer", "linear-delivery-coordinator",
        "theme-test-engineer", "theme-developer", "lemoon-design-lead",
        "theme-code-reviewer", "theme-conventions-reviewer",
    },
}
READ_ONLY_AGENTS = {
    "theme-code-reviewer", "theme-conventions-reviewer", "lemoon-copy-reviewer",
    "design-token-auditor",
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
    "delivery": {"delivery"},
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
    if name in READ_ONLY_AGENTS:
        # Role metadata is not an effective runtime permission boundary.
        instructions = config["developer_instructions"].lower()
        for required in (
            "read-only is this role's behavioral scope",
            "inherit the parent session permissions",
            "separately configured read-only parent session",
            "verify effective permissions",
            "mutating connectors must be unavailable",
            "report the limitation",
            "never describe prompt instructions as enforced capability isolation",
        ):
            require(required in instructions, f"{name}: missing read-only contract: {required}")


def require_agent_scope(name: str, requirements: tuple[str, ...]) -> None:
    with (ROOT / ".codex/agents" / f"{name}.toml").open("rb") as agent_file:
        instructions = tomllib.load(agent_file)["developer_instructions"].lower()
    for required in requirements:
        require(required.lower() in instructions, f"{name}: missing responsibility: {required}")


def validate_group(group: str) -> None:
    if group in {"core", "all"}:
        path = ROOT / "AGENTS.md"
        require(path.is_file(), "missing root AGENTS.md")
        content = path.read_text(encoding="utf-8").lower()
        for required in ("shopify liquid", "develop", "main", ".env", "config/settings_data.json", "theme check", "production", "standing authorization"):
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

    if group in {"shopify", "all"}:
        dev = (ROOT / ".agents/skills/push-theme-dev/SKILL.md").read_text(encoding="utf-8")
        prod = (ROOT / ".agents/skills/push-theme-production/SKILL.md").read_text(encoding="utf-8").lower()
        require("189557964968" in dev, "dev publishing skill must target theme 189557964968")
        require("standing authorization" in prod, "production publishing must document standing authorization")
        require(".github/workflows/deploy-production.yml" in prod and "main" in prod,
                "production publishing must use the main CI deployment workflow")
        require("only after confirmation" not in prod,
                "production publishing must not restore individual confirmation gates")
        deployment = ROOT / ".github/workflows/deploy-production.yml"
        require(deployment.is_file(), "missing production deployment workflow")
        require("scripts/deploy_shopify.py" in deployment.read_text(encoding="utf-8"),
                "production workflow must use the validated deployment helper")
        require((ROOT / "scripts/deploy_shopify.py").is_file(), "missing production deployment helper")

    if group in {"git", "all"}:
        commit = (ROOT / ".agents/skills/theme-commit/SKILL.md").read_text(encoding="utf-8")
        for path in ("AGENTS.md", ".agents/skills/", ".codex/agents/"):
            require(path in commit, f"commit workflow must allow selected Codex files: {path}")
        spec = (ROOT / "docs/superpowers/specs/2026-10-10-codex-workflow-port-design.md").read_text(encoding="utf-8")
        require(".agents/skills/**" in spec and ".codex/agents/**" in spec and "AGENTS.md" in spec, "design spec must document the Codex commit allowlist")
        # The dated port specification remains historical; current Gitflow and
        # standing deployment authority live in the operational skills/rules.
        pr = (ROOT / ".agents/skills/open-theme-pr/SKILL.md").read_text(encoding="utf-8")
        start = (ROOT / ".agents/skills/start-theme-feature/SKILL.md").read_text(encoding="utf-8")
        require("--base develop" in pr, "feature PR workflow must target develop by default")
        require("origin develop" in start, "feature branches must start from current develop")

    if group in {"builder", "all"}:
        builder = (ROOT / ".agents/skills/build-theme-section/SKILL.md").read_text(encoding="utf-8")
        require("section-builder" in builder and "agent" in builder.lower(), "section workflow must delegate to the section-builder agent")

    if group in {"delivery", "all"}:
        require_agent_scope("theme-code-reviewer", (
            "copy integration", "escaping", "html semantics", "localization",
            "legal-source review belongs to lemoon-copy-reviewer",
            ".codex/agents/lemoon-copy-reviewer.toml",
            "instead of treating code approval as copy approval", "do not edit files",
            "do not rewrite copy, commit, open prs, merge, or change linear states",
        ))
        require_agent_scope("lemoon-copy-reviewer", (
            "editorial guide/research notes", "open cited sources independently",
            "current official chilean sources", "statutory rights",
            "confirmed business information", "source/access limitations",
            "final integrated text", "keep files, linear states/comments, and pr state unchanged",
            "do not rewrite the copy under review or approve your own work",
        ))
        require_agent_scope("theme-developer", (
            "lemoon-copywriter", "lemoon-copy-reviewer", "same page ticket",
            "mocked flow", "shopify theme check --fail-level error",
        ))
        require_agent_scope("lemoon-design-lead", (
            "canonical design.md", "sources, confirmed decisions, discrepancies",
            "review mode is read-only", "distinguish source inspection from rendered verification",
        ))
        require_agent_scope("linear-delivery-coordinator", (
            "independent editorial/source review to lemoon-copy-reviewer",
            "theme-test-engineer", "theme-code-reviewer", "theme-conventions-reviewer",
            "sandbox_mode does not enforce isolation", "verify the effective permissions",
            "keep merge blocked", "designated human reviewer's explicit approval",
        ))
        guidance = (ROOT / "AGENTS.md").read_text(encoding="utf-8")
        for required in ("Context7-first", "resolve-library-id", "query-docs"):
            require(required in guidance, f"test agent documentation reference lacks repository guidance: {required}")
        for required in (
            "custom agent files inherit parent-session permissions",
            "role-level `sandbox_mode` does not enforce read-only access",
            "mutating connectors unavailable", "verify effective permissions",
            "report the limitation", "keep merge blocked",
        ):
            require(required in guidance.lower(), f"AGENTS.md lacks review permission guidance: {required}")

    if group in {"tokens", "all"}:
        token_skill = (ROOT / ".agents/skills/audit-design-tokens/SKILL.md").read_text(encoding="utf-8")
        require("--font-heading-family" in token_skill and "'Urbanist', sans-serif" in token_skill, "token skill must audit the documented heading font")
        require("--font-body-family" in token_skill and "'Instrument Sans', sans-serif" in token_skill, "token skill must audit the documented body font")
        require_agent_scope("design-token-auditor", (
            "canonical design.md", "assets/base.css", "config/settings_schema.json",
            "heading/body families and weights", "documented values",
            "trace variable/settings resolution", "unresolved decisions for lemoon-design-lead",
            "keep files and external state unchanged",
        ))

    if group == "all":
        require(sum(map(len, SKILLS.values())) == 14, "workflow map must contain exactly 14 skills")
        mapped_agents = set().union(*AGENTS.values())
        actual_agents = {path.stem for path in (ROOT / ".codex/agents").glob("*.toml")}
        require(mapped_agents == actual_agents,
                f"agent inventory mismatch: unmapped={sorted(actual_agents - mapped_agents)}, "
                f"missing={sorted(mapped_agents - actual_agents)}")


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
