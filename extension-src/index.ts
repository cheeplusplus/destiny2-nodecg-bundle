import "source-map-support/register";

import { CombinedPlayerData } from "../shared-src/types";
import { GameData } from "./gamedata";
import { NodeCG, ReplicantServer } from "../../../types/server";
import {
    DefinedReplicants,
    CharacterListItem,
    SidebarMetadata,
    SidebarDisplay,
    BottomBarMetadata
} from "../shared-src/replicants";

const API_UPDATE_INTERVAL = 1 * 60; // 1 minute

export interface BundleConfig {
    apiKey: string;
    apiMembershipType: string;
    apiMembershipId: string;
    debugApi?: boolean;
}

type ReplicantWrapper<T extends DefinedReplicants> = {
    [P in keyof T]: ReplicantServer<T[P]>;
};

function createReplicants(nodecg: NodeCG): ReplicantWrapper<DefinedReplicants> {
    const timeReplicant = nodecg.Replicant<number>("timestamp", {
        defaultValue: 977702400
    });
    const characterIdReplicant = nodecg.Replicant<string>("characterId");
    const playerDataReplicant = nodecg.Replicant<CombinedPlayerData>(
        "playerData"
    );
    const characterListReplicant = nodecg.Replicant<CharacterListItem[]>(
        "characterList"
    );
    const sidebarMetadataReplicant = nodecg.Replicant<SidebarMetadata>(
        "sidebarMetadata",
        {
            defaultValue: {
                currentMode: "guardian",
                isAnimating: true,
                animationTime: 15000
            }
        }
    );
    const bottomBarMetadataReplicant = nodecg.Replicant<BottomBarMetadata>(
        "bottomBarMetadata",
        {
            defaultValue: {
                streamText: "Destiny 2"
            }
        }
    );

    return {
        timestamp: timeReplicant,
        characterId: characterIdReplicant,
        playerData: playerDataReplicant,
        characterList: characterListReplicant,
        sidebarMetadata: sidebarMetadataReplicant,
        bottomBarMetadata: bottomBarMetadataReplicant
    };
}

async function main(nodecg: NodeCG, bundleRoot: string): Promise<void> {
    // High level variables
    nodecg.log.info("Extension running");

    const config = nodecg.bundleConfig as BundleConfig;
    const replicants = createReplicants(nodecg);

    const gameData = new GameData(nodecg, config, bundleRoot);

    // Helpers

    async function updateGameData(
        characterId: string,
        reloadGameData?: boolean,
        forceUpdate?: boolean
    ) {
        if (reloadGameData) {
            await gameData.load(forceUpdate);
        }

        // Fetch current player data
        const playerData = await gameData.getCombinedPlayerData(characterId);
        replicants.playerData.value = playerData;

        // Check if we got new data
        const oldTimestamp = replicants.timestamp.value;
        const newTimestamp = gameData.lastLoadedTimestamp;
        if (newTimestamp && oldTimestamp < newTimestamp) {
            // Update the last-updated time replicant
            replicants.timestamp.value = newTimestamp;
        }
    }

    // Change listeners

    nodecg.listenFor("updateServerData", async query => {
        if (query !== "please") {
            return;
        }

        try {
            await updateGameData(replicants.characterId.value, true, true);
        } catch (err) {
            nodecg.log.warn(
                "Failed to refresh game data on update request",
                err
            );
        }
    });

    replicants.characterId.on("change", newValue => {
        nodecg.log.debug("Got character ID change request", newValue);
        updateGameData(newValue).catch(err => {
            nodecg.log.warn(
                "Failed to refresh game data on character ID change",
                err
            );
        });
    });

    // Sidebar animation timer

    const SidebarDisplayOrder: SidebarDisplay[] = [
        "guardian",
        "weapons",
        "armor"
    ];
    let sidebarAnimationTimer: NodeJS.Timer;

    function updateSidebarState() {
        const currentValue = replicants.sidebarMetadata.value.currentMode;
        let currentPosition = SidebarDisplayOrder.indexOf(currentValue);
        if (
            currentPosition < 0 ||
            currentPosition >= SidebarDisplayOrder.length - 1
        ) {
            currentPosition = 0;
        } else {
            currentPosition++;
        }

        // Move to the next position
        const newValue = SidebarDisplayOrder[currentPosition];
        nodecg.log.debug("Updating sidebar to " + newValue);
        replicants.sidebarMetadata.value.currentMode = newValue;
    }

    function startSidebarAnimation() {
        if (sidebarAnimationTimer) {
            return;
        }

        sidebarAnimationTimer = setInterval(() => {
            updateSidebarState();
        }, replicants?.sidebarMetadata?.value?.animationTime || 15000);
    }

    function stopSidebarAnimation() {
        if (!sidebarAnimationTimer) {
            return;
        }

        clearInterval(sidebarAnimationTimer);
        sidebarAnimationTimer = null;
    }

    if (replicants.sidebarMetadata.value.isAnimating) {
        nodecg.log.info("Starting sidebar animation loop");
        startSidebarAnimation();
    }

    replicants.sidebarMetadata.on("change", newValue => {
        if (newValue.isAnimating) {
            startSidebarAnimation();
        } else {
            stopSidebarAnimation();
        }
    });

    // Refresh timer
    setInterval(() => {
        updateGameData(replicants.characterId.value, true).catch(err => {
            nodecg.log.warn(
                "Failed to refresh game data on interval update",
                err
            );
        });
    }, API_UPDATE_INTERVAL * 1000);

    // Startup handler

    try {
        await updateGameData(replicants.characterId.value, true);
        replicants.characterList.value = gameData.getCharacters();
    } catch (err) {
        nodecg.log.warn("Failed to refresh game data on intial load", err);
    }
}

export function init(nodecg: NodeCG, bundleRoot: string): void {
    main(nodecg, bundleRoot).catch(err => {
        nodecg.log.error("Got top level extension error", err);
    });
}
