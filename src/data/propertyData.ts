import { PropertyListing } from "@/types/property";
import { FlyerData } from "@/types/flyer";
import { mapleValleyProperty, celesteZarlingFlyerData } from "./mapleValleyProperty";
import { bothellProperty, bothellFlyerData } from "./bothellProperty";
import { seattleCondoProperty, seattleCondo5DownFlyerData, seattleCondo10DownFlyerData, seattleCondoCeleste5DownFlyerData, seattleCondoCeleste10DownFlyerData } from "./seattleCondoProperty";

export interface PropertyDataPackage {
    property: PropertyListing;
    flyerData: FlyerData;
}

// Clone property with financing override for 10% down
const seattleCondo10DownProperty: PropertyListing = {
    ...seattleCondoProperty,
    financing: {
        ...seattleCondoProperty.financing,
        downPaymentPercent: 10
    }
};

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
    },
    // Seattle U-District Condo — 5% Down (Adrian Mitchell)
    "seattle-condo-5down": {
        property: seattleCondoProperty,
        flyerData: seattleCondo5DownFlyerData
    },
    "905-ne-43rd-5down": {
        property: seattleCondoProperty,
        flyerData: seattleCondo5DownFlyerData
    },
    // Seattle U-District Condo — 10% Down (Adrian Mitchell)
    "seattle-condo-10down": {
        property: seattleCondo10DownProperty,
        flyerData: seattleCondo10DownFlyerData
    },
    "905-ne-43rd-10down": {
        property: seattleCondo10DownProperty,
        flyerData: seattleCondo10DownFlyerData
    },
    // Seattle U-District Condo — 5% Down (Celeste Zarling / Century 21)
    "seattle-condo-celeste-5down": {
        property: seattleCondoProperty,
        flyerData: seattleCondoCeleste5DownFlyerData
    },
    // Seattle U-District Condo — 10% Down (Celeste Zarling / Century 21)
    "seattle-condo-celeste-10down": {
        property: seattleCondo10DownProperty,
        flyerData: seattleCondoCeleste10DownFlyerData
    }
};

export const getPropertyBySlug = (slug: string | undefined): PropertyDataPackage => {
    if (!slug) return propertyMapping["maple-valley"];
    return propertyMapping[slug.toLowerCase()] || propertyMapping["maple-valley"];
};
