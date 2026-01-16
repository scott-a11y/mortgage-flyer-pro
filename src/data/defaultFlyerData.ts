import { FlyerData, brokerageThemes } from "@/types/flyer";
import celesteHeadshot from "@/assets/celeste-zarling-headshot.jpg";
import scottHeadshot from "@/assets/scott-little-headshot.jpg";

const today = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

export const defaultFlyerData: FlyerData = {
  rates: {
    thirtyYearFixed: "6.25%",
    thirtyYearFixedAPR: "6.45%",
    fifteenYearFixed: "5.79%",
    fifteenYearFixedAPR: "5.99%",
    thirtyYearJumbo: "6.40%",
    thirtyYearJumboAPR: "6.55%",
    fiveOneArm: "5.72%",
    fiveOneArmAPR: "6.85%",
    dateGenerated: today,
  },
  marketCopy: {
    headline: "Competitive Mortgage Rates Available!",
    subheading: "Take advantage of today's rates in the Greater Seattle & Portland Areas",
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
    buttonUrl: "https://www.iamortgage.org/apply",
    showQRCode: true,
  },
  broker: {
    name: "Scott Little",
    title: "Mortgage Broker",
    phone: "(360) 606-1106",
    email: "scott@ialoans.com",
    nmls: "130371",
    headshot: "https://www.nwhomeloanrates.com/wp-content/uploads/Revised-signature_02-214x300.gif",
    headshotPosition: 45, // Show face at top of image
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
    title: "Real Estate Professional",
    phone: "(425) 420-4887",
    email: "cmzarling@gmail.com",
    brokerage: "Century 21 North Homes - Kirkland",
    website: "www.century21northhomes.com",
    headshot: celesteHeadshot,
    headshotPosition: 45, // Default to show upper portion of face
    logo: "",
  },
  colorTheme: brokerageThemes[0], // Century 21 default
  layout: "modern",
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
      name: "Portland",
      cities: "Downtown, Pearl District, Alberta Arts",
      insight: "Portland metro continues to see steady demand with diverse neighborhoods offering unique character and walkability.",
    },
    {
      name: "Vancouver",
      cities: "Downtown, Salmon Creek, Camas",
      insight: "Clark County remains active for buyers seeking value near Portland with no state income tax advantage.",
    },
    {
      name: "Lake Oswego",
      cities: "Downtown, First Addition, Lake Grove",
      insight: "Premium Lake Oswego market attracts buyers seeking excellent schools and waterfront living.",
    },
  ],
  celesteServiceAreas: [
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
      name: "Eastside Communities",
      cities: "Issaquah, Woodinville, Mercer Island",
      insight: "Sought-after communities with excellent schools, outdoor recreation, and growing tech employment centers.",
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
