import { CombinedPlayerData } from "./types";

export interface CharacterListItem {
	characterId: string;
	class: string;
	level: number;
}

export type SidebarDisplay = "guardian" | "weapons" | "armor";

export interface SidebarMetadata {
	currentMode?: SidebarDisplay;
	isAnimating?: boolean;
	animationTime?: number;
}

export interface BottomBarMetadata {
	streamText?: string;
}

export interface DefinedReplicants {
	timestamp: number;
	characterId: string;
	playerData: CombinedPlayerData;
	characterList: CharacterListItem[];
	sidebarMetadata: SidebarMetadata;
	bottomBarMetadata: BottomBarMetadata;
}
