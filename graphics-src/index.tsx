import * as React from "react";
import * as ReactDOM from "react-dom";
import Main from "./components/blocks/main/Main";
import {
    NodeCgBase,
    NodeCgComponentChildProps
} from "../shared-src/components/NodeCgBase";

import "./webfonts.css";

interface Props extends NodeCgComponentChildProps {}

export default function MainPage({ replicants, ...props }: Props) {
    return <Main replicants={replicants} />;
}

const root = document.getElementById("app");
ReactDOM.render(
    <NodeCgBase
        component={MainPage}
        replicantNames={[
            "timestamp",
            "playerData",
            "sidebarMetadata",
            "bottomBarMetadata"
        ]}
    ></NodeCgBase>,
    root
);
