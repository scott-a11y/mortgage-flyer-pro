import { PropertyListing } from "@/types/property";
import { FlyerData } from "@/types/flyer";
import { mapleValleyProperty, celesteZarlingFlyerData } from "./mapleValleyProperty";
import { bothellProperty, bothellFlyerData } from "./bothellProperty";

export interface PropertyDataPackage {
    property: PropertyListing;
    flyerData: FlyerData;
}

export const propertyMapping: Record<string, PropertyDataPackage> = {
    "maple-valley": {
        property: mapleValleyProperty,
        flyerData: celesteZarlingFlyerData
    },
    "bothell": {
        property: bothellProperty,
        flyerData: bothellFlyerData
    },
    // Adding variations for easier slugs
    "24419-214th-ave-se": {
        property: mapleValleyProperty,
        flyerData: celesteZarlingFlyerData
    },
    "16454-108th-ave-ne": {
        property: bothellProperty,
        flyerData: bothellFlyerData
    }
};

export const getPropertyBySlug = (slug: string | undefined): PropertyDataPackage => {
    if (!slug) return propertyMapping["maple-valley"];
    return propertyMapping[slug.toLowerCase()] || propertyMapping["maple-valley"];
};
