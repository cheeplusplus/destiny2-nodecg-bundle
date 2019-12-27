import * as React from "react";
import posed, { PoseGroup } from "react-pose";
import SidebarArmor from "./SidebarArmor";
import SidebarGuardian from "./SidebarGuardian";
import SidebarWeapons from "./SidebarWeapons";
import { CombinedPlayerData } from "../../../../shared-src/types";
import { SidebarMetadata } from "../../../../shared-src/replicants";

import "./SidebarBlock.scss";

interface Props {
    playerData: CombinedPlayerData;
    sidebarMetadata: SidebarMetadata;
}

export default function SidebarBlock({
    playerData,
    sidebarMetadata,
    ...props
}: Props) {
    if (!playerData || !sidebarMetadata) {
        return <div>Loading...</div>;
    }

    const currentMode = sidebarMetadata?.currentMode || "guardian";

    const SidebarSliderPose = posed.div({
        enter: {
            x: 0,
            opacity: 1,
            delay: 100,
            transition: { duration: 500 }
        },
        exit: {
            x: -50,
            opacity: 0,
            delay: 100,
            transition: { duration: 500 }
        }
    });

    return (
        <div className="sidebarBlock">
            <div className="contents">
                <PoseGroup>
                    {currentMode === "guardian" && (
                        <SidebarSliderPose key="guardian">
                            <SidebarGuardian
                                guardianData={playerData.guardian}
                            />
                        </SidebarSliderPose>
                    )}
                    {currentMode === "weapons" && (
                        <SidebarSliderPose key="weapons">
                            <SidebarWeapons weaponData={playerData.weapons} />
                        </SidebarSliderPose>
                    )}
                    {currentMode === "armor" && (
                        <SidebarSliderPose key="armor">
                            <SidebarArmor armorData={playerData.armor} />
                        </SidebarSliderPose>
                    )}
                </PoseGroup>
            </div>
        </div>
    );
}
