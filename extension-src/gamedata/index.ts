import * as _ from "lodash";
import * as fs from "fs-extra";
import * as path from "path";
import * as moment from "moment";
import {
    CharacterItem,
    GetProfileCompositeResponse,
    ItemTier,
    InventoryEmblemItem,
    BucketHashes,
    InventoryTalentItem,
    InventorySocketableItem,
    InventoryItem,
    CombinedPlayerData,
    GuardianData,
    WeaponList,
    ArmorList,
    BasicItemMetadata,
    SocketCategoryHashes,
    DestinyClassToString,
    ItemState
} from "../../shared-src/types";
import { Destiny2Manifest } from "./manifest";
import { Destiny2Api } from "./api";
import { CharacterListItem } from "../../shared-src/replicants";
import { NodeCG } from "../../../../types/server";
import { BundleConfig } from "../components/shared";

const API_UPDATE_THRESHHOLD = 30; // 30 seconds

export class GameData {
    private api: Destiny2Api;
    private manifest: Destiny2Manifest;
    private loadStarted: boolean;
    private loadedProfile?: GetProfileCompositeResponse;
    private lastLoaded?: moment.Moment;

    constructor(
        private nodecg: NodeCG,
        private config: BundleConfig,
        private bundleRootDir: string
    ) {
        this.api = new Destiny2Api(config.apiKey, {
            membershipId: config.apiMembershipId,
            membershipType: config.apiMembershipType
        });

        this.manifest = new Destiny2Manifest(bundleRootDir);
    }

    get log() {
        return this.nodecg.log;
    }

    get loaded(): boolean {
        return this.manifest.loaded && !!this.loadedProfile;
    }

    get lastLoadedTimestamp(): number {
        return this.lastLoaded?.unix();
    }

    async load(force?: boolean): Promise<void> {
        // Load the game manifest
        await this.manifest.load();

        if (this.loadStarted) {
            this.log.debug("Load canceled, is already loaded or load started");
            return;
        }

        if (
            !force &&
            this.loaded &&
            moment()
                .subtract(API_UPDATE_THRESHHOLD, "seconds")
                .diff(this.lastLoaded) <= 0
        ) {
            this.log.info("Load canceled, not enough time has passed");
            return;
        }

        this.log.info("Loading new profile data");
        this.loadStarted = true;

        try {
            // Load player data
            if (this.config.debugApi) {
                const p = path.join(
                    this.bundleRootDir,
                    "d2data",
                    "examplePlayerData.json"
                );
                const res = await fs.readJSON(p, { encoding: "utf-8" });
                this.loadedProfile = res.Response;
            } else {
                const res = await this.api.GetProfile();
                this.loadedProfile = res.Response;
            }

            this.lastLoaded = moment();
        } catch (err) {
            throw err;
        } finally {
            this.loadStarted = false;
        }
    }

    async getProfile(): Promise<GetProfileCompositeResponse> {
        return this.loadedProfile;
    }

    async getCombinedPlayerData(
        characterId: string
    ): Promise<CombinedPlayerData> {
        if (!this.loaded) {
            this.log.error("Profile for user not loaded");
            return null;
        }

        this.log.trace(`Processing game data for character ${characterId}`);

        const result = {
            guardian: await this.getGuardian(characterId),
            weapons: await this.getWeapons(characterId),
            armor: await this.getArmor(characterId)
        };

        if (!result.guardian || !result.weapons || !result.armor) {
            // Don't let an empty result make a partially broken UI
            return null;
        }

        return result;
    }

    getCharacters(): CharacterListItem[] {
        if (!this.loaded) {
            this.log.error("Profile for user not loaded");
            return [];
        }

        return _.map(this.loadedProfile.profile.data.characterIds, cid => {
            const char = this.loadedProfile.characters.data[cid];
            if (!char) {
                this.log.warn(`Unable to find character ${cid}`);
                return undefined;
            }

            return {
                characterId: cid,
                class: DestinyClassToString(char.classType),
                level: char.light
            } as CharacterListItem;
        });
    }

    async getGuardian(characterId: string): Promise<GuardianData> {
        if (!this.loaded) {
            this.log.error("Profile for user not loaded");
            return null;
        }

        const char = this.loadedProfile.characters.data[characterId];
        if (!char) {
            this.log.warn(`Unable to find character ${characterId}`);
            return null;
        }

        const emblem = await this.manifest.getItemByHash<InventoryEmblemItem>(
            char.emblemHash
        );

        const equip = this.loadedProfile.characterEquipment.data[characterId];
        const equippedSubclassItem = equip.items.find(
            f => f.bucketHash === BucketHashes.subclass
        );
        const subclass = await this.manifest.getItemByHash<InventoryTalentItem>(
            equippedSubclassItem.itemHash
        );

        let currentActivityName: string,
            currentActivityMode: string,
            currentActivityPlaylist: string,
            currentActivityDestination: string,
            currentActivityPlace: string;
        const charActivity = this.loadedProfile.characterActivities.data[
            characterId
        ];
        if (charActivity) {
            if (charActivity.currentActivityHash) {
                const activity = await this.manifest.getActivityDefinitionByHash(
                    charActivity.currentActivityHash
                );
                if (activity) {
                    currentActivityName = activity.displayProperties.name;

                    if (activity.destinationHash) {
                        const destination = await this.manifest.getDestinationByHash(
                            activity.destinationHash
                        );
                        if (destination) {
                            currentActivityDestination =
                                destination.displayProperties.name;
                        }
                    }
                    if (activity.placeHash) {
                        const place = await this.manifest.getPlaceByHash(
                            activity.placeHash
                        );
                        if (place) {
                            currentActivityPlace = place.displayProperties.name;
                        }
                    }
                }
            }

            if (
                charActivity.currentPlaylistActivityHash &&
                charActivity.currentPlaylistActivityHash !==
                    charActivity.currentActivityHash
            ) {
                const playlist = await this.manifest.getActivityDefinitionByHash(
                    charActivity.currentPlaylistActivityHash
                );
                if (playlist) {
                    currentActivityPlaylist = playlist.displayProperties.name;
                }
            }

            if (charActivity.currentActivityModeHash) {
                const mode = await this.manifest.getActivityModeByHash(
                    charActivity.currentActivityModeHash
                );
                if (mode) {
                    currentActivityMode = mode.displayProperties.name;
                }
            }
        }

        return {
            characterId,
            class: DestinyClassToString(char.classType),
            level: char.light,
            subclass: {
                name: subclass.displayProperties.name,
                description: subclass.displayProperties.description,
                icon: subclass.displayProperties.icon,
                damageType: subclass.talentGrid.hudDamageType
            },
            emblem: {
                image: emblem.secondaryOverlay,
                banner: emblem.secondarySpecial,
                color: emblem.backgroundColor
            },
            activity: charActivity?.currentActivityHash
                ? {
                      name: currentActivityName,
                      mode: currentActivityMode,
                      playlist: currentActivityPlaylist,
                      destination: currentActivityDestination,
                      place: currentActivityPlace
                  }
                : null
        };
    }

    async getWeapons(characterId: string): Promise<WeaponList> {
        if (!this.loaded) {
            this.log.error("Profile for user not loaded");
            return null;
        }

        const equip = this.loadedProfile.characterEquipment.data[characterId];
        if (!equip) {
            this.log.warn(`Unable to find character equipment ${characterId}`);
            return null;
        }

        return {
            Kinetic: await this.getItemMetadataForBucket(
                equip.items,
                BucketHashes.weaponKinetic
            ),
            Energy: await this.getItemMetadataForBucket(
                equip.items,
                BucketHashes.weaponEnergy
            ),
            Power: await this.getItemMetadataForBucket(
                equip.items,
                BucketHashes.weaponPower
            )
        };
    }

    async getArmor(characterId: string): Promise<ArmorList> {
        if (!this.loaded) {
            this.log.error("Profile for user not loaded");
            return null;
        }

        const equip = this.loadedProfile.characterEquipment.data[characterId];
        if (!equip) {
            this.log.warn(`Unable to find character equipment ${characterId}`);
            return null;
        }

        return {
            Helmet: await this.getItemMetadataForBucket(
                equip.items,
                BucketHashes.armorHelmet
            ),
            Gloves: await this.getItemMetadataForBucket(
                equip.items,
                BucketHashes.armorGloves
            ),
            Chest: await this.getItemMetadataForBucket(
                equip.items,
                BucketHashes.armorChest
            ),
            Legs: await this.getItemMetadataForBucket(
                equip.items,
                BucketHashes.armorLegs
            )
        };
    }

    private async getItemMetadataForBucket(
        items: CharacterItem[],
        bucket: BucketHashes
    ): Promise<BasicItemMetadata> {
        const targetEquippedItem = _.find(items, f => f.bucketHash === bucket);

        const item = await this.manifest.getItemByHash<InventorySocketableItem>(
            targetEquippedItem.itemHash
        );
        if (!item) {
            this.log.warn(
                `Unable to find item by hash ${targetEquippedItem.itemHash}`
            );
            return null;
        }

        // If this is an exotic item, find its exotic perk
        let exoticPerk: InventoryItem["displayProperties"];
        if (item.inventory.tierType === ItemTier.Exotic && item.sockets) {
            /*const perk = _.chain(item.sockets.socketEntries)
                .map(m => this.manifest.getItemByHash(m.singleInitialItemHash))
                .filter(f => !!f && !!f.inventory)
                .find(f => f.inventory.tierType === ItemTier.Exotic)
                .value();*/
            const perks = _.find(
                item.sockets.socketCategories,
                f =>
                    f.socketCategoryHash === SocketCategoryHashes.weaponPerks ||
                    f.socketCategoryHash === SocketCategoryHashes.armor1Perks ||
                    f.socketCategoryHash === SocketCategoryHashes.armor2Perks
            );
            if (perks) {
                const firstPerkIndex = perks.socketIndexes[0];
                const primaryPerkHash =
                    item.sockets.socketEntries[firstPerkIndex];
                const primaryPerk = await this.manifest.getItemByHash(
                    primaryPerkHash.singleInitialItemHash
                );

                if (primaryPerk) {
                    exoticPerk = primaryPerk.displayProperties;
                }
            }
        }

        // Read the state bitflag to pull masterworked status
        const masterworked: boolean =
            (targetEquippedItem.state & ItemState.Masterwork) ===
            ItemState.Masterwork;

        return {
            name: item.displayProperties.name,
            description: item.displayProperties.description,
            icon: item.displayProperties.hasIcon
                ? item.displayProperties.icon
                : undefined,
            tierType: item.inventory.tierType,
            exoticPerk,
            masterworked
        };
    }
}
