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
        command = deploy_shopify.push_command(STORE, LIVE_ID, ["assets/changed.js"])
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
                    deploy_shopify.push_command(store, theme_id, ["assets/changed.js"])

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

    def test_stale_main_stops_before_any_pull_or_upload(self):
        with patch.dict(deploy_shopify.os.environ, self.environment(), clear=True), \
                patch("sys.argv", ["deploy_shopify.py"]), \
                patch.object(deploy_shopify, "run", return_value=json.dumps([live_theme()])) as run, \
                patch.object(deploy_shopify, "pull") as pull, \
                patch.object(deploy_shopify, "assert_current_main", side_effect=ValueError("Main advanced")), \
                contextlib.redirect_stdout(io.StringIO()):
            self.assertEqual(deploy_shopify.main(), 1)
        pull.assert_not_called()
        self.assertFalse(any(call.args[0][:3] == ["shopify", "theme", "push"] for call in run.call_args_list))

    def test_cli_errors_redact_the_theme_token(self):
        result = type("FailedCommand", (), {"returncode": 1, "stderr": "fixture-token-only: rejected", "stdout": ""})()
        with patch.dict(deploy_shopify.os.environ, {"SHOPIFY_CLI_THEME_TOKEN": "fixture-token-only"}, clear=True), \
                patch.object(deploy_shopify.subprocess, "run", return_value=result):
            with self.assertRaises(ValueError) as failure:
                deploy_shopify.run(["shopify", "theme", "list"])
        self.assertNotIn("fixture-token-only", str(failure.exception))
        self.assertIn("[redacted]", str(failure.exception))


class IncrementalDeploymentTests(unittest.TestCase):
    def test_upload_requires_an_explicit_nonempty_allowlist(self):
        with self.assertRaises(ValueError):
            deploy_shopify.push_command(STORE, LIVE_ID, [])
        command = deploy_shopify.push_command(STORE, LIVE_ID, ["assets/changed.js"])
        self.assertEqual(command[command.index("--only") + 1], "assets/changed.js")
        with self.assertRaises(ValueError):
            deploy_shopify.push_command(STORE, LIVE_ID, ["config/settings_data.json"])

    def test_drift_blocks_unreviewed_remote_content_and_accepts_idempotent_retry(self):
        with self.assertRaisesRegex(ValueError, "conflict"):
            deploy_shopify.verify_remote("assets/changed.js", b"old", b"new", b"editor")
        deploy_shopify.verify_remote("assets/changed.js", b"old", b"new", b"old")
        deploy_shopify.verify_remote("assets/changed.js", b"old", b"new", b"new")
        with self.assertRaises(ValueError):
            deploy_shopify.verify_remote("assets/changed.js", b"old", b"new", None)
        deploy_shopify.verify_remote("assets/new.js", None, b"new", None)

    def test_partial_json_update_rejects_unreviewed_changes(self):
        old = b'{"a":0,"nested":{"x":1},"array":[1,2],"deleted":true}'
        new = b'{"a":1,"nested":{"x":2,"added":true},"array":[2,1]}'
        partial = b'{"a":1,"nested":{"x":1,"added":true},"array":[1,2],"deleted":true}'
        deploy_shopify.verify_remote("sections/header.json", old, new, partial)
        for remote in (b'{"a":9,"nested":{"x":1},"array":[1,2],"deleted":true}',
                       b'{"a":1,"nested":{"x":1,"unknown":3},"array":[1,2]}',
                       b'{"a":1,"nested":{"x":1},"array":[1,3]}',
                       b'{"a":true,"nested":{"x":1},"array":[1,2]}'):
            with self.assertRaisesRegex(ValueError, "conflict"):
                deploy_shopify.verify_remote("sections/header.json", old, new, remote)

    def test_reviewed_history_contains_only_versions_on_the_release_path(self):
        baseline, target = "a" * 40, "c" * 40
        intermediate = "b" * 40
        with patch.object(deploy_shopify, "git_bytes", return_value=f"{target}\n{intermediate}\n".encode()) as git_bytes, \
                patch.object(deploy_shopify, "snapshot", return_value={"assets/changed.js": "mid"}) as snapshot:
            self.assertEqual(deploy_shopify.reviewed_history(baseline, target), [{"assets/changed.js": "mid"}])
        git_bytes.assert_called_once_with(["rev-list", "--ancestry-path", f"{baseline}..{target}"])
        snapshot.assert_called_once_with(intermediate)

    def test_source_deletion_in_a_pending_attempt_cannot_authorize_a_missing_live_file(self):
        filename = "assets/changed.js"
        blobs = {"old":b"old", "new":b"new"}
        with tempfile.TemporaryDirectory() as directory, \
                patch.object(deploy_shopify, "git_bytes", side_effect=lambda args: blobs[args[-1]]):
            with self.assertRaisesRegex(ValueError, "conflict"):
                deploy_shopify.verify_candidates(Path(directory), [filename], {filename:"old"},
                                                {filename:"old"}, [{filename:"new"}, {}])

    def test_json_reformatting_is_safe_but_boolean_number_change_is_not(self):
        self.assertTrue(deploy_shopify.same_content("templates/page.json", b'{"x":1}', b'/* Shopify */\n{ "x": 1 }'))
        self.assertFalse(deploy_shopify.same_content("templates/page.json", b'{"x":1}', b'{"x":true}'))
        self.assertFalse(deploy_shopify.same_content("assets/app.js", b'const x=1;', b'const x = 1;'))
        self.assertFalse(deploy_shopify.same_content("templates/page.json", b'{"x":1}', b'{"x":2}'))
        self.assertFalse(deploy_shopify.same_content("templates/page.json", b'{"x":1}', b'{"x":1,"x":2}'))

    def test_marker_accepts_only_the_exact_sanitized_schema(self):
        sha = "a" * 40
        self.assertEqual(deploy_shopify.parse_marker(json.dumps({"schema":1,"sha":sha}).encode()), sha)
        for marker in (b'{}', b'{"schema":1,"sha":"main"}', b'{"schema":true,"sha":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"}', b'bad'):
            with self.subTest(marker=marker), self.assertRaises(ValueError):
                deploy_shopify.parse_marker(marker)


class IncrementalMainTests(unittest.TestCase):
    def invoke(self, fault=None, response=None, remote_state=None, theme_changes=True, added_file=True, target="a"*40,
               history_versions=None):
        previous = "b" * 40
        old = {"assets/changed.js": "old", "sections/untouched.liquid": "same", "assets/deleted.js": "deleted"}
        new = {"assets/changed.js": "new", "sections/untouched.liquid": "same", "assets/new.js": "added"}
        if not added_file:
            new.pop("assets/new.js")
        attempted_tree = dict(new)
        if not theme_changes:
            new = dict(old)
        trees = {previous: old, "a"*40: attempted_tree, "c"*40: old, "d"*40: old, target: new}
        blobs = {"old": b"old", "new": b"new", "mid": b"mid", "same": b"source", "deleted": b"deleted", "added": b"added"}
        original_marker = json.dumps({"schema":1,"sha":previous}).encode()
        remote = {deploy_shopify.SETTINGS: b'{"merchant":"live"}', deploy_shopify.MARKER: original_marker,
                  "assets/changed.js": b"old", "sections/untouched.liquid": b"editor content",
                  "assets/deleted.js": b"deleted", "assets/remote-only.js": b"remote"}
        if remote_state is not None:
            remote = dict(remote_state)
        if fault == "initial-drift":
            remote["assets/changed.js"] = b"editor"
        if fault == "retry":
            remote["assets/changed.js"] = b"new"
        if fault == "reviewed-mid":
            remote["assets/changed.js"] = b"mid"
        pulls, uploads = [], []

        def pull(_store, _theme, directory, files):
            pulls.append((Path(directory).name, list(files)))
            phase = Path(directory).name
            if fault == "late-drift" and phase == "recheck":
                remote["assets/changed.js"] = b"late editor"
            if fault == "intent-readback" and phase == "intent":
                remote[deploy_shopify.MARKER] = original_marker
            if fault == "marker-readback" and phase == "final":
                remote[deploy_shopify.MARKER] = original_marker
            if fault == "settings" and phase == "after":
                remote[deploy_shopify.SETTINGS] = b'{"merchant":"concurrent"}'
            if fault == "readback" and phase == "after":
                remote["assets/new.js"] = b"wrong upload"
            for filename in files:
                if filename in remote:
                    path = Path(directory) / filename
                    path.parent.mkdir(parents=True, exist_ok=True)
                    path.write_bytes(remote[filename])

        def run(command):
            if command[:3] != ["shopify", "theme", "push"]:
                return json.dumps([live_theme()])
            files = [command[i+1] for i, value in enumerate(command) if value == "--only"]
            uploads.append(files)
            if files == [deploy_shopify.MARKER]:
                directory = Path(command[command.index("--path")+1])
                state = deploy_shopify.parse_state((directory / deploy_shopify.MARKER).read_bytes())
                if (fault == "marker-failure" and not state["pending_shas"]) or (fault == "intent-failure" and state["pending_shas"]):
                    return json.dumps({"theme":{"id":LIVE_ID,"warning":"receipt failed"}})
                self.assertTrue(all((directory / folder).is_dir() for folder in ("config", "layout", "templates")))
                remote[deploy_shopify.MARKER] = (directory / deploy_shopify.MARKER).read_bytes()
            else:
                if fault == "payload-no-write":
                    return json.dumps({"theme":{"id":LIVE_ID,"warning":"payload interrupted"}})
                directory = Path(command[command.index("--path")+1])
                for filename in files:
                    remote[filename] = (directory / filename).read_bytes()
                if response is not None:
                    return response if isinstance(response, str) else json.dumps(response)
            return json.dumps({"theme":{"id":LIVE_ID}})

        env = ProductionDeploymentTests().environment(GITHUB_SHA=target)
        output = io.StringIO()
        with patch.dict(deploy_shopify.os.environ, env, clear=True), patch("sys.argv", ["deploy_shopify.py"]), \
                patch.object(deploy_shopify, "run", side_effect=run), \
                patch.object(deploy_shopify, "pull", side_effect=pull), \
                patch.object(deploy_shopify, "assert_current_main"), \
                patch.object(deploy_shopify, "deployment_baseline", return_value=previous), \
                patch.object(deploy_shopify, "snapshot", side_effect=lambda revision: trees[revision]), \
                patch.object(deploy_shopify, "reviewed_history", return_value=history_versions or []), \
                patch.object(deploy_shopify, "git_bytes", side_effect=lambda args: b"" if args[0] == "merge-base" else blobs[args[-1]]), \
                contextlib.redirect_stdout(output):
            status = deploy_shopify.main()
        return status, remote, uploads, pulls, output.getvalue(), original_marker

    def test_only_changed_files_upload_and_unrelated_live_content_survives(self):
        status, remote, uploads, pulls, output, _ = self.invoke()
        self.assertEqual(status, 0, output)
        self.assertEqual(uploads, [[deploy_shopify.MARKER], ["assets/changed.js", "assets/new.js"], [deploy_shopify.MARKER]])
        self.assertEqual(remote["sections/untouched.liquid"], b"editor content")
        self.assertEqual(remote["assets/remote-only.js"], b"remote")
        self.assertEqual(remote["assets/deleted.js"], b"deleted")
        self.assertEqual(deploy_shopify.parse_marker(remote[deploy_shopify.MARKER]), "a"*40)
        self.assertEqual([phase for phase, _ in pulls], ["before", "before", "recheck", "intent", "after", "final"])

    def test_exact_reviewed_intermediate_version_can_be_replaced_by_target(self):
        history = [{"assets/changed.js": "mid"}]
        status, remote, uploads, _, output, _ = self.invoke(fault="reviewed-mid", history_versions=history)
        self.assertEqual(status, 0, output)
        self.assertEqual(remote["assets/changed.js"], b"new")
        self.assertEqual(uploads[1], ["assets/changed.js", "assets/new.js"])

    def test_marker_only_release_never_issues_a_broad_or_empty_payload_upload(self):
        status, remote, uploads, pulls, output, _ = self.invoke(theme_changes=False)
        self.assertEqual(status, 0, output)
        self.assertEqual(uploads, [[deploy_shopify.MARKER]])
        self.assertEqual(remote["assets/changed.js"], b"old")
        self.assertEqual(remote["sections/untouched.liquid"], b"editor content")
        self.assertEqual(remote["assets/remote-only.js"], b"remote")
        self.assertEqual(remote[deploy_shopify.SETTINGS], b'{"merchant":"live"}')
        self.assertEqual(deploy_shopify.parse_marker(remote[deploy_shopify.MARKER]), "a"*40)
        self.assertEqual([phase for phase, _ in pulls], ["before", "recheck", "after", "final"])
        self.assertIn("0 changed files verified", output)

    def test_failed_final_marker_readback_cannot_report_a_successful_release(self):
        status, _, _, _, output, _ = self.invoke("marker-readback", theme_changes=False)
        self.assertEqual(status, 1, output)
        self.assertIn("final readback", output)
        self.assertNotIn("Deployed ", output)

    def test_failed_attempts_do_not_claim_untouched_source_deletions_as_payload(self):
        status, remote, _, _, output, _ = self.invoke("marker-failure", added_file=False)
        self.assertEqual(status, 1, output)
        remote["assets/deleted.js"] = b"editor change to retained file"
        status, remote, uploads, _, output, _ = self.invoke(remote_state=remote, theme_changes=False, added_file=False, target="c"*40)
        self.assertEqual(status, 0, output)
        self.assertNotIn("assets/deleted.js", [filename for batch in uploads for filename in batch])
        self.assertEqual(remote["assets/deleted.js"], b"editor change to retained file")

    def test_conflict_in_initial_or_final_preflight_prevents_every_upload(self):
        for fault in ("initial-drift", "late-drift"):
            with self.subTest(fault=fault):
                status, remote, uploads, _, output, marker = self.invoke(fault)
                self.assertEqual(status, 1, output)
                self.assertEqual(uploads, [])
                self.assertEqual(remote[deploy_shopify.MARKER], marker)
                self.assertIn("conflict", output)

    def test_payload_or_settings_readback_failure_cannot_advance_release_marker(self):
        for fault in ("readback", "settings"):
            with self.subTest(fault=fault):
                status, remote, uploads, _, output, marker = self.invoke(fault)
                self.assertEqual(status, 1, output)
                self.assertEqual(uploads, [[deploy_shopify.MARKER], ["assets/changed.js", "assets/new.js"]])
                self.assertEqual(deploy_shopify.parse_state(remote[deploy_shopify.MARKER]), {"schema":2,"sha":"b"*40,"pending_shas":["a"*40]})

    def test_retry_accepts_files_already_uploaded_by_an_interrupted_release(self):
        status, _, _, _, output, _ = self.invoke("retry")
        self.assertEqual(status, 0, output)

    def test_marker_upload_failure_can_retry_after_fully_verified_payload(self):
        status, remote, uploads, _, output, marker = self.invoke("marker-failure")
        self.assertEqual(status, 1, output)
        self.assertEqual(deploy_shopify.parse_state(remote[deploy_shopify.MARKER])["pending_shas"], ["a"*40])
        self.assertEqual(remote["assets/changed.js"], b"new")
        self.assertEqual(remote["assets/new.js"], b"added")
        status, remote, _, _, output, _ = self.invoke(remote_state=remote)
        self.assertEqual(status, 0, output)
        self.assertEqual(deploy_shopify.parse_marker(remote[deploy_shopify.MARKER]), "a"*40)

    def test_failed_release_then_revert_never_certifies_stale_payload(self):
        status, remote, _, _, _, _ = self.invoke("marker-failure")
        self.assertEqual(status, 1)
        status, remote, _, _, output, _ = self.invoke(remote_state=remote, theme_changes=False, target="c"*40)
        self.assertEqual(status, 1, "Failed added file must require explicit reconciliation: " + output)
        self.assertEqual(deploy_shopify.parse_marker(remote[deploy_shopify.MARKER]), "b"*40)

    def test_failed_existing_file_can_be_restored_by_the_next_main_revision(self):
        status, remote, _, _, output, _ = self.invoke("marker-failure", added_file=False)
        self.assertEqual(status, 1, output)
        self.assertEqual(remote["assets/changed.js"], b"new")
        status, remote, uploads, _, output, _ = self.invoke(remote_state=remote, theme_changes=False, added_file=False, target="c"*40)
        self.assertEqual(status, 0, output)
        self.assertIn(["assets/changed.js"], uploads)
        self.assertEqual(remote["assets/changed.js"], b"old")
        self.assertEqual(deploy_shopify.parse_state(remote[deploy_shopify.MARKER]), {"schema":2,"sha":"c"*40,"pending_shas":[]})

    def test_multiple_failed_releases_preserve_every_pending_attempt_until_reconciled(self):
        status, remote, _, _, output, _ = self.invoke("marker-failure", added_file=False)
        self.assertEqual(status, 1, output)
        status, remote, _, _, output, _ = self.invoke("payload-no-write", remote_state=remote, theme_changes=False, added_file=False, target="c"*40)
        self.assertEqual(status, 1, output)
        self.assertEqual(remote["assets/changed.js"], b"new")
        self.assertEqual(deploy_shopify.parse_state(remote[deploy_shopify.MARKER])["pending_shas"], ["a"*40,"c"*40])
        status, remote, _, _, output, _ = self.invoke(remote_state=remote, theme_changes=False, added_file=False, target="d"*40)
        self.assertEqual(status, 0, output)
        self.assertEqual(remote["assets/changed.js"], b"old")
        self.assertEqual(deploy_shopify.parse_state(remote[deploy_shopify.MARKER]), {"schema":2,"sha":"d"*40,"pending_shas":[]})

    def test_intent_upload_and_readback_failures_never_upload_payload(self):
        for fault in ("intent-failure", "intent-readback"):
            with self.subTest(fault=fault):
                status, remote, uploads, _, output, _ = self.invoke(fault)
                self.assertEqual(status, 1, output)
                self.assertEqual(uploads, [[deploy_shopify.MARKER]])
                self.assertEqual(remote["assets/changed.js"], b"old")
                self.assertNotIn("assets/new.js", remote)

    def test_partial_cli_success_never_advances_marker(self):
        for response in ({"theme":{"id":LIVE_ID,"warning":"partial"}},
                         {"theme":{"id":LIVE_ID,"errors":["failed file"]}},
                         {"theme":{"id":LIVE_ID},"status":"cancelled"},
                         {"theme":{"id":int(LIVE_ID)+1}}, {}, "invalid-json"):
            with self.subTest(response=response):
                status, remote, uploads, pulls, output, marker = self.invoke(response=response)
                self.assertEqual(status, 1, output)
                self.assertEqual(deploy_shopify.parse_state(remote[deploy_shopify.MARKER])["pending_shas"], ["a"*40])
                self.assertEqual(len(uploads), 2)
                self.assertNotIn("after", [phase for phase, _ in pulls])
                self.assertNotIn("Deployed ", output)


class DeploymentHistoryTests(unittest.TestCase):
    def test_journal_accepts_unique_shas_only_and_has_a_finite_bound(self):
        sha = "a"*40
        state = {"schema":2,"sha":"b"*40,"pending_shas":[sha]}
        self.assertEqual(deploy_shopify.parse_state(json.dumps(state).encode()), state)
        for pending in ([sha,sha], ["main"], None, [None], ["%040x" % i for i in range(51)]):
            with self.subTest(pending=pending), self.assertRaises(ValueError):
                deploy_shopify.parse_state(json.dumps({**state,"pending_shas":pending}).encode())

    def test_missing_marker_bootstraps_only_immediate_successor_of_verified_release(self):
        target = "a"*40
        with patch.object(deploy_shopify, "git_bytes", side_effect=[(deploy_shopify.BOOTSTRAP_SHA+"\n").encode(), b"", b""]):
            self.assertEqual(deploy_shopify.deployment_baseline(None, target), deploy_shopify.BOOTSTRAP_SHA)
        with patch.object(deploy_shopify, "git_bytes", return_value=b"b"*40+b"\n"):
            with self.assertRaisesRegex(ValueError, "missing"):
                deploy_shopify.deployment_baseline(None, target)

    def test_blocks_are_theme_files_and_unsupported_names_never_silently_disappear(self):
        with patch.object(deploy_shopify, "git_bytes", return_value=b"100644 blob abc\tblocks/frame.liquid\0"):
            self.assertEqual(deploy_shopify.snapshot("a"*40), {"blocks/frame.liquid":"abc"})
        for entry in (b"100644 blob abc\tassets/unsupported file.js\0", b"120000 blob abc\tassets/link.js\0"):
            with self.subTest(entry=entry), patch.object(deploy_shopify, "git_bytes", return_value=entry):
                with self.assertRaises(ValueError):
                    deploy_shopify.snapshot("a"*40)

    def test_nonancestor_markers_and_missing_history_stop_deployment(self):
        marker = json.dumps({"schema":1,"sha":"b"*40}).encode()
        for failure_at in (0, 1):
            outputs = [b""]*failure_at + [ValueError("unrelated history")]
            with self.subTest(failure_at=failure_at), patch.object(deploy_shopify, "git_bytes", side_effect=outputs):
                with self.assertRaises(ValueError):
                    deploy_shopify.deployment_baseline(marker, "a"*40)


if __name__ == "__main__":
    unittest.main()
