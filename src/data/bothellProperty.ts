// Property listing data for 16454 108th Ave NE, Bothell, WA
import { PropertyListing } from "@/types/property";
import { FlyerData, ColorTheme } from "@/types/flyer";

// SOTHEBY'S Brand Theme - Luxury Aesthetic
export const bothellTheme: ColorTheme = {
    id: "sothebys",
    name: "Sotheby's International Realty",
    primary: "#0B2341", // Deep Navy
    secondary: "#D4AF37", // Windsor Gold
    accent: "#ffffff"
};

// Property listing data
export const bothellProperty: PropertyListing = {
    specs: {
        address: "16454 108th Ave NE",
        city: "Bothell",
        state: "WA",
        zip: "98011",
        listPrice: 2300000,
        mlsNumber: "2465864", // Placeholder MLS
        bedrooms: 4,
        bathrooms: 4.5,
        squareFootage: 5249,
        lotSize: "0.68 Acres",
        yearBuilt: 2002,
        garage: "3-Car Attached",
        hoa: 0,
        propertyType: "Single Family"
    },
    features: {
        headline: "Custom Craftsman Dream Home on Elevated Estate",
        subheadline: "5,200+ SF of Luxury Living | Gourmet Kitchen | Resort-Style Backyard",
        bulletPoints: [
            "Stunning custom craftsman architecture on private 0.68-acre lot",
            "Gourmet chef's kitchen with Miele stainless steel appliances",
            "Premium granite countertops and oversized entertainment island",
            "Expansive primary suite with spa-inspired 5-piece bath",
            "Resort backyard featuring a cascading waterfall feature",
            "Built-in outdoor BBQ and kitchen for ultimate entertaining",
            "Large deck and patio spaces overlooking manicured grounds",
            "Private basketball court tucked into lush landscaping",
            "Soaring ceilings and abundant natural light throughout",
            "Dedicated home office and flexible living spaces",
            "Hardwood floors, custom millwork and designer finishes",
            "3-car attached garage with ample storage and parking",
            "Prime Bothell location with easy access to tech hubs"
        ]
    },
    openHouse: {
        date: "Saturday, February 14, 2026",
        startTime: "1:00 PM",
        endTime: "4:00 PM"
    },
    images: {
        hero: "/bothell-hero.png",
        secondary: [
            "/bothell-kitchen.png",
            "/bothell-bath.png",
            "/bothell-backyard.png"
        ]
    },
    financing: {
        listPrice: 2300000,
        downPaymentPercent: 20,
        interestRate: 6.75, // Jumbo rates typically slightly higher
        loanTermYears: 30,
        hoa: 0
    }
};

// Celeste Zarling's Flyer Data for Bothell Property
export const bothellFlyerData: FlyerData = {
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
        dateGenerated: "February 10, 2026"
    },
    marketCopy: {
        headline: "Bothell Luxury Living",
        subheading: "Custom Craftsman Estate • 0.68 Acres",
        marketInsight: "This rare elevated estate offers unmatched privacy and luxury. With a gourmet kitchen and resort-style grounds, it provides the perfect sanctuary while remaining close to the region's top tech employers."
    },
    regions: [
        {
            name: "Bothell",
            cities: "Northshore District",
            insight: "Highly sought-after community with strong appreciation and top schools."
        },
        {
            name: "Estate Living",
            cities: "Large Lot Privacy",
            insight: "Premium demand for homes on substantial acreage in the Eastside area."
        },
        {
            name: "High-End Features",
            cities: "Luxury Amenities",
            insight: "Custom builds with premium outdoor spaces command top market value."
        }
    ],
    cta: {
        buttonText: "Schedule a Private Tour",
        buttonUrl: "https://www.redfin.com/WA/Bothell/16454-108th-Ave-NE-98011/home/454917",
        showQRCode: true,
        qrLabel: "View Details"
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
    colorTheme: bothellTheme,
    layout: "luxury",
    rateType: "jumbo"
};
