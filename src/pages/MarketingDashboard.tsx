import { useNavigate } from "react-router-dom";
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
    Rocket
} from "lucide-react";

export default function MarketingDashboard() {
    const navigate = useNavigate();

    const tools = [
        {
            id: "listing-studio",
            title: "Listing Studio",
            description: "High-fidelity listing flyers and social media kits. Create professional marketing sheets for any property in seconds.",
            icon: FileText,
            color: "from-amber-400 to-amber-600",
            path: "/builder",
            badge: "Studio",
            features: ["Print Flyers", "Social Posts", "Live Sync"]
        },
        {
            id: "rate-watch",
            title: "Rate Watch",
            description: "Professional mortgage toolkit for live rate tracking, matrix management, and secure broadcasting to your partners.",
            icon: LineChart,
            color: "from-cyan-400 to-cyan-600",
            path: "/rate-engine",
            badge: "Pro",
            features: ["Cyber Matrix", "Uplink Sync", "Legal Disclosures"]
        }
    ];

    return (
        <div className="min-h-screen bg-[#030304] text-slate-300 selection:bg-amber-500/30 font-sans">
            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px] opacity-40" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[150px] opacity-30" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500/80">Enterprise Marketing Cloud</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none">
                            Mortgage <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-white">Marketing Suite</span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-xl font-medium leading-relaxed">
                            Welcome, Scott. Your unified command center for high-fidelity property assets and real-time financing tools.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
                        <div className="p-3 bg-amber-500/20 rounded-xl">
                            <Rocket className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Status</div>
                            <div className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                All Systems Operational
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Grid Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    {tools.map((tool) => (
                        <button
                            key={tool.id}
                            onClick={() => navigate(tool.path)}
                            className="group relative flex flex-col p-8 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/20 rounded-[32px] transition-all duration-500 text-left overflow-hidden"
                        >
                            {/* Accent Glow */}
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-20 blur-[60px] transition-opacity duration-500`} />

                            <div className="flex items-center justify-between mb-8">
                                <div className={`p-4 bg-gradient-to-br ${tool.color} rounded-2xl shadow-lg ring-1 ring-white/20 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                    <tool.icon className="w-8 h-8 text-black" />
                                </div>
                                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">
                                    {tool.badge}
                                </div>
                            </div>

                            <div className="space-y-3 relative z-10">
                                <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                                    {tool.title}
                                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 text-amber-500" />
                                </h3>
                                <p className="text-slate-400 font-medium leading-relaxed">
                                    {tool.description}
                                </p>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/5 flex flex-wrap gap-2">
                                {tool.features.map((feature, idx) => (
                                    <span key={idx} className="px-2.5 py-1 bg-white/[0.02] border border-white/5 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Footer Quick Links */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col gap-2">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Live Support</div>
                        <div className="text-sm font-bold text-white">Need help presenting?</div>
                        <p className="text-xs text-slate-500">Contact the support team for personalized training on the suite.</p>
                    </div>
                    <div className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col gap-2">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Asset Cloud</div>
                        <div className="text-sm font-bold text-white">2.4 GB Storage Used</div>
                        <p className="text-xs text-slate-500">Your high-fidelity assets are securely stored in the cloud.</p>
                    </div>
                    <div className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col gap-2">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Next Gen</div>
                        <div className="text-sm font-bold text-white">v3.0.4 Early Access</div>
                        <p className="text-xs text-slate-500">AI-powered property descriptions coming in March 2026.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
