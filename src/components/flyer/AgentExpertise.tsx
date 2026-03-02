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
            desc: "Top 1% negotiator with proven track record in competitive markets."
        }
    ];

    return (
        <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="space-y-4">
                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {agentName}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        {brokerage}
                    </p>
                    <div className="flex justify-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    {expertise.map((item, index) => (
                        <div key={index} className="flex gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                {item.icon}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    {item.label}
                                </h4>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap gap-2 mt-6 justify-center">
                    <Badge variant="secondary" className="text-xs">
                        <Award className="w-3 h-3 mr-1" />
                        Top Producer 2024
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                        Licensed Expert
                    </Badge>
                </div>
            </div>
        </Card>
    );
}