// Property Listing type definitions

export interface PropertySpecs {
    address: string;
    city: string;
    state: string;
    zip: string;
    listPrice: number;
    mlsNumber: string;
    bedrooms: number;
    bathrooms: number;
    squareFootage: number;
    lotSize: string;
    yearBuilt: number;
    garage: string;
    hoa?: number;
    propertyType?: string;
}

export interface PropertyFeatures {
    headline: string;
    subheadline: string;
    bulletPoints: string[];
}

export interface OpenHouseInfo {
    date: string;
    startTime: string;
    endTime: string;
    virtualTourUrl?: string;
}

export interface PropertyImages {
    hero?: string;
    secondary: string[];
}

export interface MortgageCalculation {
    listPrice: number;
    downPaymentPercent: number;
    interestRate: number;
    loanTermYears: number;
    propertyTax?: number;
    insurance?: number;
    hoa?: number;
}

export interface RentalIncome {
    /** Low end of estimated monthly rent */
    rentLow: number;
    /** High end of estimated monthly rent */
    rentHigh: number;
    /** Display label, e.g. "Studio Rental" */
    label?: string;
}

export interface PropertyListing {
    specs: PropertySpecs;
    features: PropertyFeatures;
    openHouse?: OpenHouseInfo;
    images: PropertyImages;
    financing?: MortgageCalculation;
    rentalIncome?: RentalIncome[];
}

export interface TourInsight {
    id: string;
    type: 'pro' | 'con' | 'vibe' | 'highlight';
    category: 'arrival' | 'kitchen' | 'primary' | 'outdoors' | 'general';
    content: string;
    reactions?: number;
}

export interface BuyerExperience {
    id: string;
    listing: PropertyListing;
    agentTake: string;
    tourInsights: TourInsight[];
    localGems: {
        name: string;
        category: string;
        note: string;
        distance?: string;
    }[];
    buyerName?: string;
    strategyType: 'cash-flow' | 'low-down' | 'wealth-builder';
    isPreApproved?: boolean;
    preApprovalAmount?: number;
    hasAudioGuide?: boolean;
}

// Utility function to calculate monthly mortgage payment
export function calculateMonthlyPayment(
    principal: number,
    annualRate: number,
    termYears: number
): number {
    const monthlyRate = annualRate / 100 / 12;
    const numPayments = termYears * 12;

    if (monthlyRate === 0) {
        return principal / numPayments;
    }

    const payment =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);

    return Math.round(payment);
}

// Calculate total monthly payment including taxes, insurance, and HOA
export function calculateTotalMonthlyPayment(calc: MortgageCalculation): {
    principalInterest: number;
    propertyTax: number;
    insurance: number;
    hoa: number;
    total: number;
} {
    const loanAmount = calc.listPrice * (1 - calc.downPaymentPercent / 100);
    const principalInterest = calculateMonthlyPayment(
        loanAmount,
        calc.interestRate,
        calc.loanTermYears
    );

    // Estimate property tax if not provided (roughly 1.1% annually for WA)
    const annualPropertyTax = calc.propertyTax ?? calc.listPrice * 0.011;
    const monthlyPropertyTax = Math.round(annualPropertyTax / 12);

    // Estimate insurance if not provided (roughly 0.35% annually)
    const annualInsurance = calc.insurance ?? calc.listPrice * 0.0035;
    const monthlyInsurance = Math.round(annualInsurance / 12);

    const monthlyHoa = calc.hoa ?? 0;

    return {
        principalInterest,
        propertyTax: monthlyPropertyTax,
        insurance: monthlyInsurance,
        hoa: monthlyHoa,
        total: principalInterest + monthlyPropertyTax + monthlyInsurance + monthlyHoa
    };
}

// Format currency for display
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Format percentage for display
export function formatPercentage(rate: number): string {
    return `${rate.toFixed(3)}%`;
}

// Format number with locale-aware separators (e.g., 2,760 sq ft)
export function formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
}
