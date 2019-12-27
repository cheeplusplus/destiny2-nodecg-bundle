import * as React from "react";
import * as ReactDOM from "react-dom";
import {
	NodeCgBase,
	NodeCgComponentChildProps
} from "../shared-src/components/NodeCgBase";
import BottomBlock from "./components/blocks/bottom/BottomBlock";

import "./webfonts.css";

interface Props extends NodeCgComponentChildProps {}

export default function BottomPage({ replicants, ...props }: Props) {
	return (
		<BottomBlock
			playerData={replicants.playerData}
			bottomBarMetadata={replicants.bottomBarMetadata}
		/>
	);
}

const root = document.getElementById("app");
ReactDOM.render(
	<NodeCgBase
		component={BottomPage}
		replicantNames={["timestamp", "playerData", "bottomBarMetadata"]}
	></NodeCgBase>,
	root
);
