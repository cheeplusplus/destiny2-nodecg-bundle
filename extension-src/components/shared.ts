import { NodeCG, ReplicantServer } from "../../../../types/server";
import { DefinedReplicants } from "../../shared-src/replicants";

export interface BundleConfig {
    apiKey: string;
    apiMembershipType: string;
    apiMembershipId: string;
    debugApi?: boolean;
}

export type ReplicantWrapper<T extends DefinedReplicants> = {
    [P in keyof T]: ReplicantServer<T[P]>;
};

export interface ComponentData {
    nodecg: NodeCG;
    config: BundleConfig;
    bundleRoot: string;
    replicants: ReplicantWrapper<DefinedReplicants>;
}
