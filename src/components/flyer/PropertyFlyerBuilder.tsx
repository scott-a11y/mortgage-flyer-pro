import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { PropertyListingLayout } from "./layouts/PropertyListingLayout";
import { InstagramStoryBanner, FacebookBanner, LinkedInBanner } from "./PropertySocialBanners";
import { MortgageCalculator } from "./MortgageCalculator";
import { ExportMenu } from "./ExportMenu";
import { LiveRateRefresher } from "./LiveRateRefresher";
import { mapleValleyProperty, celesteZarlingFlyerData } from "@/data/mapleValleyProperty";
import { PropertyListing, formatCurrency, formatNumber, calculateTotalMonthlyPayment } from "@/types/property";
import { FlyerData, ColorTheme, brokerageThemes } from "@/types/flyer";
import { supabase } from "@/integrations/supabase/client";
import LZString from "lz-string";
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
    RefreshCw,
    Check,
    Copy,
    ExternalLink,
    Share2,
    Image,
    Sparkles,
    Palette,
    Mail,
    UserCircle,
    Building2,
    Users,
    Printer,
    LayoutGrid,
    AlertTriangle
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ImageUploader } from "./editors/ImageUploader";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PropertyFlyerBuilderProps {
    property?: PropertyListing;
    flyerData?: FlyerData;
    onSave?: (property: PropertyListing, flyerData: FlyerData) => void;
}

type PreviewFormat = "flyer" | "instagram" | "facebook" | "linkedin";

export default function PropertyFlyerBuilder({
    property: initialProperty = mapleValleyProperty,
    flyerData: initialFlyerData = celesteZarlingFlyerData,
    onSave
}: PropertyFlyerBuilderProps) {
    const navigate = useNavigate();
    const [property, setProperty] = useState<PropertyListing>(initialProperty);
    const [flyerData, setFlyerData] = useState<FlyerData>(initialFlyerData);
    const [activeFormat, setActiveFormat] = useState<PreviewFormat>("flyer");
    const [showExport, setShowExport] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // Theme selection - defaults to CENTURY 21 or initial flyer's theme
    const [selectedTheme, setSelectedTheme] = useState<ColorTheme>(
        initialFlyerData.colorTheme || brokerageThemes.find(t => t.id === "century21") || brokerageThemes[0]
    );

    // Image position control (0 = top, 50 = center, 100 = bottom)
    const [heroImagePosition, setHeroImagePosition] = useState(40);

    // Reset confirmation state — now handled by AlertDialog
    const [showResetDialog, setShowResetDialog] = useState(false);

    // Initial State Restoration from URL or LocalStorage
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlState = urlParams.get('state');
        const compressedState = urlParams.get('s'); // Compressed state

        const formatParam = urlParams.get('activeFormat');

        if (formatParam === "instagram" || formatParam === "facebook" || formatParam === "linkedin") {
            setActiveFormat(formatParam);
        }

        // Try compressed state first (shorter URLs)
        if (compressedState) {
            try {
                const decompressed = LZString.decompressFromEncodedURIComponent(compressedState);
                if (decompressed) {
                    const parsed = JSON.parse(decompressed);
                    if (parsed.property) setProperty(parsed.property);
                    if (parsed.flyerData) {
                        setFlyerData(parsed.flyerData);
                        if (parsed.flyerData.colorTheme) setSelectedTheme(parsed.flyerData.colorTheme);
                    }
                    toast.success("Shared configuration loaded!");
                    window.history.replaceState({}, '', window.location.pathname);
                }
            } catch (e) {
                console.error("Failed to parse compressed state:", e);
            }
        }
        // Fall back to uncompressed state
        else if (urlState) {
            try {
                const parsed = JSON.parse(decodeURIComponent(urlState));
                if (parsed.property) setProperty(parsed.property);
                if (parsed.flyerData) {
                    setFlyerData(parsed.flyerData);
                    if (parsed.flyerData.colorTheme) setSelectedTheme(parsed.flyerData.colorTheme);
                }
                toast.success("Shared configuration loaded!");
                window.history.replaceState({}, '', window.location.pathname);
            } catch (e) {
                console.error("Failed to parse shared state:", e);
            }
        }
    }, []);

    // Payment calculation — restore from localStorage if available (Bug 3 fix)
    const [interestRate, setInterestRate] = useState(() => {
        try {
            const saved = localStorage.getItem('property_preview_data');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.interestRate !== undefined) return parsed.interestRate;
            }
        } catch {}
        return property.financing?.interestRate || 6.5;
    });
    const [downPayment, setDownPayment] = useState(() => {
        try {
            const saved = localStorage.getItem('property_preview_data');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.downPayment !== undefined) return parsed.downPayment;
            }
        } catch {}
        return property.financing?.downPaymentPercent || 20;
    });

    // Auto-Save to LocalStorage for Live Preview Bridge + Path Repair
    useEffect(() => {
        // Auto-repair old .png paths if they exist in state
        let repairedFlyerData = { ...flyerData };
        let changed = false;

        if (repairedFlyerData.broker.headshot?.endsWith('-headshot.jpg')) {
            repairedFlyerData.broker.headshot = repairedFlyerData.broker.headshot.replace('.jpg', '.png');
            changed = true;
        }
        if (repairedFlyerData.realtor.headshot?.endsWith('-headshot.png')) {
            repairedFlyerData.realtor.headshot = repairedFlyerData.realtor.headshot.replace('.png', '.jpg');
            changed = true;
        }

        if (changed) {
            setFlyerData(repairedFlyerData);
            return; // Don't save yet, wait for next cycle with repaired data
        }

        const syncData = {
            property,
            flyerData: { ...flyerData, colorTheme: selectedTheme },
            interestRate,
            downPayment
        };
        localStorage.setItem('property_preview_data', JSON.stringify(syncData));
    }, [property, flyerData, selectedTheme, interestRate, downPayment]);

    // Refs for each format
    const containerRef = useRef<HTMLDivElement>(null);
    const flyerRef = useRef<HTMLDivElement>(null);
    const instagramRef = useRef<HTMLDivElement>(null);
    const facebookRef = useRef<HTMLDivElement>(null);
    const linkedinRef = useRef<HTMLDivElement>(null);

    // Auto-scaling logic for the preview
    useEffect(() => {
        if (!containerRef.current) return;

        const calculateScale = () => {
            if (!containerRef.current) return;
            const container = containerRef.current;
            const availableWidth = container.clientWidth - 64;
            const availableHeight = container.clientHeight - 64;

            // Format-specific target dimensions for scaling
            let targetWidth = 612;
            let targetHeight = 792;

            if (activeFormat === 'instagram') {
                targetWidth = 360;
                targetHeight = 640;
            } else if (activeFormat === 'facebook' || activeFormat === 'linkedin') {
                targetWidth = 600;
                targetHeight = 315;
            }

            const scaleW = availableWidth / targetWidth;
            const scaleH = availableHeight / targetHeight;

            // Use the smaller scale but cap it at 1.0 to avoid blurring
            const scale = Math.min(scaleW, scaleH, 1);

            container.style.setProperty('--preview-scale', scale.toString());
        };

        const observer = new ResizeObserver(calculateScale);
        observer.observe(containerRef.current);
        calculateScale();

        return () => observer.disconnect();
    }, [activeFormat]);

    // Update financing when rate or down payment changes
    const updateFinancing = (rate?: number, dp?: number) => {
        const newRate = rate ?? interestRate;
        const newDp = dp ?? downPayment;

        setProperty(prev => {
            const currentFinancing = prev.financing || initialProperty.financing || {
                listPrice: prev.specs.listPrice,
                downPaymentPercent: 20,
                interestRate: 6.5,
                loanTermYears: 30,
                hoa: prev.specs.hoa || 0
            };

            return {
                ...prev,
                financing: {
                    ...currentFinancing,
                    interestRate: newRate,
                    downPaymentPercent: newDp
                }
            };
        });
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
    const financing = property.financing || initialProperty.financing || {
        listPrice: property.specs.listPrice,
        downPaymentPercent: downPayment,
        interestRate: interestRate,
        loanTermYears: 30,
        hoa: property.specs.hoa || 0
    };
    const payment = calculateTotalMonthlyPayment(financing);

    // Export current format
    const handleQuickExport = async (format: PreviewFormat) => {
        if (format === 'flyer') {
            await handlePrint();
            return;
        }

        const refMap = {
            flyer: flyerRef,
            instagram: instagramRef,
            facebook: facebookRef,
            linkedin: linkedinRef
        };

        const ref = refMap[format];
        if (!ref.current) {
            toast.error("Format mismatch");
            return;
        }

        setIsExporting(true);
        toast.info(`Preparing ${format}...`, { duration: 1000 });

        try {
            const canvas = await html2canvas(ref.current, {
                scale: 3,
                useCORS: true,
                backgroundColor: "#ffffff",
                logging: false,
                onclone: (clonedDoc) => {
                    const el = clonedDoc.getElementById("capture-root");
                    if (el) {
                        el.style.transform = 'none';
                        el.style.margin = '0';
                    }
                }
            });

            const link = document.createElement("a");
            link.download = `${property.specs.address.replace(/\s+/g, "_")}_${format}.png`;
            link.href = canvas.toDataURL("image/png", 1.0);
            link.click();
            toast.success("Ready!");
        } catch (error) {
            console.error("Export error:", error);
            toast.error("Download failed");
        } finally {
            setIsExporting(false);
        }
    };

    const handlePrint = async () => {
        if (!flyerRef.current) return;
        if (isExporting) return; // Prevent double-click
        setIsExporting(true);
        toast.info("Generating PDF...");

        try {
            const element = flyerRef.current;

            // Create a temporary container for capturing at exact dimensions
            const captureContainer = document.createElement('div');
            captureContainer.style.cssText = `
                position: absolute;
                top: -10000px;
                left: -10000px;
                width: 612px;
                height: 792px;
                overflow: hidden;
                visibility: hidden;
                pointer-events: none;
                background: white;
            `;
            document.body.appendChild(captureContainer);

            // Clone the flyer element
            const clone = element.cloneNode(true) as HTMLElement;
            clone.style.cssText = `
                width: 612px;
                height: 792px;
                max-height: 792px;
                overflow: hidden;
                transform: none;
                margin: 0;
                position: absolute;
                top: 0;
                left: 0;
            `;
            captureContainer.appendChild(clone);

            // Wait for images to load in the clone
            const images = clone.querySelectorAll('img');
            await Promise.all(
                Array.from(images).map(img => {
                    if (img.complete) return Promise.resolve();
                    return new Promise(resolve => {
                        img.onload = resolve;
                        img.onerror = resolve;
                    });
                })
            );

            // Small delay for layout
            await new Promise(resolve => setTimeout(resolve, 150));

            // Capture the clone at exact dimensions
            const canvas = await html2canvas(clone, {
                scale: 2, // 2x for good quality without being too large
                useCORS: true,
                allowTaint: true,
                backgroundColor: "#ffffff",
                logging: false,
                width: 612,
                height: 792,
                x: 0,
                y: 0,
            });

            // Clean up the temporary container
            document.body.removeChild(captureContainer);

            // Generate PDF at exact letter size
            const imgData = canvas.toDataURL("image/png", 1.0);
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "pt", // Use points for precise sizing
                format: [612, 792], // Exact letter size in points
            });

            // Add image at exact dimensions
            pdf.addImage(imgData, "PNG", 0, 0, 612, 792);
            pdf.save(`${property.specs.address.replace(/\s+/g, "_")}_flyer.pdf`);
            toast.success("PDF ready!");
        } catch (error) {
            console.error("PDF generation failed:", error);
            toast.error("PDF generation failed.");
        } finally {
            setIsExporting(false);
        }
    };

    const handleShareEditor = async () => {
        try {
            // Generate a short slug
            const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
            let slug = "";
            for (let i = 0; i < 8; i++) {
                slug += chars.charAt(Math.floor(Math.random() * chars.length));
            }

            // Save to Supabase
            const { error } = await supabase
                .from("flyer_templates")
                .insert([{
                    name: `${property.specs.address} - Collaborate`,
                    data: JSON.parse(JSON.stringify({ property, flyerData })),
                    slug: slug,
                    is_published: false,
                }]);

            if (error) throw error;

            const url = `${window.location.origin}/property/${slug}`;
            await navigator.clipboard.writeText(url);
            toast.success("Short link copied!");
        } catch (err) {
            console.error("Supabase share error (non-critical):", err);
            // Fallback: encode essential config directly in URL params
            const sharePayload = {
                address: property.specs.address,
                city: property.specs.city,
                state: property.specs.state,
                price: property.specs.listPrice,
                rate: flyerData.rates?.thirtyYearFixed,
                dp: downPayment,
            };
            const encoded = btoa(JSON.stringify(sharePayload));
            const url = `${window.location.origin}/builder?cfg=${encoded}`;
            await navigator.clipboard.writeText(url);
            toast.success("Share link copied! (local sharing mode)");
        }
    };

    // Format tabs configuration with descriptions
    const formatTabs = [
        { id: "flyer" as const, label: "Print Flyer", icon: Printer, size: "8.5×11", desc: "High-quality PDF for printing" },
        { id: "instagram" as const, label: "Instagram Story", icon: Instagram, size: "1080×1920", desc: "Vertical story format" },
        { id: "facebook" as const, label: "Facebook Post", icon: Facebook, size: "1200×630", desc: "Landscape feed post" },
        { id: "linkedin" as const, label: "LinkedIn Post", icon: Linkedin, size: "1200×627", desc: "Professional network share" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <Helmet><title>Listing Studio | Mortgage Flyer Pro</title></Helmet>
            {/* ═══════════════════════════════════════════════════════════════════
          HEADER - Enterprise Navigation
          ═══════════════════════════════════════════════════════════════════ */}
            <div className="bg-slate-800/80 border-b border-slate-700/50 px-6 py-4 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex items-center gap-4 group">
                            <div className="p-2.5 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                                <Home className="w-5 h-5 text-white" />
                            </div>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-bold text-white">IA Loans Flyer Builder</h1>
                                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                    Pro
                                </span>
                            </div>
                            <p className="text-xs text-slate-400">
                                Create co-branded mortgage flyers with live rates • Print & social exports
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide max-w-[60vw] lg:max-w-none">
                        {/* Property Quick Summary */}
                        <div className="hidden xl:flex items-center gap-3 px-4 py-2 bg-slate-700/30 rounded-xl border border-slate-600/30">
                            <MapPin className="w-4 h-4 text-amber-500" />
                            <div>
                                <div className="text-xs text-white font-medium">{property.specs.address}</div>
                                <div className="text-[10px] text-slate-400">{property.specs.city}, {property.specs.state}</div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="hidden lg:flex items-center gap-3 px-4 py-2.5 bg-slate-700/50 rounded-xl border border-slate-600/50 flex-shrink-0">
                            <div className="text-center whitespace-nowrap">
                                <div className="text-[9px] text-slate-500 uppercase tracking-wider">Price</div>
                                <div className="text-sm font-bold text-amber-500">{formatCurrency(property.specs.listPrice)}</div>
                            </div>
                            <div className="w-px h-8 bg-slate-600 flex-shrink-0" />
                            <div className="text-center whitespace-nowrap">
                                <div className="text-[9px] text-slate-500 uppercase tracking-wider">Monthly</div>
                                <div className="text-sm font-bold text-white">{formatCurrency(payment.total)}</div>
                            </div>
                            <div className="w-px h-8 bg-slate-600 flex-shrink-0" />
                            <div className="text-center whitespace-nowrap">
                                <div className="text-[9px] text-slate-500 uppercase tracking-wider">Rate</div>
                                <div className="text-sm font-bold text-white">{interestRate}%</div>
                            </div>
                            <div className="w-px h-8 bg-slate-600 flex-shrink-0" />
                            <div className="text-center whitespace-nowrap">
                                <div className="text-[9px] text-slate-500 uppercase tracking-wider">Specs</div>
                                <div className="text-sm font-bold text-white">{property.specs.bedrooms}bd/{property.specs.bathrooms}ba • {formatNumber(property.specs.squareFootage || 0)}sf</div>
                            </div>
                        </div>

                        {/* View Web Version Link */}
                        <Link
                            to="/dashboard"
                            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-bold rounded-xl transition-all border border-white/5 group"
                        >
                            <LayoutGrid className="w-4 h-4 text-amber-500" />
                            Suite Dashboard
                        </Link>

                        <a
                            href={`/property-live/${property.specs.address.toLowerCase().replace(/\s+/g, '-')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-600 text-white font-bold rounded-xl transition-all border border-white/5 shadow-lg group"
                        >
                            <Eye className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                            Web Version
                        </a>

                        <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                            <AlertDialogTrigger asChild>
                                <button
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all border group bg-slate-800 hover:bg-red-500/10 text-slate-400 hover:text-red-500 border-white/5"
                                    title="Reset all flyer settings: property details, theme, calculator inputs, and co-branding"
                                >
                                    <RefreshCw className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
                                        Reset Flyer
                                    </span>
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-slate-900 border-red-500/30 text-white max-w-md">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="flex items-center gap-3 text-white">
                                        <div className="p-2 bg-red-500/20 rounded-lg">
                                            <AlertTriangle className="w-5 h-5 text-red-400" />
                                        </div>
                                        Reset All Flyer Settings?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-slate-400 text-sm leading-relaxed">
                                        This will clear all customizations including:
                                        <ul className="mt-2 space-y-1 text-slate-500">
                                            <li>• Property details and financing inputs</li>
                                            <li>• Theme and branding selections</li>
                                            <li>• Co-branded partner configurations</li>
                                            <li>• Saved templates and preferences</li>
                                        </ul>
                                        <span className="block mt-3 text-red-400/80 font-medium">This action cannot be undone.</span>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="gap-3">
                                    <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white">
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-red-600 hover:bg-red-500 text-white font-bold"
                                        onClick={() => {
                                            const keys = [
                                                'property_preview_data',
                                                'mortgage-flyer-custom-partners',
                                                'mortgage-flyer-broker-defaults',
                                                'mortgage-flyer-company-defaults',
                                                'flyer_templates_local',
                                                'flyer-templates'
                                            ];
                                            keys.forEach(k => localStorage.removeItem(k));
                                            toast.success("Flyer reset to defaults. Reloading...");
                                            setTimeout(() => window.location.reload(), 500);
                                        }}
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Reset Everything
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        {/* Share Editor Link */}
                        <button
                            onClick={handleShareEditor}
                            className="flex items-center gap-2 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-600 text-white font-bold rounded-xl transition-all border border-white/5 shadow-lg group"
                        >
                            <Users className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                            Collaborate
                        </button>

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
          MAIN CONTENT - Responsive Flex Layout
          ═══════════════════════════════════════════════════════════════════ */}
            <div className="max-w-[1800px] mx-auto px-4 lg:px-6 py-6">
                {/* Flex container with wrap for responsive stacking */}
                <div className="builder-container flex flex-wrap gap-6 lg:gap-8">

                    {/* ───────────────────────────────────────────────────────────────
              LEFT PANEL - Controls (Fixed width sidebar with independent scroll)
              ─────────────────────────────────────────────────────────────── */}
                    <div
                        className="controls-sidebar w-full lg:w-[380px] lg:flex-shrink-0 space-y-6 lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto lg:overflow-x-hidden pr-2 order-2 lg:order-1"
                    >
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

                                    {/* Quick Preset Buttons */}
                                    <div className="mt-3 pt-3 border-t border-slate-700">
                                        <div className="text-[10px] text-slate-500 mb-2 uppercase tracking-wider">Quick Presets</div>
                                        <div className="grid grid-cols-5 gap-1">
                                            {[
                                                { label: "0%", value: 0, sublabel: "VA" },
                                                { label: "3.5%", value: 3.5, sublabel: "FHA" },
                                                { label: "5%", value: 5, sublabel: "Conv" },
                                                { label: "10%", value: 10, sublabel: "" },
                                                { label: "20%", value: 20, sublabel: "Conv" },
                                            ].map((preset) => (
                                                <button
                                                    key={preset.value}
                                                    onClick={() => handleDownPaymentChange(preset.value)}
                                                    className={`py-1.5 rounded-lg text-center transition-all ${downPayment === preset.value
                                                        ? "bg-amber-500 text-slate-900"
                                                        : "bg-slate-700/50 text-slate-300 hover:bg-slate-600"
                                                        }`}
                                                >
                                                    <div className="text-[11px] font-bold">{preset.label}</div>
                                                    {preset.sublabel && (
                                                        <div className="text-[8px] opacity-70">{preset.sublabel}</div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Display - Calculated Values */}
                                <div className="pt-4 border-t border-slate-700">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Payment Breakdown</span>
                                        <span className="text-[9px] bg-slate-600/50 text-slate-400 px-2 py-0.5 rounded-full">Calculated</span>
                                    </div>
                                    <div className="text-center p-4 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl border border-slate-600/50">
                                        <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Total Monthly Payment</div>
                                        <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                                            {formatCurrency(payment.total)}
                                        </div>
                                    </div>

                                    {/* Detailed Breakdown */}
                                    <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                                        <div className="p-2 bg-slate-700/30 rounded-lg flex justify-between">
                                            <span className="text-slate-400">P&I</span>
                                            <span className="text-white font-medium">{formatCurrency(payment.principalInterest)}</span>
                                        </div>
                                        <div className="p-2 bg-slate-700/30 rounded-lg flex justify-between">
                                            <span className="text-slate-400">Property Tax</span>
                                            <span className="text-white font-medium">{formatCurrency(payment.propertyTax)}</span>
                                        </div>
                                        <div className="p-2 bg-slate-700/30 rounded-lg flex justify-between">
                                            <span className="text-slate-400">Insurance</span>
                                            <span className="text-white font-medium">{formatCurrency(payment.insurance || 0)}</span>
                                        </div>
                                        <div className="p-2 bg-slate-700/30 rounded-lg flex justify-between">
                                            <span className="text-slate-400">HOA</span>
                                            <span className="text-white font-medium">{formatCurrency(payment.hoa || 0)}</span>
                                        </div>
                                    </div>

                                    {/* Assumptions Helper Text */}
                                    <div className="mt-3 p-2 bg-slate-900/50 rounded-lg border border-slate-700/30">
                                        <div className="text-[9px] text-slate-500 leading-relaxed">
                                            <span className="font-medium text-slate-400">Assumptions:</span> Property tax ~1.1% annually,
                                            insurance ~0.35% annually, HOA from listing data. Actual rates may vary.
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
                                {/* Address Information */}
                                <div className="grid gap-3">
                                    <div>
                                        <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Street Address</label>
                                        <input
                                            type="text"
                                            value={property.specs.address}
                                            onChange={(e) => setProperty(prev => ({
                                                ...prev,
                                                specs: { ...prev.specs, address: e.target.value }
                                            }))}
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-amber-500"
                                            placeholder="123 Main St"
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="col-span-1">
                                            <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">City</label>
                                            <input
                                                type="text"
                                                value={property.specs.city}
                                                onChange={(e) => setProperty(prev => ({
                                                    ...prev,
                                                    specs: { ...prev.specs, city: e.target.value }
                                                }))}
                                                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-amber-500"
                                                placeholder="City"
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">State</label>
                                            <input
                                                type="text"
                                                value={property.specs.state}
                                                onChange={(e) => setProperty(prev => ({
                                                    ...prev,
                                                    specs: { ...prev.specs, state: e.target.value }
                                                }))}
                                                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-amber-500"
                                                placeholder="WA"
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Zip</label>
                                            <input
                                                type="text"
                                                value={property.specs.zip}
                                                onChange={(e) => setProperty(prev => ({
                                                    ...prev,
                                                    specs: { ...prev.specs, zip: e.target.value }
                                                }))}
                                                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-amber-500"
                                                placeholder="Zip"
                                            />
                                        </div>
                                    </div>
                                </div>

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

                                {/* Specs Grid - Fully Editable & Crash-Proof */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-slate-700/30 rounded-lg">
                                        <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Beds / Baths</div>
                                        <div className="flex items-center gap-2 text-white font-bold">
                                            <input
                                                type="number"
                                                value={property.specs.bedrooms}
                                                onChange={(e) => setProperty(prev => ({
                                                    ...prev,
                                                    specs: { ...prev.specs, bedrooms: parseInt(e.target.value) || 0 }
                                                }))}
                                                className="w-8 bg-slate-600/50 rounded px-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            />
                                            <span className="opacity-40">/</span>
                                            <input
                                                type="number"
                                                step="0.5"
                                                value={property.specs.bathrooms}
                                                onChange={(e) => setProperty(prev => ({
                                                    ...prev,
                                                    specs: { ...prev.specs, bathrooms: parseFloat(e.target.value) || 0 }
                                                }))}
                                                className="w-10 bg-slate-600/50 rounded px-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-3 bg-slate-700/30 rounded-lg">
                                        <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Square Feet</div>
                                        <input
                                            type="number"
                                            value={property.specs.squareFootage || 0}
                                            onChange={(e) => setProperty(prev => ({
                                                ...prev,
                                                specs: { ...prev.specs, squareFootage: parseInt(e.target.value) || 0 }
                                            }))}
                                            className="w-full bg-slate-600/50 rounded px-2 text-white font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                                        />
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
                                                    ...(prev.openHouse || initialProperty.openHouse || { date: "", startTime: "", endTime: "" }),
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
                                                        ...(prev.openHouse || initialProperty.openHouse || { date: "", startTime: "", endTime: "" }),
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
                                                        ...(prev.openHouse || initialProperty.openHouse || { date: "", startTime: "", endTime: "" }),
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

                        {/* Photo Controls */}
                        <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 backdrop-blur-sm">
                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                <div className="p-1.5 bg-amber-500/10 rounded-lg">
                                    <Image className="w-4 h-4 text-amber-500" />
                                </div>
                                Photo Controls
                            </h3>

                            <div className="space-y-4">
                                {/* Hero Image Upload */}
                                <ImageUploader
                                    label="Hero Property Photo"
                                    value={property.images.hero || ""}
                                    onChange={(url) => setProperty(prev => ({
                                        ...prev,
                                        images: { ...prev.images, hero: url }
                                    }))}
                                    className="dark"
                                />

                                {/* Image Position Control with Thumbnail Preview */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-xs text-slate-400 font-medium">Vertical Crop Position</label>
                                        <span className="text-xs text-amber-500 font-bold">{heroImagePosition}%</span>
                                    </div>

                                    {/* Thumbnail Preview */}
                                    {property.images.hero && (
                                        <div className="mb-3 relative h-16 rounded-lg overflow-hidden border border-slate-600/50">
                                            <img
                                                src={property.images.hero}
                                                alt="Position preview"
                                                className="absolute w-full h-32 object-cover"
                                                style={{ top: `${-heroImagePosition * 0.32}px` }}
                                            />
                                            <div className="absolute inset-0 border-2 border-amber-500/50 rounded-lg pointer-events-none" />
                                            <div className="absolute bottom-1 right-1 text-[8px] bg-black/60 text-white px-1.5 py-0.5 rounded">
                                                visible area
                                            </div>
                                        </div>
                                    )}

                                    <input
                                        type="range"
                                        value={heroImagePosition}
                                        onChange={(e) => setHeroImagePosition(parseInt(e.target.value))}
                                        min="0"
                                        max="100"
                                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                    />
                                    <div className="text-[9px] text-slate-500 mt-2">
                                        Slide to show more of the top (0%) or bottom (100%) of the photo
                                    </div>
                                </div>

                                {/* Quick Position Presets */}
                                <div>
                                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Quick Presets</div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { label: "Show Top", value: 20 },
                                            { label: "Centered", value: 50 },
                                            { label: "Show Bottom", value: 80 },
                                        ].map((preset) => (
                                            <button
                                                key={preset.value}
                                                onClick={() => setHeroImagePosition(preset.value)}
                                                className={`py-1.5 rounded-lg text-xs font-medium transition-all ${heroImagePosition === preset.value
                                                    ? "bg-amber-500 text-slate-900"
                                                    : "bg-slate-700/50 text-slate-300 hover:bg-slate-600"
                                                    }`}
                                            >
                                                {preset.label}
                                            </button>
                                        ))}
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

                        {/* Agent & Realtor Info */}
                        <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 backdrop-blur-sm">
                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                <div className="p-1.5 bg-amber-500/10 rounded-lg">
                                    <UserCircle className="w-4 h-4 text-amber-500" />
                                </div>
                                Co-Branding Details
                            </h3>

                            <div className="space-y-6">
                                {/* Listing Agent */}
                                <div className="space-y-3">
                                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest border-l-2 border-amber-500 pl-2">Listing Agent</div>
                                    <ImageUploader
                                        label="Agent Headshot"
                                        value={flyerData.realtor.headshot}
                                        onChange={(url) => setFlyerData(prev => ({
                                            ...prev,
                                            realtor: { ...prev.realtor, headshot: url }
                                        }))}
                                        className="dark"
                                    />
                                    <div className="grid gap-2">
                                        <input
                                            type="text"
                                            value={flyerData.realtor.name}
                                            onChange={(e) => setFlyerData(prev => ({
                                                ...prev,
                                                realtor: { ...prev.realtor, name: e.target.value }
                                            }))}
                                            placeholder="Agent Name"
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-xs text-white"
                                        />
                                        <input
                                            type="email"
                                            value={flyerData.realtor.email || ""}
                                            onChange={(e) => setFlyerData(prev => ({
                                                ...prev,
                                                realtor: { ...prev.realtor, email: e.target.value }
                                            }))}
                                            placeholder="Agent Email"
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-xs text-white"
                                        />
                                        <input
                                            type="text"
                                            value={flyerData.realtor.phone}
                                            onChange={(e) => setFlyerData(prev => ({
                                                ...prev,
                                                realtor: { ...prev.realtor, phone: e.target.value }
                                            }))}
                                            placeholder="Agent Phone"
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-xs text-white"
                                        />
                                    </div>
                                </div>

                                {/* Loan Officer */}
                                <div className="space-y-3 pt-4 border-t border-slate-700/50">
                                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest border-l-2 border-emerald-500 pl-2">Loan Officer</div>
                                    <ImageUploader
                                        label="LO Headshot"
                                        value={flyerData.broker.headshot}
                                        onChange={(url) => setFlyerData(prev => ({
                                            ...prev,
                                            broker: { ...prev.broker, headshot: url }
                                        }))}
                                        className="dark"
                                    />
                                    <div className="grid gap-2">
                                        <input
                                            type="text"
                                            value={flyerData.broker.name}
                                            onChange={(e) => setFlyerData(prev => ({
                                                ...prev,
                                                broker: { ...prev.broker, name: e.target.value }
                                            }))}
                                            placeholder="LO Name"
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-xs text-white"
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                value={flyerData.broker.nmls || ""}
                                                onChange={(e) => setFlyerData(prev => ({
                                                    ...prev,
                                                    broker: { ...prev.broker, nmls: e.target.value }
                                                }))}
                                                placeholder="NMLS #"
                                                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-xs text-white"
                                            />
                                            <input
                                                type="text"
                                                value={flyerData.broker.company || ""}
                                                onChange={(e) => setFlyerData(prev => ({
                                                    ...prev,
                                                    broker: { ...prev.broker, company: e.target.value }
                                                }))}
                                                placeholder="Company"
                                                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-xs text-white"
                                            />
                                        </div>
                                        <input
                                            type="email"
                                            value={flyerData.broker.email || ""}
                                            onChange={(e) => setFlyerData(prev => ({
                                                ...prev,
                                                broker: { ...prev.broker, email: e.target.value }
                                            }))}
                                            placeholder="LO Email"
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-xs text-white"
                                        />
                                        <input
                                            type="text"
                                            value={flyerData.broker.phone}
                                            onChange={(e) => setFlyerData(prev => ({
                                                ...prev,
                                                broker: { ...prev.broker, phone: e.target.value }
                                            }))}
                                            placeholder="LO Phone"
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-xs text-white"
                                        />
                                    </div>
                                    <div className="text-[9px] text-slate-500 p-2 bg-slate-900/50 rounded-lg">
                                        NMLS and company name will appear in the footer disclosure
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
                                <button
                                    onClick={handlePrint}
                                    className="flex items-center gap-2 p-3 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg text-left transition-all group col-span-2 border border-emerald-500/20"
                                >
                                    <Printer className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                                    <div className="flex-1">
                                        <div className="text-xs text-white font-bold">Download PDF</div>
                                        <div className="text-[10px] text-slate-400">8.5×11 print-ready flyer</div>
                                    </div>
                                    <Download className="w-4 h-4 text-emerald-500/50" />
                                </button>
                                {formatTabs.filter(t => t.id !== 'flyer').map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleQuickExport(tab.id)}
                                        disabled={isExporting}
                                        className="flex items-center gap-2 p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg text-left transition-all group border border-slate-600/30"
                                    >
                                        <tab.icon className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
                                        <div className="flex-1">
                                            <div className="text-xs text-white font-medium">{tab.label}</div>
                                            <div className="text-[9px] text-slate-500">{tab.desc}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ───────────────────────────────────────────────────────────────
              RIGHT PANEL - Preview (Flexible, grows to fill available space)
              ─────────────────────────────────────────────────────────────── */}
                    <div className="preview-area flex-1 min-w-0 order-1 lg:order-2" style={{ flexBasis: '600px' }}>
                        {/* Format Tabs - Responsive with horizontal scroll on mobile */}
                        <div className="format-tabs flex items-center gap-2 mb-6 pb-4 border-b border-slate-700/50 overflow-x-auto">
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
                                    onClick={() => activeFormat === 'flyer' ? handlePrint() : handleQuickExport(activeFormat)}
                                    disabled={isExporting}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl transition-all"
                                >
                                    {isExporting ? (
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Download className="w-4 h-4" />
                                    )}
                                    {activeFormat === 'flyer' ? 'Download PDF' : 'Download PNG'}
                                </button>
                            </div>
                        </div>

                        {/* Preview Container - Responsive with Auto-Fitting */}
                        <div
                            ref={containerRef}
                            className="bg-slate-800/20 rounded-3xl border border-slate-700/20 backdrop-blur-md shadow-inner flex flex-col p-4 lg:p-8 relative min-h-[400px] lg:min-h-[600px]"
                            style={{
                                height: "calc(100vh - 220px)",
                                maxHeight: "calc(100vh - 160px)"
                            }}
                        >
                            {/* Zoom/Fit Indicator */}
                            <div className="absolute top-3 right-4 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-slate-500 font-mono z-20">
                                AUTO-SCALE
                            </div>

                            <div className="preview-scroll flex-1 w-full overflow-auto flex items-start justify-center" style={{ minWidth: 0 }}>
                                <div className="w-full flex flex-col items-center py-4 lg:py-8" style={{ minWidth: 'fit-content' }}>
                                    {/* Print Flyer */}
                                    {activeFormat === "flyer" && (
                                        <div className="relative group transition-transform duration-500 ease-out" style={{
                                            transformOrigin: "top center",
                                            scale: "var(--preview-scale, 1)"
                                        }}>
                                            <PropertyListingLayout
                                                ref={flyerRef}
                                                data={flyerData}
                                                property={property}
                                                colorTheme={selectedTheme}
                                                heroImagePosition={heroImagePosition}
                                            />
                                            {/* Resolution Guard Mask */}
                                            <div className="absolute inset-0 pointer-events-none ring-1 ring-white/10 rounded-sm" />
                                        </div>
                                    )}

                                    {/* Instagram Story */}
                                    {activeFormat === "instagram" && (
                                        <div className="relative group transition-transform duration-500 ease-out" style={{
                                            transformOrigin: "top center",
                                            scale: "var(--preview-scale, 1)"
                                        }}>
                                            <InstagramStoryBanner
                                                ref={instagramRef}
                                                data={flyerData}
                                                property={property}
                                                colorTheme={selectedTheme}
                                            />
                                        </div>
                                    )}

                                    {/* Facebook & LinkedIn */}
                                    {(activeFormat === "facebook" || activeFormat === "linkedin") && (
                                        <div className="relative group transition-transform duration-500 ease-out" style={{
                                            transformOrigin: "top center",
                                            scale: "var(--preview-scale, 1)"
                                        }}>
                                            {activeFormat === "facebook" ? (
                                                <FacebookBanner
                                                    ref={facebookRef}
                                                    data={flyerData}
                                                    property={property}
                                                    colorTheme={selectedTheme}
                                                />
                                            ) : (
                                                <LinkedInBanner
                                                    ref={linkedinRef}
                                                    data={flyerData}
                                                    property={property}
                                                    colorTheme={selectedTheme}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════
          EXPORT MODAL
          ═══════════════════════════════════════════════════════════════════ */}
            {showExport && (
                <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300" onClick={() => setShowExport(false)}>
                    <div className="bg-slate-900 rounded-[32px] max-w-2xl w-full border border-white/10 shadow-[0_32px_128px_rgba(0,0,0,0.8)] relative overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                        {/* Abstract Background Decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />

                        <div className="flex items-center justify-between p-8 pb-6 relative flex-shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                                    <Sparkles className="w-6 h-6 text-slate-950" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white tracking-tight">Marketing Suite</h3>
                                    <p className="text-sm text-slate-400 font-medium">Export high-fidelity assets for listings</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowExport(false)}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5 active:scale-95"
                            >
                                <span className="text-2xl font-light">×</span>
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1 px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {formatTabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        handleQuickExport(tab.id);
                                        setShowExport(false);
                                    }}
                                    className="group relative flex flex-col p-5 bg-white/5 hover:bg-white/10 rounded-[24px] border border-white/5 hover:border-amber-500/30 transition-all text-left overflow-hidden"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="p-2.5 bg-slate-800 rounded-xl group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-300">
                                            <tab.icon className="w-5 h-5" />
                                        </div>
                                        <div className="px-2 py-0.5 bg-white/5 rounded-md text-[9px] font-mono text-slate-500 uppercase tracking-widest">{tab.size}</div>
                                    </div>
                                    <div className="text-white font-bold text-sm mb-1">{tab.label}</div>
                                    <div className="text-slate-400 text-xs font-medium opacity-60">High-Res PNG • 300 DPI</div>
                                    <Download className="absolute bottom-4 right-4 w-4 h-4 text-amber-500 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all" />
                                </button>
                            ))}

                            {/* Special Formats */}
                            <button className="flex flex-col p-5 bg-white/[0.02] rounded-[24px] border border-white/5 opacity-50 cursor-not-allowed text-left">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2.5 bg-slate-800 rounded-xl">
                                        <Printer className="w-5 h-5 text-slate-500" />
                                    </div>
                                    <div className="px-2 py-0.5 bg-white/5 rounded-md text-[9px] font-mono text-slate-600 uppercase tracking-widest italic">Coming Soon</div>
                                </div>
                                <div className="text-slate-500 font-bold text-sm mb-1">Print PDF</div>
                                <div className="text-slate-600 text-xs font-medium">Full Vector CMYK</div>
                            </button>
                            <button className="flex flex-col p-5 bg-white/[0.02] rounded-[24px] border border-white/5 opacity-50 cursor-not-allowed text-left">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2.5 bg-slate-800 rounded-xl">
                                        <Mail className="w-5 h-5 text-slate-500" />
                                    </div>
                                    <div className="px-2 py-0.5 bg-white/5 rounded-md text-[9px] font-mono text-slate-600 uppercase tracking-widest italic">Coming Soon</div>
                                </div>
                                <div className="text-slate-500 font-bold text-sm mb-1">Email HTML</div>
                                <div className="text-slate-600 text-xs font-medium">Responsive Layout</div>
                            </button>
                        </div>
                        </div>

                        <div className="p-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0">
                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-[0.2em]">Ready for distribution</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowExport(false)}
                                    className="px-6 py-2 rounded-full text-slate-400 hover:text-white text-xs font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button className="px-8 py-2 bg-white text-slate-950 rounded-full text-xs font-black uppercase tracking-widest hover:bg-amber-500 transition-all active:scale-95 shadow-xl shadow-white/5">
                                    One-Click Export All
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Live Rate Refresher - Floating button */}
            <LiveRateRefresher
                data={flyerData}
                onRatesUpdated={(newRates) => {
                    setFlyerData(prev => ({ ...prev, rates: newRates }));
                }}
                shareUrl={`${window.location.origin}/builder`}
            />
        </div>
    );
}
