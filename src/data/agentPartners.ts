import { RealtorContact, ColorTheme, brokerageThemes } from "@/types/flyer";

export interface AgentPartnerProfile {
    id: string;
    name: string;
    realtor: RealtorContact;
    colorTheme: ColorTheme;
}

export const agentPartners: AgentPartnerProfile[] = [
    {
        id: "celeste-zarling",
        name: "Celeste Zarling",
        realtor: {
            name: "Celeste Zarling",
            title: "Real Estate Professional",
            phone: "(425) 420-4887",
            email: "cmzarling@gmail.com",
            brokerage: "Century 21 North Homes - Kirkland",
            website: "www.century21northhomes.com",
            logo: "",
            headshot: "/celeste-zarling-headshot.jpg",
            headshotPosition: 40,
        },
        colorTheme: brokerageThemes[0], // Century 21
    },
    {
        id: "adrian-mitchell",
        name: "Adrian Mitchell",
        realtor: {
            name: "Adrian Mitchell",
            title: "REALTOR® | License #201247874",
            phone: "(971) 459-8202",
            email: "adrian@pdxworksrealestate.com",
            brokerage: "Portland Works Real Estate",
            website: "pdxworksrealestate.com",
            logo: "",
            headshot: "/adrian-mitchell-headshot.jpg",
            headshotPosition: 15,
        },
        colorTheme: { id: "pdxworks", name: "Portland Works", primary: "#000000", secondary: "#FFFFFF", accent: "#D4AF37" },
    },
    {
        id: "marcus-chen",
        name: "Marcus Chen",
        realtor: {
            name: "Marcus Chen",
            title: "Senior Real Estate Advisor",
            phone: "(503) 555-0123",
            email: "marcus@remaxgold.com",
            brokerage: "RE/MAX Gold",
            website: "marcuschenrealty.com",
            logo: "",
            headshot: "/marcus-chen-headshot.jpg",
            headshotPosition: 10,
        },
        colorTheme: brokerageThemes[1], // RE/MAX
    },
    {
        id: "sarah-jenkins",
        name: "Sarah Jenkins",
        realtor: {
            name: "Sarah Jenkins",
            title: "Principal Broker",
            phone: "(503) 555-0456",
            email: "sarah@jenkinsgroup.com",
            brokerage: "Keller Williams Realty",
            website: "jenkinsgroup.com",
            logo: "",
            headshot: "/sarah-jenkins-headshot.jpg",
            headshotPosition: 20,
        },
        colorTheme: brokerageThemes[3], // Keller Williams
    },
    {
        id: "elena-rodriguez",
        name: "Elena Rodriguez",
        realtor: {
            name: "Elena Rodriguez",
            title: "Luxury Property Specialist",
            phone: "(503) 555-0789",
            email: "elena@compass.com",
            brokerage: "Compass",
            website: "elenasellsportland.com",
            logo: "",
            headshot: "/elena-rodriguez-headshot.jpg",
            headshotPosition: 30,
        },
        colorTheme: brokerageThemes[5], // Compass
    },
    {
        id: "david-park",
        name: "David Park",
        realtor: {
            name: "David Park",
            title: "Global Real Estate Advisor",
            phone: "(503) 555-0999",
            email: "david@sothebysrealty.com",
            brokerage: "Sotheby's International Realty",
            website: "davidparkrealty.com",
            logo: "",
            headshot: "/david-park-headshot.jpg",
            headshotPosition: 5,
        },
        colorTheme: brokerageThemes[7], // Sotheby's
    },
    {
        id: "danne-wilson",
        name: "Danné Wilson",
        realtor: {
            name: "Danné Wilson",
            title: "Real Estate Broker",
            phone: "(971) 517-2953",
            email: "dlwilson@gtrealty.com",
            brokerage: "Georgetown Realty, Inc.",
            website: "gtrealty.com",
            logo: "",
            headshot: "/danne-wilson-headshot.jpg",
            headshotPosition: 25,
        },
        colorTheme: { id: "georgetown", name: "Georgetown Realty", primary: "#2C5F2D", secondary: "#FFFFFF", accent: "#97BC62" },
    },
];
