# Architecture

Harborlight has four trust-separated pieces: an Intelligent Contract, a wallet-driven browser console, public evidence artifacts, and a read-only deployment verifier.

The contract owns voyage generations, discovered scope, observations, disputes, review deadlines, and notarizations. GenLayer consensus is used only where public web retrieval or semantic interpretation is required. Deterministic code owns all consequence: schema bounds, hashes, coverage, state precedence, retry limits, freshness, and commitment construction.

## Evidence graph

Each voyage binds:

1. a baseline origin and an independently retrieved route index;
2. authenticated baseline capsules for every critical route;
3. mandatory protocol invariants plus publisher obligations;
4. a same-origin candidate manifest with exact response-body hashes;
5. per-route semantic findings and any admitted counterclaims;
6. a post-review seal observation made from newly retrieved bytes;
7. one canonical evidence root and notarization digest.

The browser is an operator interface, never a source of truth. The verifier does not trust digest shape alone: it validates the contract runtime identity, protocol identity, finalized state, live public artifacts, and recomputed canonical commitments.
