import { FlyerData } from "@/types/flyer";

const today = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

export const defaultFlyerData: FlyerData = {
  rates: {
    thirtyYearFixed: "6.25%",
    fifteenYearFixed: "5.79%",
    thirtyYearJumbo: "6.40%",
    fiveOneArm: "5.72%",
    dateGenerated: today,
  },
  marketCopy: {
    headline: "Sub-6% Mortgage Rates Are Here!",
    subheading: "Take advantage of competitive rates in Oregon, Washington & Idaho",
    marketInsight: "Current market conditions favor buyers with historically competitive rates. Lock in your rate today before the next Fed meeting.",
  },
  regions: [
    {
      name: "Oregon",
      cities: "Portland, Salem, Central Oregon",
      insight: "Portland metro continues to see steady demand. First-time buyers are finding opportunities in Salem and Central Oregon with lower entry points.",
    },
    {
      name: "Washington",
      cities: "Vancouver, Seattle Metro, Tri-Cities",
      insight: "Clark County remains hot for buyers seeking value near Portland. Seattle suburbs offer growing inventory with competitive pricing.",
    },
    {
      name: "Idaho",
      cities: "Boise, Coeur d'Alene, Twin Falls",
      insight: "Idaho continues to attract relocating buyers. Boise market stabilizing with increased inventory and motivated sellers.",
    },
  ],
  cta: {
    buttonText: "Start My Pre-Qualification",
    buttonUrl: "https://www.iamortgage.org/apply",
  },
  broker: {
    name: "Scott Little",
    title: "Mortgage Broker",
    phone: "(360) 606-1106",
    email: "scott@ialoans.com",
    nmls: "130371",
    headshot: "",
  },
  company: {
    name: "Imagination Age Mortgage",
    phone1: "(360) 606-1106",
    phone2: "(503) 573-0960",
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
    headshot: "",
    logo: "",
  },
};

// Pre-defined region templates for different markets
export const regionTemplates = {
  pnwCorridor: [
    {
      name: "Oregon",
      cities: "Portland, Salem, Central Oregon",
      insight: "Portland metro continues to see steady demand. First-time buyers are finding opportunities in Salem and Central Oregon with lower entry points.",
    },
    {
      name: "Washington",
      cities: "Vancouver, Seattle Metro, Tri-Cities",
      insight: "Clark County remains hot for buyers seeking value near Portland. Seattle suburbs offer growing inventory with competitive pricing.",
    },
    {
      name: "Idaho",
      cities: "Boise, Coeur d'Alene, Twin Falls",
      insight: "Idaho continues to attract relocating buyers. Boise market stabilizing with increased inventory and motivated sellers.",
    },
  ],
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
      insight: "Light rail expansion has transformed Shoreline into a hot market. Buyers find value compared to Seattle proper with excellent transit access.",
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
} as const;
