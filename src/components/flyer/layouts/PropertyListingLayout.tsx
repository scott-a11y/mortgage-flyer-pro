import { FlyerData, ColorTheme } from "@/types/flyer";
import { PropertyListing, formatCurrency, calculateTotalMonthlyPayment } from "@/types/property";
import { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FlyerProfileImage } from "../shared/FlyerProfileImage";
import { FlyerLegal } from "../shared/FlyerLegal";
import {
    Bed,
    Bath,
    Maximize,
    Trees,
    Calendar,
    Car,
    Home,
    MapPin,
    Phone,
    Mail,
    Clock,
    CheckCircle,
    Shield,
    Star
} from "lucide-react";

interface PropertyLayoutProps {
    data: FlyerData;
    property: PropertyListing;
    colorTheme?: ColorTheme;
}

export const PropertyListingLayout = forwardRef<HTMLDivElement, PropertyLayoutProps>(
    ({ data, property, colorTheme }, ref) => {
        // Use provided color theme or fall back to Navy Blue / Gold
        const theme = colorTheme || data.colorTheme || {
            id: "navy-gold",
            name: "Navy Gold",
            primary: "#1e3a5f",
            secondary: "#d4af37",
            accent: "#ffffff"
        };

        const primaryColor = theme.primary;
        const accentColor = theme.secondary;

        // Calculate estimated payment
        const financing = property.financing || {
            listPrice: property.specs.listPrice,
            downPaymentPercent: 20,
            interestRate: 6.5,
            loanTermYears: 30,
            hoa: property.specs.hoa || 0
        };

        const paymentBreakdown = calculateTotalMonthlyPayment(financing);

        // Feature icons for visual interest
        const getFeatureIcon = (feature: string, index: number) => {
            const icons = [CheckCircle, Star, Shield, CheckCircle, Star, Shield, CheckCircle, Star, Shield, CheckCircle, Star, Shield, CheckCircle];
            const Icon = icons[index % icons.length];
            return <Icon className="w-2.5 h-2.5 flex-shrink-0" style={{ color: accentColor }} />;
        };

        return (
            <div
                ref={ref}
                data-capture="flyer"
                className="bg-white w-[612px] h-[792px] shadow-2xl flex flex-col relative overflow-hidden"
                style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
            >
                {/* ═══════════════════════════════════════════════════════════════════
            HERO SECTION - Full Bleed Image with Gradient Overlay
            ═══════════════════════════════════════════════════════════════════ */}
                <div className="relative h-[220px] overflow-hidden">
                    {/* Hero Image */}
                    {property.images.hero ? (
                        <img
                            src={property.images.hero}
                            alt="Property Exterior"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div
                            className="w-full h-full"
                            style={{
                                background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 50%, ${accentColor}40 100%)`
                            }}
                        />
                    )}

                    {/* Gradient Overlays for text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

                    {/* Top Bar - Badges */}
                    <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
                        {/* Open House Badge */}
                        {property.openHouse && (
                            <div
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm"
                                style={{ backgroundColor: `${accentColor}ee` }}
                            >
                                <Clock className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                                <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: primaryColor }}>
                                    Open House Today
                                </span>
                            </div>
                        )}

                        {/* Price Tag */}
                        <div
                            className="px-4 py-2 rounded-lg shadow-xl backdrop-blur-sm ml-auto"
                            style={{ backgroundColor: "rgba(255,255,255,0.95)" }}
                        >
                            <div className="text-[9px] uppercase tracking-wider font-medium" style={{ color: primaryColor }}>
                                Listed at
                            </div>
                            <span className="text-2xl font-black tracking-tight" style={{ color: primaryColor }}>
                                {formatCurrency(property.specs.listPrice)}
                            </span>
                        </div>
                    </div>

                    {/* Headline Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h1 className="text-[22px] font-black text-white leading-tight mb-1 drop-shadow-lg">
                            {property.features.headline}
                        </h1>
                        <p className="text-[11px] text-white/90 font-medium drop-shadow mb-2">
                            {property.features.subheadline}
                        </p>
                        <div className="flex items-center gap-1.5 text-white/80">
                            <MapPin className="w-3 h-3" />
                            <span className="text-[10px] font-medium">
                                {property.specs.address} • {property.specs.city}, {property.specs.state} {property.specs.zip}
                            </span>
                            <span className="text-white/50 mx-1">|</span>
                            <span className="text-[10px] text-white/60">MLS# {property.specs.mlsNumber}</span>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════════════
            PROPERTY SPECS BAR - Key Stats at a Glance
            ═══════════════════════════════════════════════════════════════════ */}
                <div
                    className="flex items-center justify-center gap-6 px-5 py-2.5"
                    style={{ backgroundColor: primaryColor }}
                >
                    {[
                        { icon: Bed, value: property.specs.bedrooms, label: "Beds" },
                        { icon: Bath, value: property.specs.bathrooms, label: "Baths" },
                        { icon: Maximize, value: property.specs.squareFootage.toLocaleString(), label: "Sq Ft" },
                        { icon: Trees, value: property.specs.lotSize, label: "" },
                        { icon: Car, value: property.specs.garage.replace(" Attached", ""), label: "" },
                        { icon: Calendar, value: property.specs.yearBuilt, label: "Built" },
                    ].map((stat, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-white">
                            <stat.icon className="w-3.5 h-3.5 opacity-70" />
                            <span className="text-[11px] font-bold">{stat.value}</span>
                            {stat.label && <span className="text-[9px] opacity-60">{stat.label}</span>}
                        </div>
                    ))}
                </div>

                {/* ═══════════════════════════════════════════════════════════════════
            MAIN CONTENT - Two Column Layout
            ═══════════════════════════════════════════════════════════════════ */}
                <div className="flex flex-1 bg-gray-50">
                    {/* LEFT COLUMN - Features & Images */}
                    <div className="flex-1 p-4 overflow-hidden flex flex-col">
                        {/* Feature Highlights */}
                        <div className="mb-3">
                            <h2
                                className="text-[10px] font-black uppercase tracking-[0.15em] mb-2 flex items-center gap-2"
                                style={{ color: primaryColor }}
                            >
                                <div className="w-8 h-px" style={{ backgroundColor: accentColor }} />
                                Property Highlights
                            </h2>

                            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                                {property.features.bulletPoints.slice(0, 10).map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-1.5">
                                        {getFeatureIcon(feature, idx)}
                                        <span className="text-[8.5px] text-gray-700 leading-tight">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Secondary Images Gallery */}
                        {property.images.secondary.length > 0 && (
                            <div className="mt-auto">
                                <h3
                                    className="text-[9px] font-bold uppercase tracking-wider mb-2 flex items-center gap-2"
                                    style={{ color: primaryColor }}
                                >
                                    <div className="w-6 h-px" style={{ backgroundColor: accentColor }} />
                                    Interior Features
                                </h3>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {property.images.secondary.slice(0, 3).map((img, idx) => (
                                        <div key={idx} className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md">
                                            <img
                                                src={img}
                                                alt={`Interior ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                            <div className="absolute bottom-1 left-1.5 text-[7px] font-medium text-white drop-shadow">
                                                {idx === 0 ? "Kitchen" : idx === 1 ? "Primary Bath" : "Forest View"}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN - Financing & Open House */}
                    <div
                        className="w-[185px] p-4 flex flex-col"
                        style={{ backgroundColor: primaryColor }}
                    >
                        {/* Financing Section */}
                        <div className="mb-4">
                            <div className="flex items-center gap-1.5 mb-2">
                                <Home className="w-3.5 h-3.5" style={{ color: accentColor }} />
                                <span className="text-[9px] font-bold uppercase tracking-wider text-white">
                                    Financing Options
                                </span>
                            </div>

                            {/* Main Payment Display */}
                            <div className="text-center py-3 px-2 bg-white/10 rounded-xl mb-2 backdrop-blur-sm">
                                <div className="text-[8px] text-white/60 uppercase tracking-wider mb-0.5">
                                    Est. Monthly Payment*
                                </div>
                                <div className="text-[28px] font-black text-white leading-none">
                                    {formatCurrency(paymentBreakdown.total)}
                                </div>
                                <div className="text-[7px] text-white/50 mt-1">
                                    {financing.downPaymentPercent}% down • {financing.interestRate}% / {(financing.interestRate + 0.25).toFixed(3)}% APR
                                </div>
                                <div className="text-[6px] text-white/40 mt-0.5">
                                    30-Year Fixed Rate
                                </div>
                            </div>

                            {/* Payment Breakdown */}
                            <div className="space-y-1 text-[8px] mb-3">
                                <div className="flex justify-between text-white/60">
                                    <span>Principal & Interest</span>
                                    <span className="text-white font-medium">{formatCurrency(paymentBreakdown.principalInterest)}</span>
                                </div>
                                <div className="flex justify-between text-white/60">
                                    <span>Est. Property Tax</span>
                                    <span className="text-white font-medium">{formatCurrency(paymentBreakdown.propertyTax)}</span>
                                </div>
                                <div className="flex justify-between text-white/60">
                                    <span>Est. Insurance</span>
                                    <span className="text-white font-medium">{formatCurrency(paymentBreakdown.insurance)}</span>
                                </div>
                                {paymentBreakdown.hoa > 0 && (
                                    <div className="flex justify-between text-white/60">
                                        <span>HOA Dues</span>
                                        <span className="text-white font-medium">{formatCurrency(paymentBreakdown.hoa)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Open House Card */}
                        {property.openHouse && (
                            <div
                                className="p-3 rounded-xl mb-3"
                                style={{ backgroundColor: `${accentColor}20`, border: `1px solid ${accentColor}40` }}
                            >
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Clock className="w-3 h-3" style={{ color: accentColor }} />
                                    <span className="text-[9px] font-bold text-white uppercase tracking-wide">
                                        Open House
                                    </span>
                                </div>
                                <div className="text-[10px] font-bold text-white">
                                    {property.openHouse.date}
                                </div>
                                <div className="text-[9px] text-white/70">
                                    {property.openHouse.startTime} – {property.openHouse.endTime}
                                </div>
                            </div>
                        )}

                        {/* QR Code & CTA */}
                        <div className="mt-auto text-center">
                            <div className="text-[8px] text-white/70 mb-2">
                                Scan for Pre-Approval
                            </div>
                            {data.cta.buttonUrl && (
                                <div className="inline-block p-2 bg-white rounded-xl shadow-lg">
                                    <QRCodeSVG
                                        value={data.cta.buttonUrl}
                                        size={56}
                                        level="H"
                                        fgColor={primaryColor}
                                    />
                                </div>
                            )}
                            <div className="text-[7px] text-white/50 mt-1.5 uppercase tracking-widest">
                                {data.cta.qrLabel || "Get Rates Today"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════════════
            FOOTER - Dual Contact Cards
            ═══════════════════════════════════════════════════════════════════ */}
                <div
                    className="px-4 py-3"
                    style={{ backgroundColor: primaryColor }}
                >
                    <div className="flex gap-3">
                        {/* Listing Agent Card */}
                        <div className="flex-1 flex items-center gap-2.5 p-2 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                            <FlyerProfileImage
                                src={data.realtor.headshot}
                                alt={data.realtor.name}
                                position={data.realtor.headshotPosition}
                                className="w-12 h-12 rounded-full border-2 shadow-lg"
                                style={{ borderColor: accentColor }}
                            />
                            <div className="min-w-0 flex-1">
                                <div className="text-[7px] uppercase tracking-wider font-medium" style={{ color: accentColor }}>
                                    Your Listing Agent
                                </div>
                                <div className="text-white font-bold text-[11px] leading-tight">{data.realtor.name}</div>
                                <div className="text-[8px] text-white/60 leading-tight">{data.realtor.brokerage}</div>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-0.5">
                                        <Phone className="w-2 h-2" style={{ color: accentColor }} />
                                        <span className="text-white text-[8px]">{data.realtor.phone}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-0.5">
                                    <Mail className="w-2 h-2" style={{ color: accentColor }} />
                                    <span className="text-white text-[7px]">{data.realtor.email}</span>
                                </div>
                            </div>
                        </div>

                        {/* Lender Card */}
                        <div className="flex-1 flex items-center gap-2.5 p-2 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                            <FlyerProfileImage
                                src={data.broker.headshot}
                                alt={data.broker.name}
                                position={data.broker.headshotPosition}
                                className="w-12 h-12 rounded-full border-2 shadow-lg"
                                style={{ borderColor: accentColor }}
                            />
                            <div className="min-w-0 flex-1">
                                <div className="text-[7px] uppercase tracking-wider font-medium" style={{ color: accentColor }}>
                                    Preferred Lender
                                </div>
                                <div className="text-white font-bold text-[11px] leading-tight">{data.broker.name}</div>
                                <div className="text-[8px] text-white/60 leading-tight">{data.company.name}</div>
                                <div className="text-[7px] font-medium mt-0.5" style={{ color: accentColor }}>
                                    NMLS# {data.broker.nmls}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-0.5">
                                        <Phone className="w-2 h-2" style={{ color: accentColor }} />
                                        <span className="text-white text-[8px]">{data.broker.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-0.5">
                                        <Mail className="w-2 h-2" style={{ color: accentColor }} />
                                        <span className="text-white text-[7px]">{data.broker.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legal Footer with Licensing */}
                <div className="px-4 py-2 bg-gray-100 border-t border-gray-200">
                    <div className="text-center text-gray-500 text-[6px] leading-relaxed">
                        <div className="font-medium mb-0.5">
                            {data.company.name} | NMLS# {data.company.nmls} | {data.broker.name}, NMLS# {data.broker.nmls}
                        </div>
                        <div>
                            *Payment estimate includes principal, interest, taxes, and insurance. Actual payment may vary based on credit, property type, and loan terms.
                            Rate shown is for illustrative purposes only. APR reflects cost of credit including fees. Equal Housing Lender.
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

PropertyListingLayout.displayName = "PropertyListingLayout";
