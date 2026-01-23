import { FlyerData } from "@/types/flyer";

interface FlyerLegalProps {
    data: FlyerData;
    className?: string;
}

export function FlyerLegal({ data, className = "" }: FlyerLegalProps) {
    return (
        <div className={`text-[9px] text-slate-400 text-center border-t border-slate-200 mt-auto ${className}`}>
            Rates subject to change. {data.company.name} NMLS #{data.company.nmls}. Equal Housing Opportunity. • VERIFIED PRO MARKETING
        </div>
    );
}
