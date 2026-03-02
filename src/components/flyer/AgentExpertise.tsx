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
        }
    ];

    return (
        <Card className="p-6 border-2 border-primary/10 bg-gradient-to-br from-background to-primary/5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg">Agent Expertise</h3>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    5.0 Rating
                </Badge>
            </div>

            <div className="space-y-4">
                <div>
                    <p className="font-medium text-sm">{agentName}</p>
                    <p className="text-xs text-muted-foreground">{brokerage}</p>
                </div>

                <div className="space-y-3">
                    {expertise.map((item, index) => (
                        <div key={index} className="flex gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                {item.icon}
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-sm">{item.label}</p>
                                <p className="text-xs text-muted-foreground">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}