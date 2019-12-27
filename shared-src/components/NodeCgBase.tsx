import * as React from "react";
import NCGStore from "../stores/NodecgStore";
import { replicate } from "../stores/NodecgStore";
import { DefinedReplicants } from "../replicants";

export interface NodeCgComponentChildProps {
    replicants: Readonly<DefinedReplicants>;
}

interface Props {
    component:
        | React.ComponentClass<NodeCgComponentChildProps>
        | React.FunctionComponent<NodeCgComponentChildProps>;
    replicantNames: (keyof DefinedReplicants)[];
}

interface State {
    replicants: DefinedReplicants;
}

export class NodeCgBase extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            replicants: NCGStore.getReplicants()
        };
    }

    componentDidMount() {
        // Subscribing to replicant changes
        for (const rn of this.props.replicantNames) {
            replicate(rn);
        }

        // We keep all our subscribed replicants in a single "replicants" object
        NCGStore.on("change", () => {
            this.setState({
                replicants: NCGStore.getReplicants()
            });
        });
    }

    render() {
        return React.createElement(this.props.component, {
            replicants: this.state.replicants
        });
    }
}
