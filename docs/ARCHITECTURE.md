# Architecture

Harborlight has four trust-separated pieces: an Intelligent Contract, a wallet-driven browser console, public evidence artifacts, and a read-only deployment verifier.

The contract owns voyage generations, discovered scope, observations, disputes, review deadlines, and notarizations. GenLayer consensus is used only where public web retrieval or semantic interpretation is required. Deterministic code owns all consequence: schema bounds, hashes, coverage, state precedence, retry limits, freshness, and commitment construction.

## Evidence graph

Each voyage binds:

1. a baseline origin, an independently retrieved route index, and a fixed same-origin build-generated release inventory whose route sets must match exactly;
2. authenticated baseline capsules for every critical route;
3. mandatory protocol invariants plus publisher obligations;
4. a same-origin candidate manifest with exact response-body hashes;
5. per-route semantic findings derived only from the committed raw bytes, plus any admitted counterclaims;
6. a post-review seal observation made from newly retrieved bytes;
7. one canonical evidence root and notarization digest.

The byte-derived inspector covers static HTML semantics and structural affordances: headings, links, and form declarations. It does not claim to execute JavaScript, submit forms, authenticate, or prove remote destinations work. Those belong in conventional browser/API tests. Limits on bytes, semantic text, headings, links, and forms fail the observation closed instead of silently truncating requirements.

The browser is an operator interface, never a source of truth. It reports a write as successful only after transaction finalization and a method-specific read of finalized contract state. The verifier does not trust digest shape alone: it validates the contract runtime identity, protocol identity, finalized state, live inventory and public artifacts, and recomputed canonical commitments.
