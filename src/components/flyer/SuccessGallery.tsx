import { Quote, User, MapPin, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function SuccessGallery() {
    const cases = [
        {
            family: "The Miller Family",
            path: "Portland → Austin",
            strategy: "Non-Contingent Bridge",
            result: "Bought dream home with 4 other offers; Sold old home for $25k over ask.",
            quote: "Being 'cash buyers' changed everything. We moved in 14 days and sold our old place empty and staged for a record price.",
            avatar: "https://images.unsplash.com/photo-1542362567-b052ed5d2b73?auto=format&fit=crop&q=80&w=100"
        },
        {
            family: "Robert & Sarah K.",
            path: "Seattle → Boise",
            strategy: "Equity Unlock",
            result: "Avoided double mortgage; Tapped $450k equity to fund 20% down payment.",
            quote: "The process was seamless. Our lender coordinated everything with the Boise team so we never felt like we were flyin' blind.",
            avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100"
        }
    ];

    return (
        <div className="py-20 px-4 md:px-16 bg-[#0c0c0e] border-b border-white/5 relative overflow-hidden">
            <div className="max-w-5xl mx-auto space-y-16">
                <div className="text-center space-y-4">
                    <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/5 px-4 py-1 uppercase tracking-widest text-[10px] font-bold">
                        Case Studies
                    </Badge>
                    <h2 className="text-4xl font-serif text-white">The <span className="text-amber-500 italic">Success Gallery.</span></h2>
                    <p className="text-slate-500 max-w-lg mx-auto font-light leading-relaxed">
                        Real stories of sellers who used our Bridge Strategy to win in competitive markets.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {cases.map((cs, i) => (
                        <Card key={i} className="bg-white/[0.02] border-white/5 p-8 space-y-8 hover:bg-white/[0.04] transition-all group border-l-4 border-l-amber-500/50">
                            <div className="space-y-6">
                                <Quote className="w-8 h-8 text-amber-500/20 group-hover:text-amber-500/50 transition-colors" />
                                <p className="text-lg font-serif text-slate-200 leading-relaxed italic">
                                    "{cs.quote}"
                                </p>
                                <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                                    <img src={cs.avatar} alt={cs.family} className="w-12 h-12 rounded-full grayscale group-hover:grayscale-0 transition-all opacity-80" />
                                    <div>
                                        <div className="text-white font-medium">{cs.family}</div>
                                        <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-slate-500">
                                            <MapPin className="w-3 h-3" />
                                            {cs.path}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 bg-black/40 p-6 rounded-2xl border border-white/5">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] uppercase font-bold tracking-tighter text-amber-500">Strategy Implemented</span>
                                    <Badge className="text-[9px] bg-amber-500/10 text-amber-500 border-none">{cs.strategy}</Badge>
                                </div>
                                <div className="text-sm text-slate-400 leading-relaxed">
                                    <span className="text-white font-medium tracking-tight">Outcome:</span> {cs.result}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="text-center">
                    <button className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                        View more case studies
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
