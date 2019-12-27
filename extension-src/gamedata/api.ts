import * as superagent from "superagent";
import { GetProfileCompositeResponse } from "../../shared-src/types";

export interface Membership {
    membershipType: string;
    membershipId: string;
}
interface ApiResponse<T> {
    Response: T;
    ErrorCode: number;
    ThrottleSeconds: number;
    ErrorStatus: string;
    Message: string;
    MessageData: {};
}

const DESTINY_API = "https://www.bungie.net/Platform";

enum DestinyComponentType {
    None = 0,
    Profiles = 100,
    Characters = 200,
    CharacterActivities = 204,
    CharacterEquipment = 205
}

export class Destiny2Api {
    constructor(private apiKey: string, private membership: Membership) {}

    GetProfile() {
        const components: DestinyComponentType[] = [
            DestinyComponentType.Profiles,
            DestinyComponentType.Characters,
            DestinyComponentType.CharacterActivities,
            DestinyComponentType.CharacterEquipment
        ];

        return this.makeGetRequest<GetProfileCompositeResponse>(
            `/Destiny2/${this.membership.membershipType}/Profile/${this.membership.membershipId}/`,
            { components: components.join(",") }
        );
    }

    private async makeGetRequest<T = {}>(
        url: string,
        query?: { [key: string]: string }
    ): Promise<ApiResponse<T>> {
        const req = superagent
            .get(DESTINY_API + url)
            .set("x-api-key", this.apiKey);
        if (query) {
            req.query(query);
        }

        const res = await req;
        return res.body as ApiResponse<T>;
    }
}
