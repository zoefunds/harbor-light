# Consensus boundary

Harborlight uses six custom leader/validator flows. Every validator independently repeats retrieval and interpretation, then compares the complete consequential payload by canonical JSON.

| Flow | Consensus work | Deterministic consequence |
|---|---|---|
| Chart discovery | Fetch the public route index and fixed framework inventory; require exact route-set equality | Exact inventory and route-set commitments; complete coverage |
| Baseline anchoring | Fetch baseline bytes and capsule; derive inspection from those bytes; judge faithful representation | Immutable baseline, assessed-byte, and probe digests |
| Candidate binding | Fetch and validate same-origin manifest | New generation and exact route hashes |
| Observation / dispute | Re-fetch candidate, compare obligations, test admitted counterclaim | Rule statuses and route outcome |
| Final seal | After review, re-fetch manifest and all route bytes | Freshness root and notarization, or fail closed |

Challenge evidence is not mere provenance. Admission produces a closed-schema counterclaim (`target`, `assertion`, `expected_observation`) tied to the evidence digest. Reassessment includes that claim and evidence text inside a defused data fence and requires a `counterclaim_status` of `SUPPORTED`, `REFUTED`, or `UNRESOLVED`. A supported material counterclaim deterministically holds the route; unresolved evidence makes it uncertain.

Explanatory prose is presentation-only and never affects state. Closed enums and exact schemas are consensus-bound. Retrieval failures, malformed model output, disagreement, drift, or incomplete scope fail closed.
