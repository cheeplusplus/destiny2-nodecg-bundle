import * as React from "react";
import * as ReactDOM from "react-dom";
import SidebarBlock from "./components/blocks/sidebar/SidebarBlock";
import {
	NodeCgComponentChildProps,
	NodeCgBase
} from "../shared-src/components/NodeCgBase";

import "./webfonts.css";

interface Props extends NodeCgComponentChildProps {}

export default function SidebarPage({ replicants, ...props }: Props) {
	return (
		<SidebarBlock
			playerData={replicants.playerData}
			sidebarMetadata={replicants.sidebarMetadata}
		/>
	);
}

const root = document.getElementById("app");
ReactDOM.render(
	<NodeCgBase
		component={SidebarPage}
		replicantNames={["timestamp", "playerData", "sidebarMetadata"]}
	></NodeCgBase>,
	root
);
