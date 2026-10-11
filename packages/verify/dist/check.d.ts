export declare const PROTOCOL_ID = "harborlight.release-notary.v2";
export type Identity = {
    protocol_id: string;
    version: number;
    network: string;
    chain_id: number;
};
export type Voyage = {
    id: number;
    state: string;
    generation: number;
    observed_generation: number;
    release_ref: string;
    candidate_origin: string;
    manifest_url: string;
    manifest_digest: string;
    route_index_digest: string;
    inventory_url: string;
    inventory_digest: string;
    route_ids: string[];
    open_dispute: number;
};
export type SealRoute = {
    route_id: string;
    path: string;
    body_sha256: string;
    probe_digest: string;
    observation_digest: string;
};
export type Notarization = {
    protocol_id: string;
    voyage_id: number;
    generation: number;
    release_ref: string;
    candidate_origin: string;
    manifest_url: string;
    manifest_digest: string;
    route_index_digest: string;
    inventory_digest: string;
    freshness_root: string;
    seal: {
        protocol_id: string;
        voyage_id: number;
        generation: number;
        release_ref: string;
        manifest_digest: string;
        route_index_digest: string;
        inventory_digest: string;
        routes: SealRoute[];
    };
    notarization_digest: string;
};
export type Manifest = {
    schema: string;
    protocol_id: string;
    candidate_origin: string;
    release_ref: string;
    route_index_digest: string;
    inventory_digest: string;
    routes: {
        path: string;
        body_sha256: string;
    }[];
};
export type Inventory = {
    schema: string;
    generated_from: string;
    routes: string[];
};
export declare function canonical(value: unknown): string;
export declare const sha256: (value: string | Uint8Array) => string;
export declare const digest: (value: unknown) => string;
export declare function assertIdentity(identity: Identity, deployedSource: string, expectedSourceHash: string): void;
export declare function assertState(v: Voyage, n: Notarization, expectedRef: string): void;
export declare function verifyCommitments(v: Voyage, n: Notarization, manifest: Manifest, inventory: Inventory, bodies: Map<string, Uint8Array>): boolean;
