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
  },
  company: {
    phone1: "(360) 606-1106",
    phone2: "(503) 573-0960",
    email: "scott@ialoans.com",
    website: "www.iamortgage.org",
    nmls: "1731464",
  },
  realtor: {
    name: "Celeste Zarling",
    phone: "",
    email: "celeste@c21nwr.com",
    brokerage: "Century 21 Northwest Realtors",
    website: "",
  },
};
