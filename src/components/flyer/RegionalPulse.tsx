import { Signal, Activity, TrendingUp, MapPin, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface RegionalPulseProps {
    stateCode?: string;
}

export function RegionalPulse({ stateCode = 'National' }: RegionalPulseProps) {
    const isLicensed = ['OR', 'WA', 'ID'].includes(stateCode);

    return (
        <div className="py-20 px-8 md:px-16 border-b border-white/5 bg-[#0a0a0c]">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/5 uppercase tracking-widest text-[10px] font-bold">
                            Market Intelligence
                        </Badge>
                        <h2 className="text-3xl font-serif text-white flex items-center gap-3">
                            Regional Pulse: <span className="text-emerald-500 italic">{stateCode}</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-4 bg-white/5 p-2 rounded-full border border-white/10 px-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                            <Signal className="w-3 h-3 text-emerald-500" />
                            Live Data Link Active
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-white/5 border-white/10 p-6 space-y-4 hover:bg-white/[0.08] transition-all">
                        <div className="flex items-center justify-between">
                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                            <div className="text-[10px] font-bold text-emerald-500 uppercase">+2.4% MoM</div>
                        </div>
                        <div>
                            <h4 className="text-white font-medium mb-1">Inventory Flow</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                New listings in {stateCode} are moving 12% faster than the national average, making bridge strategies critical.
                            </p>
                        </div>
                    </Card>

                    <Card className="bg-white/5 border-white/10 p-6 space-y-4 hover:bg-white/[0.08] transition-all">
                        <div className="flex items-center justify-between">
                            <Activity className="w-5 h-5 text-blue-400" />
                            <div className="text-[10px] font-bold text-blue-400 uppercase">Steady</div>
                        </div>
                        <div>
                            <h4 className="text-white font-medium mb-1">Offer Velocity</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Multi-offer scenarios represent 65% of transactions. Non-contingent buyers are winning at a 3x higher rate.
                            </p>
                        </div>
                    </Card>

                    <Card className="bg-white/5 border-white/10 p-6 space-y-4 hover:bg-white/[0.08] transition-all">
                        <div className="flex items-center justify-between">
                            <MapPin className="w-5 h-5 text-amber-500" />
                            <div className="text-[10px] font-bold text-amber-500 uppercase">Hot Market</div>
                        </div>
                        <div>
                            <h4 className="text-white font-medium mb-1">Local Hot-Spots</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Urban sectors are seeing a surge in "Buy Before Sell" demand as sellers trade up for more space.
                            </p>
                        </div>
                    </Card>
                </div>

                {isLicensed && (
                    <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                                <Search className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-white font-medium">Deep Dive: {stateCode} Strategy</h4>
                                <p className="text-xs text-slate-500">We have proprietary market data for {stateCode} ready for your analysis.</p>
                            </div>
                        </div>
                        <button className="px-6 py-2 rounded-full border border-amber-500/30 text-amber-500 text-xs font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all">
                            Request Full Pulse Report
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
