// General structure

export interface Color {
    colorHash?: number;
    red: number;
    green: number;
    blue: number;
    alpha: number;
}

interface BasicDefinition {
    displayProperties: {
        name: string; // Sleeper Simulant
        description: string; // Subroutine IKELOS: Status=complete. ...
        icon: string; // URL
        hasIcon: boolean;
    };
}

// Inventory data structure

export interface InventoryTalentItem extends InventoryItem {
    talentGrid: {
        hudDamageType: DamageType;
    };
}

export interface InventoryEmblemItem extends InventoryItem {
    secondaryOverlay: string;
    secondarySpecial: string;
    backgroundColor: Color;
}

export interface InventorySocketableItem extends InventoryItem {
    sockets?: {
        socketEntries: {
            singleInitialItemHash: number; // 3884127242 => Dornröschen
        }[];
        socketCategories: {
            socketCategoryHash: SocketCategoryHashes; // 4241085061 Weapon Perks
            socketIndexes: number[]; // 0, 1, 2...
        }[];
    };
}

export interface InventoryItem extends BasicDefinition {
    itemTypeDisplayName: string; // Linear Fusion Rifle
    itemTypeAndTierDisplayName: string; // Exotic Linear Fusion Rifle
    inventory: {
        tierTypeName: string; // Exotic
        tierType: ItemTier; // 6
    };
}

// Activity data structure

export interface Activity extends BasicDefinition {
    destinationHash: number;
    placeHash: number;
    activityTypeHash: number;
}

export interface ActivityMode extends BasicDefinition {}

export interface Destination extends BasicDefinition {}

export interface Place extends BasicDefinition {}

// Hardcoded hashes so we don't need to look them from file up every time

/** Destiny.DestinyClass enum */
export enum DestinyClass {
    Titan = 0,
    Hunter = 1,
    Warlock = 2,
    Unknown = 3
}

export function DestinyClassToString(c: DestinyClass): string {
    switch (c) {
        case DestinyClass.Titan:
            return "Titan";
        case DestinyClass.Hunter:
            return "Hunter";
        case DestinyClass.Warlock:
            return "Warlock";
        default:
            return "The Darkness";
    }
}

/** Bucket hash convienence enum */
export enum BucketHashes {
    armorHelmet = 3448274439,
    armorGloves = 3551918588,
    armorChest = 14239492,
    armorLegs = 20886954,
    weaponKinetic = 1498876634,
    weaponEnergy = 2465295065,
    weaponPower = 953998645,
    subclass = 3284755031
}

/** Socket category convienence enum */
export enum SocketCategoryHashes {
    weaponPerks = 4241085061,
    armor1Perks = 2518356196,
    armor2Perks = 3154740035
}

/** Destiny.ItemTier enum */
export enum ItemTier {
    Unknown = 0,
    Currency = 1,
    Basic = 2,
    Common = 3,
    Rare = 4,
    Superior = 5,
    Exotic = 6
}

/** Destiny.ItemState bitflag */
export enum ItemState {
    None = 0,
    Locked = 1,
    Tracked = 2,
    Masterwork = 4
}

/** Destiny.DamageType enum */
export enum DamageType {
    None = 0,
    Kinetic = 1,
    Arc = 2,
    Thermal = 3,
    Void = 4,
    Raid = 5
}
