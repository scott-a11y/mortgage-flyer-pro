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
    DollarSign
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mapleValleyProperty } from "@/data/mapleValleyProperty";
import { BuyerExperience } from "@/types/property";

export default function BuyerExperienceTour() {
    // Demo data - in a real app this would be fetched via slug
    const experience: BuyerExperience = {
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
        strategyType: "wealth-builder"
    };

    return (
        <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-purple-500/30 pb-20 overflow-x-hidden">
            {/* Header Hero */}
            <div className="relative h-[45vh] lg:h-[60vh] overflow-hidden">
                <img 
                    src={experience.listing.images.hero} 
                    alt="Property" 
                    className="w-full h-full object-cover scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
                
                <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
                    <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Live Spotlight</span>
                    </div>
                    <Button size="icon" variant="ghost" className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white">
                        <Share2 className="w-4 h-4" />
                    </Button>
                </div>

                <div className="absolute bottom-10 left-6 right-6 z-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2 text-center"
                    >
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
                                            key={idx} 
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
                                                <button className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-500 hover:text-white hover:border-purple-500/50 transition-all active:scale-90">
                                                    <Sparkles className="w-3 h-3" />
                                                    Insightful
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Section: Live Strategy Matrix */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-emerald-400" />
                        <h2 className="text-xl font-bold text-white tracking-tight">Strategy Matrix</h2>
                    </div>
                    
                    <Card className="p-8 bg-gradient-to-br from-emerald-500/10 to-blue-500/5 border-white/10 backdrop-blur-3xl rounded-[2rem] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 uppercase tracking-widest text-[9px] font-black">
                                Live Analysis
                            </Badge>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Recommended Program</p>
                                <h3 className="text-2xl font-black text-white tracking-tight">30-Year Fixed Strategy</h3>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Est. Payment</p>
                                    <p className="text-2xl font-black text-emerald-400 tracking-tighter">$4,124<span className="text-xs ml-1 opacity-60">/mo</span></p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Today's Rate</p>
                                    <p className="text-2xl font-black text-white tracking-tighter">6.125<span className="text-xs ml-1 opacity-60">%</span></p>
                                </div>
                            </div>
                            
                            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                                <p className="text-xs text-slate-400 font-medium italic">"Based on your 20% down goal discussed on Feb 12th."</p>
                                <Button size="sm" variant="ghost" className="text-xs text-emerald-400 hover:text-emerald-300">
                                    Adjust Math
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
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{gem.category}</p>
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

                {/* CTA Action Bar */}
                <div className="pt-8 flex flex-col gap-4 text-center">
                    <div className="p-6 rounded-[2rem] bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-xl shadow-purple-500/20 group cursor-pointer active:scale-95 transition-all">
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">Secure Financing</p>
                                <p className="text-2xl font-black tracking-tighter">View Your Rate Insight</p>
                            </div>
                            <ArrowRight className="w-8 h-8 opacity-40 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0" />
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                        Powered by IA Loans x High-Fidelity Marketing
                    </p>
                </div>
            </div>

            {/* Float Navigation */}
            <div className="fixed bottom-6 left-6 right-6 z-50">
                <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-full p-2 flex items-center justify-around shadow-2xl ring-1 ring-white/10">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                        <Calendar className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                        <DollarSign className="w-5 h-5" />
                    </Button>
                    <Button className="bg-white text-black font-black uppercase tracking-widest text-[10px] px-6 rounded-full h-10 shadow-lg active:scale-95 transition-all">
                        Schedule Tour
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                        <Smartphone className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
