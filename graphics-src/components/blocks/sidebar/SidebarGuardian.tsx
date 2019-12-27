import * as React from "react";
import { GuardianData } from "../../../../shared-src/types";
import BungieApiImage from "../../widgets/BungieApiImage";

interface Props {
    guardianData: GuardianData;
}

export default function SidebarGuardian({ guardianData, ...props }: Props) {
    return (
        <div className="guardianBlock">
            <div className="smallTitle">Guardian</div>
            <div className="centered">
                <h1>Power level</h1>
                <div className="largeText">{guardianData.level}</div>
                <br />
                <h1>Class</h1>
                <div className="lessLargeText">
                    <div>{guardianData.class}</div>
                    <div style={{ margin: "16px" }}>
                        <BungieApiImage path={guardianData.subclass.icon} />
                    </div>
                    <div>{guardianData.subclass.name}</div>
                </div>
            </div>
        </div>
    );
}
