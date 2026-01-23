import { ShieldCheck, Users, Zap, GraduationCap, Handshake } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ReferralEducationProps {
    stateName: string;
}

export function ReferralEducation({ stateName }: ReferralEducationProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] uppercase tracking-widest font-bold">
                    <GraduationCap className="w-3 h-3" />
                    The Referral Advantage
                </div>
                <h3 className="text-2xl font-serif text-white">Why our {stateName} Network?</h3>
                <p className="text-slate-500 text-sm max-w-lg mx-auto">
                    We believe in providing the highest level of service, even where we aren't directly licensed. Here's how our elite referral cloud protects you.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-white/5 border-white/10 p-6 space-y-4 hover:border-blue-500/30 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-white font-medium mb-1">Pre-Vetted Experts</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            We only partner with top 1% lenders in {stateName} who specialize in bridge strategies and non-contingent offers.
                        </p>
                    </div>
                </Card>

                <Card className="bg-white/5 border-white/10 p-6 space-y-4 hover:border-blue-500/30 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Zap className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-white font-medium mb-1">Priority Processing</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            As a referral from our office, you receive "VIP Gold" status with our partners, ensuring faster turn times and dedicated support.
                        </p>
                    </div>
                </Card>

                <Card className="bg-white/5 border-white/10 p-6 space-y-4 hover:border-blue-500/30 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-white font-medium mb-1">Seamless Coordination</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            We stay on your team as consultants, coordinating the handoff to ensure no data is lost and your strategy remains consistent.
                        </p>
                    </div>
                </Card>

                <Card className="bg-white/5 border-white/10 p-6 space-y-4 hover:border-blue-500/30 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Handshake className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-white font-medium mb-1">Trusted Relationship</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Our reputation is on the line. We only refer to partners who mirror our commitment to transparency and communication.
                        </p>
                    </div>
                </Card>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20">
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    The Process
                </h4>
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px]">1</span>
                        State Selected
                    </div>
                    <div className="hidden md:block w-8 h-px bg-white/10" />
                    <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px]">2</span>
                        Partner Selection
                    </div>
                    <div className="hidden md:block w-8 h-px bg-white/10" />
                    <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px]">3</span>
                        Warm Introduction
                    </div>
                    <div className="hidden md:block w-8 h-px bg-white/10" />
                    <div className="flex items-center gap-2 text-white font-medium">
                        <span className="w-5 h-5 rounded-full bg-blue-500 text-black flex items-center justify-center text-[10px] font-bold">4</span>
                        Fast-Track Approval
                    </div>
                </div>
            </div>
        </div>
    );
}
