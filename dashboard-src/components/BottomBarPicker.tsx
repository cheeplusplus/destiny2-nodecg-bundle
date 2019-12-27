import * as React from "react";
import * as _ from "lodash";
import { BottomBarMetadata } from "../../shared-src/replicants";
import nodeCGStore from "../../shared-src/stores/NodecgStore";

interface Props {
    bottomBarMetadata: BottomBarMetadata;
}

export default function BottomBarPicker({
    bottomBarMetadata,
    ...props
}: Props) {
    if (!bottomBarMetadata) {
        return <></>;
    }

    const [streamText, setStreamText] = React.useState<string>(
        bottomBarMetadata.streamText || "Stream Text Goes Here"
    );

    const handleOnClick = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        bottomBarMetadata.streamText = streamText;
        nodeCGStore.setValue("bottomBarMetadata", bottomBarMetadata);
    };

    return (
        <div>
            Stream text:
            <input
                type="text"
                value={streamText}
                onChange={e => setStreamText(e.target.value)}
            />
            <br />
            <button onClick={handleOnClick}>Change</button>
        </div>
    );
}
