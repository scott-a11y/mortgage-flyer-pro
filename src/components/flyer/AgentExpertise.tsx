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
            desc: "Top 1% negotiator with proven track record of winning in competitive markets."
        },
        {
            icon: <Award className="w-4 h-4" />,
            label: "Client Advocate",
            desc: "Dedicated to protecting your interests and maximizing your investment potential."
        }
    ];

    return (
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Your Real Estate Expert
                    </h3>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        <Star className="w-3 h-3 mr-1" />
                        Top Producer
                    </Badge>
                </div>
                
                <div className="text-center mb-4">
                    <p className="font-semibold text-gray-900">{agentName}</p>
                    <p className="text-sm text-gray-600">{brokerage}</p>
                </div>

                <div className="space-y-3">
                    {expertise.map((item, index) => (
                        <div key={index} className="flex gap-3">
                            <div className="flex-shrink-0 text-blue-600">
                                {item.icon}
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-900">
                                    {item.label}
                                </p>
                                <p className="text-xs text-gray-600">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}