import "source-map-support/register";

import { NodeCG } from "../../../types/server";
import {
    registerReplicants,
    registerSidebarTimer,
    registerGameData,
    ComponentData,
    BundleConfig
} from "./components";

// Init everything here
async function main(nodecg: NodeCG, bundleRoot: string): Promise<void> {
    const config = nodecg.bundleConfig as BundleConfig;
    const replicants = registerReplicants(nodecg);

    const shared: ComponentData = {
        nodecg,
        config,
        replicants,
        bundleRoot
    };

    await registerGameData(shared);
    registerSidebarTimer(shared);

    nodecg.log.info("Destiny 2 bundle ready");
}

// Exported non-async init function called from ../extension.js
export function init(nodecg: NodeCG, bundleRoot: string): void {
    main(nodecg, bundleRoot).catch(err => {
        nodecg.log.error("Got top level extension error", err);
    });
}
