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
            label: "Certified Advisor",
            desc: "Accredited Buyer's Representative with advanced market certifications."
        }
    ];

    return (
        <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Agent Expertise</h3>
                <Badge variant="secondary" className="text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Top Producer
                </Badge>
            </div>
            
            <div className="space-y-3">
                {expertise.map((item, index) => (
                    <div key={index} className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            {item.icon}
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-sm">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="pt-3 border-t">
                <p className="text-sm font-medium">{agentName}</p>
                <p className="text-xs text-muted-foreground">{brokerage}</p>
            </div>
        </Card>
    );
}