from pathlib import Path

SOURCE=Path(__file__).parents[1].joinpath("contracts/harborlight.py").read_text()

def test_all_five_consensus_boundaries_exist():
    assert SOURCE.count("gl.vm.run_nondet_unsafe") == 6
    for method in ("discover_chart","anchor_baseline","bind_candidate","observe_route","open_dispute","notarize"):
        assert f"def {method}(" in SOURCE

def test_protocol_policies_are_mandatory():
    for rule in ("hl-security","hl-function","hl-claims","hl-access"):
        assert rule in SOURCE
    assert "authoritative route coverage incomplete" in SOURCE

def test_semantic_inspection_is_derived_from_committed_bytes_only():
    assert "gl.nondet.web.render" not in SOURCE
    assert '"assessed_body_sha256":digest' in SOURCE
    assert '"INSPECTION_LIMIT_EXCEEDED"' in SOURCE

def test_authoritative_inventory_and_unique_paths_are_enforced():
    assert 'harborlight.inventory.v1' in SOURCE
    assert 'set(inventory_paths)=={x["path"] for x in normalized}' in SOURCE
    assert 'path in registered_paths' in SOURCE

def test_counter_evidence_is_causal_input():
    assert "COUNTER_EVIDENCE:" in SOURCE
    assert 'counter=="SUPPORTED"' in SOURCE
    assert 'counter=="UNRESOLVED"' in SOURCE

def test_notarization_refetches_live_artifacts():
    notarize=SOURCE.split("def notarize",1)[1].split("@gl.public.view",1)[0]
    assert "_fetch_json(v[\"manifest_url\"])" in notarize
    assert "_probe(v[\"candidate_origin\"]+r[\"path\"])" in notarize
    assert "freshness seal failed" in notarize

def test_no_force_or_admin_bypass_surface():
    lowered=SOURCE.lower()
    assert "force_clear" not in lowered
    assert "force_notarize" not in lowered
    assert "admin_override" not in lowered
