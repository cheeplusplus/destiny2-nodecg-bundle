import * as React from "react";
import TextFit from "react-textfit";
import BungieApiImage from "./BungieApiImage";
import { BasicItemMetadata, ItemTier } from "../../../shared-src/types";

import "./InventoryItem.scss";

type Props = { item: BasicItemMetadata } & React.HTMLProps<HTMLDivElement>;

export default function InventoryItem({ item, ...props }: Props) {
    const {
        name,
        description,
        icon,
        tierType,
        exoticPerk,
        masterworked
    } = item;

    return (
        <div className="inventoryItem">
            <div>
                <BungieApiImage
                    path={icon}
                    className={`imageframe ${
                        masterworked ? "masterworked" : ""
                    }`}
                />
            </div>
            <TextFit mode="single" max={48}>
                {name}
            </TextFit>
            {tierType === ItemTier.Exotic && exoticPerk && (
                <div className="perk">
                    <TextFit mode="single" max={32}>
                        <div className="perkName">
                            <BungieApiImage
                                path={exoticPerk.icon}
                                width={48}
                                height={48}
                                style={{ marginRight: "16px" }}
                            />
                            {exoticPerk.name}
                        </div>
                    </TextFit>
                    <TextFit className="perkDescription">
                        {exoticPerk.description}
                    </TextFit>
                </div>
            )}
        </div>
    );
}
