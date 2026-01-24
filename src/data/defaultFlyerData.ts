import { FlyerData, brokerageThemes } from "@/types/flyer";

const today = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

export const defaultFlyerData: FlyerData = {
  rates: {
    thirtyYearFixed: "6.125%",
    thirtyYearFixedAPR: "6.325%",
    fifteenYearFixed: "5.790%",
    fifteenYearFixedAPR: "5.99%",
    thirtyYearJumbo: "6.425%",
    thirtyYearJumboAPR: "6.625%",
    fiveOneArm: "5.72%",
    fiveOneArmAPR: "6.85%",
    fha: "5.50%",
    fhaAPR: "6.68%",
    va: "5.50%",
    vaAPR: "5.72%",
    dateGenerated: today,
  },
  marketCopy: {
    headline: "Liquidity & Acquisition",
    subheading: "Private Client Market Update",
    marketInsight: "Current market conditions offer opportunities for buyers. Contact us for a personalized quote and rate lock options.",
  },
  regions: [
    {
      name: "Seattle Eastside",
      cities: "Kirkland, Bellevue, Redmond, Sammamish",
      insight: "Kirkland's waterfront appeal and tech proximity drive consistent demand. Strong school districts attract families seeking long-term value.",
    },
    {
      name: "Seattle Metro",
      cities: "Seattle, Shoreline, Bothell, Edmonds",
      insight: "Light rail expansion continues to transform the market. Buyers find excellent transit access with growing urban amenities.",
    },
    {
      name: "Portland Metro",
      cities: "Portland, Vancouver, Lake Oswego",
      insight: "Portland metro continues to see steady demand. Clark County remains active for buyers seeking value near Portland.",
    },
  ],
  cta: {
    buttonText: "Start My Pre-Qualification",
    buttonUrl: "https://1731464.my1003app.com/130371/register",
    showQRCode: true,
  },
  broker: {
    name: "Scott Little",
    title: "Mortgage Broker",
    phone: "(360) 606-1106",
    email: "scott@ialoans.com",
    nmls: "130371",
    headshot: "/scott-little-headshot.png",
    headshotPosition: 10,
  },
  company: {
    name: "IA Mortgage",
    phone1: "(360) 606-1106",
    phone2: "",
    email: "scott@ialoans.com",
    website: "www.iamortgage.org",
    nmls: "1731464",
    logo: "",
  },
  realtor: {
    name: "Celeste Zarling",
    title: "The American Dream TV",
    phone: "(425) 420-4887",
    email: "cmzarling@gmail.com",
    brokerage: "Century 21",
    website: "www.CelesteZarlingRealtor.com",
    logo: "",
    headshot: "/celeste-zarling-headshot.jpg",
    headshotPosition: 40,
  },
  colorTheme: brokerageThemes[0], // Century 21 default
  layout: "luxury",
  rateType: "jumbo",
};

// Pre-defined region templates for different markets
export const regionTemplates = {
  seattleEastside: [
    {
      name: "Kirkland",
      cities: "Downtown Kirkland, Totem Lake, Juanita",
      insight: "Kirkland's waterfront appeal and tech proximity drive consistent demand. Strong school districts attract families seeking long-term value.",
    },
    {
      name: "Bellevue",
      cities: "Downtown Bellevue, Crossroads, Factoria",
      insight: "Bellevue remains the Eastside's premier market with luxury condos and tech-driven buyers. New developments offer modern living options.",
    },
    {
      name: "Redmond",
      cities: "Downtown Redmond, Education Hill, Overlake",
      insight: "Microsoft and gaming industry presence fuels Redmond's market. Growing light rail access makes commuting increasingly convenient.",
    },
  ],
  northSeattle: [
    {
      name: "Shoreline",
      cities: "Aurora, Richmond Beach, Echo Lake",
      insight: "Light rail expansion has transformed Shoreline into a sought-after market. Buyers find value compared to Seattle proper with excellent transit access.",
    },
    {
      name: "Lake Forest Park",
      cities: "Town Center, Sheridan Beach, Brookside",
      insight: "Charming lake community appeal with Burke-Gilman trail access. Family-friendly neighborhoods with strong community involvement.",
    },
    {
      name: "Bothell",
      cities: "Downtown Bothell, Canyon Park, North Creek",
      insight: "UW Bothell and biotech presence drive demand. New mixed-use developments create vibrant urban living opportunities.",
    },
  ],
  portlandVancouver: [
    {
      name: "Northeast Portland",
      cities: "Alberta Arts, Concordia, Williams District",
      insight: "High demand for historic homes and walkable urban amenities. Williams/Vancouver corridor remains a top-tier investment zone.",
    },
    {
      name: "North Portland",
      cities: "St. Johns, Kenton, Overlook",
      insight: "Rapid appreciation driven by neighborhood character and proximity to downtown. Overlook offers premium views and park access.",
    },
    {
      name: "Southeast Portland",
      cities: "Hawthorne, Division, Richmond",
      insight: "Iconic Portland lifestyle with strong buyer interest. Division corridor continues to set local benchmarks for modern urban living.",
    },
  ],
  adrianServiceAreas: [
    {
      name: "Portland Metro",
      cities: "Northeast, North, & Southeast Portland",
      insight: "Portland's core neighborhoods maintain strong resilience. Walkable districts with unique business cores continue to drive premium value.",
    },
    {
      name: "Close-in Eastside",
      cities: "Buckman, Kerns, Laurelhurst",
      insight: "Historic charm meets urban convenience. High demand for well-preserved period homes in established neighborhood settings.",
    },
    {
      name: "Clark County",
      cities: "Vancouver, Camas, Ridgefield",
      insight: "Strong alternative for buyers seeking value near Portland with significant growth in new developments and lifestyle amenities.",
    },
  ],
} as const;

// Template storage key
export const TEMPLATE_STORAGE_KEY = "flyer-templates";

export interface SavedTemplate {
  id: string;
  name: string;
  data: FlyerData;
  createdAt: string;
}
