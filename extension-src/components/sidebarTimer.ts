import { SidebarDisplay } from "../../shared-src/replicants";
import { ComponentData } from "./shared";

const SidebarDisplayOrder: SidebarDisplay[] = ["guardian", "weapons", "armor"];

export function registerSidebarTimer({ nodecg, replicants }: ComponentData) {
    let sidebarAnimationTimer: NodeJS.Timer;

    function updateSidebarState() {
        const currentValue = replicants.sidebarMetadata.value.currentMode;
        let currentPosition = SidebarDisplayOrder.indexOf(currentValue);
        if (
            currentPosition < 0 ||
            currentPosition >= SidebarDisplayOrder.length - 1
        ) {
            currentPosition = 0;
        } else {
            currentPosition++;
        }

        // Move to the next position
        const newValue = SidebarDisplayOrder[currentPosition];
        nodecg.log.debug("Updating sidebar to " + newValue);
        replicants.sidebarMetadata.value.currentMode = newValue;
    }

    function startSidebarAnimation() {
        if (sidebarAnimationTimer) {
            return;
        }

        sidebarAnimationTimer = setInterval(() => {
            updateSidebarState();
        }, replicants?.sidebarMetadata?.value?.animationTime || 15000);
    }

    function stopSidebarAnimation() {
        if (!sidebarAnimationTimer) {
            return;
        }

        clearInterval(sidebarAnimationTimer);
        sidebarAnimationTimer = null;
    }

    if (replicants.sidebarMetadata.value.isAnimating) {
        nodecg.log.info("Starting sidebar animation loop");
        startSidebarAnimation();
    }

    replicants.sidebarMetadata.on("change", newValue => {
        if (newValue.isAnimating) {
            startSidebarAnimation();
        } else {
            stopSidebarAnimation();
        }
    });
}
