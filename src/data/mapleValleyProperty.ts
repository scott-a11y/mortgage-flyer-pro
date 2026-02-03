// Property listing data for 24419 214th Ave SE, Maple Valley, WA
import { PropertyListing } from "@/types/property";
import { FlyerData, ColorTheme, brokerageThemes } from "@/types/flyer";

// CENTURY 21 Brand Theme - Official Colors
// https://brandfolder.com/century21
export const mapleValleyTheme: ColorTheme = {
    id: "century21",
    name: "CENTURY 21",
    primary: "#252526",   // Obsessed Grey (Dark)
    secondary: "#F2A900", // CENTURY 21 Gold
    accent: "#ffffff"
};

// Property listing data
export const mapleValleyProperty: PropertyListing = {
    specs: {
        address: "24419 214th Ave SE",
        city: "Maple Valley",
        state: "WA",
        zip: "98038",
        listPrice: 1099000,
        mlsNumber: "2465863",
        bedrooms: 4,
        bathrooms: 2.5,
        squareFootage: 2760,
        lotSize: "0.5 Acres",
        yearBuilt: 1997,
        garage: "3-Car Attached",
        hoa: 13,
        propertyType: "Single Family"
    },
    features: {
        headline: "Private Forest Retreat in Wilderness Downs Estate",
        subheadline: "Thoughtfully Renovated 4-Bed Home on Nearly Half an Acre | Tahoma School District",
        bulletPoints: [
            "Backs to open forest space for ultimate privacy",
            "Quiet cul-de-sac location in sought-after Wilderness Downs",
            "Tahoma School District",
            "Renovated kitchen with stainless appliances, oversized island, walk-in pantry & garden window",
            "Primary suite with dual walk-in closets & luxurious 5-piece bath",
            "Spacious family room with custom built-ins & gas fireplace",
            "Main-level den/office",
            "Newly refinished hardwood floors & fresh interior paint",
            "A/C and wired security system (ADT-ready)",
            "Gated RV/boat parking with oversized driveway",
            "Fully fenced with sprinkler system & established garden beds",
            "Minutes to Lake Wilderness Park, trails, library & shopping",
            "Pre-inspected for buyer peace of mind"
        ]
    },
    openHouse: {
        date: "Saturday, January 31, 2026",
        startTime: "2:00 PM",
        endTime: "4:00 PM"
    },
    images: {
        hero: "/maple-valley-hero.jpg",
        secondary: [
            "/maple-valley-kitchen.png",
            "/maple-valley-bathroom.png",
            "/maple-valley-backyard.png"
        ]
    },
    financing: {
        listPrice: 1099000,
        downPaymentPercent: 10,
        interestRate: 6.5,
        loanTermYears: 30,
        hoa: 13
    }
};

// Celeste Zarling's Flyer Data
export const celesteZarlingFlyerData: FlyerData = {
    rates: {
        thirtyYearFixed: "6.625%",
        thirtyYearFixedAPR: "6.731%",
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
        dateGenerated: "January 30, 2026"
    },
    marketCopy: {
        headline: "Private Forest Retreat",
        subheading: "Wilderness Downs Estate • Tahoma Schools",
        marketInsight: "This thoughtfully renovated home offers the perfect blend of privacy, space, and modern updates. Situated on nearly half an acre backing to forest, with top-rated schools and easy access to Lake Wilderness amenities."
    },
    regions: [
        {
            name: "Maple Valley",
            cities: "Wilderness Downs, Summit",
            insight: "Strong buyer demand with limited inventory in established neighborhoods."
        },
        {
            name: "Tahoma Schools",
            cities: "Coveted School District",
            insight: "Top-rated schools driving premium values for family homes."
        },
        {
            name: "Lake Wilderness",
            cities: "Parks, Trails, Recreation",
            insight: "Outdoor lifestyle amenities add value to nearby properties."
        }
    ],
    cta: {
        buttonText: "Get Pre-Approved",
        buttonUrl: "https://www.redfin.com/WA/Maple-Valley/24419-214th-Ave-SE-98038/home/477282",
        showQRCode: true,
        qrLabel: "View Listing"
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
        email: "info@ialoans.com",
        website: "ialoans.com",
        nmls: "1858045",
        logo: ""
    },
    realtor: {
        name: "Celeste Zarling",
        title: "Real Estate Professional",
        phone: "(425) 420-4887",
        email: "CZtransactions@c21nwr.com",
        brokerage: "CENTURY 21 North Homes Realty",
        website: "www.century21northhomes.com",
        headshot: "/celeste-zarling-headshot.jpg",
        headshotPosition: 50,
        logo: ""
    },
    colorTheme: mapleValleyTheme,
    layout: "luxury",
    rateType: "conventional"
};

// Transaction contact info (for reference)
export const transactionContact = {
    name: "Irene Malabanan-Escutin",
    role: "Transaction Coordinator",
    email: "CZtransactions@c21nwr.com",
    phone: "425-474-2895"
};
