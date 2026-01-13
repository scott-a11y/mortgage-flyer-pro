export interface RateInfo {
  thirtyYearFixed: string;
  thirtyYearFixedAPR: string;
  fifteenYearFixed: string;
  fifteenYearFixedAPR: string;
  thirtyYearJumbo: string;
  thirtyYearJumboAPR: string;
  fiveOneArm: string;
  fiveOneArmAPR: string;
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
  showQRCode: boolean;
}

export interface BrokerContact {
  name: string;
  title: string;
  phone: string;
  email: string;
  nmls: string;
  headshot?: string;
}

export interface CompanyContact {
  name: string;
  phone1: string;
  phone2: string;
  email: string;
  website: string;
  nmls: string;
  logo?: string;
}

export interface RealtorContact {
  name: string;
  title: string;
  phone: string;
  email: string;
  brokerage: string;
  website: string;
  headshot?: string;
  logo?: string;
}

export interface ColorTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
}

export interface FlyerData {
  rates: RateInfo;
  marketCopy: MarketCopy;
  regions: [RegionInfo, RegionInfo, RegionInfo];
  cta: CTAInfo;
  broker: BrokerContact;
  company: CompanyContact;
  realtor: RealtorContact;
  colorTheme?: ColorTheme;
}

// Predefined brokerage color themes
export const brokerageThemes: ColorTheme[] = [
  { id: "century21", name: "Century 21", primary: "#B5A26E", secondary: "#1C1C1C", accent: "#D4AF37" },
  { id: "remax", name: "RE/MAX", primary: "#DC1C2E", secondary: "#003DA5", accent: "#FFFFFF" },
  { id: "coldwell", name: "Coldwell Banker", primary: "#012169", secondary: "#C8102E", accent: "#FFFFFF" },
  { id: "keller", name: "Keller Williams", primary: "#B40101", secondary: "#1C1C1C", accent: "#FFFFFF" },
  { id: "berkshire", name: "Berkshire Hathaway", primary: "#652D6A", secondary: "#9E8B6E", accent: "#FFFFFF" },
  { id: "compass", name: "Compass", primary: "#000000", secondary: "#E4002B", accent: "#FFFFFF" },
  { id: "exp", name: "eXp Realty", primary: "#003366", secondary: "#56A0D3", accent: "#FFFFFF" },
  { id: "sothebys", name: "Sotheby's", primary: "#0B2341", secondary: "#D4AF37", accent: "#FFFFFF" },
];

export type ExportFormat = "letter" | "instagram" | "facebook" | "email-sig";

export interface ExportConfig {
  format: ExportFormat;
  width: number;
  height: number;
  label: string;
}

export const exportFormats: ExportConfig[] = [
  { format: "letter", width: 612, height: 792, label: "Letter (8.5×11)" },
  { format: "instagram", width: 1080, height: 1920, label: "Instagram Story" },
  { format: "facebook", width: 1200, height: 630, label: "Facebook Post" },
  { format: "email-sig", width: 600, height: 200, label: "Email Signature" },
];
