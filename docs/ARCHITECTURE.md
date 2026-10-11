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

## Authoritative route scope

The authoritative release surface is deliberately exact and narrow: every static HTML route handler below `apps/console/app/demo`. Before each console build, `apps/console/scripts/generate-inventory.mjs` scans that source tree and generates `/.well-known/harborlight-inventory.json` with schema `harborlight.inventory.v1` and generator identity `next-release-route-scan`. The publisher route index uses schema `harborlight.route-index.v2` and must name the same inventory URL, exact inventory digest, and exactly the same unique path set. A voyage cannot seal until every discovered path has one registered route.

For the finalized demonstration voyage, the inventory contains `/demo/release`. Its current raw response hash is `09e5f98f2839dc5df6f413de8e1f7e8ff202fcfc8a3a9d6be93ff4e6a79d0703`. Dynamic console pages such as `/voyages/[id]`, authenticated behavior, JavaScript execution, and external destinations are not included in this guarantee.

## Commitments

All JSON digests use recursively key-sorted, separator-free canonical JSON followed by SHA-256. Route bodies are hashed as their exact HTTP response bytes. `_probe()` decodes and inspects those same bytes; there is no second render request. Each successful probe therefore carries an equal `body_sha256` and `assessed_body_sha256`.

The final seal binds protocol ID, voyage ID, generation, release reference, manifest digest, route-index digest, inventory digest, route IDs, paths, current body hashes, probe digests, and observation digests. The SHA-256 of that canonical seal is the freshness root. The notarization digest is the canonical SHA-256 of the entire unsigned notarization record.

## Current deployed topology

- Console/evidence origin: `https://harbor-light-app.vercel.app`
- Contract: `0xB43ad8c26BCD23927Ff46CA849b0a5FaeBc520e6`
- Protocol: `harborlight.release-notary.v2`
- Chain: GenLayer Studionet `61999`
- Deployment transaction: `0xafb5078d74565c5d506f3bc457332376f80e53c0990825787cad5b85b66efbf9`
- Contract source SHA-256: `25e32457c402de8c19ec41ca5a0c3d8198862a39e3ed731cbdc65afa55ee857d`
