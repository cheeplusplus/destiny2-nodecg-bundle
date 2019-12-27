import * as React from "react";
import * as _ from "lodash";
import { CharacterListItem } from "../../shared-src/replicants";
import nodeCGStore from "../../shared-src/stores/NodecgStore";

interface Props {
	currentCharacterId: string;
	characterList: CharacterListItem[];
}

export default function CharacterPicker({
	currentCharacterId,
	characterList,
	...props
}: Props) {
	if (!characterList) {
		return <></>;
	}

	if (!currentCharacterId) {
		currentCharacterId = characterList?.[0]?.characterId;
	}

	const [characterId, setCharacterId] = React.useState<string>(
		currentCharacterId
	);

	if (!characterList || characterList.length < 1) {
		return <div>(List not yet loaded)</div>;
	}

	const handleOnClick = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		if (characterId) {
			nodecg.log.info(`Updating character ID to ${characterId}`);
			nodeCGStore.setValue("characterId", characterId);
		} else {
			nodecg.log.warn("Could not find a character ID to update to");
		}
	};

	return (
		<div>
			<p>Current Character</p>
			<select
				value={characterId}
				onChange={e => setCharacterId(e.target.value)}
			>
				{_.map(characterList, (v, i) => {
					return (
						<option value={v.characterId} key={i}>
							{v.class} &#10023; {v.level}
						</option>
					);
				})}
			</select>
			<br />
			<button onClick={handleOnClick}>Change</button>
		</div>
	);
}
