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
        }
    ];

    return (
        <Card className="p-6 bg-gradient-to-br from-gray-50 to-white border-gray-200">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Your Agent's Expertise</h3>
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                        <Star className="w-3 h-3 mr-1" />
                        Top Producer
                    </Badge>
                </div>
                
                <div className="space-y-3">
                    {expertise.map((item, index) => (
                        <div key={index} className="flex gap-3">
                            <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg text-primary">
                                {item.icon}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900 text-sm">{item.label}</h4>
                                <p className="text-xs text-gray-600 mt-0.5">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-700">
                        <span className="font-medium">{agentName}</span> with{' '}
                        <span className="font-medium">{brokerage}</span>
                    </p>
                </div>
            </div>
        </Card>
    );
}