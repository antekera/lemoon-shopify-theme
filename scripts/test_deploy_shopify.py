#!/usr/bin/env python3
"""Credential-free regressions for production deployment target selection."""

import contextlib
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

import deploy_shopify


STORE = "lemoon-8277.myshopify.com"
LIVE_ID = "155307737256"


def live_theme(**changes):
    return {"id": int(LIVE_ID), "name": "Published theme", "role": "live", "processing": False, **changes}


class ProductionDeploymentTests(unittest.TestCase):
    def environment(self, **changes):
        return {
            "SHOPIFY_PRODUCTION_STORE": STORE,
            "SHOPIFY_PRODUCTION_THEME_ID": LIVE_ID,
            "SHOPIFY_CLI_THEME_TOKEN": "fixture-token-only",
            "GITHUB_EVENT_NAME": "push", "GITHUB_REF": "refs/heads/main", "GITHUB_SHA": "a" * 40,
            **changes,
        }

    def test_only_main_push_can_write_to_shopify(self):
        self.assertTrue(deploy_shopify.deployment_allowed("push", "refs/heads/main"))
        for event, ref in (
            ("push", "refs/heads/develop"),
            ("push", "refs/heads/feat/example"),
            ("push", "refs/tags/main"),
            ("push", "refs/heads/main/other"),
            ("push", "refs/heads/main\n"),
            ("pull_request", "refs/heads/main"),
            ("pull_request_target", "refs/heads/main"),
            ("workflow_dispatch", "refs/heads/main"),
            ("workflow_call", "refs/heads/main"),
            ("push\n", "refs/heads/main"),
            (None, None),
        ):
            with self.subTest(event=event, ref=ref):
                self.assertFalse(deploy_shopify.deployment_allowed(event, ref))

    def test_store_normalizes_to_the_pinned_shop(self):
        self.assertEqual(deploy_shopify.normalize_store(STORE), STORE)

    def test_other_stores_and_url_injection_are_rejected(self):
        for store in (
            "", None, "other.myshopify.com", "pzsrt4-1u.myshopify.com", "lemoon.cl",
            "lemoon-8277.myshopify.com.evil.test", "https://evil.test/lemoon-8277.myshopify.com",
            "https://lemoon-8277.myshopify.com@evil.test", "https://evil.test@lemoon-8277.myshopify.com",
            "lemoon-8277.myshopify.com:443", "lemoon-8277.myshopify.com/admin",
            "lemoon-8277.myshopify.com?store=other", "lemoon-8277.myshopify.com\n--store=other",
        ):
            with self.subTest(store=store):
                with self.assertRaises(ValueError):
                    deploy_shopify.normalize_store(store)

    def test_accepts_both_cli_list_shapes_and_checks_the_expected_live_id(self):
        selected = live_theme()
        themes = [live_theme(id=189557964968, role="development"), selected]
        for payload in (themes, {"themes": themes}):
            with self.subTest(payload=payload):
                actual = deploy_shopify.select_live_theme(payload, LIVE_ID)
                self.assertEqual(str(actual["id"]), LIVE_ID)
                self.assertEqual(actual["name"], selected["name"])
                self.assertEqual(actual["role"], "live")

    def test_accepts_decimal_id_from_cli_without_relying_on_theme_names(self):
        actual = deploy_shopify.select_live_theme([live_theme(id=LIVE_ID, name="Renamed production")], LIVE_ID)
        self.assertEqual(str(actual["id"]), LIVE_ID)

    def test_fails_closed_for_malformed_cli_payloads(self):
        for payload in (
            None, {}, {"themes": None}, {"themes": {}}, "[]", [None], ["live"],
            {"error": "authentication failed"}, {"themes": [live_theme()], "errors": ["partial response"]},
        ):
            with self.subTest(payload=payload):
                with self.assertRaises(ValueError):
                    deploy_shopify.select_live_theme(payload, LIVE_ID)

    def test_missing_and_ambiguous_live_targets_are_rejected(self):
        for themes in (
            [], [live_theme(role="development")], [live_theme(role="unpublished")],
            [live_theme(), live_theme(id=155307737257)], [live_theme(), live_theme()],
        ):
            with self.subTest(themes=themes):
                with self.assertRaises(ValueError):
                    deploy_shopify.select_live_theme(themes, LIVE_ID)

    def test_never_pushes_a_processing_live_theme(self):
        with self.assertRaises(ValueError):
            deploy_shopify.select_live_theme([live_theme(processing=True)], LIVE_ID)

    def test_refuses_a_live_theme_changed_since_the_configured_target(self):
        with self.assertRaises(ValueError):
            deploy_shopify.select_live_theme([live_theme(id=155307737257)], LIVE_ID)

    def test_non_decimal_and_missing_ids_are_rejected(self):
        for value in (None, "", "0", 0, -1, True, "155307737256\n", "gid://shopify/OnlineStoreTheme/155307737256", "155307737256 --publish"):
            with self.subTest(value=value):
                with self.assertRaises(ValueError):
                    deploy_shopify.select_live_theme([live_theme(id=value)], LIVE_ID)

    def test_expected_id_must_also_be_an_explicit_valid_target(self):
        for expected in (None, "", "0", "not-a-theme", "155307737256\n"):
            with self.subTest(expected=expected):
                with self.assertRaises(ValueError):
                    deploy_shopify.select_live_theme([live_theme()], expected)

    def test_push_result_requires_the_expected_theme_without_requiring_an_invented_store_field(self):
        for theme_id in (LIVE_ID, int(LIVE_ID)):
            with self.subTest(theme_id=theme_id):
                theme = {"id": theme_id, "name": "Published theme"}
                selected = deploy_shopify.select_push_result({"theme": theme}, LIVE_ID)
                self.assertEqual(str(selected["id"]), LIVE_ID)
                self.assertEqual(selected["name"], theme["name"])

    def test_partial_warning_and_cancelled_push_results_fail_despite_zero_cli_exit(self):
        for payload in (
            {"theme": {"id": LIVE_ID, "warning": "Some files could not be uploaded"}},
            {"theme": {"id": LIVE_ID, "errors": [{"file": "sections/example.liquid", "message": "Upload failed"}]}},
            {"theme": {"id": LIVE_ID}, "error": "Upload failed"},
            {"theme": {"id": LIVE_ID}, "errors": ["Partial upload"]},
            {"theme": {"id": LIVE_ID}, "status": "cancelled"},
            {"theme": {"id": LIVE_ID}, "status": "failed"},
        ):
            with self.subTest(payload=payload):
                with self.assertRaises(ValueError):
                    deploy_shopify.select_push_result(payload, LIVE_ID)

    def test_unexpected_and_wrong_theme_push_responses_fail_closed(self):
        for payload in (
            None, [], {}, "{}", {"themes": [live_theme()]}, {"theme": None}, {"theme": []}, {"theme": {}},
            {"theme": {"id": ""}}, {"theme": {"id": True}}, {"theme": {"id": "gid://shopify/OnlineStoreTheme/155307737256"}},
            {"theme": {"id": int(LIVE_ID) + 1}},
        ):
            with self.subTest(payload=payload):
                with self.assertRaises(ValueError):
                    deploy_shopify.select_push_result(payload, LIVE_ID)

    def test_push_command_preserves_editor_configuration_and_unowned_files(self):
        command = deploy_shopify.push_command(STORE, LIVE_ID)
        self.assertIsInstance(command, list)
        self.assertEqual(command[:3], ["shopify", "theme", "push"])
        self.assertEqual(command[command.index("--store") + 1], STORE)
        self.assertEqual(command[command.index("--theme") + 1], LIVE_ID)
        self.assertIn("--allow-live", command)
        self.assertIn("--nodelete", command)
        self.assertIn("--json", command)
        self.assertEqual(command[command.index("--ignore") + 1], "config/settings_data.json")
        self.assertNotIn("--publish", command)
        self.assertNotIn("--live", command)
        self.assertNotIn("--force", command)

    def test_push_command_revalidates_its_store_and_theme_arguments(self):
        for store, theme_id in (("other.myshopify.com", LIVE_ID), (STORE, "155307737256; echo injected"), (STORE, "")):
            with self.subTest(store=store, theme_id=theme_id):
                with self.assertRaises(ValueError):
                    deploy_shopify.push_command(store, theme_id)

    def test_current_main_requires_the_exact_checked_and_remote_revision(self):
        revision = "a" * 40
        with patch.dict(deploy_shopify.os.environ, {"GITHUB_SHA": revision}, clear=True):
            with patch.object(deploy_shopify, "run", side_effect=[revision + "\n", revision + "\trefs/heads/main\n"]) as run:
                deploy_shopify.assert_current_main()
                self.assertEqual(run.call_args_list[0].args[0], ["git", "rev-parse", "HEAD"])
                self.assertEqual(run.call_args_list[1].args[0], ["git", "ls-remote", "origin", "refs/heads/main"])
            for outputs in (["b" * 40], [revision, "b" * 40 + "\trefs/heads/main"], [revision, ""]):
                with self.subTest(outputs=outputs), patch.object(deploy_shopify, "run", side_effect=outputs):
                    with self.assertRaises(ValueError):
                        deploy_shopify.assert_current_main()

    def test_invalid_checked_sha_fails_before_running_git(self):
        for revision in ("", "main", "a" * 39, "g" * 40, "a" * 40 + "\n"):
            with self.subTest(revision=revision), patch.dict(deploy_shopify.os.environ, {"GITHUB_SHA": revision}, clear=True):
                with patch.object(deploy_shopify, "run") as run:
                    with self.assertRaises(ValueError):
                        deploy_shopify.assert_current_main()
                    run.assert_not_called()

    def test_manual_preflight_reads_the_target_without_pull_or_push(self):
        output = io.StringIO()
        with patch.dict(deploy_shopify.os.environ, self.environment(GITHUB_EVENT_NAME="workflow_dispatch"), clear=True), \
                patch("sys.argv", ["deploy_shopify.py", "--preflight"]), \
                patch.object(deploy_shopify, "run", return_value=json.dumps([live_theme()])) as run, \
                patch.object(deploy_shopify, "pull") as pull, \
                patch.object(deploy_shopify, "assert_current_main") as revision_check, \
                contextlib.redirect_stdout(output):
            self.assertEqual(deploy_shopify.main(), 0)
        run.assert_called_once_with(["shopify", "theme", "list", "--store", STORE, "--json"])
        pull.assert_not_called()
        revision_check.assert_not_called()
        self.assertIn("no upload performed", output.getvalue())

    def test_non_main_write_request_stops_before_any_shopify_command(self):
        with patch.dict(deploy_shopify.os.environ, self.environment(GITHUB_REF="refs/heads/develop"), clear=True), \
                patch("sys.argv", ["deploy_shopify.py"]), patch.object(deploy_shopify, "run") as run, \
                contextlib.redirect_stdout(io.StringIO()):
            self.assertEqual(deploy_shopify.main(), 1)
        run.assert_not_called()

    def test_stale_main_stops_after_backup_and_before_upload(self):
        def pull(_store, _theme, directory, files):
            target = Path(directory) / "config/settings_data.json"
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text('{"merchant":"configuration"}')

        with patch.dict(deploy_shopify.os.environ, self.environment(), clear=True), \
                patch("sys.argv", ["deploy_shopify.py"]), \
                patch.object(deploy_shopify, "run", return_value=json.dumps([live_theme()])) as run, \
                patch.object(deploy_shopify, "pull", side_effect=pull) as backup, \
                patch.object(deploy_shopify, "assert_current_main", side_effect=ValueError("Main advanced")), \
                contextlib.redirect_stdout(io.StringIO()):
            self.assertEqual(deploy_shopify.main(), 1)
        self.assertEqual(backup.call_count, 1)
        self.assertFalse(any(call.args[0][:3] == ["shopify", "theme", "push"] for call in run.call_args_list))

    def test_success_requires_preserved_settings_and_matching_layout_readback(self):
        for change in (None, "settings", "layout"):
            with self.subTest(change=change), tempfile.TemporaryDirectory() as directory:
                root = Path(directory)
                (root / "layout").mkdir()
                (root / "layout/theme.liquid").write_text("checked layout\n")

                def pull(_store, _theme, target, files):
                    for filename in files:
                        file = Path(target) / filename
                        file.parent.mkdir(parents=True, exist_ok=True)
                        value = "checked layout\n" if filename == "layout/theme.liquid" else '{"merchant":"configuration"}'
                        if Path(target).name == "after" and ((change == "settings" and filename.startswith("config/")) or (change == "layout" and filename.startswith("layout/"))):
                            value = "concurrent change\n"
                        file.write_text(value)

                def run(command):
                    return json.dumps({"theme": {"id": int(LIVE_ID)}} if command[:3] == ["shopify", "theme", "push"] else [live_theme()])

                with patch.dict(deploy_shopify.os.environ, self.environment(), clear=True), \
                        patch("sys.argv", ["deploy_shopify.py"]), \
                        patch.object(deploy_shopify.Path, "cwd", return_value=root), \
                        patch.object(deploy_shopify, "run", side_effect=run) as run_mock, \
                        patch.object(deploy_shopify, "pull", side_effect=pull) as readback, \
                        patch.object(deploy_shopify, "assert_current_main"), contextlib.redirect_stdout(io.StringIO()):
                    self.assertEqual(deploy_shopify.main(), 0 if change is None else 1)
                commands = [call.args[0] for call in run_mock.call_args_list]
                self.assertEqual(sum(command[:3] == ["shopify", "theme", "push"] for command in commands), 1)
                self.assertEqual(readback.call_args_list[0].args[-1], ["config/settings_data.json"])
                self.assertEqual(readback.call_args_list[1].args[-1], ["config/settings_data.json", "layout/theme.liquid"])

    def test_main_stops_on_partial_push_json_before_readback_or_success_message(self):
        checked_layout = (Path.cwd() / "layout/theme.liquid").read_text()
        responses = (
            {"theme": {"id": LIVE_ID, "warning": "One file failed"}},
            {"theme": {"id": LIVE_ID, "errors": [{"file": "assets/example.js", "message": "Upload failed"}]}},
            {"theme": {"id": LIVE_ID}, "errors": ["Partial upload"]},
            {"theme": {"id": LIVE_ID}, "status": "cancelled"},
            {"theme": {"id": LIVE_ID}, "status": "failed"},
            {"theme": {"id": int(LIVE_ID) + 1}}, {}, "invalid-json",
        )
        for response in responses:
            with self.subTest(response=response):
                output = io.StringIO()

                def pull(_store, _theme, target, files):
                    for filename in files:
                        path = Path(target) / filename
                        path.parent.mkdir(parents=True, exist_ok=True)
                        path.write_text(checked_layout if filename == "layout/theme.liquid" else '{"merchant":"configuration"}')

                def run(command):
                    if command[:3] == ["shopify", "theme", "push"]:
                        return response if isinstance(response, str) else json.dumps(response)
                    return json.dumps([live_theme()])

                with patch.dict(deploy_shopify.os.environ, self.environment(), clear=True), \
                        patch("sys.argv", ["deploy_shopify.py"]), \
                        patch.object(deploy_shopify, "run", side_effect=run) as run_mock, \
                        patch.object(deploy_shopify, "pull", side_effect=pull) as readback, \
                        patch.object(deploy_shopify, "assert_current_main"), contextlib.redirect_stdout(output):
                    self.assertEqual(deploy_shopify.main(), 1)
                self.assertEqual(readback.call_count, 1)
                self.assertEqual(readback.call_args.args[-1], ["config/settings_data.json"])
                self.assertEqual(sum(call.args[0][:3] == ["shopify", "theme", "push"] for call in run_mock.call_args_list), 1)
                self.assertNotIn("Deployed ", output.getvalue())
                self.assertIn("Deployment stopped:", output.getvalue())

    def test_cli_errors_redact_the_theme_token(self):
        result = type("FailedCommand", (), {"returncode": 1, "stderr": "fixture-token-only: rejected", "stdout": ""})()
        with patch.dict(deploy_shopify.os.environ, {"SHOPIFY_CLI_THEME_TOKEN": "fixture-token-only"}, clear=True), \
                patch.object(deploy_shopify.subprocess, "run", return_value=result):
            with self.assertRaises(ValueError) as failure:
                deploy_shopify.run(["shopify", "theme", "list"])
        self.assertNotIn("fixture-token-only", str(failure.exception))
        self.assertIn("[redacted]", str(failure.exception))


if __name__ == "__main__":
    unittest.main()
