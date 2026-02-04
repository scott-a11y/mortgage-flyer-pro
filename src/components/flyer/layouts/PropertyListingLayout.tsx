import { FlyerData, ColorTheme } from "@/types/flyer";
import { PropertyListing, formatCurrency, calculateTotalMonthlyPayment } from "@/types/property";
import { forwardRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
    Bed,
    Bath,
    Maximize,
    Trees,
    Car,
    MapPin,
    Clock,
    CheckCircle,
    Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyListingLayoutProps {
    data: FlyerData;
    property: PropertyListing;
    colorTheme: ColorTheme;
    heroImagePosition?: number; // 0-100 (top to bottom)
    className?: string;
}

export const PropertyListingLayout = forwardRef<HTMLDivElement, PropertyListingLayoutProps>(
    ({ data, property, colorTheme, heroImagePosition = 40, className }, ref) => {
        const primaryColor = colorTheme?.primary || "#252526";
        const accentColor = colorTheme?.secondary || "#F2A900";

        const financing = property.financing || {
            listPrice: property.specs.listPrice,
            downPaymentPercent: 20,
            interestRate: 6.5,
            loanTermYears: 30,
            hoa: property.specs.hoa || 0
        };

        const paymentBreakdown = calculateTotalMonthlyPayment(financing);

        // Split bullet points into two columns
        const bulletPoints = property.features.bulletPoints;
        const midpoint = Math.ceil(bulletPoints.length / 2);
        const leftColumn = bulletPoints.slice(0, midpoint);
        const rightColumn = bulletPoints.slice(midpoint);

        // Fixed section heights to ensure total = 792px exactly
        // Hero: 200px, Stats: 36px, Address: 44px, Content: 387px, Footer: 105px, Legal: 20px
        const HERO_HEIGHT = 200;
        const STATS_HEIGHT = 36;
        const ADDRESS_HEIGHT = 44;
        const FOOTER_HEIGHT = 105; // Increased for full email display
        const LEGAL_HEIGHT = 20;
        const CONTENT_HEIGHT = 792 - HERO_HEIGHT - STATS_HEIGHT - ADDRESS_HEIGHT - FOOTER_HEIGHT - LEGAL_HEIGHT;

        return (
            <div
                ref={ref}
                id="capture-root"
                data-capture="flyer"
                className={cn(
                    "bg-white shadow-2xl mx-auto flex flex-col print:shadow-none",
                    className
                )}
                style={{
                    width: "612px",
                    height: "792px",
                    maxHeight: "792px",
                    overflow: "hidden",
                    fontFamily: "Inter, system-ui, sans-serif",
                    color: "#1a1a1a",
                    lineHeight: "1.3",
                    WebkitPrintColorAdjust: "exact",
                    printColorAdjust: "exact",
                    boxSizing: "border-box",
                }}
            >
                {/* HERO SECTION - Fixed height */}
                <div
                    className="relative w-full"
                    style={{ height: `${HERO_HEIGHT}px`, flexShrink: 0 }}
                >
                    {property.images.hero && (
                        <img
                            src={property.images.hero}
                            alt="Property Hero"
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{ objectPosition: `center ${heroImagePosition}%` }}
                        />
                    )}

                    {/* Top gradient for title readability */}
                    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/60 to-transparent" />

                    {/* Title at top-left */}
                    <div className="absolute top-3 left-4 right-4 z-10">
                        <h1
                            className="text-[17px] font-black text-white uppercase leading-tight"
                            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}
                        >
                            {property.features.headline}
                        </h1>
                        <p
                            className="text-[9px] text-white/90 font-medium mt-1"
                            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
                        >
                            {property.features.subheadline}
                        </p>
                    </div>
                </div>

                {/* SLIM STATS BAR - Fixed height */}
                <div
                    className="flex justify-between items-center px-6"
                    style={{ backgroundColor: primaryColor, height: `${STATS_HEIGHT}px`, flexShrink: 0 }}
                >
                    {[
                        { icon: Bed, value: property.specs.bedrooms || 0, label: "Beds" },
                        { icon: Bath, value: property.specs.bathrooms || 0, label: "Baths" },
                        { icon: Maximize, value: (property.specs.squareFootage || 0).toLocaleString(), label: "SF" },
                        { icon: Trees, value: "0.5", label: "Acres" },
                        { icon: Car, value: "3-Car", label: "Garage" },
                    ].map((stat, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-white">
                            <stat.icon className="w-3.5 h-3.5" style={{ color: accentColor }} />
                            <span className="text-[12px] font-black">{stat.value}</span>
                            <span className="text-[8px] font-medium opacity-60 uppercase">{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* ADDRESS & PRICE BAR - Fixed height */}
                <div className="flex items-center justify-between px-5 bg-white border-b border-gray-100" style={{ height: `${ADDRESS_HEIGHT}px`, flexShrink: 0 }}>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <div>
                            <div className="text-[11px] font-bold text-gray-900">{property.specs.address}</div>
                            <div className="text-[8px] font-medium text-gray-500 uppercase tracking-wide">
                                {property.specs.city}, {property.specs.state} • MLS# {property.specs.mlsNumber}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">Listed At</div>
                        <div className="text-[18px] font-black leading-none" style={{ color: primaryColor }}>
                            {formatCurrency(property.specs.listPrice)}
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT - Calculated height to fill remaining space */}
                <div className="grid grid-cols-[1.4fr_1fr] p-3 gap-3 bg-white" style={{ height: `${CONTENT_HEIGHT}px`, flexShrink: 0, overflow: "hidden" }}>
                    {/* LEFT COLUMN */}
                    <div className="flex flex-col gap-3 overflow-hidden">
                        {/* Property Highlights */}
                        <section>
                            <h3 className="text-[9px] font-black uppercase tracking-[0.15em] mb-2 flex items-center gap-2" style={{ color: primaryColor }}>
                                <span className="w-4 h-[2px]" style={{ backgroundColor: accentColor }} />
                                Property Highlights
                            </h3>
                            <div className="grid grid-cols-2 gap-x-3">
                                {/* Left Column */}
                                <div className="space-y-1.5">
                                    {leftColumn.map((bullet, idx) => (
                                        <div key={idx} className="flex items-start gap-1.5">
                                            <CheckCircle className="w-2.5 h-2.5 mt-0.5 flex-shrink-0" style={{ color: accentColor }} />
                                            <span className="text-[8px] leading-tight font-medium text-gray-700">{bullet}</span>
                                        </div>
                                    ))}
                                </div>
                                {/* Right Column */}
                                <div className="space-y-1.5">
                                    {rightColumn.map((bullet, idx) => (
                                        <div key={idx} className="flex items-start gap-1.5">
                                            <CheckCircle className="w-2.5 h-2.5 mt-0.5 flex-shrink-0" style={{ color: accentColor }} />
                                            <span className="text-[8px] leading-tight font-medium text-gray-700">{bullet}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Interior Features */}
                        <section className="mt-auto">
                            <h3 className="text-[9px] font-black uppercase tracking-[0.15em] mb-2 flex items-center gap-2" style={{ color: primaryColor }}>
                                <span className="w-4 h-[2px]" style={{ backgroundColor: accentColor }} />
                                Interior Features
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                {property.images.secondary?.slice(0, 3).map((img, idx) => (
                                    <div key={idx} className="aspect-[4/3] rounded-md overflow-hidden border border-gray-200">
                                        <img src={img} className="w-full h-full object-cover" alt={`Interior ${idx + 1}`} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="flex flex-col gap-3 overflow-hidden">
                        {/* Financing Details */}
                        <div className="bg-slate-900 rounded-lg p-3 text-white flex-shrink-0">
                            <div className="flex items-center gap-1.5 mb-2">
                                <Shield className="w-3 h-3" style={{ color: accentColor }} />
                                <h3 className="text-[8px] font-black uppercase tracking-wider text-white/60">Financing Details</h3>
                            </div>

                            <div className="text-center mb-3">
                                <div className="text-[7px] text-white/50 uppercase font-bold tracking-wide">Est. Monthly Payment*</div>
                                <div className="text-[24px] font-black leading-none mt-1">{formatCurrency(paymentBreakdown.total)}</div>
                                <div className="text-[7px] text-white/40 mt-1 font-medium">
                                    {financing.downPaymentPercent}% Down • {financing.interestRate}% Rate
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-2 space-y-1">
                                {[
                                    { label: "Principal & Interest", value: paymentBreakdown.principalInterest },
                                    { label: "Property Tax", value: paymentBreakdown.propertyTax },
                                    { label: "Insurance", value: paymentBreakdown.insurance },
                                    ...(paymentBreakdown.hoa > 0 ? [{ label: "HOA Dues", value: paymentBreakdown.hoa }] : [])
                                ].map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-[8px]">
                                        <span className="text-white/60">{item.label}</span>
                                        <span className="font-bold text-white tabular-nums">{formatCurrency(item.value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Schedule */}
                        {property.openHouse && (
                            <div className="bg-gray-50 border border-gray-100 rounded-lg p-2.5 flex-shrink-0">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Clock className="w-3 h-3 text-gray-400" />
                                    <span className="text-[7px] font-black uppercase tracking-wider text-gray-400">Schedule</span>
                                </div>
                                <div className="font-bold text-[10px] text-gray-900">{property.openHouse.date}</div>
                                <div className="text-[9px] text-gray-500 font-medium">{property.openHouse.startTime} - {property.openHouse.endTime}</div>
                            </div>
                        )}

                        {/* QR Code */}
                        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 rounded-lg p-2 border border-gray-100">
                            <div className="bg-white p-1.5 rounded border border-gray-100 shadow-sm">
                                <QRCodeCanvas value={data.cta.buttonUrl} size={50} level="H" fgColor={primaryColor} />
                            </div>
                            <div className="text-[7px] font-bold uppercase text-gray-400 tracking-wide mt-1.5">Scan for Rates</div>
                        </div>
                    </div>
                </div>

                {/* FOOTER - Fixed height agent cards */}
                <div className="px-3 py-2 print:break-inside-avoid" style={{ height: `${FOOTER_HEIGHT}px`, flexShrink: 0, backgroundColor: primaryColor, WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
                    <div className="grid grid-cols-2 gap-3 h-full">
                        {/* Listing Agent */}
                        <div className="flex items-center gap-2.5 bg-white/5 p-2 rounded-lg border border-white/10">
                            <img
                                src={data.realtor.headshot}
                                alt={data.realtor.name}
                                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                                style={{ border: `2px solid ${accentColor}` }}
                            />
                            <div className="flex-1 min-w-0 space-y-0.5">
                                <div className="text-[5px] font-bold uppercase tracking-wider text-white/50 leading-none">Listing Agent</div>
                                <div className="text-[10px] font-black text-white leading-tight">{data.realtor.name}</div>
                                <div className="text-[6px] text-white/70 font-semibold uppercase truncate leading-tight">{data.realtor.brokerage}</div>
                                <div className="pt-1 border-t border-white/10 space-y-0.5">
                                    <div className="text-[9px] font-black leading-tight" style={{ color: accentColor }}>{data.realtor.phone}</div>
                                    {data.realtor.email && (
                                        <div className="text-[7px] text-white/80 leading-tight">{data.realtor.email}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Loan Officer */}
                        <div className="flex items-center gap-2.5 bg-white/5 p-2 rounded-lg border border-white/10">
                            <img
                                src={data.broker.headshot}
                                alt={data.broker.name}
                                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                                style={{ border: `2px solid ${accentColor}` }}
                            />
                            <div className="flex-1 min-w-0 space-y-0.5">
                                <div className="text-[5px] font-bold uppercase tracking-wider text-white/50 leading-none">Loan Officer</div>
                                <div className="text-[10px] font-black text-white leading-tight">{data.broker.name}</div>
                                <div className="text-[6px] text-white/70 font-semibold uppercase truncate leading-tight">{data.company.name}</div>
                                <div className="pt-1 border-t border-white/10 space-y-0.5">
                                    <div className="text-[9px] font-black leading-tight" style={{ color: accentColor }}>{data.broker.phone}</div>
                                    {data.broker.email && (
                                        <div className="text-[7px] text-white/80 leading-tight">{data.broker.email}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* LEGAL FOOTER - Fixed height */}
                <div className="bg-white border-t border-gray-100 flex items-center justify-center px-4" style={{ height: `${LEGAL_HEIGHT}px`, flexShrink: 0 }}>
                    <div className="text-[7px] text-gray-400 font-medium text-center">
                        Rates subject to change. {data.company.name} NMLS #{data.company.nmls}. Equal Housing Opportunity. • VERIFIED PRO MARKETING
                    </div>
                </div>
            </div>
        );
    }
);

PropertyListingLayout.displayName = "PropertyListingLayout";
