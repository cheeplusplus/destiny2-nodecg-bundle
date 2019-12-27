import {
    DefinedReplicants,
    CharacterListItem,
    SidebarMetadata,
    BottomBarMetadata
} from "../../shared-src/replicants";
import { NodeCG } from "../../../../types/server";
import { CombinedPlayerData } from "../../shared-src/types";
import { ReplicantWrapper } from "./shared";

export function registerReplicants(
    nodecg: NodeCG
): ReplicantWrapper<DefinedReplicants> {
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
