/**
 * Custom hook for bridge calculator logic.
 * Extracts calculation logic from the BridgeCalculator component.
 */

import { useMemo, useState } from "react";
import { BRIDGE_CALC_CONFIG } from "@/lib/constants";

/**
 * Calculator input values
 */
export interface BridgeCalcInputs {
    homeValue: number;
    mortgageBalance: number;
}

/**
 * Calculated statistics
 */
export interface BridgeCalcStats {
    /** Total equity in the home */
    grossEquity: number;
    /** Estimated selling costs (commissions, closing) */
    sellingCosts: number;
    /** Net equity after selling costs */
    netEquity: number;
    /** Maximum bridge loan buying power */
    bridgeBuyingPower: number;
    /** Current loan-to-value ratio */
    ltv: number;
    /** Strategic advice based on LTV */
    strategicInsight: string;
    /** LTV classification */
    ltvCategory: "excellent" | "strong" | "moderate";
}

/**
 * Result of the useBridgeCalculator hook
 */
export interface UseBridgeCalculatorResult {
    /** Current input values */
    inputs: BridgeCalcInputs;
    /** Calculated statistics */
    stats: BridgeCalcStats;
    /** Update home value */
    setHomeValue: (value: number) => void;
    /** Update mortgage balance */
    setMortgageBalance: (value: number) => void;
    /** Reset to default values */
    reset: () => void;
    /** Configuration constants */
    config: typeof BRIDGE_CALC_CONFIG;
}

/**
 * Get strategic insight based on LTV
 */
function getStrategicInsight(ltv: number): { insight: string; category: "excellent" | "strong" | "moderate" } {
    const { EXCELLENT, STRONG } = BRIDGE_CALC_CONFIG.LTV_THRESHOLDS;

    if (ltv < EXCELLENT) {
        return {
            insight: "Excellent Equity Position. You are a prime candidate for a low-cost bridge and a non-contingent offer.",
            category: "excellent",
        };
    }
    if (ltv < STRONG) {
        return {
            insight: "Strong Leverage Available. We can unlock significant capital to secure your next home easily.",
            category: "strong",
        };
    }
    return {
        insight: "Strategic Planning Required. We'll focus on maximizing your net proceeds to ensure a smooth transition.",
        category: "moderate",
    };
}

/**
 * Hook for bridge loan calculations.
 *
 * @param initialHomeValue - Initial home value (optional)
 * @param initialMortgageBalance - Initial mortgage balance (optional)
 * @returns Calculator inputs, stats, and update functions
 *
 * @example
 * function MyCalculator() {
 *   const { inputs, stats, setHomeValue, setMortgageBalance } = useBridgeCalculator();
 *
 *   return (
 *     <div>
 *       <Range value={inputs.homeValue} onChange={setHomeValue} />
 *       <p>Bridge Buying Power: ${stats.bridgeBuyingPower}</p>
 *     </div>
 *   );
 * }
 */
export function useBridgeCalculator(
    initialHomeValue?: number,
    initialMortgageBalance?: number
): UseBridgeCalculatorResult {
    const [homeValue, setHomeValue] = useState<number>(
        initialHomeValue ?? BRIDGE_CALC_CONFIG.DEFAULTS.HOME_VALUE
    );
    const [mortgageBalance, setMortgageBalance] = useState<number>(
        initialMortgageBalance ?? BRIDGE_CALC_CONFIG.DEFAULTS.MORTGAGE_BALANCE
    );

    const stats = useMemo<BridgeCalcStats>(() => {
        const grossEquity = homeValue - mortgageBalance;
        const sellingCosts = homeValue * BRIDGE_CALC_CONFIG.SELLING_COSTS_PERCENTAGE;
        const netEquity = Math.max(0, grossEquity - sellingCosts);

        const maxBridgeLtv = homeValue * BRIDGE_CALC_CONFIG.MAX_BRIDGE_LTV_PERCENTAGE;
        const bridgeBuyingPower = Math.max(0, maxBridgeLtv - mortgageBalance);

        const ltv = homeValue > 0 ? (mortgageBalance / homeValue) * 100 : 0;
        const { insight, category } = getStrategicInsight(ltv);

        return {
            grossEquity,
            sellingCosts,
            netEquity,
            bridgeBuyingPower,
            ltv,
            strategicInsight: insight,
            ltvCategory: category,
        };
    }, [homeValue, mortgageBalance]);

    const reset = () => {
        setHomeValue(BRIDGE_CALC_CONFIG.DEFAULTS.HOME_VALUE);
        setMortgageBalance(BRIDGE_CALC_CONFIG.DEFAULTS.MORTGAGE_BALANCE);
    };

    return {
        inputs: { homeValue, mortgageBalance },
        stats,
        setHomeValue,
        setMortgageBalance,
        reset,
        config: BRIDGE_CALC_CONFIG,
    };
}

export default useBridgeCalculator;
