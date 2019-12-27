import * as React from "react";
import InventoryDisplay from "../../widgets/InventoryDisplay";
import { ArmorList } from "../../../../shared-src/types";

interface Props {
    armorData: ArmorList;
}

export default function SidebarArmor({ armorData, ...props }: Props) {
    return (
        <div className="armorBlock">
            <div className="smallTitle">Loadout</div>
            <div className="centered">
                <InventoryDisplay
                    items={armorData}
                    order={["Helmet", "Gloves", "Chest", "Legs"]}
                />
            </div>
        </div>
    );
}
