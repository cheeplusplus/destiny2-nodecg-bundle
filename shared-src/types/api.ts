import { DestinyClass, Color, BucketHashes, ItemState } from "./manifest";

interface GetProfileProfileComponent {
    userInfo: {
        displayName: string;
    };
    dateLastPlayed: string;
    characterIds: string[];
}

interface GetProfileCharactersComponent {
    [characterId: string]: {
        characterId: string;
        dateLastPlayed: string;
        minutesPlayedThisSession: string;
        minutesPlayedTotal: string;
        light: number;
        classType: DestinyClass;
        emblemPath: string;
        emblemBackgroundPath: string;
        emblemHash: number;
        emblemColor: Color;
    };
}

export interface GetProfileCharacterActivitiesComponent {
    [characterId: string]: {
        dateActivityStarted: string;
        currentActivityHash: number; // 3903562779 Tower [DestinyActivityDefinition]
        currentActivityModeHash: number; // 1589650888 Social [DestinyActivityModeDefinition]
        currentActivityModeType: number; // 40 Social [Destiny.HistoricalStats.Definitions.DestinyActivityModeType]
        currentPlaylistActivityHash: number; // 3903562779 Tower [DestinyActivityDefinition]
    };
}

/*
    Activity examples

    Signed out
        "currentActivityHash": 0,
        "currentActivityModeHash": 0,
    
    Actively in orbit
        "currentActivityHash": 82913930,
        "currentActivityModeHash": 2166136261,
        "currentPlaylistActivityHash": 82913930,

    In the Tower
        "currentActivityHash": 3903562779,
        "currentActivityModeHash": 1589650888,
        "currentActivityModeType": 40,
        "currentActivityModeHashes": [1589650888],
        "currentActivityModeTypes": [40],
        "currentPlaylistActivityHash": 3903562779,

    In transit to EDZ and EDZ freeroam (travel makes no difference)
        "currentActivityHash": 3143798436,
        "currentActivityModeHash": 3497767639,
        "currentActivityModeType": 6,
        "currentActivityModeHashes": [3497767639,1164760493],
        "currentActivityModeTypes": [6,7],
        "currentPlaylistActivityHash": 3143798436,

    On Patrol in the EDZ
        "currentActivityHash": 2445164291,
        "currentActivityModeHash": 3497767639,
        "currentActivityModeType": 6,
        "currentActivityModeHashes": [3497767639,1164760493],
        "currentActivityModeTypes": [6,7],
        "currentPlaylistActivityHash": 2445164291,

    Playing Iron Banner
        "currentActivityHash": 532383918,
        "currentActivityModeHash": 2843684868,
        "currentActivityModeType": 43,
        "currentActivityModeHashes": [2843684868,1826469369,1164760504],
        "currentActivityModeTypes": [43,19,5],
        "currentPlaylistActivityHash": 3753505781,
*/

export interface CharacterItem {
    itemHash: number;
    bucketHash: BucketHashes;
    state: ItemState;
}

interface GetProfileCharacterEquipmentComponent {
    [characterId: string]: {
        items: CharacterItem[];
    };
}

interface GetProfileComponentResponse<T> {
    data: T;
    privacy: number;
}

export interface GetProfileCompositeResponse {
    profile: GetProfileComponentResponse<GetProfileProfileComponent>;
    characters: GetProfileComponentResponse<GetProfileCharactersComponent>;
    characterActivities: GetProfileComponentResponse<
        GetProfileCharacterActivitiesComponent
    >;
    characterEquipment: GetProfileComponentResponse<
        GetProfileCharacterEquipmentComponent
    >;
}
