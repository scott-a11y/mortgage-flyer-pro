import { useState, useEffect, useCallback } from "react";
import { MortgageCalculation, calculateTotalMonthlyPayment, formatCurrency } from "@/types/property";
import { Calculator, DollarSign, Percent, Home, Calendar, TrendingDown, ChevronDown, ChevronUp } from "lucide-react";

interface MortgageCalculatorProps {
    listPrice: number;
    hoa?: number;
    defaultRate?: number;
    defaultDownPayment?: number;
    defaultTerm?: number;
    compact?: boolean;
    onPaymentChange?: (payment: { total: number; breakdown: ReturnType<typeof calculateTotalMonthlyPayment> }) => void;
}

export function MortgageCalculator({
    listPrice,
    hoa = 0,
    defaultRate = 6.5,
    defaultDownPayment = 20,
    defaultTerm = 30,
    compact = false,
    onPaymentChange
}: MortgageCalculatorProps) {
    const [downPaymentPercent, setDownPaymentPercent] = useState(defaultDownPayment);
    const [interestRate, setInterestRate] = useState(defaultRate);
    const [loanTermYears, setLoanTermYears] = useState(defaultTerm);
    const [showBreakdown, setShowBreakdown] = useState(!compact);

    const calculation: MortgageCalculation = {
        listPrice,
        downPaymentPercent,
        interestRate,
        loanTermYears,
        hoa
    };

    const payment = calculateTotalMonthlyPayment(calculation);
    const downPaymentAmount = listPrice * (downPaymentPercent / 100);
    const loanAmount = listPrice - downPaymentAmount;

    useEffect(() => {
        onPaymentChange?.({ total: payment.total, breakdown: payment });
    }, [payment.total, onPaymentChange]);

    const handleRateChange = useCallback((value: number) => {
        setInterestRate(Math.max(0, Math.min(15, value)));
    }, []);

    const handleDownPaymentChange = useCallback((value: number) => {
        setDownPaymentPercent(Math.max(0, Math.min(100, value)));
    }, []);

    if (compact) {
        return (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Est. Payment</span>
                    </div>
                    <button
                        onClick={() => setShowBreakdown(!showBreakdown)}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        {showBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                </div>

                <div className="text-center mb-3">
                    <span className="text-3xl font-bold text-white">{formatCurrency(payment.total)}</span>
                    <span className="text-slate-400 text-sm">/month</span>
                </div>

                <div className="flex gap-2 text-xs text-slate-400">
                    <span>{interestRate}% Rate</span>
                    <span>•</span>
                    <span>{downPaymentPercent}% Down</span>
                    <span>•</span>
                    <span>{loanTermYears}yr</span>
                </div>

                {showBreakdown && (
                    <div className="mt-4 pt-4 border-t border-slate-700 space-y-2 text-xs">
                        <div className="flex justify-between text-slate-400">
                            <span>Principal & Interest</span>
                            <span className="text-white">{formatCurrency(payment.principalInterest)}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                            <span>Property Tax</span>
                            <span className="text-white">{formatCurrency(payment.propertyTax)}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                            <span>Insurance</span>
                            <span className="text-white">{formatCurrency(payment.insurance)}</span>
                        </div>
                        {payment.hoa > 0 && (
                            <div className="flex justify-between text-slate-400">
                                <span>HOA</span>
                                <span className="text-white">{formatCurrency(payment.hoa)}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <Calculator className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                    <h3 className="font-bold text-white text-lg">Mortgage Calculator</h3>
                    <p className="text-xs text-slate-400">Estimate your monthly payment</p>
                </div>
            </div>

            {/* Main Display */}
            <div className="text-center py-6 px-4 bg-slate-800/50 rounded-xl mb-6 border border-slate-700/30">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Estimated Monthly Payment</div>
                <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-white tracking-tight">{formatCurrency(payment.total)}</span>
                    <span className="text-lg text-slate-400">/mo</span>
                </div>
                <div className="mt-3 flex items-center justify-center gap-1 text-emerald-400 text-sm">
                    <TrendingDown className="w-4 h-4" />
                    <span>Based on {downPaymentPercent}% down</span>
                </div>
            </div>

            {/* Controls */}
            <div className="space-y-5">
                {/* Interest Rate */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="flex items-center gap-2 text-sm text-slate-300">
                            <Percent className="w-4 h-4 text-amber-500" />
                            Interest Rate
                        </label>
                        <div className="flex items-center gap-1">
                            <input
                                type="number"
                                value={interestRate}
                                onChange={(e) => handleRateChange(parseFloat(e.target.value) || 0)}
                                step="0.125"
                                min="0"
                                max="15"
                                className="w-20 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-right text-white text-sm focus:border-amber-500 focus:outline-none"
                            />
                            <span className="text-slate-400 text-sm">%</span>
                        </div>
                    </div>
                    <input
                        type="range"
                        value={interestRate}
                        onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                        step="0.125"
                        min="2"
                        max="10"
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>2%</span>
                        <span>10%</span>
                    </div>
                </div>

                {/* Down Payment */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="flex items-center gap-2 text-sm text-slate-300">
                            <DollarSign className="w-4 h-4 text-amber-500" />
                            Down Payment
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">{formatCurrency(downPaymentAmount)}</span>
                            <input
                                type="number"
                                value={downPaymentPercent}
                                onChange={(e) => handleDownPaymentChange(parseFloat(e.target.value) || 0)}
                                step="1"
                                min="0"
                                max="100"
                                className="w-16 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-right text-white text-sm focus:border-amber-500 focus:outline-none"
                            />
                            <span className="text-slate-400 text-sm">%</span>
                        </div>
                    </div>
                    <input
                        type="range"
                        value={downPaymentPercent}
                        onChange={(e) => handleDownPaymentChange(parseFloat(e.target.value))}
                        step="1"
                        min="0"
                        max="50"
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>0%</span>
                        <span>50%</span>
                    </div>
                </div>

                {/* Loan Term */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="flex items-center gap-2 text-sm text-slate-300">
                            <Calendar className="w-4 h-4 text-amber-500" />
                            Loan Term
                        </label>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {[15, 20, 30].map((term) => (
                            <button
                                key={term}
                                onClick={() => setLoanTermYears(term)}
                                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${loanTermYears === term
                                        ? "bg-amber-500 text-slate-900"
                                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                    }`}
                            >
                                {term} Years
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Payment Breakdown */}
            <div className="mt-6 pt-6 border-t border-slate-700">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-slate-300">Payment Breakdown</span>
                    <Home className="w-4 h-4 text-slate-500" />
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Loan Amount</span>
                        <span className="text-sm font-medium text-white">{formatCurrency(loanAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Principal & Interest</span>
                        <span className="text-sm font-medium text-white">{formatCurrency(payment.principalInterest)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Est. Property Tax</span>
                        <span className="text-sm font-medium text-white">{formatCurrency(payment.propertyTax)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Est. Insurance</span>
                        <span className="text-sm font-medium text-white">{formatCurrency(payment.insurance)}</span>
                    </div>
                    {payment.hoa > 0 && (
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-400">HOA Dues</span>
                            <span className="text-sm font-medium text-white">{formatCurrency(payment.hoa)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t border-slate-700">
                        <span className="text-sm font-bold text-white">Total Monthly</span>
                        <span className="text-lg font-bold text-amber-500">{formatCurrency(payment.total)}</span>
                    </div>
                </div>
            </div>

            {/* Disclaimer */}
            <p className="mt-4 text-[10px] text-slate-500 leading-relaxed">
                *Estimates based on entered values. Actual payment may vary. Does not include PMI if applicable.
                Contact your lender for accurate quotes and pre-approval.
            </p>
        </div>
    );
}
