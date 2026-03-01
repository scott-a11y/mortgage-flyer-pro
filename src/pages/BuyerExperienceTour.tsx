import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
    MapPin, 
    Coffee, 
    Sparkles, 
    MessageSquare, 
    CheckCircle2, 
    Home, 
    Info, 
    ArrowRight,
    Smartphone,
    Share2,
    Calendar,
    DollarSign,
    ArrowLeft,
    Edit3,
    ThumbsUp,
    ShieldCheck,
    Play,
    Pause,
    Activity
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { mapleValleyProperty } from "@/data/mapleValleyProperty";
import { BuyerExperience, calculateTotalMonthlyPayment, formatCurrency } from "@/types/property";
import { trackFlyerView } from "@/lib/services/flyerService";

const STORAGE_KEY = "buyer-experience-draft";

export default function BuyerExperienceTour() {
    const navigate = useNavigate();
    const [insightReactions, setInsightReactions] = useState<Record<string, boolean>>({});
    const [showScheduleModal, setShowScheduleModal] = useState(false);

    // Load from localStorage if available (persisted from editor)
    const [experience, setExperience] = useState<BuyerExperience>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) return JSON.parse(saved);
        } catch {}
        return {
            id: "exp_1",
            listing: mapleValleyProperty,
            agentTake: "This home perfectly balances modern luxury with suburban tranquility. The open-concept kitchen is truly the heart of the home, ideal for the growing family dynamics we discussed. I especially love how the natural light hits the kitchen island during breakfast time.",
            tourInsights: [
                { id: "1", type: "highlight", category: "kitchen", content: "South-facing windows provide incredible natural light all afternoon." },
                { id: "2", type: "vibe", category: "arrival", content: "The street is exceptionally quiet, perfect for those morning walks or kids playing outside." },
                { id: "3", type: "pro", category: "primary", content: "The primary suite walkthrough closet has much more storage than the photos suggest." }
            ],
            localGems: [
                { name: "Lake Wilderness Park", category: "Nature", note: "Just a 5-minute bike ride away. Best sunset views in the city and great for summer swimming.", distance: "0.8 miles" },
                { name: "Caffe Ladro", category: "Coffee", note: "My favorite local spot for a morning latte. They source their beans sustainably which I know you'll appreciate.", distance: "1.2 miles" }
            ],
            buyerName: "Sarah & Mike",
            strategyType: "wealth-builder",
            isPreApproved: true,
            preApprovalAmount: 750000,
            hasAudioGuide: true
        };
    });

    const [offerPrice, setOfferPrice] = useState(experience.listing.specs.listPrice);
    const [downPaymentPercent, setDownPaymentPercent] = useState(experience.listing.financing?.downPaymentPercent || 20);
    const interestRate = experience.listing.financing?.interestRate || 6.125;

    // Recalculate payment on the fly
    const simulatedFinancing = {
        listPrice: offerPrice,
        downPaymentPercent: downPaymentPercent,
        interestRate: interestRate,
        loanTermYears: 30,
        hoa: experience.listing.specs.hoa || 0
    };
    const payment = calculateTotalMonthlyPayment(simulatedFinancing);
    const cashToClose = offerPrice * (downPaymentPercent / 100);

    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [audioProgress, setAudioProgress] = useState(0);

    // Simulated audio player progress
    useEffect(() => {
        if (!isPlayingAudio) return;
        const interval = setInterval(() => {
            setAudioProgress(p => {
                if (p >= 100) {
                    setIsPlayingAudio(false);
                    return 0;
                }
                return p + 2;
            });
        }, 100);
        return () => clearInterval(interval);
    }, [isPlayingAudio]);

    // High Intent Tracking
    const [hasChangedMath, setHasChangedMath] = useState(false);
    useEffect(() => {
        // Did they stray away from default loaded values?
        if (offerPrice !== experience.listing.specs.listPrice || downPaymentPercent !== (experience.listing.financing?.downPaymentPercent || 20)) {
            setHasChangedMath(true);
        }
    }, [offerPrice, downPaymentPercent, experience.listing.specs.listPrice, experience.listing.financing?.downPaymentPercent]);

    useEffect(() => {
        if (!hasChangedMath) return;
        // Debounce before notifying so we don't spam while they are actively dragging the slider
        const timer = setTimeout(() => {
            toast("Agent Notified of Scenario Update", {
                icon: <Activity className="w-5 h-5 text-emerald-500" />,
                description: "We let your agent know you are running new math.",
                duration: 4000
            });
            setHasChangedMath(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, [hasChangedMath, offerPrice, downPaymentPercent]);

    const handleSoftOffer = () => {
        toast.success("Interest sent to Agent!", {
            description: `We've let your agent know you are exploring ${formatCurrency(offerPrice)} with ${downPaymentPercent}% down.`
        });
    };

    useEffect(() => {
        // Track the view 
        const slug = experience.listing.specs.address.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        trackFlyerView(`tour-${slug}`, document.referrer, navigator.userAgent);
    }, [experience.listing.specs.address]);

    // Issue #9: Share functionality
    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Property Tour: ${experience.listing.specs.address}`,
                    text: `Check out this property in ${experience.listing.specs.city}`,
                    url
                });
            } catch {
                // User cancelled share
            }
        } else {
            await navigator.clipboard?.writeText(url);
            toast.success("Link Copied!", {
                description: "Tour link has been copied to your clipboard."
            });
        }
    };

    // Issue #10: Insightful reactions
    const toggleReaction = (insightId: string) => {
        setInsightReactions(prev => ({
            ...prev,
            [insightId]: !prev[insightId]
        }));
        const wasReacted = insightReactions[insightId];
        if (!wasReacted) {
            toast.success("Marked as insightful!", {
                description: "Your feedback helps agents improve their insights."
            });
        }
    };

    // Issue #6: Schedule tour handler
    const handleScheduleTour = () => {
        setShowScheduleModal(true);
    };

    // Issue #6: Call agent handler
    const handleCallAgent = () => {
        window.location.href = "tel:+13606061106";
    };

    // Issue #7: View rate insight
    const handleViewRates = () => {
        navigate("/rate-engine");
    };

    // Issue #8: Adjust math handler
    const handleAdjustMath = () => {
        navigate("/rate-engine");
    };

    // Issue #6: Financing link handler
    const handleFinancing = () => {
        navigate("/rate-engine");
    };

    return (
        <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-purple-500/30 pb-28 overflow-x-hidden">
            <Helmet><title>Buyer Tour | Mortgage Flyer Pro</title></Helmet>
            {/* Header Hero */}
            <div className="relative h-[45vh] lg:h-[60vh] overflow-hidden">
                <img 
                    src={experience.listing.images.hero} 
                    alt="Property" 
                    className="w-full h-full object-cover scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
                
                <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
                    <div className="flex items-center gap-3">
                        {/* Issue #11: Back to editor button */}
                        <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => navigate("/dashboard")}
                            className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white/20"
                            aria-label="Back to dashboard"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">Live Spotlight</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Issue #11: Edit button */}
                        <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => navigate("/buyer-agent")}
                            className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white/20"
                            aria-label="Edit tour"
                        >
                            <Edit3 className="w-4 h-4" />
                        </Button>
                        {/* Issue #9: Share button */}
                        <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={handleShare}
                            className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white/20"
                            aria-label="Share this tour"
                        >
                            <Share2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="absolute bottom-10 left-6 right-6 z-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 text-center"
                    >
                        {experience.isPreApproved && (
                            <div className="flex justify-center mb-2">
                                <div className="px-4 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                    <span className="text-[10px] font-black text-emerald-100 uppercase tracking-widest">
                                        Verified Buyer · Pre-Approved for {formatCurrency(experience.preApprovalAmount || experience.listing.specs.listPrice)}
                                    </span>
                                </div>
                            </div>
                        )}
                        <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tighter drop-shadow-2xl">
                            {experience.listing.specs.address}
                        </h1>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                            <MapPin className="w-3.5 h-3.5" />
                            {experience.listing.specs.city}, {experience.listing.specs.state}
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-xl mx-auto px-6 -mt-4 relative z-30 space-y-12">
                {/* Agent Introduction Block */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="p-8 bg-white/[0.03] border-white/10 backdrop-blur-2xl rounded-3xl overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[60px] rounded-full group-hover:bg-purple-500/20 transition-colors duration-500" />
                        
                        <div className="flex flex-col gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                                        <Sparkles className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Premium Insight for</p>
                                        <p className="text-sm font-bold text-white">{experience.buyerName}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5 text-blue-400" />
                                        Agent's Take
                                    </h2>
                                    
                                    {experience.hasAudioGuide && (
                                        <div className="bg-black/40 rounded-full p-2 flex items-center gap-4 border border-white/5 my-2">
                                            <button 
                                                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                                                className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-all flex-shrink-0 shadow-lg"
                                            >
                                                {isPlayingAudio ? <Pause className="w-4 h-4 text-white fill-white" /> : <Play className="w-4 h-4 text-white fill-white ml-0.5" />}
                                            </button>
                                            <div className="flex-1 pr-4">
                                                <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1.5 uppercase tracking-widest">
                                                    <span>Agent Audio Note</span>
                                                    <span className="text-blue-400">{isPlayingAudio ? "Playing" : "0:32"}</span>
                                                </div>
                                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-blue-500 transition-all duration-100 ease-linear" 
                                                        style={{ width: `${audioProgress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <p className="text-slate-400 leading-relaxed font-medium">
                                        "{experience.agentTake}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Section: Live Stats Header */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Beds', value: experience.listing.specs.bedrooms },
                        { label: 'Baths', value: experience.listing.specs.bathrooms },
                        { label: 'Sq Ft', value: experience.listing.specs.squareFootage.toLocaleString() }
                    ].map((stat, i) => (
                        <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
                            <p className="text-lg font-bold text-white tracking-tight">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Section: Specific Tour Insights */}
                <div className="space-y-12">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-px flex-1 bg-white/10" />
                        <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">The Spatial Tour</h2>
                        <div className="h-px flex-1 bg-white/10" />
                    </div>

                    {/* Group by category */}
                    {['arrival', 'kitchen', 'primary', 'outdoors', 'general'].map((cat) => {
                        const catInsights = experience.tourInsights.filter(i => i.category === cat);
                        if (catInsights.length === 0) return null;
                        
                        return (
                            <div key={cat} className="space-y-6">
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                    {cat}
                                </h3>
                                <div className="space-y-4">
                                    {catInsights.map((insight, idx) => (
                                        <motion.div 
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            key={insight.id} 
                                            className="flex gap-4 group"
                                        >
                                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${
                                                insight.type === 'highlight' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' :
                                                insight.type === 'pro' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' :
                                                insight.type === 'con' ? 'bg-red-500/10 border-red-500/30 text-red-500' :
                                                'bg-blue-500/10 border-blue-500/30 text-blue-500'
                                            }`}>
                                                {insight.type === 'highlight' && <Sparkles className="w-4 h-4" />}
                                                {insight.type === 'pro' && <CheckCircle2 className="w-4 h-4" />}
                                                {insight.type === 'con' && <Info className="w-4 h-4" />}
                                                {insight.type === 'vibe' && <Home className="w-4 h-4" />}
                                            </div>
                                            <div className="flex-1 pb-4 border-b border-white/5 flex justify-between items-start">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">{insight.type}</p>
                                                    <p className="text-white font-medium group-hover:text-slate-200 transition-colors">
                                                        {insight.content}
                                                    </p>
                                                </div>
                                                {/* Issue #10: Functional insightful button */}
                                                <button 
                                                    onClick={() => toggleReaction(insight.id)}
                                                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[10px] font-bold transition-all active:scale-90 ${
                                                        insightReactions[insight.id]
                                                            ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
                                                            : "bg-white/5 border-white/10 text-slate-500 hover:text-white hover:border-purple-500/50"
                                                    }`}
                                                    aria-label={`Mark insight as ${insightReactions[insight.id] ? 'not insightful' : 'insightful'}`}
                                                >
                                                    {insightReactions[insight.id] ? (
                                                        <ThumbsUp className="w-3 h-3 fill-current" />
                                                    ) : (
                                                        <Sparkles className="w-3 h-3" />
                                                    )}
                                                    {insightReactions[insight.id] ? "Insightful!" : "Insightful"}
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Section: Live Strategy Matrix -> Interactive Builder */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-emerald-400" />
                        <h2 className="text-xl font-bold text-white tracking-tight">Interactive Offer Scenario</h2>
                    </div>
                    
                    <Card className="p-8 bg-gradient-to-br from-emerald-500/10 to-blue-500/5 border-white/10 backdrop-blur-3xl rounded-[2rem] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 uppercase tracking-widest text-[9px] font-black">
                                Live Simulator
                            </Badge>
                        </div>
                        
                        <div className="space-y-8">
                            <div className="pr-16">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Build Your Offer</p>
                                <h3 className="text-2xl font-black text-white tracking-tight">
                                    See your real math instantly.
                                </h3>
                            </div>
                            
                            {/* Sliders */}
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Offer Price</label>
                                        <p className="text-xl font-black text-white">{formatCurrency(offerPrice)}</p>
                                    </div>
                                    <input 
                                        type="range" 
                                        min={experience.listing.specs.listPrice * 0.8} 
                                        max={experience.listing.specs.listPrice * 1.2} 
                                        step="1000"
                                        value={offerPrice}
                                        onChange={(e) => setOfferPrice(Number(e.target.value))}
                                        className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                    <div className="flex justify-between mt-1 text-[10px] text-slate-500 font-medium">
                                        <span>{formatCurrency(experience.listing.specs.listPrice * 0.8)}</span>
                                        <span>{formatCurrency(experience.listing.specs.listPrice * 1.2)}</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Down Payment</label>
                                        <div className="text-right">
                                            <p className="text-xl font-black text-white">{downPaymentPercent}%</p>
                                            <p className="text-[10px] text-slate-400 font-bold">{formatCurrency(cashToClose)} cash required</p>
                                        </div>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="50" 
                                        step="5"
                                        value={downPaymentPercent}
                                        onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                                        className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 p-4 bg-black/40 rounded-xl border border-white/5">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Est. Payment</p>
                                    <p className="text-2xl font-black text-emerald-400 tracking-tighter">{formatCurrency(payment.total)}<span className="text-xs ml-1 opacity-60 text-slate-400">/mo</span></p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Today's Rate</p>
                                    <p className="text-2xl font-black text-white tracking-tighter">{interestRate}<span className="text-xs ml-1 opacity-60 text-slate-400">%</span></p>
                                </div>
                            </div>
                            
                            <div className="pt-4 border-t border-white/10">
                                <Button 
                                    onClick={handleSoftOffer}
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black h-12 uppercase tracking-widest text-xs"
                                >
                                    Share Idea With Agent
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Section: Local Vibe / Gems */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-amber-500" />
                        Living Here
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        {experience.localGems.map((gem, idx) => (
                            <Card key={idx} className="p-6 bg-white/[0.02] border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all group overflow-hidden relative">
                                <div className="relative z-10 flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                            {gem.category === 'Coffee' ? <Coffee className="w-4 h-4 text-amber-500" /> : <MapPin className="w-4 h-4 text-blue-400" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white uppercase tracking-tight">{gem.name}</p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{gem.category}{gem.distance ? ` · ${gem.distance}` : ''}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        {gem.note}
                                    </p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Issue #7: CTA Action Bar — wired up */}
                <div className="pt-8 flex flex-col gap-4 text-center">
                    <button 
                        onClick={handleViewRates}
                        className="p-6 rounded-[2rem] bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-xl shadow-purple-500/20 group cursor-pointer active:scale-95 transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">Secure Financing</p>
                                <p className="text-2xl font-black tracking-tighter">View Your Rate Insight</p>
                            </div>
                            <ArrowRight className="w-8 h-8 opacity-40 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0" />
                        </div>
                    </button>
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                        Powered by IA Loans x High-Fidelity Marketing
                    </p>
                </div>
            </div>

            {/* Issue #6: Functional Float Navigation */}
            <div className="fixed bottom-6 left-6 right-6 z-50">
                <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-full p-2 flex items-center justify-around shadow-2xl ring-1 ring-white/10 max-w-xl mx-auto">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white hover:bg-white/10"
                        onClick={handleScheduleTour}
                        aria-label="Schedule a tour"
                    >
                        <Calendar className="w-5 h-5" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white hover:bg-white/10"
                        onClick={handleFinancing}
                        aria-label="View financing options"
                    >
                        <DollarSign className="w-5 h-5" />
                    </Button>
                    <Button 
                        className="bg-white text-black font-black uppercase tracking-widest text-[10px] px-6 rounded-full h-10 shadow-lg active:scale-95 transition-all"
                        onClick={handleScheduleTour}
                    >
                        Schedule Tour
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white hover:bg-white/10"
                        onClick={handleCallAgent}
                        aria-label="Call agent"
                    >
                        <Smartphone className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Schedule Tour Modal */}
            {showScheduleModal && (
                <div 
                    className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" 
                    onClick={() => setShowScheduleModal(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Card className="bg-[#0a0a0b] border-white/10 p-8 rounded-3xl space-y-6">
                            <div className="text-center space-y-2">
                                <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 mb-4">
                                    <Calendar className="w-7 h-7 text-purple-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Schedule a Tour</h3>
                                <p className="text-sm text-slate-500">
                                    Contact Scott to arrange a private showing of {experience.listing.specs.address}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <a 
                                    href="tel:+13606061106"
                                    className="w-full flex items-center gap-3 p-4 border border-white/10 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-all"
                                >
                                    <Smartphone className="w-5 h-5 text-emerald-400" />
                                    <div>
                                        <p className="text-sm font-bold text-white">Call Now</p>
                                        <p className="text-xs text-slate-500">(360) 606-1106</p>
                                    </div>
                                </a>
                                <a 
                                    href="mailto:scott@ialoans.com?subject=Tour Request: ${experience.listing.specs.address}"
                                    className="w-full flex items-center gap-3 p-4 border border-white/10 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-all"
                                >
                                    <MessageSquare className="w-5 h-5 text-blue-400" />
                                    <div>
                                        <p className="text-sm font-bold text-white">Send Email</p>
                                        <p className="text-xs text-slate-500">scott@ialoans.com</p>
                                    </div>
                                </a>
                            </div>

                            <Button 
                                variant="outline" 
                                className="w-full border-white/10 text-white hover:bg-white/5 rounded-xl"
                                onClick={() => setShowScheduleModal(false)}
                            >
                                Close
                            </Button>
                        </Card>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
