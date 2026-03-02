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
            desc: "Top 1% negotiator with proven track record of winning in multiple offer situations."
        },
        {
            icon: <Award className="w-4 h-4" />,
            label: "Certified Partner",
            desc: "Vetted and certified by District Design Build for exceptional service standards."
        }
    ];

    const stats = [
        { value: "98%", label: "Success Rate" },
        { value: "14", label: "Days Average" },
        { value: "250+", label: "Homes Sold" },
        { value: "5.0", label: "Client Rating", icon: <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> }
    ];

    return (
        <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
            <div className="space-y-6">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-slate-900">{agentName}</h3>
                    <p className="text-sm text-slate-600">{brokerage}</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            Elite Partner
                        </Badge>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                            Top Producer
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="flex items-center justify-center gap-1 text-xl font-bold text-slate-900">
                                {stat.value}
                                {stat.icon}
                            </div>
                            <div className="text-xs text-slate-600">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="space-y-3">
                    {expertise.map((item, index) => (
                        <div key={index} className="flex gap-3 items-start">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                {item.icon}
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-sm text-slate-900">{item.label}</div>
                                <div className="text-xs text-slate-600 leading-relaxed">{item.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}