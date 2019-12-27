import * as React from "react";
import SidebarBlock from "../sidebar/SidebarBlock";
import BottomBlock from "../bottom/BottomBlock";
import { DefinedReplicants } from "../../../../shared-src/replicants";

import "./Main.scss";

interface Props {
    replicants: DefinedReplicants;
}

export default function Main({ replicants, ...props }: Props) {
    const { playerData, sidebarMetadata, bottomBarMetadata } = replicants;

    return (
        <div>
            <div className="videoBlock">
                <div className="videoBoxDetails">
                    <p>Put the OBS video overlay here:</p>
                    <div className="videoWidth">Width: </div>
                    <div className="videoHeight">Height: </div>
                    <div className="videoLeft">Left: </div>
                    <div className="videoTop">Top: </div>
                </div>
            </div>
            <SidebarBlock
                playerData={playerData}
                sidebarMetadata={sidebarMetadata}
            />
            <BottomBlock
                playerData={playerData}
                bottomBarMetadata={bottomBarMetadata}
            />
        </div>
    );
}
