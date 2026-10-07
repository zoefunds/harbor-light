# Security model

Harborlight assumes candidate pages, manifests, snapshots, route indexes, and challenge documents are hostile input. All inputs are size-bounded, canonically serialized, origin-checked, delimiter-defused, and passed to models as data. Model output uses closed schemas; validators independently recompute consequential fields.

The owner cannot weaken mandatory protocol policies, omit routes marked critical by the public route index, challenge their own voyage, shorten review below the minimum, or bypass a hold. New candidates invalidate prior results. Final sealing re-fetches current bytes after the review period.

The deployment verifier requires an expected deployed-source hash and protocol ID from protected repository configuration. It obtains the source independently from Studionet, recomputes live manifest and route hashes, and verifies both canonical notarization commitments. A configured address alone is insufficient.

Residual risks include correlated model/provider failures, personalized or regional content, unstable sites, upstream RPC compromise, and misleading claims that are consistently present in both baseline and candidate. These result in uncertainty where detected; the protocol does not claim to establish real-world truth.
