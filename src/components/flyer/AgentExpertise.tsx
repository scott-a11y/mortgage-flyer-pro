import { Award, ShieldCheck, Map, TrendingUp, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface AgentExpertiseProps {
    agentName: string;
    brokerage: string;
}

export function AgentExpertise({ agentName, brokerage }: AgentExpertiseProps) {
    const expertise = [
        {
            icon: <Map className="w-4 h-4" />,
            label: "Market Specialist",
            desc: "Deep expertise in hyper-local inventory flow and neighborhood valuation."
        },
        {
            icon: <ShieldCheck className="w-4 h-4" />,
            label: "Bridge Strategy Expert",
            desc: "Specialized in non-contingent offer structures and strategic home transitions."
        },
        {
            icon: <TrendingUp className="w-4 h-4" />,
            label: "Negotiation Elite",
            desc: "Top 1% negotiator focused on maximizing seller net proceeds."
        }
    ];

    return (
        <div className="py-20 px-8 md:px-16 bg-[#050505] border-b border-white/5 relative">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/5 px-4 py-1 uppercase tracking-widest text-[10px] font-bold">
                            Your Strategic Partner
                        </Badge>
                        <h2 className="text-4xl font-serif text-white">Why {agentName.split(' ')[0]} <span className="text-amber-500 italic">Wins.</span></h2>
                        <p className="text-slate-500 font-light leading-relaxed">
                            Choosing the right agent isn't just about listing a home; it's about executing a complex financial strategy with zero friction. {agentName} brings a level of tactical precision to {brokerage} that ensures you move with confidence.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {expertise.map((item, i) => (
                            <div key={i} className="flex gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-all">
                                    {item.icon}
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-white font-medium text-sm group-hover:text-amber-500 transition-colors uppercase tracking-widest">{item.label}</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 bg-amber-500/10 blur-[80px] rounded-full"></div>
                    <Card className="bg-white/5 border-white/10 p-10 relative overflow-hidden backdrop-blur-xl group hover:border-amber-500/30 transition-all">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Award className="w-32 h-32 text-white" />
                        </div>

                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-2xl bg-amber-500 border-4 border-white/10 flex items-center justify-center text-black shadow-2xl skew-x-3">
                                    <Star className="w-10 h-10 fill-current" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-serif text-amber-500 italic">The Strategic Promise</h3>
                                    <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">Elite Standards of Service</p>
                                </div>
                            </div>

                            <p className="text-lg font-serif text-slate-200 leading-relaxed italic">
                                "Our goal isn't just to sell your home—it's to unlock your next chapter without the stress of contingencies. We handle the complexity so you can focus on the vision."
                            </p>

                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                <div>
                                    <div className="text-white font-bold">{agentName}</div>
                                    <div className="text-[9px] uppercase tracking-widest text-slate-500">{brokerage} Elite Team</div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
