import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, Calculator, TrendingUp, Wallet, ArrowRight } from 'lucide-react';
import { StrategyReport } from './StrategyReport';

/**
 * Configuration constants for bridge loan calculations.
 * These values are based on typical industry standards and may need
 * adjustment based on specific lender requirements.
 */
const BRIDGE_CALC_CONFIG = {
    /** Estimated selling costs as percentage of home value (commissions + closing) */
    SELLING_COSTS_PERCENTAGE: 0.07,
    /** Maximum LTV (Loan-to-Value) ratio for bridge loans */
    MAX_BRIDGE_LTV_PERCENTAGE: 0.75,
    /** LTV thresholds for strategic advice */
    LTV_THRESHOLDS: {
        EXCELLENT: 50,  // Below 50% = excellent equity position
        STRONG: 70,     // Below 70% = strong leverage available
    },
    /** Slider configuration */
    SLIDER: {
        HOME_VALUE: { MIN: 200000, MAX: 3000000, STEP: 10000 },
        MORTGAGE: { STEP: 10000 },
    },
    /** Default values */
    DEFAULTS: {
        HOME_VALUE: 750000,
        MORTGAGE_BALANCE: 450000,
    }
} as const;

interface BridgeCalculatorProps {
    stateName: string;
    officerName: string;
    agentName: string;
}

export function BridgeCalculator({ stateName, officerName, agentName }: BridgeCalculatorProps) {
    const [homeValue, setHomeValue] = useState<number>(BRIDGE_CALC_CONFIG.DEFAULTS.HOME_VALUE);
    const [mortgageBalance, setMortgageBalance] = useState<number>(BRIDGE_CALC_CONFIG.DEFAULTS.MORTGAGE_BALANCE);

    const stats = useMemo(() => {
        const grossEquity = homeValue - mortgageBalance;
        const sellingCosts = homeValue * BRIDGE_CALC_CONFIG.SELLING_COSTS_PERCENTAGE;
        const netEquity = Math.max(0, grossEquity - sellingCosts);

        const maxBridgeLtv = homeValue * BRIDGE_CALC_CONFIG.MAX_BRIDGE_LTV_PERCENTAGE;
        const bridgeBuyingPower = Math.max(0, maxBridgeLtv - mortgageBalance);

        const ltv = (mortgageBalance / homeValue) * 100;

        return {
            grossEquity,
            sellingCosts,
            netEquity,
            bridgeBuyingPower,
            ltv
        };
    }, [homeValue, mortgageBalance]);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="py-20 px-4 md:px-16 bg-[#0a0a0c] border-b border-white/5 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/5 blur-[120px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/5 px-4 py-1 uppercase tracking-widest text-[10px] font-bold">
                        Live Strategy Calculator
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-serif text-white">Unlock Your <span className="text-blue-400 italic">Home Equity.</span></h2>
                    <p className="text-slate-500 max-w-xl mx-auto font-light leading-relaxed">
                        Estimate your net proceeds and your maximum "Bridge Buying Power" to secure your next home before listing your current one.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Controls */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Current Home Value</label>
                                <div className="text-2xl font-serif text-white">{formatCurrency(homeValue)}</div>
                            </div>
                            <Slider
                                value={[homeValue]}
                                min={200000}
                                max={3000000}
                                step={10000}
                                onValueChange={([v]) => setHomeValue(v)}
                                className="[&_.relative]:bg-blue-500/20 [&_[role=slider]]:bg-blue-400 [&_[role=slider]]:border-blue-400"
                            />
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Mortgage Balance</label>
                                <div className="text-2xl font-serif text-white">{formatCurrency(mortgageBalance)}</div>
                            </div>
                            <Slider
                                value={[mortgageBalance]}
                                min={0}
                                max={homeValue}
                                step={10000}
                                onValueChange={([v]) => setMortgageBalance(v)}
                                className="[&_.relative]:bg-red-500/20 [&_[role=slider]]:bg-red-400 [&_[role=slider]]:border-red-400"
                            />
                        </div>

                        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-4">
                            <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />
                            <p className="text-[11px] text-slate-500 leading-relaxed italic">
                                *Selling costs estimated at 7% for commissions and closing. Actual costs may vary by market and negotiation.
                            </p>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="space-y-6">
                        <Card className="bg-[#0f0f12] border-white/5 p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Calculator className="w-24 h-24 text-white" />
                            </div>

                            <div className="space-y-8 relative z-10">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-bold uppercase tracking-tighter text-blue-400">Bridge Buying Power</div>
                                    <div className="text-5xl font-serif text-white tracking-tight">{formatCurrency(stats.bridgeBuyingPower)}</div>
                                    <p className="text-xs text-slate-500 font-light mt-2">
                                        Estimated liquidity available to fund your next purchase deposit and down payment before selling.
                                    </p>
                                </div>

                                <div className="h-px bg-white/5" />

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-bold uppercase tracking-tighter text-slate-500">Net Proceeds</div>
                                        <div className="text-xl text-white font-medium">{formatCurrency(stats.netEquity)}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-bold uppercase tracking-tighter text-slate-500">Current LTV</div>
                                        <div className="text-xl text-white font-medium">{stats.ltv.toFixed(1)}%</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-emerald-400">
                                        <TrendingUp className="w-3 h-3" />
                                        Strategic Insight
                                    </div>
                                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            {stats.ltv < 50
                                                ? "Excellent Equity Position. You are a prime candidate for a low-cost bridge and a non-contingent offer."
                                                : stats.ltv < 70
                                                    ? "Strong Leverage Available. We can unlock significant capital to secure your next home easily."
                                                    : "Strategic Planning Required. We'll focus on maximizing your net proceeds to ensure a smooth transition."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <StrategyReport
                            data={{
                                homeValue,
                                mortgageBalance,
                                netEquity: stats.netEquity,
                                bridgeBuyingPower: stats.bridgeBuyingPower,
                                stateName,
                                officerName,
                                agentName
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
