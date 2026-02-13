import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    Sparkles, 
    ArrowLeft, 
    Home, 
    MapPin, 
    Coffee, 
    MessageSquare, 
    Plus, 
    Trash2, 
    Share2,
    Eye,
    Layout
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { BuyerExperience, TourInsight } from "@/types/property";
import { mapleValleyProperty } from "@/data/mapleValleyProperty";

export default function BuyerAgentToolkit() {
    const navigate = useNavigate();
    const [experience, setExperience] = useState<BuyerExperience>({
        id: "exp_1",
        listing: mapleValleyProperty,
        agentTake: "This home perfectly balances modern luxury with suburban tranquility. The open-concept kitchen is truly the heart of the home, ideal for the growing family dynamics we discussed. I especially love how the natural light hits the kitchen island during breakfast time.",
        tourInsights: [
            { id: "1", type: "highlight", category: "kitchen", content: "South-facing windows provide incredible natural light all afternoon." },
            { id: "2", type: "vibe", category: "arrival", content: "The street is exceptionally quiet, perfect for those morning walks or kids playing outside." }
        ],
        localGems: [
            { name: "Lake Wilderness Park", category: "Nature", note: "Just a 5-minute bike ride away. Best sunset views in the city.", distance: "0.8 miles" },
            { name: "Caffe Ladro", category: "Coffee", note: "My favorite local spot for a morning latte.", distance: "1.2 miles" }
        ],
        buyerName: "Sarah & Mike",
        strategyType: "wealth-builder"
    });

    const addInsight = () => {
        const newInsight: TourInsight = {
            id: Date.now().toString(),
            type: "vibe",
            category: "general",
            content: ""
        };
        setExperience({
            ...experience,
            tourInsights: [...experience.tourInsights, newInsight]
        });
    };

    const removeInsight = (id: string) => {
        setExperience({
            ...experience,
            tourInsights: experience.tourInsights.filter(i => i.id !== id)
        });
    };

    const updateInsight = (id: string, content: string) => {
        setExperience({
            ...experience,
            tourInsights: experience.tourInsights.map(i => i.id === id ? { ...i, content } : i)
        });
    };

    const addGem = () => {
        setExperience({
            ...experience,
            localGems: [...experience.localGems, { name: "", category: "Food", note: "" }]
        });
    };

    const handleShare = () => {
        toast.success("Tour Experience Link Created!", {
            description: "The link has been copied to your clipboard."
        });
    };

    return (
        <div className="min-h-screen bg-[#030304] text-slate-300 font-sans">
            {/* Atmosphere */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] opacity-40" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[150px] opacity-30" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="space-y-4">
                        <button 
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors mb-4"
                        >
                            <ArrowLeft className="w-3 h-3" />
                            Back to Command Center
                        </button>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400">Buyer Experience Studio</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter">
                            Detailing & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Listing Insights</span>
                        </h1>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" className="border-white/10 hover:bg-white/5 gap-2" onClick={() => navigate("/tour-live")}>
                            <Eye className="w-4 h-4" />
                            Preview Live
                        </Button>
                        <Button className="bg-purple-500 hover:bg-purple-600 text-white font-bold gap-2" onClick={handleShare}>
                            <Share2 className="w-4 h-4" />
                            Share Experience
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Core Detailing */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Section: Listing Reference */}
                        <Card className="p-6 bg-white/[0.03] border-white/10 backdrop-blur-xl">
                            <div className="flex items-start gap-4">
                                <div className="w-24 h-24 rounded-xl overflow-hidden ring-1 ring-white/10">
                                    <img src={experience.listing.images.hero} alt="Listing" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Target Property</div>
                                    <h3 className="text-xl font-bold text-white">{experience.listing.specs.address}</h3>
                                    <p className="text-sm text-slate-400">{experience.listing.specs.city}, {experience.listing.specs.state}</p>
                                    <Badge variant="secondary" className="mt-2 bg-white/5 border-white/10 text-slate-400">
                                        MLS #{experience.listing.specs.mlsNumber}
                                    </Badge>
                                </div>
                                <Button size="sm" variant="ghost" className="text-xs text-purple-400 hover:text-purple-300">
                                    Change Listing
                                </Button>
                            </div>
                        </Card>

                        {/* Section: The Agent's Take */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-purple-400" />
                                    <h2 className="text-lg font-bold text-white uppercase tracking-wider">The Agent's Take</h2>
                                </div>
                                <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="text-[10px] font-black uppercase tracking-widest text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 gap-2"
                                    onClick={() => {
                                        const prompt = `Draft a high-fidelity, emotionally resonant agent perspective for a ${experience.listing.specs.bedrooms}BR home in ${experience.listing.specs.city} for buyers named ${experience.buyerName}. Focus on the open-concept flow and the lifestyle of the neighborhood.`;
                                        toast.info("AI Ghost Detailer Engaged", {
                                            description: "Synthesizing property data into a premium perspective..."
                                        });
                                        setTimeout(() => {
                                            setExperience({
                                                ...experience,
                                                agentTake: `This ${experience.listing.specs.bedrooms}-bedroom sanctuary in ${experience.listing.specs.city} is more than a listing; it's a lifestyle upgrade. The flow from the kitchen to the social spaces is exactly what you need for those weekend gatherings. ${experience.buyerName}, I can already see you enjoying the morning light in that breakfast nook while the neighborhood wakes up.`
                                            });
                                            toast.success("Perspective Optimized", {
                                                description: "The Ghost Detailer has refined your take."
                                            });
                                        }, 1500);
                                    }}
                                >
                                    <Sparkles className="w-3 h-3" />
                                    Ghost Detail
                                </Button>
                            </div>
                            <Card className="p-6 bg-white/[0.03] border-white/10 backdrop-blur-xl">
                                <Textarea 
                                    value={experience.agentTake}
                                    onChange={(e) => setExperience({ ...experience, agentTake: e.target.value })}
                                    placeholder="What's your professional perspective on this home for this specific buyer?"
                                    className="bg-transparent border-none p-0 focus-visible:ring-0 text-lg leading-relaxed text-slate-300 resize-none min-h-[120px]"
                                />
                            </Card>
                        </div>

                        {/* Section: Tour Insights */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Layout className="w-5 h-5 text-blue-400" />
                                    <h2 className="text-lg font-bold text-white uppercase tracking-wider">Specific Insights</h2>
                                </div>
                                <Button size="sm" onClick={addInsight} className="bg-white/5 border-white/10 hover:bg-white/10 text-xs">
                                    <Plus className="w-3 h-3 mr-2" />
                                    Add Insight
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {experience.tourInsights.map((insight) => (
                                    <Card key={insight.id} className="p-4 bg-white/[0.02] border-white/5 flex items-start gap-4">
                                        <select 
                                            value={insight.category}
                                            onChange={(e) => setExperience({
                                                ...experience,
                                                tourInsights: experience.tourInsights.map(i => i.id === insight.id ? { ...i, category: e.target.value as any } : i)
                                            })}
                                            className="bg-white/5 border border-white/10 rounded-md text-[10px] uppercase font-bold px-2 py-1 text-slate-400 outline-none focus:border-purple-500 transition-colors"
                                        >
                                            <option value="arrival">Arrival</option>
                                            <option value="kitchen">Kitchen</option>
                                            <option value="primary">Primary</option>
                                            <option value="outdoors">Outdoors</option>
                                            <option value="general">General</option>
                                        </select>
                                        <select 
                                            value={insight.type}
                                            onChange={(e) => setExperience({
                                                ...experience,
                                                tourInsights: experience.tourInsights.map(i => i.id === insight.id ? { ...i, type: e.target.value as any } : i)
                                            })}
                                            className="bg-white/5 border border-white/10 rounded-md text-[10px] uppercase font-bold px-2 py-1 text-slate-400 outline-none focus:border-purple-500 transition-colors"
                                        >
                                            <option value="highlight">Highlight</option>
                                            <option value="vibe">Vibe</option>
                                            <option value="pro">Pro</option>
                                            <option value="con">Con</option>
                                        </select>
                                        <Input 
                                            value={insight.content}
                                            onChange={(e) => updateInsight(insight.id, e.target.value)}
                                            placeholder="Detail something specific about the layout, condition, or feeling..."
                                            className="bg-transparent border-none p-0 focus-visible:ring-0 text-slate-300 h-auto"
                                        />
                                        <button onClick={() => removeInsight(insight.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Experience Nuances */}
                    <div className="space-y-8">
                        {/* Section: Experience Personalization */}
                        <div className="space-y-4">
                            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Personalization</h2>
                            <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/5 border-white/10 backdrop-blur-xl space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Buyer Name(s)</label>
                                    <Input 
                                        value={experience.buyerName} 
                                        onChange={(e) => setExperience({...experience, buyerName: e.target.value})}
                                        className="bg-white/5 border-white/10 text-white" 
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Financing Strategy</label>
                                    <select 
                                        value={experience.strategyType}
                                        onChange={(e) => setExperience({...experience, strategyType: e.target.value as any})}
                                        className="w-full bg-white/5 border border-white/10 rounded-md text-sm font-medium px-3 py-2 text-white outline-none focus:border-purple-500 transition-colors"
                                    >
                                        <option value="wealth-builder">Wealth Builder (30yr Fixed)</option>
                                        <option value="cash-flow">Cash Flow Maximizer (ARM)</option>
                                        <option value="low-down">Low Down Payment (FHA/VA)</option>
                                    </select>
                                </div>
                            </Card>
                        </div>

                        {/* Section: Local Gems */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Local Gems</h2>
                                <button onClick={addGem} className="text-[10px] font-bold text-purple-400 hover:text-purple-300 uppercase tracking-widest transition-colors">
                                    Add Gem
                                </button>
                            </div>
                            <div className="space-y-4">
                                {experience.localGems.map((gem, idx) => (
                                    <Card key={idx} className="p-4 bg-white/[0.03] border-white/10 space-y-3">
                                        <div className="flex items-center gap-2">
                                            {gem.category === 'Coffee' ? <Coffee className="w-3.5 h-3.5 text-amber-500" /> : <MapPin className="w-3.5 h-3.5 text-blue-400" />}
                                            <Input 
                                                value={gem.name} 
                                                onChange={(e) => {
                                                    const newGems = [...experience.localGems];
                                                    newGems[idx].name = e.target.value;
                                                    setExperience({ ...experience, localGems: newGems });
                                                }}
                                                placeholder="Place Name" 
                                                className="bg-transparent border-none p-0 h-auto text-sm font-bold text-white focus-visible:ring-0" 
                                            />
                                        </div>
                                        <Textarea 
                                            value={gem.note}
                                            onChange={(e) => {
                                                const newGems = [...experience.localGems];
                                                newGems[idx].note = e.target.value;
                                                setExperience({ ...experience, localGems: newGems });
                                            }}
                                            placeholder="Why do they need to know about this?" 
                                            className="bg-white/5 border-white/10 text-xs text-slate-400 h-20 resize-none" 
                                        />
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
