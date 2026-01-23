import { Check, X, Shield, Zap, Home, Clock, DollarSign, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function StrategyComparison() {
    const metrics = [
        {
            label: "Offer Strength",
            traditional: "Contingent (Weak)",
            bridge: "Non-Contingent (Strong)",
            icon: <Award className="w-4 h-4" />,
            bridgeWins: true
        },
        {
            label: "Move Speed",
            traditional: "45-90 Days",
            bridge: "14-21 Days",
            icon: <Clock className="w-4 h-4" />,
            bridgeWins: true
        },
        {
            label: "Double Mortgage",
            traditional: "Risk of Pay. Overlap",
            bridge: "Interest-Only / No Pay.",
            icon: <DollarSign className="w-4 h-4" />,
            bridgeWins: true
        },
        {
            label: "Sale Value",
            traditional: "Living in home (Lower)",
            bridge: "Empty & Staged (Higher)",
            icon: <Home className="w-4 h-4" />,
            bridgeWins: true
        }
    ];

    return (
        <div className="py-20 px-4 md:px-16 bg-[#050505] border-b border-white/5 relative">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl font-serif text-white">The <span className="text-amber-500 italic">Strategic Edge.</span></h2>
                    <p className="text-slate-500 max-w-lg mx-auto font-light">
                        Compare the friction of a traditional sale against the velocity of our Bridge Strategy.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                    {/* Traditional Board */}
                    <div className="bg-[#0c0c0e] p-10 space-y-8 opacity-60 grayscale hover:grayscale-0 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-500/10 flex items-center justify-center text-slate-400">
                                <X className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-serif text-slate-400">Traditional Sale</h3>
                        </div>

                        <div className="space-y-6">
                            {metrics.map((m, i) => (
                                <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <span className="text-slate-600">{m.icon}</span>
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-600">{m.label}</span>
                                    </div>
                                    <div className="text-sm text-slate-500">{m.traditional}</div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-[11px] text-red-400/80 leading-relaxed italic">
                            *Requires "subject to sale" contingency. High risk of deal failure in competitive markets.
                        </div>
                    </div>

                    {/* Bridge Board */}
                    <div className="bg-gradient-to-b from-amber-900/10 to-[#0c0c0e] p-10 space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6">
                            <Shield className="w-24 h-24 text-amber-500/5 rotate-12" />
                        </div>

                        <div className="flex items-center gap-3 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-500">
                                <Check className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-serif text-white">Bridge Strategy</h3>
                            <Badge className="bg-amber-500 text-black font-bold text-[9px] px-2 ml-auto">WINNING MODEL</Badge>
                        </div>

                        <div className="space-y-6 relative z-10">
                            {metrics.map((m, i) => (
                                <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0 group">
                                    <div className="flex items-center gap-3">
                                        <span className="text-amber-500 group-hover:scale-125 transition-transform">{m.icon}</span>
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{m.label}</span>
                                    </div>
                                    <div className="text-sm text-white font-medium">{m.bridge}</div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-500 leading-relaxed italic relative z-10">
                            <div className="flex gap-3">
                                <Zap className="w-4 h-4 flex-shrink-0" />
                                <span>Zero contingencies. You are essentially a cash buyer, enabling you to secure property at a lower purchase price and sell for a higher premium.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
