export interface RateInfo {
  thirtyYearFixed: string;
  fifteenYearFixed: string;
  thirtyYearJumbo: string;
  fiveOneArm: string;
  dateGenerated: string;
}

export interface MarketCopy {
  headline: string;
  subheading: string;
  marketInsight: string;
}

export interface RegionInfo {
  name: string;
  cities: string;
  insight: string;
}

export interface CTAInfo {
  buttonText: string;
  buttonUrl: string;
}

export interface BrokerContact {
  name: string;
  title: string;
  phone: string;
  email: string;
  nmls: string;
}

export interface CompanyContact {
  phone1: string;
  phone2: string;
  email: string;
  website: string;
  nmls: string;
}

export interface RealtorContact {
  name: string;
  phone: string;
  email: string;
  brokerage: string;
  website: string;
}

export interface FlyerData {
  rates: RateInfo;
  marketCopy: MarketCopy;
  regions: [RegionInfo, RegionInfo, RegionInfo];
  cta: CTAInfo;
  broker: BrokerContact;
  company: CompanyContact;
  realtor: RealtorContact;
}
