import * as React from "react";
import * as ReactDOM from "react-dom";
import * as _ from "lodash";
import {
    NodeCgBase,
    NodeCgComponentChildProps
} from "../shared-src/components/NodeCgBase";
import CharacterPicker from "./components/CharacterPicker";
import LastAgo from "./components/LastAgo";

interface Props extends NodeCgComponentChildProps {}

export default function GameDataPanel({ replicants, ...props }: Props) {
    const { characterId, characterList, timestamp } = replicants;

    const updateApi = () => {
        nodecg.log.info(`Asking extension for an API update`);
        nodecg.sendMessageToBundle(
            "updateServerData",
            "destiny2-nodecg-bundle"
        );
    };

    if (!timestamp) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <p>
                Last updated: <LastAgo timestamp={timestamp} />
                <br />
                <button onClick={updateApi}>Update from API</button>
            </p>
            <CharacterPicker
                currentCharacterId={characterId}
                characterList={characterList}
            />
        </div>
    );
}

const root = document.getElementById("app");
ReactDOM.render(
    <NodeCgBase
        component={GameDataPanel}
        replicantNames={["characterId", "characterList", "timestamp"]}
    ></NodeCgBase>,
    root
);
