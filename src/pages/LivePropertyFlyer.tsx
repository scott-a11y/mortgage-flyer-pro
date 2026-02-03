import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PropertyListingLayout } from "@/components/flyer/layouts/PropertyListingLayout";
import { mapleValleyProperty, celesteZarlingFlyerData } from "@/data/mapleValleyProperty";
import { Loader2, ArrowLeft, Share2, Printer, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function LivePropertyFlyer() {
    const { slug } = useParams<{ slug: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [property, setProperty] = useState(mapleValleyProperty);
    const [flyerData, setFlyerData] = useState(celesteZarlingFlyerData);

    useEffect(() => {
        // Try to load synced data from builder first
        const savedData = localStorage.getItem('property_preview_data');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.property) setProperty(parsed.property);
                if (parsed.flyerData) setFlyerData(parsed.flyerData);
                console.log("Synced live data loaded from storage");
            } catch (e) {
                console.error("Sync data parse error:", e);
            }
        }

        // Simulate loading
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: property.features.headline,
                    text: `Check out this beautiful property at ${property.specs.address}`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log("Share failed:", err);
            }
        } else {
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
        }
    };

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
                    <Link to="/property/maple-valley">
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
            </main>

            {/* CONTACT FOOTER (MOBILE OPTIMIZED) */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-white/10 p-4 pb-safe flex items-center justify-around sm:hidden backdrop-blur-xl">
                <button className="flex flex-col items-center gap-1 group">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-active:bg-amber-500 group-active:text-slate-950 transition-colors shadow-lg shadow-black/40">
                        <Phone className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Call</span>
                </button>
                <button className="flex flex-col items-center gap-1 group">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-active:bg-green-500 group-active:text-white transition-colors shadow-lg shadow-black/40">
                        <MessageCircle className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Text</span>
                </button>
                <button onClick={handleShare} className="flex flex-col items-center gap-1 group">
                    <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <Share2 className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">Share</span>
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
