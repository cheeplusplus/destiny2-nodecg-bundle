import { DestinyClass, DamageType, Color, ItemTier } from "./manifest";

export interface BareCharacter {
	characterId: string;
	class: string;
	level: number;
}

interface DisplayProperties {
	name: string;
	description: string;
	icon: string;
}

export interface CombinedPlayerData {
	guardian: GuardianData;
	weapons: WeaponList;
	armor: ArmorList;
}

export interface GuardianData extends BareCharacter {
	subclass: DisplayProperties & {
		damageType: DamageType;
	};
	emblem: {
		image: string;
		banner: string;
		color: Color;
	};
	activity: {
		name: string;
		mode: string;
        playlist?: string;
		destination: string;
		place: string;
	};
}

export interface BasicItemMetadata extends DisplayProperties {
	tierType: ItemTier;
	exoticPerk?: DisplayProperties;
	masterworked?: boolean;
}

export interface WeaponList {
	Kinetic: BasicItemMetadata;
	Energy: BasicItemMetadata;
	Power: BasicItemMetadata;
}

export interface ArmorList {
	Helmet: BasicItemMetadata;
	Gloves: BasicItemMetadata;
	Chest: BasicItemMetadata;
	Legs: BasicItemMetadata;
}
