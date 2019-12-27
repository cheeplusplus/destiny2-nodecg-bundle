import * as React from "react";
import InventoryDisplay from "../../widgets/InventoryDisplay";
import { WeaponList } from "../../../../shared-src/types";

interface Props {
	weaponData: WeaponList;
}

export default function SidebarWeapons({ weaponData, ...props }: Props) {
	return (
		<div className="weaponsBlock">
			<div className="smallTitle">Loadout</div>
			<div className="centered">
				<InventoryDisplay
					items={weaponData}
					order={["Kinetic", "Energy", "Power"]}
				/>
			</div>
		</div>
	);
}
