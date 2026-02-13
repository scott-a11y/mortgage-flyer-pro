import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Map, MapPin, Building2, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

interface RegionalPulseProps {
    stateCode?: string;
}

export default function RegionalPulse({ stateCode = 'PNW' }: RegionalPulseProps) {
    const counties = [
        { name: "King County", price: "$945k", trend: "up", change: "+2.4%", inventory: "1.4mo" },
        { name: "Snohomish", price: "$780k", trend: "down", change: "-0.8%", inventory: "1.2mo" },
        { name: "Pierce", price: "$565k", trend: "up", change: "+1.2%", inventory: "1.8mo" }
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-4">
                Regional Market Pulse: {stateCode}
                <div className="h-px flex-1 bg-white/5" />
            </h2>

            <div className="grid grid-cols-1 gap-4">
                {counties.map((county, i) => (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                    >
                        <Card className="p-4 bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-amber-500/20 transition-all cursor-default group">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-white/5">
                                        <Building2 className="w-4 h-4 text-slate-500 group-hover:text-amber-500 transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{county.name}</p>
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{county.inventory} inventory</p>
                                    </div>
                                </div>
                                
                                <div className="text-right">
                                    <div className="flex items-center justify-end gap-2 text-sm font-black text-white">
                                        {county.price}
                                        {county.trend === 'up' ? (
                                            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                                        ) : (
                                            <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                                        )}
                                    </div>
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${
                                        county.trend === 'up' ? 'text-emerald-500/80' : 'text-red-500/80'
                                    }`}>
                                        {county.change} M/M
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[10px] font-black text-amber-500/80 uppercase tracking-widest">Market Forecast</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium italic">
                    "Inventory levels are tightening across the corridor. Well-priced listings in King County are seeing 12% faster turnover than last month."
                </p>
            </Card>
        </div>
    );
}
