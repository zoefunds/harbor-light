# Harborlight

Harborlight is a GenLayer release-notary network. It answers a consequential question before production deployment: **does the artifact currently being served still satisfy its public promises, protocol safety invariants, and accepted external counter-evidence?**

Instead of trusting a screenshot, a stored verdict, or a mutable preview URL, Harborlight creates a versioned evidence voyage. Validators independently fetch a baseline, discover its public surface, inspect the candidate, evaluate semantic obligations, and resolve bounded public objections. Once the review tide closes, authorization performs a new, independent byte-level observation. CI then verifies the deployed contract identity, re-fetches the current release manifest and route bytes, and recomputes the notarization commitments before allowing deployment.

## What makes the decision trustworthy

- **Open surface discovery.** A required sitemap or route-index artifact is independently retrieved. The contract enforces coverage of every discovered critical route, not only routes selected by the publisher.
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

- Console: https://harbor-light-app.vercel.app
- Studionet contract: `0x892a229Ef258666B22aBA4c72C25AA98070BFbC0`
- Deployment transaction: `0x35f8855fe046338ae22c6a17fd11ca1fb5260955ac67bb629d2d23a0df32d952`
- Deployed source SHA-256: `f147b8e14ce60377042e1e58f783c8b858508e43f332fb81053456b89d5e00bf`

The launchpad’s **Load live demo fields** control supplies a real public route index, baseline capsule, custom policy, candidate manifest, and exact canonical digests. A tester only needs an injected Studionet wallet and the finalized voyage ID returned by the first transaction.
