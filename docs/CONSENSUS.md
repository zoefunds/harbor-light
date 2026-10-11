# Consensus boundary

Harborlight uses five retrieval/assessment consensus stages implemented across its write lifecycle. Every validator independently repeats retrieval and interpretation, then compares the complete consequential payload by canonical JSON. Deterministic writes apply an agreed payload only after GenLayer consensus finalizes it.

| Flow | Consensus work | Deterministic consequence |
|---|---|---|
| Chart discovery | Fetch the public route index and fixed framework inventory; require exact route-set equality | Exact inventory and route-set commitments; complete coverage |
| Baseline anchoring | Fetch baseline bytes and capsule; derive inspection from those bytes; judge faithful representation | Immutable baseline, assessed-byte, and probe digests |
| Candidate binding | Fetch and validate same-origin manifest | New generation and exact route hashes |
| Observation / dispute | Re-fetch candidate, compare obligations, test admitted counterclaim | Rule statuses and route outcome |
| Final seal | After review, re-fetch manifest and all route bytes | Freshness root and notarization, or fail closed |

## Decision rules

Every route includes four mandatory rules: `hl-security`, `hl-function`, `hl-claims`, and `hl-access`. Publisher rules may add obligations but cannot replace these. Findings use the closed statuses `PRESERVED`, `REGRESSED`, `CONFLICTING`, and `UNREADABLE`. A route is `HELD` for a regression or supported counterclaim, `UNCERTAIN` for conflicting/unreadable evidence or an unresolved counterclaim, and `CLEAR` only when every rule is preserved. Voyage aggregation gives `HELD` precedence over `UNCERTAIN`; it produces `CLEAR` only when every registered route has a current-generation clear observation.

Candidate binding increments the generation and invalidates all earlier observations, clear timestamps, deadlines, and disputes. Observation attempts are bounded. A challenge is permitted only during the active review window, must come from a non-owner account, must target a current route rule, and must pass structured admission. `SUPPORTED` and `REFUTED` resolve a dispute. `UNRESOLVED` deliberately leaves the dispute open and the voyage non-notarizable so reassessment can be retried.

Notarization is available only after the minimum `600`-second review window, with a current `CLEAR` aggregate and no open dispute. It independently retrieves the manifest and route bodies again. Any unavailable response, identity mismatch, manifest change, body change, stale observation, or non-clear observation aborts the write.

Challenge evidence is not mere provenance. Admission produces a closed-schema counterclaim (`target`, `assertion`, `expected_observation`) tied to the evidence digest. Reassessment includes that claim and evidence text inside a defused data fence and requires a `counterclaim_status` of `SUPPORTED`, `REFUTED`, or `UNRESOLVED`. A supported material counterclaim deterministically holds the route; unresolved evidence makes it uncertain.

Explanatory prose is presentation-only and never affects state. Closed enums and exact schemas are consensus-bound. Retrieval failures, malformed model output, disagreement, drift, or incomplete scope fail closed.

## Finalized reference run

Voyage `1` on contract `0xB43ad8c26BCD23927Ff46CA849b0a5FaeBc520e6` completed baseline discovery, route registration, baseline anchoring, chart sealing, candidate binding, semantic observation, readiness derivation, public challenge, reassessment, post-dispute derivation, and notarization. The challenge was `REFUTED`; the final observation digest is `8db4e0df1209ca976452a41c400308d0ad6dbc8b275eee714f744c09a285dd9f`. The final freshness root is `0fe4903a5ce210d8e4b36d59fc4cd9c2862ce90d7de34c0ec5e28f4c85454e51`, and the notarization digest is `77ee42c9cc798b8ba55972b26b15d630bd726ef7272a855c9e024fbf520536ee`. Every finalized transaction hash is retained in `proof/hardening-v2-2026-10-11.json`.
