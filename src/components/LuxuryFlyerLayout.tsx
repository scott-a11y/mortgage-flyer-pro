import { ArrowUpRight, ShieldCheck, TrendingDown, Landmark, Building2, Flag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define the shape of data you likely have from Supabase
interface FlyerProps {
    officer: {
        name: string;
        title: string;
        nmls: string;
        phone: string;
        email?: string;
        image: string;
        imagePosition?: number;
        imagePositionX?: number;
    };
    agent: {
        name: string;
        title: string;
        email: string;
        phone: string;
        brokerage: string;
        image: string;
        imagePosition?: number;
        imagePositionX?: number;
    };
    rates: {
        jumbo: string;
        conventional: string;
        fifteenYear: string;
        fha: string;
        va: string;
    };
    lastUpdated?: string;
    rateType?: 'jumbo' | 'conventional' | 'government';
}

export default function LuxuryFlyerLayout({ officer, agent, rates, lastUpdated, rateType = 'jumbo' }: FlyerProps) {
    const [activeType, setActiveType] = useState(rateType);

    useEffect(() => {
        setActiveType(rateType);
    }, [rateType]);

    // Determine content based on activeType
    const isJumbo = activeType === 'jumbo';
    const isConv = activeType === 'conventional';
    const isGov = activeType === 'government';

    // Left Card Data
    const leftTitle = isGov ? 'FHA 30-Year' : (isConv ? '30-Year Fixed' : 'Jumbo Portfolio');
    const leftRate = isGov ? rates.fha : (isConv ? rates.conventional : rates.jumbo);

    return (
        // MAIN BACKGROUND: Deep Onyx/Black
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 md:p-8 pb-40 font-sans antialiased text-slate-200">

            {/* CARD CONTAINER */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-5xl bg-[#0f0f11]/60 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/5 relative group premium-shadow"
            >

                {/* AMBIENT GLOW */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none"></div>

                {/* --- HEADER --- */}
                <div className="relative z-10 p-8 md:p-12 text-center border-b border-white/5">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-medium">
                            {isGov ? 'Government Loan Update' : 'Private Client Market Update'}
                        </span>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        <motion.h1
                            key={activeType}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="text-4xl md:text-6xl font-serif text-white tracking-tight mb-4"
                        >
                            {isGov ? (
                                <>Security & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-500">Stability.</span></>
                            ) : (
                                <>Liquidity & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Acquisition.</span></>
                            )}
                        </motion.h1>
                    </AnimatePresence>

                    <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-light mb-8">
                        {isGov
                            ? "Accessible financing solutions with government-backed security. Low down payment options for your future."
                            : "Strategic financing structures designed for the complex portfolio. Leverage equity to secure your next property without contingency."
                        }
                    </p>

                    {/* INTERACTIVE TOGGLE */}
                    <div className="inline-flex bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md">
                        <button
                            onClick={() => setActiveType('jumbo')}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-500 ${activeType === 'jumbo' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white'}`}
                        >
                            Jumbo
                        </button>
                        <button
                            onClick={() => setActiveType('conventional')}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-500 ${activeType === 'conventional' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'}`}
                        >
                            Conventional
                        </button>
                        <button
                            onClick={() => setActiveType('government')}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-500 ${activeType === 'government' ? 'bg-blue-500 text-black shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'}`}
                        >
                            Government
                        </button>
                    </div>
                </div>

                {/* --- DATA GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5 bg-[#0a0a0c]/80 backdrop-blur-md">

                    {/* Left Card */}
                    <motion.div
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                        className="group p-10 transition-all duration-500 flex flex-col items-center text-center"
                    >
                        <div className={`mb-4 p-4 rounded-full bg-slate-900 border border-white/10 transition-colors ${isGov ? 'group-hover:border-blue-500/30' : 'group-hover:border-amber-500/30'}`}>
                            {isGov ? <Building2 className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition-colors" /> : <ShieldCheck className="w-6 h-6 text-slate-400 group-hover:text-amber-400 transition-colors" />}
                        </div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                            {leftTitle}
                        </h3>
                        <div className="flex items-start justify-center gap-1 mb-2">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={leftRate}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-5xl font-light text-white tracking-tighter"
                                >
                                    {leftRate}
                                </motion.span>
                            </AnimatePresence>
                            <span className={`text-lg font-serif italic mt-1 ${isGov ? 'text-blue-500/80' : 'text-amber-500/80'}`}>%</span>
                        </div>
                        <p className="text-xs text-slate-500 px-4 leading-relaxed">
                            {isGov ? "Low down payment FHA financing." : "Flexible underwriting for high-net-worth liquidity."}
                        </p>
                    </motion.div>

                    {/* Center Card (Hero) */}
                    <div className="group p-10 bg-gradient-to-b from-amber-900/10 to-transparent hover:from-amber-900/20 transition-all duration-500 flex flex-col items-center text-center relative border-x border-white/5">
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-40"></div>
                        <div className="mb-4 p-4 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                            <Landmark className="w-6 h-6" />
                        </div>
                        <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">Bridge Strategy</h3>
                        <div className="flex items-center justify-center h-[60px]">
                            <span className="text-3xl md:text-4xl font-serif text-white italic">Non-Contingent</span>
                        </div>
                        <p className="text-xs text-amber-500/80 px-4 leading-relaxed mt-2 font-medium">
                            Buy before you sell. <span className="text-slate-500 font-normal">Secure the asset first.</span>
                        </p>
                    </div>

                    {/* Right Card */}
                    <motion.div
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                        className="group p-10 transition-all duration-500 flex flex-col items-center text-center"
                    >
                        <div className={`mb-4 p-4 rounded-full bg-slate-900 border border-white/10 transition-colors ${isGov ? 'group-hover:border-red-500/30' : 'group-hover:border-emerald-500/30'}`}>
                            {isGov ? <Flag className="w-6 h-6 text-slate-400 group-hover:text-red-400 transition-colors" /> : <TrendingDown className="w-6 h-6 text-slate-400 group-hover:text-emerald-400 transition-colors" />}
                        </div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                            {isGov ? 'VA 30-Year' : (isConv ? '15-Year Fixed' : '15-Year Acq.')}
                        </h3>
                        <div className="flex items-start justify-center gap-1 mb-2">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={isGov ? rates.va : rates.fifteenYear}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-5xl font-light text-white tracking-tighter"
                                >
                                    {isGov ? rates.va : rates.fifteenYear}
                                </motion.span>
                            </AnimatePresence>
                            <span className={`text-lg font-serif italic mt-1 ${isGov ? 'text-red-500/80' : 'text-emerald-500/80'}`}>%</span>
                        </div>
                        <p className="text-xs text-slate-500 px-4 leading-relaxed">
                            {isGov ? "Zero down payment for eligible veterans." : "Accelerated equity strategy for rapid pay-down."}
                        </p>
                    </motion.div>
                </div>

                {/* --- FOOTER (TEAM) --- */}
                <div className="bg-[#050505]/95 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-white/10">

                    {/* Scott */}
                    <div className="flex items-center gap-5 group cursor-pointer text-left">
                        {officer.image && (
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500/30 flex-shrink-0 shadow-xl group-hover:border-amber-500/50 transition-all duration-500 group-hover:scale-105">
                                <img
                                    src={officer.image}
                                    alt={officer.name}
                                    className="w-full h-full object-cover"
                                    style={{ objectPosition: `center ${officer.imagePosition || 50}%` }}
                                    crossOrigin="anonymous"
                                />
                            </div>
                        )}
                        <div>
                            <div className="text-white font-serif text-lg tracking-wide group-hover:text-amber-500 transition-colors">{officer.name}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{officer.title}</div>
                            <div className="text-[10px] text-slate-600">NMLS #{officer.nmls}</div>
                            <div className="text-[10px] text-slate-600">{officer.phone || "(360) 606-1106"} • {officer.email || "scott@ialoans.com"}</div>
                        </div>
                    </div>

                    {/* CTA */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            const subject = encodeURIComponent('Request Mortgage Analysis');
                            const body = encodeURIComponent(`Hi ${officer.name},\n\nI'd like to request a mortgage analysis.\n\nThank you,`);
                            window.location.href = `mailto:${officer.email || 'scott@ialoans.com'}?subject=${subject}&body=${body}`;
                        }}
                        className="hidden md:flex items-center gap-2 px-8 py-3 bg-white text-black hover:bg-amber-400 transition-colors duration-500 rounded-sm cursor-pointer font-bold shadow-xl shadow-white/5"
                    >
                        <span className="text-xs uppercase tracking-[0.2em]">Request Analysis</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </motion.button>

                    {/* Adrian Mitchell */}
                    <div className="flex items-center gap-5 flex-row-reverse md:flex-row group cursor-pointer text-right">
                        {agent.image && (
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500/30 flex-shrink-0 shadow-xl group-hover:border-amber-500/50 transition-all duration-500 group-hover:scale-105">
                                <img
                                    src={agent.image}
                                    alt={agent.name}
                                    className="w-full h-full object-cover"
                                    style={{ objectPosition: `center ${agent.imagePosition || 50}%` }}
                                    crossOrigin="anonymous"
                                />
                            </div>
                        )}
                        <div className="md:text-left">
                            <div className="text-white font-serif text-lg tracking-wide group-hover:text-amber-500 transition-colors">{agent.name}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{agent.brokerage || "Century 21 North Homes"}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{agent.title}</div>
                            <div className="text-[10px] text-slate-600">{agent.phone || "(425) 420-4887"} • {agent.email}</div>
                        </div>
                    </div>
                </div>

                {/* --- COMPLIANCE FOOTER --- */}
                <div className="bg-[#050505] pb-6 px-8 text-center border-t border-white/5 pt-4">
                    <p className="text-[10px] text-slate-600 font-sans tracking-wide">
                        Equal Housing Opportunity. Rates subject to change. NMLS #{officer.nmls}.
                        {lastUpdated && <span className="ml-2 text-slate-700">Rates as of {lastUpdated}</span>}
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
