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
            desc: "Top 1% negotiator with proven track record of securing winning offers."
        },
        {
            icon: <Award className="w-4 h-4" />,
            label: "Certified Professional",
            desc: "Advanced certifications in luxury homes, relocation, and investment properties."
        }
    ];

    return (
        <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-lg font-semibold text-white">Agent Expertise</h3>
                </div>
                
                <div className="space-y-3">
                    {expertise.map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-white/10 text-white/80">
                                {item.icon}
                            </div>
                            <div className="flex-1 space-y-1">
                                <h4 className="text-sm font-medium text-white">{item.label}</h4>
                                <p className="text-xs text-white/70">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-white">{agentName}</p>
                            <p className="text-xs text-white/70">{brokerage}</p>
                        </div>
                        <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                            Expert Agent
                        </Badge>
                    </div>
                </div>
            </div>
        </Card>
    );
}