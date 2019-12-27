import * as React from "react";
import BungieApiImage from "../../widgets/BungieApiImage";
import { BottomBarMetadata } from "../../../../shared-src/replicants";
import { CombinedPlayerData } from "../../../../shared-src/types";

import "./BottomBlock.scss";

interface Props {
    playerData: CombinedPlayerData;
    bottomBarMetadata: BottomBarMetadata;
}

export default function BottomBlock({
    playerData,
    bottomBarMetadata,
    ...props
}: Props) {
    const guardianData = playerData?.guardian;
    const activity = guardianData?.activity;

    if (!guardianData) {
        return <div>Loading...</div>;
    }

    let line1: string, line2: string;
    if (activity) {
        if (activity.place === "Orbit") {
            line1 = "In Orbit";
        } else {
            /* Playing Tower (Social)
               The Last City on Earth

               Playing Endless Vale (Iron Banner Control): Iron Banner
               on The Crucible 

            let modeLine = "";
            if (activity.mode) {
                modeLine = ` (${activity.mode})`;
            }
            let playlistLine = "";
            if (activity.playlist) {
                playlistLine = `: ${activity.playlist}`;
            }

            line1 = `Playing ${guardianData.activity.name ||
                "?"}${modeLine}${playlistLine}`;
            line2 = `${guardianData.activity.destination ||
                ""} on ${activity.place || "unknown"}`;*/

            /* New mode
               Name / Playlist (Mode[subst out playlist from mode])
               Playlist / Destination / Place

               Tower (Social)
               The Last City / Earth

               Endless Vale: Iron Banner (Control)
               The Crucible
            */

            line1 = `${activity.name}`;
            if (activity.playlist) {
                line1 += `: ${activity.playlist}`;
            }
            if (activity.mode) {
                let modeLine = activity.mode;
                if (activity.playlist) {
                    modeLine = modeLine.replace(activity.playlist, "");
                }
                line1 += ` (${modeLine})`;
            }

            if (activity.destination) {
                line2 += `${activity.destination} `;
            }
            if (activity.place) {
                line2 += activity.place;
            }
        }
    }

    return (
        <div className="bottomBlock">
            <BungieApiImage
                path={guardianData.emblem.banner}
                className="banner"
            />
            <BungieApiImage
                path={guardianData.emblem.image}
                className="emblem"
            />
            <div className="streamTitle">
                <div className="d2-header bigHeader">
                    {bottomBarMetadata?.streamText || "Stream Text Goes Here"}
                </div>
            </div>
            <div className="currentActivity">
                {((line1 || line2) && (
                    <>
                        <div className="smallTitleTight">Currently...</div>
                        <div>
                            <div>{line1}</div>
                            <div>{line2}</div>
                        </div>
                    </>
                )) ||
                    "Not playing!"}
            </div>
        </div>
    );
}
