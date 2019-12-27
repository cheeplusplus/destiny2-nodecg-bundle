import * as React from "react";
import InventoryItem from "./InventoryItem";
import {
	WeaponList,
	ArmorList,
	BasicItemMetadata
} from "../../../shared-src/types";

interface WeaponProps {
	items: WeaponList;
	order: (keyof WeaponList)[];
}

interface ArmorProps {
	items: ArmorList;
	order: (keyof ArmorList)[];
}

type MixedProps = WeaponProps | ArmorProps;

type Props = React.HTMLProps<HTMLDivElement> & MixedProps;

export default function InventoryDisplay({ items, order, ...props }: Props) {
	const combinedOrder = order as string[];

	return (
		<div className="inventoryDisplay centered">
			{combinedOrder.map((o, i) => {
				const item: BasicItemMetadata = (items as any)[o];
				return <InventoryItem item={item} key={i} />;
			})}
		</div>
	);
}
