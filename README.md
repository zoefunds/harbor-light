# Harborlight

Harborlight is a GenLayer release-notary network. It answers a consequential question before production deployment: **does the artifact currently being served still satisfy its public promises, protocol safety invariants, and accepted external counter-evidence?**

Instead of trusting a screenshot, a stored verdict, or a mutable preview URL, Harborlight creates a versioned evidence voyage. Validators independently fetch a baseline, reconcile its route index against a framework-generated public inventory, inspect the candidate bytes, evaluate semantic obligations, and resolve bounded public objections. Once the review tide closes, authorization performs a new, independent byte-level observation. CI then verifies the deployed contract identity, re-fetches the current inventory, release manifest, and route bytes, and recomputes the notarization commitments before allowing deployment.

## What makes the decision trustworthy

- **Authoritative surface discovery.** The build scans every static HTML release handler under `app/demo` and publishes that scoped inventory at a fixed same-origin URL. Validators retrieve it independently; its route set must exactly match the route index, duplicate paths are rejected, and every inventoried route must be registered before sealing.
- **Byte-bound semantic evidence.** HTML structure and readable text are derived deterministically from the same raw response bytes whose SHA-256 is committed. Harborlight never assesses a separately rendered response, and inspection-limit overflow fails closed.
- **Protocol invariants.** Security, accessibility, redirect integrity, form-action continuity, and material public-claim preservation are mandatory policy checks. Publishers can add stricter obligations but cannot remove these.
- **Causal objections.** A challenge is admitted as a bounded, schema-validated public claim. Its exact evidence bytes and claim are included in reassessment, so a substantiated objection can change a rule result while remaining fenced as untrusted data.
- **Fresh notarization.** After the review window, validators fetch the manifest and every candidate route again. Any byte drift, route drift, or manifest drift aborts authorization.
- **Independent deployment verification.** The GitHub Action hashes the exact contract source returned by Studionet and checks its protocol identity, reads finalized state, downloads current public bytes, and recomputes manifest, route, freshness-root, and notarization digests.

## Lifecycle

`DRAFT → CHARTED → OBSERVING → CLEAR | HELD | UNCERTAIN → DISPUTED → CLEAR → NOTARIZED`

Every candidate change advances the voyage generation and invalidates prior observations. `HELD` takes precedence over `UNCERTAIN`; `CLEAR` requires complete passing evidence. There is no administrative force-clear or force-notarize path.

## Repository

- `contracts/harborlight.py` — Intelligent Contract and consensus flows
- `apps/console` — responsive public operations console
- `packages/verify` — source GitHub Action and independent commitment verifier
- `tests` — deterministic contract-model and commitment tests
- `docs` — protocol, threat model, consensus, and integration specifications

## Local validation

```bash
npm install
npm test
npm run typecheck
npm run build
python3 -m pytest tests -q
GENVM_VERSION=v0.2.16 genvm-lint check contracts/harborlight.py
```

The supported network is GenLayer Studionet (chain `61999`). No private key or server signer is stored by the application; browser writes use an injected wallet and all reads target finalized state.

## Live deployment

- Canonical console and evidence origin: https://harbor-light-app.vercel.app
- Studionet contract: `0xB43ad8c26BCD23927Ff46CA849b0a5FaeBc520e6`
- Deployment transaction: `0xafb5078d74565c5d506f3bc457332376f80e53c0990825787cad5b85b66efbf9`
- Deployed source SHA-256: `25e32457c402de8c19ec41ca5a0c3d8198862a39e3ed731cbdc65afa55ee857d`
- Protocol identity: `harborlight.release-notary.v2`, version `2`
- Network identity: GenLayer Studionet, chain `61999`
- Finalized demonstration voyage: `1`, release reference `harborlight-demo-v2`
- Final state: `NOTARIZED`, aggregate `CLEAR`, generation `1`, open dispute `0`
- Notarization digest: `77ee42c9cc798b8ba55972b26b15d630bd726ef7272a855c9e024fbf520536ee`
- Freshness root: `0fe4903a5ce210d8e4b36d59fc4cd9c2862ce90d7de34c0ec5e28f4c85454e51`

### Live public evidence

| Artifact | URL | Canonical SHA-256 commitment |
|---|---|---|
| Framework route inventory | `https://harbor-light-app.vercel.app/.well-known/harborlight-inventory.json` | `17d737351134bdf10024e4789e19fe8895b0d0d63f238bf0af6dfa069e412a3e` |
| Publisher route index | `https://harbor-light-app.vercel.app/.well-known/harborlight-routes.json` | `83881b7c859d1e002b5b7cb289e9cea76a48552b075c50b3e7deb0b806a49c8e` |
| Candidate manifest | `https://harbor-light-app.vercel.app/.well-known/harborlight.json` | `f940fbbc7b7247b3131ae23adaf6e44327eb20d290c8f7da280b73001dd3eff8` |
| Assessed route | `https://harbor-light-app.vercel.app/demo/release` | raw-body SHA-256 `09e5f98f2839dc5df6f413de8e1f7e8ff202fcfc8a3a9d6be93ff4e6a79d0703` |
| Baseline capsule | `https://harbor-light-app.vercel.app/demo/baseline-capsule.json` | bound during baseline anchoring |
| Public counter-evidence | `https://harbor-light-app.vercel.app/demo/counter-evidence.txt` | admitted and resolved `REFUTED` |

The launchpad’s **Load live demo fields** control supplies a real public route index, framework inventory, baseline capsule, custom policy, candidate manifest, and exact canonical digests. A tester only needs an injected Studionet wallet and the finalized voyage ID returned by the first transaction. The console reports success only after finalization and a method-specific finalized-state read proves the intended state transition occurred.

The complete finalized v2 transaction chain, review-window seal, mutation-gate results, canonical commitments, and exact verification outcomes are recorded in [`proof/hardening-v2-2026-10-11.json`](proof/hardening-v2-2026-10-11.json). Deployment identity is separately recorded in [`proof/deployment.json`](proof/deployment.json), and the current end-to-end summary is in [`proof/e2e-2026-10-11.json`](proof/e2e-2026-10-11.json).

## Current verified test baseline

The committed v2 deployment has been checked with GenVM `v0.2.16`: contract lint and validation pass, all `21` direct contract tests pass, all `4` console tests pass, all `7` deployment-verifier tests pass, both TypeScript workspaces type-check, and both production packages build. The packaged verifier also passes against the live contract and production bytes. Its negative identity test fails closed with `deployed contract source identity mismatch`; current-byte, manifest, inventory, and commitment mutations are covered by the verifier suite.
