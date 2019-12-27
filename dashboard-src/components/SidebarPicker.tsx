import * as React from "react";
import * as _ from "lodash";
import { SidebarMetadata, SidebarDisplay } from "../../shared-src/replicants";
import nodeCGStore from "../../shared-src/stores/NodecgStore";

interface Props {
	sidebarMetadata: SidebarMetadata;
}

export default function SidebarPicker({ sidebarMetadata, ...props }: Props) {
	if (!sidebarMetadata) {
		return <></>;
	}

	const [currentMode, setCurrentMode] = React.useState<SidebarDisplay>(
		"guardian"
	);
	const isAnimating = sidebarMetadata.isAnimating;

	const handleOnClick = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		sidebarMetadata.currentMode = currentMode;
		sidebarMetadata.isAnimating = false;
		nodeCGStore.setValue("sidebarMetadata", sidebarMetadata);
	};

	const setAnimationState = (value: boolean) => {
		sidebarMetadata.isAnimating = value;
		nodeCGStore.setValue("sidebarMetadata", sidebarMetadata);
	};

	const startAnimation = () => {
		if (!isAnimating) {
			setAnimationState(true);
		}
	};

	const stopAnimation = () => {
		if (isAnimating) {
			setAnimationState(false);
		}
	};

	return (
		<div>
			<div>
				Current display: {sidebarMetadata?.currentMode || "unknown"}
			</div>
			<select
				value={currentMode}
				onChange={e => setCurrentMode(e.target.value as SidebarDisplay)}
			>
				<option value="guardian">Guardian</option>
				<option value="weapons">Weapons</option>
				<option value="armor">Armor</option>
			</select>
			<br />
			<button onClick={handleOnClick}>Change</button>
			<br />
			<br />
			<div>
				Is animating: {JSON.stringify(sidebarMetadata?.isAnimating)}
			</div>
			<button onClick={startAnimation} disabled={isAnimating === true}>
				Start anim
			</button>
			<button onClick={stopAnimation} disabled={isAnimating === false}>
				Stop anim
			</button>
		</div>
	);
}
