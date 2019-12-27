import * as React from "react";
import * as ReactDOM from "react-dom";
import * as _ from "lodash";
import {
    NodeCgBase,
    NodeCgComponentChildProps
} from "../shared-src/components/NodeCgBase";
import BottomBarPicker from "./components/BottomBarPicker";

interface Props extends NodeCgComponentChildProps {}

export default function BottomBarPanel({ replicants, ...props }: Props) {
    const { bottomBarMetadata } = replicants;

    return <BottomBarPicker bottomBarMetadata={bottomBarMetadata} />;
}

const root = document.getElementById("app");
ReactDOM.render(
    <NodeCgBase
        component={BottomBarPanel}
        replicantNames={["bottomBarMetadata"]}
    ></NodeCgBase>,
    root
);
