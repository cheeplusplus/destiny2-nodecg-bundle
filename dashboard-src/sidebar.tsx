import * as React from "react";
import * as ReactDOM from "react-dom";
import * as _ from "lodash";
import {
	NodeCgBase,
	NodeCgComponentChildProps
} from "../shared-src/components/NodeCgBase";
import SidebarPicker from "./components/SidebarPicker";

interface Props extends NodeCgComponentChildProps {}

export default function SidebarPanel({ replicants, ...props }: Props) {
	const { sidebarMetadata } = replicants;

	return <SidebarPicker sidebarMetadata={sidebarMetadata} />;
}

const root = document.getElementById("app");
ReactDOM.render(
	<NodeCgBase
		component={SidebarPanel}
		replicantNames={["sidebarMetadata"]}
	></NodeCgBase>,
	root
);
