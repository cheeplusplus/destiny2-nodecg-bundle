import { GameData } from "../gamedata";
import { ComponentData } from "./shared";
import { UnhandledListenForCb } from "../../../../types/lib/nodecg-instance";

const API_UPDATE_INTERVAL = 1 * 60; // 1 minute

export async function registerGameData({
    nodecg,
    config,
    replicants,
    bundleRoot
}: ComponentData) {
    const gameData = new GameData(nodecg, config, bundleRoot);

    // Handle game data updating

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

    // Listen for update button

    nodecg.listenFor("updateServerData", (_, ack: UnhandledListenForCb) => {
        if (ack && !ack.handled) {
            ack();
        }

        nodecg.log.info("Okay let's go", replicants.characterId.value);
        updateGameData(replicants.characterId.value, true, true).catch(err => {
            nodecg.log.warn(
                "Failed to refresh game data on update request",
                err
            );
        });
    });

    // Listen for character ID changes

    replicants.characterId.on("change", newValue => {
        nodecg.log.debug("Got character ID change request", newValue);
        updateGameData(newValue).catch(err => {
            nodecg.log.warn(
                "Failed to refresh game data on character ID change",
                err
            );
        });
    });

    // Update timer

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
        await updateGameData(replicants.characterId.value, true, true);

        // Load the character list immediately
        replicants.characterList.value = gameData.getCharacters();
    } catch (err) {
        nodecg.log.warn("Failed to refresh game data on intial load", err);
    }
}
