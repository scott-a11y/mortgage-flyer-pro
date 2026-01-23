import { Compass, BarChart3, Zap, Key, Home, Sparkles } from 'lucide-react';

export function StrategyRoadmap() {
    const steps = [
        {
            icon: <Compass className="w-6 h-6" />,
            title: "Strategic Consultation",
            description: "We analyze your current equity and future goals to build a custom bridge plan.",
            color: "blue"
        },
        {
            icon: <BarChart3 className="w-6 h-6" />,
            title: "Equity Blueprint",
            description: "A professional valuation of your current property to unlock your maximum buying power.",
            color: "amber"
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Bridge Activation",
            description: "Secure your financing first. Get fully underwritten and ready to strike.",
            color: "emerald"
        },
        {
            icon: <Key className="w-6 h-6" />,
            title: "Secure Your Next Home",
            description: "Make a winning, non-contingent offer. Buy with the confidence of a cash buyer.",
            color: "blue"
        },
        {
            icon: <Home className="w-6 h-6" />,
            title: "Top-Dollar Sale",
            description: "Stage and sell your old home while you're already living in the new one.",
            color: "amber"
        },
        {
            icon: <Sparkles className="w-6 h-6" />,
            title: "Final Transition",
            description: "Close the bridge, minimize your long-term rate, and enjoy your new home.",
            color: "emerald"
        }
    ];

    return (
        <div className="py-20 px-8 md:px-16 border-b border-white/5 bg-[#08080a]">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl font-serif text-white">The 6-Step <span className="text-amber-500 italic">Roadmap</span></h2>
                    <p className="text-slate-500 max-w-lg mx-auto">
                        From your current living room to your new front door. Here is how we manage the entire transition.
                    </p>
                </div>

                <div className="relative">
                    {/* Vertical line for mobile */}
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-white/5 md:hidden"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                        {steps.map((step, index) => (
                            <div key={index} className="relative flex gap-6 group">
                                {/* Number bullet */}
                                <div className="absolute -left-10 md:-left-12 top-0 flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full border border-white/10 bg-black flex items-center justify-center text-[10px] font-bold text-slate-500 group-hover:border-amber-500 group-hover:text-amber-500 transition-colors shadow-lg`}>
                                        {index + 1}
                                    </div>
                                </div>

                                <div className="space-y-4 flex-1">
                                    <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-all duration-500 
                    ${step.color === 'blue' ? 'text-blue-400 group-hover:border-blue-500/50' :
                                            step.color === 'amber' ? 'text-amber-400 group-hover:border-amber-500/50' :
                                                'text-emerald-400 group-hover:border-emerald-500/50'}`}>
                                        {step.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-serif text-lg mb-2">{step.title}</h4>
                                        <p className="text-sm text-slate-500 leading-relaxed font-light">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
