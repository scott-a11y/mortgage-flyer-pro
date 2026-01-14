// Flyer type definitions
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

// Layout template types
export type LayoutTemplate = "modern" | "traditional" | "luxury";

export interface LayoutConfig {
  id: LayoutTemplate;
  name: string;
  description: string;
  preview: string;
}

export const layoutTemplates: LayoutConfig[] = [
  { 
    id: "modern", 
    name: "Modern", 
    description: "Clean lines, bold typography, minimal design",
    preview: "🎨"
  },
  { 
    id: "traditional", 
    name: "Traditional", 
    description: "Classic layout, professional appearance",
    preview: "📋"
  },
  { 
    id: "luxury", 
    name: "Luxury", 
    description: "Premium feel, elegant styling, gold accents",
    preview: "✨"
  },
];

export interface FlyerData {
  rates: RateInfo;
  marketCopy: MarketCopy;
  regions: [RegionInfo, RegionInfo, RegionInfo];
  cta: CTAInfo;
  broker: BrokerContact;
  company: CompanyContact;
  realtor: RealtorContact;
  colorTheme?: ColorTheme;
  layout?: LayoutTemplate;
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

export type ExportFormat = "letter" | "letter-hires" | "instagram" | "facebook" | "linkedin" | "email-sig" | "postcard";

export interface ExportConfig {
  format: ExportFormat;
  width: number;
  height: number;
  label: string;
  scale: number;
  category: "print" | "social" | "other";
}

export const exportFormats: ExportConfig[] = [
  { format: "letter", width: 612, height: 792, label: "Letter PDF (8.5×11)", scale: 2, category: "print" },
  { format: "letter-hires", width: 2550, height: 3300, label: "Print-Ready (300 DPI)", scale: 4, category: "print" },
  { format: "postcard", width: 1800, height: 1200, label: "Postcard (6×4)", scale: 3, category: "print" },
  { format: "instagram", width: 1080, height: 1920, label: "Instagram Story", scale: 3, category: "social" },
  { format: "facebook", width: 1200, height: 630, label: "Facebook Post", scale: 3, category: "social" },
  { format: "linkedin", width: 1200, height: 627, label: "LinkedIn Post", scale: 3, category: "social" },
  { format: "email-sig", width: 600, height: 200, label: "Email Signature", scale: 2, category: "other" },
];
