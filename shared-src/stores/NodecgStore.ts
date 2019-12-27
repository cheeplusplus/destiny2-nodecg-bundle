/// <reference path="../../../../types/browser.d.ts" />
import { DefinedReplicants } from "../replicants";
import { EventEmitter } from "events";

class NCGStore extends EventEmitter {
    private actualReplicants: {
        [name: string]: import("../../../../types/lib/replicant").ReplicantBrowser<
            any
        >;
    };
    private replicantCurrentValues: DefinedReplicants;

    constructor() {
        super();

        this.actualReplicants = {};
        this.replicantCurrentValues = {} as DefinedReplicants;
    }

    monitorReplicant<
        T extends keyof DefinedReplicants,
        Y extends DefinedReplicants[T]
    >(name: T) {
        if (this.actualReplicants[name]) {
            return;
        }

        const replicant = nodecg.Replicant(name);
        this.actualReplicants[name] = replicant as any;

        NodeCG.waitForReplicants(replicant).then(() => {
            this.emit("ready", { name });
            replicant.on("change", (newValue: Y) => {
                this.replicantCurrentValues[name] = newValue;
                this.emit("change");
            });
        });
    }

    getReplicants(): Readonly<DefinedReplicants> {
        return this.replicantCurrentValues;
    }

    setValue<T extends keyof DefinedReplicants, Y extends DefinedReplicants[T]>(
        name: T,
        value: Y
    ) {
        if (!this.actualReplicants[name]) {
            throw new Error("Attempted to use unregistered replicant");
        }

        this.actualReplicants[name].value = value;
        this.emit("change");
    }
}

const replicate = <T extends keyof DefinedReplicants>(name: T) => {
    nodeCGStore.monitorReplicant(name);
};

const nodeCGStore = new NCGStore();
export default nodeCGStore;
export { replicate };
