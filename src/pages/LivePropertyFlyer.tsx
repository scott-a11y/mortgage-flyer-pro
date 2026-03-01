import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PropertyListingLayout } from "@/components/flyer/layouts/PropertyListingLayout";
import { getPropertyBySlug } from "@/data/propertyData";
import { trackFlyerView } from "@/lib/services/flyerService";
import { Loader2, ArrowLeft, Share2, Printer, MessageCircle, Phone, TrendingUp, TrendingDown, DollarSign, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { formatCurrency, calculateTotalMonthlyPayment } from "@/types/property";

export default function LivePropertyFlyer() {
    const { slug } = useParams<{ slug: string }>();
    const [isLoading, setIsLoading] = useState(true);

    // Initial data from slug
    const slugData = getPropertyBySlug(slug);
    const [property, setProperty] = useState(slugData.property);
    const [flyerData, setFlyerData] = useState(slugData.flyerData);

    // Rental scenario state — user can switch between and adjust
    const scenarios = property.rentalIncome || [];
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const activeScenario = scenarios[scenarioIndex] || scenarios[0];
    const [rentAmount, setRentAmount] = useState(
        activeScenario
            ? Math.round((activeScenario.rentLow + activeScenario.rentHigh) / 2)
            : 0
    );

    // When scenario changes, reset slider to that scenario's midpoint
    const switchScenario = (idx: number) => {
        setScenarioIndex(idx);
        const s = scenarios[idx];
        if (s) setRentAmount(Math.round((s.rentLow + s.rentHigh) / 2));
    };

    useEffect(() => {
        // Try to load synced data from builder first
        const savedData = localStorage.getItem('property_preview_data');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                // Only sync if the address matches (prevents cross-property mess)
                if (parsed.property?.specs?.address === property.specs.address) {
                    if (parsed.property) setProperty(parsed.property);
                    if (parsed.flyerData) setFlyerData(parsed.flyerData);
                    console.log("Synced live data loaded from storage");
                } else {
                    console.log("Storage address mismatch - sticking with default slug data");
                }
            } catch (e) {
                console.error("Sync data parse error:", e);
            }
        }

        // Simulate loading
        const timer = setTimeout(() => setIsLoading(false), 800);

        // Track view
        const currentSlug = slug || 'maple-valley';
        trackFlyerView(currentSlug, document.referrer, navigator.userAgent);

        return () => clearTimeout(timer);
    }, [slug]);

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: property.features.headline,
                    text: `Check out this beautiful property at ${property.specs.address}`,
                    url,
                });
                toast.success("Shared successfully!");
            } catch (err: unknown) {
                // User cancelled or share failed — fall back to clipboard
                if (err instanceof Error && err.name !== 'AbortError') {
                    console.log("Share failed, copying to clipboard");
                }
                try {
                    await navigator.clipboard.writeText(url);
                    toast.success("Link copied to clipboard!");
                } catch {
                    toast.info(`Share this link: ${url}`);
                }
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                toast.success("Link copied to clipboard!");
            } catch {
                toast.info(`Share this link: ${url}`);
            }
        }
    };

    // Calculate mortgage payment for cash flow analysis
    const financing = property.financing || {
        listPrice: property.specs.listPrice,
        downPaymentPercent: 5,
        interestRate: 6.5,
        loanTermYears: 30,
        hoa: property.specs.hoa || 0
    };
    const payment = calculateTotalMonthlyPayment(financing);
    const netCashFlow = rentAmount - payment.total;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-sans">
                <div className="text-center space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin text-amber-500 mx-auto" />
                    <p className="text-sm font-medium text-slate-400 animate-pulse">Loading Web Experience...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-amber-500/30">
            <Helmet>
                <title>{property.features.headline} | {property.specs.address}</title>
                <meta name="description" content={property.features.subheadline} />
            </Helmet>

            {/* FLOATING ACTION BAR */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center justify-between px-6 shadow-2xl">
                <div className="flex items-center gap-3">
                    <Link to="/dashboard">
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-white/5 gap-2 h-9">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Back</span>
                        </Button>
                    </Link>
                    <div className="w-px h-6 bg-white/10 hidden sm:block" />
                    <div className="hidden sm:block">
                        <h1 className="text-white font-bold text-sm truncate max-w-[200px]">{property.specs.address}</h1>
                        <p className="text-[10px] text-amber-500 uppercase tracking-widest font-black">Live Web Version</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button onClick={handleShare} size="sm" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold h-9 gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all">
                        <Share2 className="w-4 h-4" />
                        Share
                    </Button>
                    <div className="flex gap-1 border-l border-white/10 pl-2 ml-1">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white h-9 w-9">
                            <Printer className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 pt-24 pb-32 px-4 flex flex-col items-center overflow-auto custom-scrollbar">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative"
                >
                    {/* Background Glow */}
                    <div className="absolute -inset-20 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

                    {/* The Flyer Content */}
                    <div className="relative shadow-[0_50px_100px_rgba(0,0,0,0.6)] rounded-sm overflow-hidden scale-[0.6] sm:scale-75 md:scale-90 lg:scale-100 origin-top">
                        <PropertyListingLayout
                            data={flyerData}
                            property={property}
                            colorTheme={flyerData.colorTheme}
                        />
                    </div>
                </motion.div>

                {/* ═══════════════════════════════════════════════════════
                    RENTAL CASH FLOW CALCULATOR — Interactive, below flyer
                    Supports multiple scenarios (Studio, 1-Bed, Both Units)
                ═══════════════════════════════════════════════════════ */}
                {scenarios.length > 0 && activeScenario && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                        className="w-full max-w-[612px] mt-8 lg:mt-12"
                    >
                        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                        <DollarSign className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-sm">
                                            Rental Cash Flow Calculator
                                        </h3>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                                            Investment Analysis · No Rental Cap
                                        </p>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                                    netCashFlow >= 0
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : 'bg-amber-500/20 text-amber-400'
                                }`}>
                                    {netCashFlow >= 0 ? (
                                        <TrendingUp className="w-3.5 h-3.5" />
                                    ) : (
                                        <TrendingDown className="w-3.5 h-3.5" />
                                    )}
                                    {netCashFlow >= 0 ? 'Cash Flow Positive' : 'Subsidized Investment'}
                                </div>
                            </div>

                            {/* Scenario Tabs */}
                            {scenarios.length > 1 && (
                                <div className="px-6 pt-4 pb-1">
                                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">
                                        Choose Rental Scenario
                                    </div>
                                    <div className="flex gap-2">
                                        {scenarios.map((s, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => switchScenario(idx)}
                                                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                                                    scenarioIndex === idx
                                                        ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-105'
                                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                                                }`}
                                            >
                                                {s.label || `Scenario ${idx + 1}`}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Rent Slider */}
                            <div className="px-6 py-5">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        {activeScenario.label || 'Estimated'} — Monthly Rent
                                    </label>
                                    <div className="flex items-center gap-1">
                                        <span className="text-2xl font-black text-white tabular-nums">
                                            {formatCurrency(rentAmount)}
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-bold">/mo</span>
                                    </div>
                                </div>

                                {/* Slider */}
                                <input
                                    type="range"
                                    min={Math.max(0, (activeScenario.rentLow || 800) - 400)}
                                    max={(activeScenario.rentHigh || 1200) + 800}
                                    step={25}
                                    value={rentAmount}
                                    onChange={(e) => setRentAmount(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-amber-500
                                        [&::-webkit-slider-thumb]:appearance-none
                                        [&::-webkit-slider-thumb]:w-5
                                        [&::-webkit-slider-thumb]:h-5
                                        [&::-webkit-slider-thumb]:rounded-full
                                        [&::-webkit-slider-thumb]:bg-amber-500
                                        [&::-webkit-slider-thumb]:shadow-lg
                                        [&::-webkit-slider-thumb]:shadow-amber-500/30
                                        [&::-webkit-slider-thumb]:cursor-pointer
                                        [&::-webkit-slider-thumb]:border-2
                                        [&::-webkit-slider-thumb]:border-white
                                    "
                                />

                                {/* Range labels */}
                                <div className="flex justify-between mt-1.5">
                                    <span className="text-[10px] text-slate-600 font-medium">
                                        {formatCurrency(Math.max(0, (activeScenario.rentLow || 800) - 400))}
                                    </span>
                                    <span className="text-[10px] text-slate-600 font-medium">
                                        Market range: {formatCurrency(activeScenario.rentLow)}–{formatCurrency(activeScenario.rentHigh)}
                                    </span>
                                    <span className="text-[10px] text-slate-600 font-medium">
                                        {formatCurrency((activeScenario.rentHigh || 1200) + 800)}
                                    </span>
                                </div>
                            </div>

                            {/* Breakdown */}
                            <div className="px-6 pb-5">
                                <div className="bg-slate-800/50 rounded-xl p-4 space-y-2.5 border border-white/5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-slate-400 font-medium">Gross Rental Income</span>
                                        <span className="text-sm font-bold text-white tabular-nums">
                                            +{formatCurrency(rentAmount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-slate-400 font-medium">Principal & Interest</span>
                                        <span className="text-sm font-bold text-white tabular-nums">
                                            –{formatCurrency(payment.principalInterest)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-slate-400 font-medium">Property Tax</span>
                                        <span className="text-sm font-bold text-white tabular-nums">
                                            –{formatCurrency(payment.propertyTax)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-slate-400 font-medium">Insurance</span>
                                        <span className="text-sm font-bold text-white tabular-nums">
                                            –{formatCurrency(payment.insurance)}
                                        </span>
                                    </div>
                                    {payment.hoa > 0 && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-slate-400 font-medium">HOA Dues</span>
                                            <span className="text-sm font-bold text-white tabular-nums">
                                                –{formatCurrency(payment.hoa)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Net Cash Flow — the hero number */}
                                    <div className="border-t border-white/10 pt-3 mt-1">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-black text-white uppercase tracking-wide">
                                                Net Monthly Cash Flow
                                            </span>
                                            <span className={`text-xl font-black tabular-nums ${
                                                netCashFlow >= 0 ? 'text-emerald-400' : 'text-red-400'
                                            }`}>
                                                {netCashFlow >= 0 ? '+' : ''}{formatCurrency(netCashFlow)}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                                            Based on {financing.downPaymentPercent}% down at {financing.interestRate}% rate · {financing.loanTermYears}-year fixed ·
                                            Does not include vacancy, maintenance, or property management costs
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
                {/* ═══════════════════════════════════════════════════════
                    "I'M INTERESTED" CTA — Links to lead capture page
                ═══════════════════════════════════════════════════════ */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                    className="w-full max-w-[612px] mt-8 lg:mt-12 pb-8"
                >
                    <Link to={`/lead/${slug || 'maple-valley'}`}>
                        <div className="group p-6 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 shadow-xl shadow-amber-500/20 cursor-pointer active:scale-[0.98] transition-all hover:shadow-amber-500/40">
                            <div className="flex items-center justify-between">
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-1">Next Step</p>
                                    <p className="text-2xl font-black tracking-tighter">I'm Interested — Tell Me More</p>
                                    <p className="text-xs font-bold opacity-70 mt-1">Get pre-approved or schedule a tour</p>
                                </div>
                                <ArrowLeft className="w-8 h-8 opacity-40 group-hover:opacity-100 transition-all transform rotate-180 translate-x-[10px] group-hover:translate-x-0" />
                            </div>
                        </div>
                    </Link>
                </motion.div>
            </main>

            {/* CONTACT FOOTER (MOBILE OPTIMIZED) */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-white/10 p-4 pb-safe flex items-center justify-around sm:hidden backdrop-blur-xl">
                <a href={`tel:${flyerData.realtor?.phone || flyerData.broker?.phone || ''}`} className="flex flex-col items-center gap-1 group">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-active:bg-amber-500 group-active:text-slate-950 transition-colors shadow-lg shadow-black/40">
                        <Phone className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Call</span>
                </a>
                <a href={`sms:${flyerData.realtor?.phone || flyerData.broker?.phone || ''}`} className="flex flex-col items-center gap-1 group">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-active:bg-green-500 group-active:text-white transition-colors shadow-lg shadow-black/40">
                        <MessageCircle className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Text</span>
                </a>
                <Link to={`/lead/${slug || 'maple-valley'}`} className="flex flex-col items-center gap-1 group">
                    <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <Send className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">Inquire</span>
                </Link>
                <button onClick={handleShare} className="flex flex-col items-center gap-1 group">
                    <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center group-active:bg-white group-active:text-slate-950 transition-colors shadow-lg shadow-black/40">
                        <Share2 className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Share</span>
                </button>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
            `}} />
        </div>
    );
}
