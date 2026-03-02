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
        },
        {
            icon: <Award className="w-4 h-4" />,
            label: "Service Excellence",
            desc: "Consistently rated 5-star by clients for exceptional service and results."
        }
    ];

    return (
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-100">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="font-bold text-lg text-gray-900">{agentName}</h3>
                    <p className="text-sm text-gray-600">{brokerage}</p>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <Star className="w-3 h-3 mr-1" />
                    Top Producer
                </Badge>
            </div>
            
            <div className="space-y-3">
                {expertise.map((item, index) => (
                    <div key={index} className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            {item.icon}
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-sm text-gray-900">{item.label}</p>
                            <p className="text-xs text-gray-600 mt-0.5">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}