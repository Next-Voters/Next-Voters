export type SupportedRegions = "United States" | "Canada" | "California" | "Texas"

export type RegionType = "city" | "state" | "country";

export interface SupportedRegionDetails {
    code: string;
    name: string;
    type: RegionType;
    parentRegionCode?: string;
    politicalParties: string[];
    collectionName: string;
}