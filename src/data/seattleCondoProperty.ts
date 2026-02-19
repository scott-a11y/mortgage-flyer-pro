// Property listing data for 905 NE 43rd St Unit #111, Seattle, WA 98105
// U-District Condo — Adrian Mitchell (Works Real Estate)
import { PropertyListing } from "@/types/property";
import { FlyerData, ColorTheme } from "@/types/flyer";

// Works Real Estate Theme — Adrian Mitchell's branding (Black / White / Gold)
export const seattleCondoTheme: ColorTheme = {
    id: "worksre-udistrict",
    name: "Works Real Estate — U-District",
    primary: "#1a1a2e",   // Deep charcoal navy
    secondary: "#D4AF37", // Gold accent
    accent: "#ffffff"
};

// Property listing data
export const seattleCondoProperty: PropertyListing = {
    specs: {
        address: "905 NE 43rd St Unit #111",
        city: "Seattle",
        state: "WA",
        zip: "98105",
        listPrice: 179900,
        mlsNumber: "2438807",
        bedrooms: 1,
        bathrooms: 1,
        squareFootage: 545,
        lotSize: "N/A",
        yearBuilt: 1926,
        garage: "None",
        hoa: 986,
        propertyType: "Condominium"
    },
    features: {
        headline: "Move-In Ready U-District Condo — No Rental Cap!",
        subheadline: "Renovated Corner Unit with Vintage Charm | Walk to UW & Light Rail",
        bulletPoints: [
            "Best-priced 1-bedroom condo in the University District",
            "Desirable main-level corner unit with abundant natural light",
            "Newly refinished original hardwood floors throughout",
            "Freshly painted interior with tall ceilings & oversized windows",
            "Renovated kitchen with eating area and vintage charm",
            "Walk-in closet for generous storage",
            "Brick & concrete construction — solid, timeless build quality",
            "NO rental cap — perfect for investors or owner-occupants",
            "HOA covers water, sewer, trash, hot water & common area maintenance",
            "Laundry facilities in building",
            "Steps from UW campus, shops, restaurants & the Burke-Gilman Trail",
            "Easy access to U-District Light Rail station",
            "Ideal starter home, investment property, or pied-à-terre"
        ]
    },
    images: {
        hero: "/seattle-condo-hero.png",
        secondary: [
            "/seattle-condo-kitchen.png",
            "/seattle-condo-living.png",
            "/seattle-condo-bath.png"
        ]
    },
    financing: {
        listPrice: 179900,
        downPaymentPercent: 5,
        interestRate: 6.5,
        loanTermYears: 30,
        hoa: 986
    }
};

// ─────────────────────────────────────────────────────
//  5% DOWN FLYER — Adrian Mitchell + Scott Little
// ─────────────────────────────────────────────────────
export const seattleCondo5DownFlyerData: FlyerData = {
    rates: {
        thirtyYearFixed: "6.500%",
        thirtyYearFixedAPR: "6.682%",
        fifteenYearFixed: "5.875%",
        fifteenYearFixedAPR: "5.992%",
        thirtyYearJumbo: "6.750%",
        thirtyYearJumboAPR: "6.890%",
        fiveOneArm: "6.000%",
        fiveOneArmAPR: "7.125%",
        fha: "6.125%",
        fhaAPR: "6.832%",
        va: "6.000%",
        vaAPR: "6.250%",
        dateGenerated: "February 18, 2026"
    },
    marketCopy: {
        headline: "U-District Condo — 5% Down",
        subheading: "Move-In Ready • No Rental Cap • Walk to UW",
        marketInsight: "At just $179,900, this renovated corner unit is the most affordable entry point into Seattle's University District. With only 5% down ($8,995), buyers can own a move-in ready condo with character, convenience, and investment potential — NO rental cap means immediate cash flow opportunity."
    },
    regions: [
        {
            name: "University District",
            cities: "U-District, Wallingford, Ravenna",
            insight: "UW campus proximity and new light rail access fuel strong rental demand and consistent appreciation."
        },
        {
            name: "Investor Friendly",
            cities: "No Rental Cap",
            insight: "Properties without rental restrictions are increasingly rare in Seattle condos — strong draw for investors."
        },
        {
            name: "Transit & Lifestyle",
            cities: "Light Rail, Burke-Gilman Trail",
            insight: "U-District Station connects to downtown, airport, and the Eastside — premium walkability adds lasting value."
        }
    ],
    cta: {
        buttonText: "Get Pre-Approved Today",
        buttonUrl: "https://1731464.my1003app.com/130371/register",
        showQRCode: true,
        qrLabel: "Scan for Pre-Approval"
    },
    broker: {
        name: "Scott Little",
        title: "Mortgage Broker",
        phone: "(360) 606-1106",
        email: "scott@ialoans.com",
        nmls: "1858045",
        headshot: "/scott-little-headshot.png",
        headshotPosition: 50
    },
    company: {
        name: "IA Loans",
        phone1: "(360) 606-1106",
        phone2: "",
        email: "scott@ialoans.com",
        website: "ialoans.com",
        nmls: "1858045",
        logo: ""
    },
    realtor: {
        name: "Adrian Mitchell",
        title: "Oregon REALTOR®",
        phone: "(971) 712-4291",
        email: "adrian.mitchell@worksrealestate.co",
        brokerage: "Works Real Estate",
        website: "portlandworksrealestate.co",
        headshot: "/adrian-mitchell-headshot.png",
        headshotPosition: 15,
        logo: ""
    },
    colorTheme: seattleCondoTheme,
    layout: "luxury",
    rateType: "conventional"
};

// ─────────────────────────────────────────────────────
//  10% DOWN FLYER — Adrian Mitchell + Scott Little
// ─────────────────────────────────────────────────────
export const seattleCondo10DownFlyerData: FlyerData = {
    ...seattleCondo5DownFlyerData,
    marketCopy: {
        headline: "U-District Condo — 10% Down",
        subheading: "Move-In Ready • No Rental Cap • Walk to UW",
        marketInsight: "At $179,900 with 10% down ($17,990), this renovated corner unit offers an affordable path to Seattle homeownership with lower monthly PMI. The University District's walkability, light rail, and strong rental market make this an ideal owner-occupied or investment purchase."
    }
};

// Financing overrides for each scenario
export const financing5Down = {
    listPrice: 179900,
    downPaymentPercent: 5,
    downPaymentAmount: 8995,
    loanAmount: 170905,
    interestRate: 6.5,
    loanTermYears: 30,
    hoa: 986,
    estimatedMonthlyPI: 1080,     // P&I on $170,905 @ 6.5%
    estimatedPMI: 119,             // ~0.83% annual PMI on 95% LTV
    estimatedTaxes: 150,           // ~$1,800/yr property tax
    estimatedInsurance: 35,        // condo HO-6
    estimatedTotalPayment: 2370,   // P&I + PMI + Tax + Insurance + HOA
};

export const financing10Down = {
    listPrice: 179900,
    downPaymentPercent: 10,
    downPaymentAmount: 17990,
    loanAmount: 161910,
    interestRate: 6.5,
    loanTermYears: 30,
    hoa: 986,
    estimatedMonthlyPI: 1023,     // P&I on $161,910 @ 6.5%
    estimatedPMI: 73,              // ~0.54% annual PMI on 90% LTV
    estimatedTaxes: 150,           // ~$1,800/yr property tax
    estimatedInsurance: 35,        // condo HO-6
    estimatedTotalPayment: 2267,   // P&I + PMI + Tax + Insurance + HOA
};
