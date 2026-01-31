import { useState, useRef } from "react";
import { PropertyListingLayout } from "./layouts/PropertyListingLayout";
import { InstagramStoryBanner, FacebookBanner, LinkedInBanner } from "./PropertySocialBanners";
import { MortgageCalculator } from "./MortgageCalculator";
import { ExportMenu } from "./ExportMenu";
import { mapleValleyProperty, celesteZarlingFlyerData } from "@/data/mapleValleyProperty";
import { PropertyListing, formatCurrency, calculateTotalMonthlyPayment } from "@/types/property";
import { FlyerData, ColorTheme, brokerageThemes } from "@/types/flyer";
import {
    Home,
    Calculator,
    Download,
    Eye,
    MapPin,
    Calendar,
    DollarSign,
    FileText,
    Instagram,
    Facebook,
    Linkedin,
    Printer,
    RefreshCw,
    Check,
    Copy,
    ExternalLink,
    Share2,
    Image,
    Sparkles,
    Palette
} from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";

interface PropertyFlyerBuilderProps {
    property?: PropertyListing;
    flyerData?: FlyerData;
    onSave?: (property: PropertyListing, flyerData: FlyerData) => void;
}

type PreviewFormat = "flyer" | "instagram" | "facebook" | "linkedin";

export function PropertyFlyerBuilder({
    property: initialProperty = mapleValleyProperty,
    flyerData: initialFlyerData = celesteZarlingFlyerData,
    onSave
}: PropertyFlyerBuilderProps) {
    const [property, setProperty] = useState<PropertyListing>(initialProperty);
    const [flyerData, setFlyerData] = useState<FlyerData>(initialFlyerData);
    const [activeFormat, setActiveFormat] = useState<PreviewFormat>("flyer");
    const [showExport, setShowExport] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // Theme selection - defaults to CENTURY 21 or initial flyer's theme
    const [selectedTheme, setSelectedTheme] = useState<ColorTheme>(
        initialFlyerData.colorTheme || brokerageThemes.find(t => t.id === "century21") || brokerageThemes[0]
    );

    // Payment calculation
    const [interestRate, setInterestRate] = useState(property.financing?.interestRate || 6.5);
    const [downPayment, setDownPayment] = useState(property.financing?.downPaymentPercent || 20);

    // Refs for each format
    const flyerRef = useRef<HTMLDivElement>(null);
    const instagramRef = useRef<HTMLDivElement>(null);
    const facebookRef = useRef<HTMLDivElement>(null);
    const linkedinRef = useRef<HTMLDivElement>(null);

    // Update financing when rate or down payment changes
    const updateFinancing = (rate?: number, dp?: number) => {
        const newRate = rate ?? interestRate;
        const newDp = dp ?? downPayment;

        setProperty(prev => ({
            ...prev,
            financing: {
                ...prev.financing!,
                interestRate: newRate,
                downPaymentPercent: newDp
            }
        }));
    };

    const handleRateChange = (rate: number) => {
        setInterestRate(rate);
        updateFinancing(rate, undefined);
    };

    const handleDownPaymentChange = (dp: number) => {
        setDownPayment(dp);
        updateFinancing(undefined, dp);
    };

    // Calculate current payment
    const financing = property.financing || {
        listPrice: property.specs.listPrice,
        downPaymentPercent: downPayment,
        interestRate: interestRate,
        loanTermYears: 30,
        hoa: property.specs.hoa || 0
    };
    const payment = calculateTotalMonthlyPayment(financing);

    // Export current format
    const handleQuickExport = async (format: PreviewFormat) => {
        const refMap = {
            flyer: flyerRef,
            instagram: instagramRef,
            facebook: facebookRef,
            linkedin: linkedinRef
        };

        const ref = refMap[format];
        if (!ref.current) return;

        setIsExporting(true);
        try {
            const canvas = await html2canvas(ref.current, {
                scale: 3,
                useCORS: true,
                backgroundColor: "#ffffff",
            });

            const link = document.createElement("a");
            link.download = `${property.specs.address.replace(/\s+/g, "_")}_${format}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();

            toast.success(`${format.charAt(0).toUpperCase() + format.slice(1)} exported successfully!`);
        } catch (error) {
            toast.error("Export failed. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    // Format tabs configuration
    const formatTabs = [
        { id: "flyer" as const, label: "Print Flyer", icon: Printer, size: "8.5×11" },
        { id: "instagram" as const, label: "Instagram", icon: Instagram, size: "1080×1920" },
        { id: "facebook" as const, label: "Facebook", icon: Facebook, size: "1200×630" },
        { id: "linkedin" as const, label: "LinkedIn", icon: Linkedin, size: "1200×627" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* ═══════════════════════════════════════════════════════════════════
          HEADER - Enterprise Navigation
          ═══════════════════════════════════════════════════════════════════ */}
            <div className="bg-slate-800/80 border-b border-slate-700/50 px-6 py-4 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg shadow-amber-500/20">
                            <Home className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-bold text-white">Property Marketing Suite</h1>
                                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                    Pro
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 flex items-center gap-1.5">
                                <MapPin className="w-3 h-3" />
                                {property.specs.address}, {property.specs.city}
                                <span className="text-slate-600">•</span>
                                <span className="text-amber-500 font-medium">{formatCurrency(property.specs.listPrice)}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Quick Stats */}
                        <div className="hidden lg:flex items-center gap-4 px-5 py-2.5 bg-slate-700/50 rounded-xl border border-slate-600/50">
                            <div className="text-center">
                                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Monthly</div>
                                <div className="text-base font-bold text-amber-500">{formatCurrency(payment.total)}</div>
                            </div>
                            <div className="w-px h-8 bg-slate-600" />
                            <div className="text-center">
                                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Rate</div>
                                <div className="text-base font-bold text-white">{interestRate}%</div>
                            </div>
                            <div className="w-px h-8 bg-slate-600" />
                            <div className="text-center">
                                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Down</div>
                                <div className="text-base font-bold text-white">{downPayment}%</div>
                            </div>
                        </div>

                        {/* Export All Button */}
                        <button
                            onClick={() => setShowExport(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
                        >
                            <Download className="w-4 h-4" />
                            Export All
                        </button>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════
          MAIN CONTENT
          ═══════════════════════════════════════════════════════════════════ */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">

                    {/* ───────────────────────────────────────────────────────────────
              LEFT PANEL - Controls
              ─────────────────────────────────────────────────────────────── */}
                    <div className="xl:col-span-1 space-y-6">
                        {/* Financing Quick Adjust */}
                        <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 backdrop-blur-sm">
                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                <div className="p-1.5 bg-amber-500/10 rounded-lg">
                                    <Calculator className="w-4 h-4 text-amber-500" />
                                </div>
                                Financing Calculator
                            </h3>

                            <div className="space-y-5">
                                {/* Interest Rate */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-xs text-slate-400 font-medium">Interest Rate</label>
                                        <div className="flex items-center gap-1 bg-slate-700/50 rounded-lg px-2 py-1">
                                            <input
                                                type="number"
                                                value={interestRate}
                                                onChange={(e) => handleRateChange(parseFloat(e.target.value) || 0)}
                                                step="0.125"
                                                className="w-14 bg-transparent text-right text-white text-sm font-medium focus:outline-none"
                                            />
                                            <span className="text-slate-400 text-sm">%</span>
                                        </div>
                                    </div>
                                    <input
                                        type="range"
                                        value={interestRate}
                                        onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                                        step="0.125"
                                        min="4"
                                        max="9"
                                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                        <span>4%</span>
                                        <span>9%</span>
                                    </div>
                                </div>

                                {/* Down Payment */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-xs text-slate-400 font-medium">Down Payment</label>
                                        <div className="flex items-center gap-1 bg-slate-700/50 rounded-lg px-2 py-1">
                                            <input
                                                type="number"
                                                value={downPayment}
                                                onChange={(e) => handleDownPaymentChange(parseFloat(e.target.value) || 0)}
                                                step="5"
                                                className="w-14 bg-transparent text-right text-white text-sm font-medium focus:outline-none"
                                            />
                                            <span className="text-slate-400 text-sm">%</span>
                                        </div>
                                    </div>
                                    <input
                                        type="range"
                                        value={downPayment}
                                        onChange={(e) => handleDownPaymentChange(parseFloat(e.target.value))}
                                        step="5"
                                        min="0"
                                        max="50"
                                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                        <span>0%</span>
                                        <span>50%</span>
                                    </div>
                                </div>

                                {/* Payment Display */}
                                <div className="pt-4 border-t border-slate-700">
                                    <div className="text-center p-4 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl border border-slate-600/50">
                                        <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Total Monthly Payment</div>
                                        <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                                            {formatCurrency(payment.total)}
                                        </div>
                                        <div className="text-[10px] text-slate-500 mt-2 space-x-2">
                                            <span>P&I: {formatCurrency(payment.principalInterest)}</span>
                                            <span>•</span>
                                            <span>Tax: {formatCurrency(payment.propertyTax)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Editable Property Details */}
                        <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 backdrop-blur-sm">
                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                <div className="p-1.5 bg-amber-500/10 rounded-lg">
                                    <FileText className="w-4 h-4 text-amber-500" />
                                </div>
                                Property Details
                                <span className="text-[10px] text-slate-500 font-normal ml-auto">Editable</span>
                            </h3>

                            <div className="space-y-4 text-sm">
                                {/* List Price */}
                                <div>
                                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">List Price</label>
                                    <div className="flex items-center gap-1 bg-slate-700/50 rounded-lg px-3 py-2">
                                        <span className="text-slate-400">$</span>
                                        <input
                                            type="number"
                                            value={property.specs.listPrice}
                                            onChange={(e) => setProperty(prev => ({
                                                ...prev,
                                                specs: { ...prev.specs, listPrice: parseInt(e.target.value) || 0 },
                                                financing: prev.financing ? { ...prev.financing, listPrice: parseInt(e.target.value) || 0 } : prev.financing
                                            }))}
                                            className="flex-1 bg-transparent text-white font-bold focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Specs Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-slate-700/30 rounded-lg">
                                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Beds/Baths</div>
                                        <div className="text-white font-bold">{property.specs.bedrooms} / {property.specs.bathrooms}</div>
                                    </div>
                                    <div className="p-3 bg-slate-700/30 rounded-lg">
                                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Square Feet</div>
                                        <div className="text-white font-bold">{property.specs.squareFootage.toLocaleString()}</div>
                                    </div>
                                </div>

                                {/* Open House - Editable */}
                                <div className="p-3 bg-gradient-to-r from-amber-500/10 to-transparent rounded-lg border border-amber-500/20">
                                    <div className="flex items-center gap-2 text-amber-500 mb-3">
                                        <Calendar className="w-4 h-4" />
                                        <span className="font-bold text-sm">Open House</span>
                                    </div>

                                    {/* Date */}
                                    <div className="mb-2">
                                        <label className="text-[10px] text-slate-400 block mb-1">Date</label>
                                        <input
                                            type="text"
                                            value={property.openHouse?.date || ""}
                                            onChange={(e) => setProperty(prev => ({
                                                ...prev,
                                                openHouse: {
                                                    ...prev.openHouse!,
                                                    date: e.target.value
                                                }
                                            }))}
                                            placeholder="Saturday, January 31, 2026"
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded px-2 py-1.5 text-white text-xs focus:outline-none focus:border-amber-500"
                                        />
                                    </div>

                                    {/* Time Range */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-[10px] text-slate-400 block mb-1">Start Time</label>
                                            <input
                                                type="text"
                                                value={property.openHouse?.startTime || ""}
                                                onChange={(e) => setProperty(prev => ({
                                                    ...prev,
                                                    openHouse: {
                                                        ...prev.openHouse!,
                                                        startTime: e.target.value
                                                    }
                                                }))}
                                                placeholder="2:00 PM"
                                                className="w-full bg-slate-700/50 border border-slate-600 rounded px-2 py-1.5 text-white text-xs focus:outline-none focus:border-amber-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-slate-400 block mb-1">End Time</label>
                                            <input
                                                type="text"
                                                value={property.openHouse?.endTime || ""}
                                                onChange={(e) => setProperty(prev => ({
                                                    ...prev,
                                                    openHouse: {
                                                        ...prev.openHouse!,
                                                        endTime: e.target.value
                                                    }
                                                }))}
                                                placeholder="4:00 PM"
                                                className="w-full bg-slate-700/50 border border-slate-600 rounded px-2 py-1.5 text-white text-xs focus:outline-none focus:border-amber-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Theme Selector */}
                        <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 backdrop-blur-sm">
                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                <div className="p-1.5 bg-amber-500/10 rounded-lg">
                                    <Palette className="w-4 h-4 text-amber-500" />
                                </div>
                                Agent Branding
                            </h3>

                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                {brokerageThemes.map(theme => (
                                    <button
                                        key={theme.id}
                                        onClick={() => setSelectedTheme(theme)}
                                        className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all ${selectedTheme.id === theme.id
                                            ? "bg-slate-600/50 ring-2 ring-amber-500/50"
                                            : "bg-slate-700/30 hover:bg-slate-700/50"
                                            }`}
                                    >
                                        {/* Color swatches */}
                                        <div className="flex gap-1">
                                            <div
                                                className="w-5 h-5 rounded-full border border-white/20"
                                                style={{ backgroundColor: theme.primary }}
                                            />
                                            <div
                                                className="w-5 h-5 rounded-full border border-white/20"
                                                style={{ backgroundColor: theme.secondary }}
                                            />
                                        </div>
                                        <span className="text-xs text-white font-medium flex-1 text-left">
                                            {theme.name}
                                        </span>
                                        {selectedTheme.id === theme.id && (
                                            <Check className="w-4 h-4 text-amber-500" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Current theme preview */}
                            <div className="mt-4 pt-4 border-t border-slate-700">
                                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Active Theme</div>
                                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: selectedTheme.primary }}>
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                                        style={{ backgroundColor: selectedTheme.secondary, color: selectedTheme.primary }}
                                    >
                                        {selectedTheme.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-white text-sm font-bold">{selectedTheme.name}</div>
                                        <div className="text-white/60 text-[10px]">
                                            {selectedTheme.primary} / {selectedTheme.secondary}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Custom Color Picker */}
                            <div className="mt-4 pt-4 border-t border-slate-700">
                                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-3">Custom Colors</div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] text-slate-400 block mb-1">Primary</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={selectedTheme.primary}
                                                onChange={(e) => setSelectedTheme({
                                                    ...selectedTheme,
                                                    id: "custom",
                                                    name: "Custom",
                                                    primary: e.target.value
                                                })}
                                                className="w-8 h-8 rounded cursor-pointer border-0"
                                            />
                                            <input
                                                type="text"
                                                value={selectedTheme.primary}
                                                onChange={(e) => setSelectedTheme({
                                                    ...selectedTheme,
                                                    id: "custom",
                                                    name: "Custom",
                                                    primary: e.target.value
                                                })}
                                                className="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs text-white"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-slate-400 block mb-1">Accent</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={selectedTheme.secondary}
                                                onChange={(e) => setSelectedTheme({
                                                    ...selectedTheme,
                                                    id: "custom",
                                                    name: "Custom",
                                                    secondary: e.target.value
                                                })}
                                                className="w-8 h-8 rounded cursor-pointer border-0"
                                            />
                                            <input
                                                type="text"
                                                value={selectedTheme.secondary}
                                                onChange={(e) => setSelectedTheme({
                                                    ...selectedTheme,
                                                    id: "custom",
                                                    name: "Custom",
                                                    secondary: e.target.value
                                                })}
                                                className="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Export Buttons */}
                        <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 backdrop-blur-sm">
                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                <div className="p-1.5 bg-amber-500/10 rounded-lg">
                                    <Share2 className="w-4 h-4 text-amber-500" />
                                </div>
                                Quick Export
                            </h3>

                            <div className="grid grid-cols-2 gap-2">
                                {formatTabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleQuickExport(tab.id)}
                                        disabled={isExporting}
                                        className="flex items-center gap-2 p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg text-left transition-all group"
                                    >
                                        <tab.icon className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
                                        <div>
                                            <div className="text-xs text-white font-medium">{tab.label}</div>
                                            <div className="text-[10px] text-slate-500">{tab.size}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ───────────────────────────────────────────────────────────────
              RIGHT PANEL - Preview
              ─────────────────────────────────────────────────────────────── */}
                    <div className="xl:col-span-3">
                        {/* Format Tabs */}
                        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-700/50">
                            {formatTabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveFormat(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeFormat === tab.id
                                        ? "bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/25"
                                        : "bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white"
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${activeFormat === tab.id ? "bg-slate-900/20 text-slate-900" : "bg-slate-600 text-slate-300"
                                        }`}>
                                        {tab.size}
                                    </span>
                                </button>
                            ))}

                            <div className="ml-auto">
                                <button
                                    onClick={() => handleQuickExport(activeFormat)}
                                    disabled={isExporting}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl transition-all"
                                >
                                    {isExporting ? (
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Download className="w-4 h-4" />
                                    )}
                                    Download PNG
                                </button>
                            </div>
                        </div>

                        {/* Preview Container */}
                        <div className="bg-slate-800/30 rounded-2xl p-8 border border-slate-700/30 backdrop-blur-sm">
                            <div className="flex justify-center">
                                {/* Print Flyer */}
                                {activeFormat === "flyer" && (
                                    <div className="transform scale-[0.8] origin-top">
                                        <PropertyListingLayout
                                            ref={flyerRef}
                                            data={flyerData}
                                            property={property}
                                            colorTheme={selectedTheme}
                                        />
                                    </div>
                                )}

                                {/* Instagram Story */}
                                {activeFormat === "instagram" && (
                                    <div className="transform scale-[0.9] origin-top">
                                        <InstagramStoryBanner
                                            ref={instagramRef}
                                            data={flyerData}
                                            property={property}
                                            colorTheme={selectedTheme}
                                        />
                                    </div>
                                )}

                                {/* Facebook */}
                                {activeFormat === "facebook" && (
                                    <div className="transform scale-[0.95] origin-top">
                                        <FacebookBanner
                                            ref={facebookRef}
                                            data={flyerData}
                                            property={property}
                                            colorTheme={selectedTheme}
                                        />
                                    </div>
                                )}

                                {/* LinkedIn */}
                                {activeFormat === "linkedin" && (
                                    <div className="transform scale-[0.95] origin-top">
                                        <LinkedInBanner
                                            ref={linkedinRef}
                                            data={flyerData}
                                            property={property}
                                            colorTheme={selectedTheme}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════
          EXPORT MODAL
          ═══════════════════════════════════════════════════════════════════ */}
            {showExport && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 rounded-2xl p-6 max-w-lg w-full border border-slate-700 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-500/10 rounded-xl">
                                    <Sparkles className="w-5 h-5 text-amber-500" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Export Marketing Assets</h3>
                                    <p className="text-xs text-slate-400">Download all formats at once</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowExport(false)}
                                className="text-slate-400 hover:text-white text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-3">
                            {formatTabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        handleQuickExport(tab.id);
                                        setShowExport(false);
                                    }}
                                    className="w-full flex items-center gap-4 p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl transition-all group"
                                >
                                    <div className="p-2 bg-slate-600/50 rounded-lg group-hover:bg-amber-500/20">
                                        <tab.icon className="w-5 h-5 text-slate-400 group-hover:text-amber-500" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="text-white font-medium">{tab.label}</div>
                                        <div className="text-xs text-slate-400">{tab.size} • High Resolution PNG</div>
                                    </div>
                                    <Download className="w-4 h-4 text-slate-400 group-hover:text-white" />
                                </button>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-700">
                            <ExportMenu
                                previewRef={flyerRef}
                                isExporting={isExporting}
                                setIsExporting={setIsExporting}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PropertyFlyerBuilder;
