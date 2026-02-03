import { FlyerData, ColorTheme } from "@/types/flyer";
import { PropertyListing, formatCurrency, calculateTotalMonthlyPayment } from "@/types/property";
import { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FlyerProfileImage } from "./shared/FlyerProfileImage";
import {
    Bed,
    Bath,
    Maximize,
    Trees,
    MapPin,
    Clock,
    ChevronRight,
    Home
} from "lucide-react";

interface SocialBannerProps {
    data: FlyerData;
    property: PropertyListing;
    colorTheme?: ColorTheme;
}

// ═══════════════════════════════════════════════════════════════════════════
// INSTAGRAM STORY - 1080 x 1920 (9:16 Vertical)
// ═══════════════════════════════════════════════════════════════════════════
export const InstagramStoryBanner = forwardRef<HTMLDivElement, SocialBannerProps>(
    ({ data, property, colorTheme }, ref) => {
        const theme = colorTheme || data.colorTheme || {
            id: "navy-gold",
            name: "Navy Gold",
            primary: "#1e3a5f",
            secondary: "#d4af37",
            accent: "#ffffff"
        };

        const primaryColor = theme.primary;
        const accentColor = theme.secondary;

        const financing = property.financing || {
            listPrice: property.specs.listPrice,
            downPaymentPercent: 20,
            interestRate: 6.5,
            loanTermYears: 30,
            hoa: property.specs.hoa || 0
        };
        const payment = calculateTotalMonthlyPayment(financing);

        return (
            <div
                ref={ref}
                data-capture="banner"
                className="w-[360px] h-[640px] relative overflow-hidden"
                style={{ fontFamily: "'Inter', sans-serif" }}
            >
                {/* Full Background Image */}
                {property.images.hero && (
                    <img
                        src={property.images.hero}
                        alt="Property"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />

                {/* Top Content */}
                <div className="absolute top-6 left-4 right-4">
                    {/* Open House Badge */}
                    {property.openHouse && (
                        <div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 shadow-2xl"
                            style={{ backgroundColor: accentColor }}
                        >
                            <Clock className="w-4 h-4" style={{ color: primaryColor }} />
                            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: primaryColor }}>
                                Open House • {property.openHouse.startTime}
                            </span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="mb-3">
                        <div className="text-white/60 text-xs uppercase tracking-widest mb-1">Just Listed</div>
                        <div className="text-white text-5xl font-black tracking-tight drop-shadow-2xl">
                            {formatCurrency(property.specs.listPrice)}
                        </div>
                    </div>
                </div>

                {/* Center - Property Specs */}
                <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2">
                    <div className="flex justify-center gap-6 py-4 px-6 rounded-2xl backdrop-blur-md" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                        {[
                            { icon: Bed, value: property.specs.bedrooms || 0, label: "Beds" },
                            { icon: Bath, value: property.specs.bathrooms || 0, label: "Baths" },
                            { icon: Maximize, value: (property.specs.squareFootage || 0).toLocaleString(), label: "SF" },
                            { icon: Trees, value: property.specs.lotSize || "", label: "" },
                        ].map((stat, idx) => (
                            <div key={idx} className="text-center text-white">
                                <stat.icon className="w-5 h-5 mx-auto mb-1 opacity-80" />
                                <div className="text-lg font-bold">{stat.value}</div>
                                <div className="text-[10px] opacity-60">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-6 left-4 right-4">
                    {/* Headline */}
                    <h2 className="text-white text-2xl font-black leading-tight mb-2 drop-shadow-lg">
                        {property.features.headline}
                    </h2>

                    {/* Address */}
                    <div className="flex items-center gap-1.5 text-white/80 mb-4">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{property.specs.address}, {property.specs.city}</span>
                    </div>

                    {/* Payment Callout */}
                    <div
                        className="p-4 rounded-xl mb-4"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-white/60 text-[10px] uppercase tracking-wider">Est. Monthly</div>
                                <div className="text-white text-2xl font-bold">{formatCurrency(payment.total)}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-white/60 text-[10px]">{financing.downPaymentPercent}% down</div>
                                <div className="text-white text-sm font-medium">{financing.interestRate}% rate</div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Strip */}
                    <div className="flex items-center gap-3 p-3 rounded-xl backdrop-blur-md" style={{ backgroundColor: "rgba(255,255,255,0.95)" }}>
                        <FlyerProfileImage
                            src={data.realtor.headshot}
                            alt={data.realtor.name}
                            position={data.realtor.headshotPosition}
                            className="w-12 h-12 rounded-full border-2"
                            style={{ borderColor: accentColor }}
                        />
                        <div className="flex-1">
                            <div className="font-bold text-sm" style={{ color: primaryColor }}>{data.realtor.name}</div>
                            <div className="text-[10px] text-gray-600">{data.realtor.phone}</div>
                        </div>
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: accentColor }}
                        >
                            <ChevronRight className="w-4 h-4" style={{ color: primaryColor }} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

InstagramStoryBanner.displayName = "InstagramStoryBanner";


// ═══════════════════════════════════════════════════════════════════════════
// FACEBOOK POST - 1200 x 630 (1.91:1 Landscape)
// ═══════════════════════════════════════════════════════════════════════════
export const FacebookBanner = forwardRef<HTMLDivElement, SocialBannerProps>(
    ({ data, property, colorTheme }, ref) => {
        const theme = colorTheme || data.colorTheme || {
            id: "navy-gold",
            name: "Navy Gold",
            primary: "#1e3a5f",
            secondary: "#d4af37",
            accent: "#ffffff"
        };

        const primaryColor = theme.primary;
        const accentColor = theme.secondary;

        const financing = property.financing || {
            listPrice: property.specs.listPrice,
            downPaymentPercent: 20,
            interestRate: 6.5,
            loanTermYears: 30,
            hoa: property.specs.hoa || 0
        };
        const payment = calculateTotalMonthlyPayment(financing);

        return (
            <div
                ref={ref}
                data-capture="banner"
                className="w-[600px] h-[315px] relative overflow-hidden flex"
                style={{ fontFamily: "'Inter', sans-serif", backgroundColor: primaryColor }}
            >
                {/* Left - Image */}
                <div className="w-[55%] relative">
                    {property.images.hero && (
                        <img
                            src={property.images.hero}
                            alt="Property"
                            className="w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40" />

                    {/* Price Badge */}
                    <div className="absolute top-4 left-4 px-4 py-2 rounded-lg shadow-xl bg-white">
                        <div className="text-[10px] uppercase tracking-wider" style={{ color: primaryColor }}>Listed at</div>
                        <div className="text-2xl font-black" style={{ color: primaryColor }}>
                            {formatCurrency(property.specs.listPrice)}
                        </div>
                    </div>

                    {/* Open House Badge */}
                    {property.openHouse && (
                        <div
                            className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full"
                            style={{ backgroundColor: accentColor }}
                        >
                            <Clock className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                            <span className="text-[10px] font-bold uppercase" style={{ color: primaryColor }}>
                                Open House • {property.openHouse.date.split(",")[0]}
                            </span>
                        </div>
                    )}
                </div>

                {/* Right - Content */}
                <div className="w-[45%] p-5 flex flex-col">
                    {/* Headline */}
                    <h2 className="text-white text-lg font-black leading-tight mb-2">
                        {property.features.headline}
                    </h2>

                    <div className="flex items-center gap-1 text-white/70 text-xs mb-3">
                        <MapPin className="w-3 h-3" />
                        <span>{property.specs.city}, {property.specs.state}</span>
                    </div>

                    {/* Specs */}
                    <div className="flex gap-4 mb-4">
                        {[
                            { value: property.specs.bedrooms || 0, label: "Beds" },
                            { value: property.specs.bathrooms || 0, label: "Baths" },
                            { value: `${(property.specs.squareFootage || 0).toLocaleString()} SF`, label: "" },
                        ].map((stat, idx) => (
                            <div key={idx} className="text-white">
                                <div className="text-lg font-bold">{stat.value}</div>
                                <div className="text-[10px] opacity-60">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Payment */}
                    <div className="p-3 rounded-lg bg-white/10 mb-4">
                        <div className="flex items-baseline gap-2">
                            <div className="text-white/60 text-[10px]">Est. Payment</div>
                            <div className="text-xl font-bold" style={{ color: accentColor }}>
                                {formatCurrency(payment.total)}/mo
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="mt-auto flex items-center gap-2">
                        <FlyerProfileImage
                            src={data.realtor.headshot}
                            alt={data.realtor.name}
                            position={data.realtor.headshotPosition}
                            className="w-10 h-10 rounded-full border-2"
                            style={{ borderColor: accentColor }}
                        />
                        <div>
                            <div className="text-white font-bold text-sm">{data.realtor.name}</div>
                            <div className="text-white/60 text-[10px]">{data.realtor.brokerage}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

FacebookBanner.displayName = "FacebookBanner";


// ═══════════════════════════════════════════════════════════════════════════
// LINKEDIN POST - 1200 x 627 (Similar to Facebook)
// ═══════════════════════════════════════════════════════════════════════════
export const LinkedInBanner = forwardRef<HTMLDivElement, SocialBannerProps>(
    ({ data, property, colorTheme }, ref) => {
        const theme = colorTheme || data.colorTheme || {
            id: "navy-gold",
            name: "Navy Gold",
            primary: "#1e3a5f",
            secondary: "#d4af37",
            accent: "#ffffff"
        };

        const primaryColor = theme.primary;
        const accentColor = theme.secondary;

        const financing = property.financing || {
            listPrice: property.specs.listPrice,
            downPaymentPercent: 20,
            interestRate: 6.5,
            loanTermYears: 30,
            hoa: property.specs.hoa || 0
        };
        const payment = calculateTotalMonthlyPayment(financing);

        return (
            <div
                ref={ref}
                data-capture="banner"
                className="w-[600px] h-[314px] relative overflow-hidden"
                style={{ fontFamily: "'Inter', sans-serif" }}
            >
                {/* Background Image */}
                {property.images.hero && (
                    <img
                        src={property.images.hero}
                        alt="Property"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}

                {/* Overlay */}
                <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${primaryColor}ee 0%, ${primaryColor}aa 50%, transparent 100%)` }} />

                {/* Content */}
                <div className="relative z-10 h-full p-6 flex">
                    {/* Left Content */}
                    <div className="flex-1 flex flex-col">
                        {/* Badge */}
                        <div
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full self-start mb-4"
                            style={{ backgroundColor: accentColor }}
                        >
                            <Home className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                            <span className="text-[10px] font-bold uppercase" style={{ color: primaryColor }}>
                                New Listing
                            </span>
                        </div>

                        {/* Headline */}
                        <h2 className="text-white text-2xl font-black leading-tight mb-2 max-w-[350px]">
                            {property.features.headline}
                        </h2>

                        <div className="flex items-center gap-1.5 text-white/80 text-sm mb-4">
                            <MapPin className="w-4 h-4" />
                            <span>{property.specs.address}, {property.specs.city}</span>
                        </div>

                        {/* Specs Row */}
                        <div className="flex items-center gap-4 text-white mb-4">
                            <span className="text-sm"><strong>{property.specs.bedrooms || 0}</strong> Beds</span>
                            <span className="text-white/30">•</span>
                            <span className="text-sm"><strong>{property.specs.bathrooms || 0}</strong> Baths</span>
                            <span className="text-white/30">•</span>
                            <span className="text-sm"><strong>{(property.specs.squareFootage || 0).toLocaleString()}</strong> SF</span>
                        </div>

                        {/* Contact */}
                        <div className="mt-auto flex items-center gap-3">
                            <FlyerProfileImage
                                src={data.realtor.headshot}
                                alt={data.realtor.name}
                                position={data.realtor.headshotPosition}
                                className="w-11 h-11 rounded-full border-2"
                                style={{ borderColor: accentColor }}
                            />
                            <div>
                                <div className="text-white font-bold text-sm">{data.realtor.name}</div>
                                <div className="text-white/60 text-xs">{data.realtor.brokerage}</div>
                            </div>
                            <div className="ml-auto mr-4">
                                <FlyerProfileImage
                                    src={data.broker.headshot}
                                    alt={data.broker.name}
                                    position={data.broker.headshotPosition}
                                    className="w-11 h-11 rounded-full border-2"
                                    style={{ borderColor: accentColor }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right - Price Card */}
                    <div className="w-[180px] flex flex-col items-end">
                        {/* Price */}
                        <div className="bg-white rounded-xl p-4 shadow-2xl text-right mb-4">
                            <div className="text-[10px] uppercase tracking-wider text-gray-500">Listed at</div>
                            <div className="text-3xl font-black" style={{ color: primaryColor }}>
                                {formatCurrency(property.specs.listPrice)}
                            </div>
                            <div className="mt-2 pt-2 border-t border-gray-100">
                                <div className="text-[10px] text-gray-500">Est. Monthly</div>
                                <div className="text-lg font-bold" style={{ color: accentColor }}>
                                    {formatCurrency(payment.total)}
                                </div>
                            </div>
                        </div>

                        {/* QR Code */}
                        {data.cta.buttonUrl && (
                            <div className="bg-white p-2 rounded-lg shadow-lg">
                                <QRCodeSVG
                                    value={data.cta.buttonUrl}
                                    size={60}
                                    level="M"
                                    fgColor={primaryColor}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
);

LinkedInBanner.displayName = "LinkedInBanner";
