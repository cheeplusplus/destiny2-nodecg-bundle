import * as _ from "lodash";
import {
	InventoryItem,
	Activity,
	Destination,
	Place,
	ActivityMode
} from "../../shared-src/types";
import * as path from "path";
import * as sqlite from "sqlite";

interface DestinyDbStruct {
	id: string;
	json: string;
}

export class Destiny2Manifest {
	private db: sqlite.Database;

	constructor(private bundleRootDir: string) {}

	get loaded(): boolean {
		return !!this.db;
	}

	async load() {
		if (this.db) {
			// Only load once
			return;
		}

		const p = path.join(
			this.bundleRootDir,
			"d2data",
			"world_sql_content.content"
		);
		this.db = await sqlite.open(p);
	}

	async getItemByHash<T extends InventoryItem>(hash: number): Promise<T> {
		return this.fetchByHash<T>("DestinyInventoryItemDefinition", hash);
	}

	async getActivityDefinitionByHash(hash: number): Promise<Activity> {
		return this.fetchByHash<Activity>("DestinyActivityDefinition", hash);
	}

	async getActivityModeByHash(hash: number): Promise<ActivityMode> {
		return this.fetchByHash<ActivityMode>("DestinyActivityModeDefinition", hash);
	}

	async getDestinationByHash(hash: number): Promise<Destination> {
		return this.fetchByHash<Destination>(
			"DestinyDestinationDefinition",
			hash
		);
	}

	async getPlaceByHash(hash: number): Promise<Place> {
		return this.fetchByHash<Place>("DestinyPlaceDefinition", hash);
	}

	private async fetchByHash<T>(table: string, hash: number): Promise<T> {
		if (!this.db) {
			throw new Error("DB not open");
		}

		const res = await this.db.get<DestinyDbStruct>(
			`SELECT json FROM ${table} WHERE id = ?`,
			[this.hashToSqliteId(hash)]
		);
		if (!res) {
			console.warn(`Failed to find hash ${hash} in table ${table}`);
			return undefined;
		}
		return JSON.parse(res.json) as T;
	}

	private hashToSqliteId(hash: number): number {
		return hash >> 0;
	}
}
