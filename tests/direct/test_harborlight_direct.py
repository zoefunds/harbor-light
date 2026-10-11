import hashlib,json
from datetime import datetime,timezone
import pytest

CONTRACT="contracts/harborlight.py"
BASE="https://baseline.test"
CANDIDATE="https://candidate.test"
INDEX_URL=BASE+"/.well-known/routes.json"
INVENTORY_URL=BASE+"/.well-known/harborlight-inventory.json"
CAPSULE_URL="https://evidence.test/pricing.json"
MANIFEST_URL=CANDIDATE+"/.well-known/harborlight.json"
BASE_BODY="<html><head><title>Plans</title></head><body><h1>Plans</h1><p>Pro is $49 monthly. Cancel any time.</p><form action='/join' method='post'></form></body></html>"
CANDIDATE_BODY=BASE_BODY.replace("<title>Plans</title>","<title>Pricing</title>")
RULE_IDS=("hl-security","hl-function","hl-claims","hl-access","price")

def canon(v): return json.dumps(v,sort_keys=True,separators=(",",":"),ensure_ascii=False)
def digest(v): return hashlib.sha256(canon(v).encode()).hexdigest()
def body_digest(v): return hashlib.sha256(v.encode()).hexdigest()
def inventory(routes=None): return {"schema":"harborlight.inventory.v1","generated_from":"next-release-route-scan","routes":routes or ["/pricing"]}
def route_index(routes=None):
    inv=inventory(routes); return {"schema":"harborlight.route-index.v2","inventory_url":INVENTORY_URL,"inventory_sha256":digest(inv),"routes":[{"path":x,"critical":True} for x in inv["routes"]]}
def capsule(): return {"source_url":BASE+"/pricing","route_id":"pricing","content_sha256":body_digest(BASE_BODY),"title":"Plans","claims":["Pro is $49 monthly","Cancel any time"],"primary_action":"POST /join"}
def rules(): return json.dumps([{"id":"price","question":"Is the $49 monthly price preserved?","allowed_changes":"Equivalent formatting is allowed."}])
def manifest(ref="release-a",body=CANDIDATE_BODY): return {"schema":"harborlight.manifest.v2","protocol_id":"harborlight.release-notary.v2","candidate_origin":CANDIDATE,"release_ref":ref,"route_index_digest":digest(route_index()),"inventory_digest":digest(inventory()),"routes":[{"path":"/pricing","body_sha256":body_digest(body)}]}

def mock_chart(vm,index=None,inv=None):
    index=index or route_index(); inv=inv or inventory()
    vm.mock_web(r".*baseline\.test/\.well-known/routes\.json.*",{"status":200,"body":json.dumps(index)})
    vm.mock_web(r".*baseline\.test/\.well-known/harborlight-inventory\.json.*",{"status":200,"body":json.dumps(inv)})
def mock_baseline(vm):
    vm.mock_web(r".*evidence\.test/pricing\.json.*",{"status":200,"body":json.dumps(capsule())})
    vm.mock_web(r".*baseline\.test/pricing.*",{"status":200,"body":BASE_BODY})
    vm.mock_llm(r".*Harborlight baseline authentication.*",json.dumps({"faithful":True,"reason":"capsule matches"}))
def mock_candidate(vm,body=CANDIDATE_BODY,statuses=None,counter="NONE"):
    man=manifest(body=body); vm.mock_web(r".*candidate\.test/\.well-known/harborlight\.json.*",{"status":200,"body":json.dumps(man)})
    vm.mock_web(r".*candidate\.test/pricing.*",{"status":200,"body":body})
    if statuses is not None:
        findings=[{"rule_id":rid,"status":statuses.get(rid,"PRESERVED"),"reason":"checked"} for rid in RULE_IDS]
        vm.mock_llm(r".*Harborlight semantic observation.*",json.dumps({"findings":findings,"counterclaim_status":counter}))
    return man
def charted(vm,c):
    vid=c.open_voyage("Pricing release",BASE,INDEX_URL,600); mock_chart(vm); c.discover_chart(vid,digest(route_index())); c.add_route(vid,"pricing","/pricing",rules()); mock_baseline(vm); c.anchor_baseline(vid,"pricing",CAPSULE_URL,digest(capsule())); c.seal_chart(vid); return vid

def test_open_voyage_and_protocol_identity(direct_deploy):
    c=direct_deploy(CONTRACT); vid=c.open_voyage("Docs",BASE,INDEX_URL,600); v=c.get_voyage(vid); identity=c.get_protocol_identity()
    assert v["state"]=="DRAFT" and identity["protocol_id"]=="harborlight.release-notary.v2" and identity["version"]==2 and identity["chain_id"]==61999

def test_public_chart_enforces_critical_coverage(direct_vm,direct_deploy):
    c=direct_deploy(CONTRACT); vid=c.open_voyage("Docs",BASE,INDEX_URL,600); mock_chart(direct_vm); c.discover_chart(vid,digest(route_index()))
    with direct_vm.expect_revert("authoritative route coverage incomplete"): c.seal_chart(vid)

def test_route_index_must_match_authoritative_inventory(direct_vm,direct_deploy):
    c=direct_deploy(CONTRACT); vid=c.open_voyage("Docs",BASE,INDEX_URL,600)
    incomplete=route_index(); complete=inventory(["/pricing","/security"])
    mock_chart(direct_vm,incomplete,complete)
    with direct_vm.expect_revert("chart verification failed"): c.discover_chart(vid,digest(incomplete))

def test_duplicate_path_under_different_identifier_is_rejected(direct_vm,direct_deploy):
    c=direct_deploy(CONTRACT); vid=c.open_voyage("Docs",BASE,INDEX_URL,600); mock_chart(direct_vm); c.discover_chart(vid,digest(route_index()))
    c.add_route(vid,"pricing","/pricing",rules())
    with direct_vm.expect_revert("route invalid"): c.add_route(vid,"pricing-copy","/pricing","[]")

def test_native_rule_array_is_accepted_for_sdk_and_cli_callers(direct_vm,direct_deploy):
    c=direct_deploy(CONTRACT); vid=c.open_voyage("SDK-native rules",BASE,INDEX_URL,600); mock_chart(direct_vm); c.discover_chart(vid,digest(route_index()))
    native=[{"id":"price","question":"Is the $49 monthly price preserved?","allowed_changes":"Equivalent formatting is allowed."}]
    c.add_route(vid,"pricing","/pricing",native)
    route=c.get_route(vid,"pricing")
    assert route["route_id"]=="pricing" and [x["id"] for x in route["rules"]][-1]=="price"

def test_clear_route_requires_mandatory_and_custom_findings(direct_vm,direct_deploy):
    c=direct_deploy(CONTRACT); vid=charted(direct_vm,c); direct_vm.clear_mocks(); man=mock_candidate(direct_vm); c.bind_candidate(vid,CANDIDATE,digest(man)); direct_vm.clear_mocks(); mock_candidate(direct_vm,statuses={})
    assert c.observe_route(vid,"pricing")=="CLEAR"; assert c.derive_readiness(vid)=="CLEAR"; assert c.get_voyage(vid)["review_deadline"]>0

def test_material_mandatory_failure_holds_voyage(direct_vm,direct_deploy):
    c=direct_deploy(CONTRACT); vid=charted(direct_vm,c); direct_vm.clear_mocks(); man=mock_candidate(direct_vm); c.bind_candidate(vid,CANDIDATE,digest(man)); direct_vm.clear_mocks(); mock_candidate(direct_vm,statuses={"hl-security":"BROKEN"})
    assert c.observe_route(vid,"pricing")=="HELD"; assert c.derive_readiness(vid)=="HELD"

def test_admitted_counterclaim_causally_holds_route(direct_vm,direct_deploy,direct_bob):
    c=direct_deploy(CONTRACT); vid=charted(direct_vm,c); direct_vm.clear_mocks(); man=mock_candidate(direct_vm); c.bind_candidate(vid,CANDIDATE,digest(man)); direct_vm.clear_mocks(); mock_candidate(direct_vm,statuses={}); c.observe_route(vid,"pricing"); c.derive_readiness(vid)
    direct_vm.sender=direct_bob; direct_vm.clear_mocks()
    evidence={"target":"hl-security","assertion":"The form target is unsafe","expected_observation":"A cross-origin form action"}
    direct_vm.mock_web(r".*evidence\.test/counterclaim.*",{"status":200,"body":json.dumps(evidence)})
    assert c.open_dispute(vid,"pricing","https://evidence.test/counterclaim")==1
    direct_vm.clear_mocks(); mock_candidate(direct_vm,statuses={},counter="SUPPORTED")
    assert c.observe_route(vid,"pricing")=="HELD"
    dispute=c.get_dispute(vid,1,1)
    assert dispute["resolution"]=="SUPPORTED" and dispute["route_result"]=="HELD"

def test_unsupported_objection_is_rejected(direct_vm,direct_deploy,direct_bob):
    c=direct_deploy(CONTRACT); vid=charted(direct_vm,c); direct_vm.clear_mocks(); man=mock_candidate(direct_vm); c.bind_candidate(vid,CANDIDATE,digest(man)); direct_vm.clear_mocks(); mock_candidate(direct_vm,statuses={}); c.observe_route(vid,"pricing"); c.derive_readiness(vid)
    direct_vm.sender=direct_bob; direct_vm.clear_mocks()
    evidence={"target":"not-a-rule","assertion":"Unsupported allegation","expected_observation":"Anything"}
    direct_vm.mock_web(r".*evidence\.test/counterclaim.*",{"status":200,"body":json.dumps(evidence)})
    with direct_vm.expect_revert("counter-evidence rejected"): c.open_dispute(vid,"pricing","https://evidence.test/counterclaim")

def test_unresolved_objection_stays_open_for_bounded_retry(direct_vm,direct_deploy,direct_bob):
    c=direct_deploy(CONTRACT); vid=charted(direct_vm,c); direct_vm.clear_mocks(); man=mock_candidate(direct_vm); c.bind_candidate(vid,CANDIDATE,digest(man)); direct_vm.clear_mocks(); mock_candidate(direct_vm,statuses={}); c.observe_route(vid,"pricing"); c.derive_readiness(vid)
    direct_vm.sender=direct_bob; direct_vm.clear_mocks(); evidence={"target":"hl-security","assertion":"The form target is unsafe","expected_observation":"A cross-origin form action"}; direct_vm.mock_web(r".*evidence\.test/counterclaim.*",{"status":200,"body":json.dumps(evidence)}); c.open_dispute(vid,"pricing","https://evidence.test/counterclaim")
    direct_vm.clear_mocks(); mock_candidate(direct_vm,statuses={},counter="UNRESOLVED")
    assert c.observe_route(vid,"pricing")=="UNCERTAIN"
    assert c.get_voyage(vid)["state"]=="DISPUTED" and c.get_voyage(vid)["open_dispute"]==1
    assert c.get_dispute(vid,1,1)["resolved"] is False
    direct_vm.clear_mocks(); mock_candidate(direct_vm,statuses={},counter="REFUTED")
    assert c.observe_route(vid,"pricing")=="CLEAR"
    assert c.get_voyage(vid)["state"]=="OBSERVING" and c.get_voyage(vid)["open_dispute"]==0

def test_modified_manifest_after_binding_fails_closed(direct_vm,direct_deploy):
    c=direct_deploy(CONTRACT); vid=charted(direct_vm,c); direct_vm.clear_mocks(); bound=mock_candidate(direct_vm); c.bind_candidate(vid,CANDIDATE,digest(bound)); direct_vm.clear_mocks()
    changed=manifest(ref="release-tampered")
    direct_vm.mock_web(r".*candidate\.test/\.well-known/harborlight\.json.*",{"status":200,"body":json.dumps(changed)})
    direct_vm.mock_web(r".*candidate\.test/pricing.*",{"status":200,"body":CANDIDATE_BODY})
    assert c.observe_route(vid,"pricing")=="UNCERTAIN"
    observation=c.get_observation(vid,1,"pricing")
    assert observation["identity_ok"] is False and observation["findings"]==[]

def test_semantics_are_derived_from_the_exact_committed_bytes(direct_vm,direct_deploy):
    c=direct_deploy(CONTRACT); vid=charted(direct_vm,c); direct_vm.clear_mocks(); man=mock_candidate(direct_vm); c.bind_candidate(vid,CANDIDATE,digest(man)); direct_vm.clear_mocks(); mock_candidate(direct_vm,statuses={})
    assert c.observe_route(vid,"pricing")=="CLEAR"
    observation=c.get_observation(vid,1,"pricing")
    assert observation["probe"]["body_sha256"]==observation["probe"]["assessed_body_sha256"]==body_digest(CANDIDATE_BODY)
    assert observation["probe"]["inspection_scope"]=="byte-derived-static-html-v1"

def test_inspection_limits_fail_closed_instead_of_truncating_requirements(direct_vm,direct_deploy):
    c=direct_deploy(CONTRACT); vid=charted(direct_vm,c); oversized="<html><body><h1>Pricing</h1><p>"+("material obligation "*900)+"</p></body></html>"; direct_vm.clear_mocks(); man=mock_candidate(direct_vm,body=oversized); c.bind_candidate(vid,CANDIDATE,digest(man)); direct_vm.clear_mocks(); mock_candidate(direct_vm,body=oversized,statuses={})
    assert c.observe_route(vid,"pricing")=="UNCERTAIN"
    observation=c.get_observation(vid,1,"pricing")
    assert observation["probe"]["code"]=="INSPECTION_LIMIT_EXCEEDED" and observation["identity_ok"] is False

def test_post_assessment_content_change_blocks_notarization(direct_vm,direct_deploy):
    c=direct_deploy(CONTRACT); vid=charted(direct_vm,c); direct_vm.clear_mocks(); man=mock_candidate(direct_vm); c.bind_candidate(vid,CANDIDATE,digest(man)); direct_vm.clear_mocks(); mock_candidate(direct_vm,statuses={}); c.observe_route(vid,"pricing"); c.derive_readiness(vid)
    direct_vm.warp(datetime.fromtimestamp(c.get_voyage(vid)["review_deadline"]+1,timezone.utc).isoformat()); direct_vm.clear_mocks()
    direct_vm.mock_web(r".*candidate\.test/\.well-known/harborlight\.json.*",{"status":200,"body":json.dumps(man)})
    direct_vm.mock_web(r".*candidate\.test/pricing.*",{"status":200,"body":CANDIDATE_BODY+"<!-- changed after assessment -->"})
    with direct_vm.expect_revert("freshness seal failed"): c.notarize(vid)
