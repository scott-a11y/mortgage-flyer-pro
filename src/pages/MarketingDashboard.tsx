import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FileText,
    Layout,
    Share2,
    Users,
    Sparkles,
    LineChart,
    Globe,
    ArrowRight,
    Home,
    Smartphone,
    Rocket,
    Eye,
    Zap,
    LayoutDashboard,
    UserCircle2,
    ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RegionalPulse from "@/components/flyer/RegionalPulse";
import { agentPartners } from "@/data/agentPartners";

export default function MarketingDashboard() {
    const navigate = useNavigate();
    const { agentId } = useParams();
    const currentAgent = agentPartners.find(a => a.id === agentId);
    
    const allAssets = [
        { name: "Maple Valley Sanctuary", type: "Listing Flyer", views: 124, status: "Live", agentId: "celeste-zarling" },
        { name: "Kirkland Waterfront", type: "Listing Flyer", views: 245, status: "Live", agentId: "celeste-zarling" },
        { name: "Bellevue Modern", type: "Buyer Tour", views: 67, status: "Draft", agentId: "celeste-zarling" },
        { name: "Portland Metro - Denae Wilson", type: "Partner Live", views: 89, status: "Live", agentId: "adrian-mitchell" },
        { name: "Pearl District Loft", type: "Listing Flyer", views: 156, status: "Live", agentId: "adrian-mitchell" },
        { name: "West Hills Estate", type: "Buyer Tour", views: 42, status: "Draft", agentId: "adrian-mitchell" },
        { name: "Seattle Skyline Suite", type: "Listing Flyer", views: 312, status: "Live", agentId: "marcus-chen" },
        { name: "Queen Anne Collection", type: "Listing Flyer", views: 184, status: "Live", agentId: "marcus-chen" },
        { name: "Downtown Luxury Loft", type: "Buyer Tour", views: 92, status: "Live", agentId: "marcus-chen" },
        { name: "Global Luxury Collection", type: "Buyer Tour", views: 512, status: "Live", agentId: null }
    ];

    const activeAssets = currentAgent 
        ? allAssets.filter(a => a.agentId === currentAgent.id)
        : allAssets.filter(a => a.agentId === null || a.agentId === "celeste-zarling").slice(0, 4);

    const [stats, setStats] = useState({
        totalViews: 0,
        activeLeads: 0,
        assets: activeAssets.length,
        conversionRate: "0.0%"
    });

    useEffect(() => {
        // 1. Calculate Views from Active Assets
        const assetViews = activeAssets.reduce((sum, asset) => sum + asset.views, 0);
        
        // 2. Mock individual lead counts for variance
        const mockLeadsMap: Record<string, number> = {
            'celeste-zarling': 12,
            'adrian-mitchell': 8,
            'marcus-chen': 15,
            'default': 42
        };

        const activeLeads = currentAgent 
            ? mockLeadsMap[currentAgent.id] || 5 
            : mockLeadsMap['default'];

        // 3. Dynamic Conversion Rate
        const rate = assetViews > 0 
            ? ((activeLeads / assetViews) * 100).toFixed(1)
            : "0.0";

        setStats({
            totalViews: assetViews,
            activeLeads: activeLeads,
            assets: activeAssets.length,
            conversionRate: `${rate}%`
        });
    }, [agentId, currentAgent, activeAssets]);

    const tools = [
        {
            id: "listing-studio",
            title: "Listing Studio",
            description: "High-fidelity listing flyers and social media kits for your property inventory.",
            icon: FileText,
            color: "from-amber-400 to-amber-600",
            path: "/builder",
            badge: "Active",
            features: ["Print Flyers", "Social Posts", "Live Sync"]
        },
        {
            id: "buyer-experience",
            title: "Buyer's Experience",
            description: "Premium property detailing & interactive tours for high-value buyer clients.",
            icon: Sparkles,
            color: "from-purple-400 to-purple-600",
            path: "/buyer-agent",
            badge: "Exclusive",
            features: ["Agent Insights", "Local Gems", "Buyer Tours"]
        },
        {
            id: "rate-watch",
            title: "Rate Watch",
            description: "Professional mortgage toolkit for live rate tracking and matrix management.",
            icon: LineChart,
            color: "from-cyan-400 to-cyan-600",
            path: "/rate-engine",
            badge: "Pro",
            features: ["Cyber Matrix", "Uplink Sync", "Disclosures"]
        },
        {
            id: "leads-hub",
            title: "Leads Dashboard",
            description: "Centralized lead tracking and real-time conversion monitoring for all flyers.",
            icon: Users,
            color: "from-emerald-400 to-emerald-600",
            path: "/leads",
            badge: `${stats.activeLeads} Unread`,
            features: ["Conversion Stats", "Contact Sync", "Alerts"]
        }
    ];

    return (
        <div className="min-h-screen bg-[#030304] text-slate-300 selection:bg-amber-500/30 font-sans pb-20 overflow-x-hidden">
            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px] opacity-40" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[150px] opacity-30" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-16">
                {/* Unified Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            {agentId && (
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => navigate('/dashboard')}
                                    className="rounded-full bg-white/5 border border-white/10 hover:bg-white/10"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </Button>
                            )}
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                                <LayoutDashboard className="w-3.5 h-3.5 text-amber-500" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500/80">
                                    {currentAgent ? 'Partner Portal' : 'Command Center v3.0'}
                                </span>
                            </div>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none">
                            {currentAgent ? currentAgent.name : 'Unified'} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-white">
                                {currentAgent ? 'Success Dashboard' : 'Marketing Suite'}
                            </span>
                        </h1>
                        <p className="text-slate-400 max-w-lg font-medium">
                            {currentAgent 
                                ? `Welcome back, ${currentAgent.name.split(' ')[0]}. Here is your real-time performance and asset hub for ${currentAgent.realtor.brokerage}.`
                                : 'Welcome, Scott. Your unified command center for high-fidelity property assets and real-time financing tools.'}
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        {currentAgent?.realtor.headshot && (
                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-3 pr-6 backdrop-blur-xl">
                                <img src={currentAgent.realtor.headshot} className="w-12 h-12 rounded-xl object-cover border border-white/10" alt="" />
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{currentAgent.realtor.brokerage}</div>
                                    <div className="text-sm font-bold text-white tracking-tight">{currentAgent.realtor.title}</div>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
                            <div className="p-3 bg-emerald-500/20 rounded-xl">
                                <Rocket className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Global Sync Status</div>
                                <div className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    Rates Live & Broadcasting
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance HUD */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {[
                        { label: 'Asset Engagement', value: stats.totalViews.toLocaleString(), sub: `Across ${stats.assets} assets`, icon: Eye, color: 'text-blue-400' },
                        { label: 'Active Leads', value: stats.activeLeads, sub: `Conversion rate ${stats.conversionRate}`, icon: Users, color: 'text-amber-500' },
                        { label: 'Performance Tier', value: currentAgent ? 'Platinum' : 'Enterprise', sub: 'Top 5% in Region', icon: Zap, color: 'text-purple-400' }
                    ].map((item, i) => (
                        <Card key={i} className="bg-white/[0.03] border-white/10 p-6 backdrop-blur-xl group hover:bg-white/[0.05] transition-all">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</p>
                                    <h4 className="text-3xl font-black text-white tracking-tighter">{item.value}</h4>
                                    <p className="text-xs text-slate-500 font-medium">{item.sub}</p>
                                </div>
                                <div className={`p-3 rounded-xl bg-white/5 ${item.color} group-hover:scale-110 transition-transform`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Primary Launchpad */}
                <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-4">
                    Product Suite
                    <div className="h-px flex-1 bg-white/5" />
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {tools.map((tool) => (
                        <motion.button
                            whileHover={{ y: -5 }}
                            key={tool.id}
                            onClick={() => navigate(tool.path)}
                            className="group relative flex flex-col p-6 bg-white/[0.02] hover:bg-white/[0.08] border border-white/5 hover:border-white/20 rounded-[2rem] transition-all duration-500 text-left overflow-hidden h-full"
                        >
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 blur-[40px] transition-opacity duration-500`} />

                            <div className="flex items-center justify-between mb-6">
                                <div className={`p-3 bg-gradient-to-br ${tool.color} rounded-xl shadow-lg ring-1 ring-white/10`}>
                                    <tool.icon className="w-5 h-5 text-black" />
                                </div>
                                <Badge variant="outline" className="border-white/10 bg-white/5 text-[9px] uppercase tracking-widest font-black text-slate-400 group-hover:text-white transition-colors">
                                    {tool.badge}
                                </Badge>
                            </div>

                            <div className="space-y-2 relative z-10 flex-1">
                                <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                                    {tool.title}
                                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 text-amber-500" />
                                </h3>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                    {tool.description}
                                </p>
                            </div>
                        </motion.button>
                    ))}
                </div>

                {/* Active Campaigns Explorer */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-4">
                            Active Assets
                            <div className="h-px flex-1 bg-white/5" />
                        </h2>
                        <div className="grid grid-cols-1 gap-3">
                            {activeAssets.map((asset, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 rounded-2xl transition-all group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-white/5">
                                            <Globe className="w-4 h-4 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white tracking-tight">{asset.name}</p>
                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{asset.type}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <p className="text-sm font-black text-white">{asset.views}</p>
                                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Views</p>
                                        </div>
                                        <Badge className={`bg-white/5 border-white/10 ${asset.status === 'Live' ? 'text-emerald-500' : 'text-slate-500'}`}>
                                            {asset.status}
                                        </Badge>
                                        <Button variant="ghost" size="icon" className="group-hover:text-amber-500 transition-colors">
                                            <Share2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <RegionalPulse />
                        
                        {!agentId && (
                            <div className="pt-8 space-y-6">
                                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-4">
                                    Partner Network
                                    <div className="h-px flex-1 bg-white/5" />
                                </h2>
                                <div className="space-y-3">
                                    {agentPartners.slice(0, 3).map((partner, i) => (
                                        <Card 
                                            key={i} 
                                            onClick={() => navigate(`/dashboard/${partner.id}`)}
                                            className="p-4 bg-white/[0.02] border-white/10 hover:border-amber-500/30 transition-all group cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                                                    {partner.realtor.headshot ? (
                                                        <img src={partner.realtor.headshot} className="w-full h-full object-cover" alt="" />
                                                    ) : (
                                                        <div className="w-full h-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">
                                                            {partner.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white tracking-tight">{partner.name}</p>
                                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{partner.realtor.brokerage}</p>
                                                </div>
                                                <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all text-amber-500" />
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
