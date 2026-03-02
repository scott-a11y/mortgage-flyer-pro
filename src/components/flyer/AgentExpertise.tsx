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
            desc: "Top 1% negotiator with proven track record of securing optimal terms."
        },
        {
            icon: <Award className="w-4 h-4" />,
            label: "Certified Advisor",
            desc: "Multiple industry certifications and continuous education commitment."
        }
    ];

    return (
        <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100/50">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Agent Expertise</h3>
                <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    5.0 Rating
                </Badge>
            </div>
            
            <div className="space-y-3">
                <div className="text-sm">
                    <p className="font-medium text-slate-900">{agentName}</p>
                    <p className="text-slate-600">{brokerage}</p>
                </div>
                
                <div className="grid gap-3">
                    {expertise.map((item, index) => (
                        <div key={index} className="flex gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200/60 flex items-center justify-center text-slate-700">
                                {item.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900">{item.label}</p>
                                <p className="text-xs text-slate-600 line-clamp-2">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}