import { ArrowUpRight, ShieldCheck, Home, Landmark, Building2, MapPin, CheckCircle2, Info } from 'lucide-react';
import { QRCodeSVG } from "qrcode.react";
import { useState, useEffect, forwardRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { US_STATES, getReferralType } from '@/lib/referral';
import { ReferralEducation } from '../ReferralEducation';
import { StrategyRoadmap } from '../StrategyRoadmap';
import { BridgeCalculator } from '../BridgeCalculator';
import { StrategyComparison } from '../StrategyComparison';
import { RegionalPulse } from '../RegionalPulse';
import { LeadRoutingForm } from '../LeadRoutingForm';
import { SuccessGallery } from '../SuccessGallery';
import { AgentExpertise } from '../AgentExpertise';
import { FlyerData } from '@/types/flyer';
import { FlyerProfileImage } from '../shared/FlyerProfileImage';
import { FlyerLegal } from '../shared/FlyerLegal';

interface LayoutProps {
    data: FlyerData;
}

export const BBYSLayout = forwardRef<HTMLDivElement, LayoutProps>(({ data }, ref) => {
    const [destinationState, setDestinationState] = useState('');
    const referralType = destinationState ? getReferralType(destinationState) : null;

    const officer = data.broker;
    const agent = data.realtor;
    const rates = data.rates;

    return (
        <div ref={ref} data-capture="flyer" className="min-h-screen bg-[#020202] text-slate-200 font-sans antialiased p-4 md:p-8 pb-32">
            <div className="max-w-5xl mx-auto bg-[#0a0a0c] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl relative">
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full -ml-48 -mb-48 pointer-events-none"></div>

                {/* --- HERO SECTION --- */}
                <div className="relative z-10 p-8 md:p-16 text-center border-b border-white/5">
                    <Badge variant="outline" className="mb-6 py-1 px-4 border-amber-500/30 bg-amber-500/5 text-amber-500 uppercase tracking-widest text-[10px] font-bold">
                        Exclusive Seller Strategy
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-serif text-white tracking-tight mb-6 leading-tight">
                        Buy Before <span className="text-amber-500 italic">You Sell.</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
                        Don't let your current home hold back your future. Our <span className="text-white font-medium">Bridge Strategy</span> allows you to make non-contingent offers and secure your next property first.
                    </p>
                </div>

                {/* --- REGIONAL PULSE --- */}
                <RegionalPulse stateCode={destinationState || 'PNW'} />

                {/* --- STRATEGY GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5 border-b border-white/5">
                    <div className="p-10 flex flex-col items-center text-center group hover:bg-white/[0.02] transition-all">
                        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 text-amber-500 group-hover:scale-110 transition-transform">
                            <Landmark className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-serif text-white mb-3">Bridge Financing</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Access your current home's equity to fund the down payment on your next purchase.
                        </p>
                    </div>
                    <div className="p-10 bg-amber-500/[0.02] flex flex-col items-center text-center group transition-all relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-amber-500/50"></div>
                        <div className="w-20 h-20 rounded-full bg-amber-500 border-4 border-white/10 flex items-center justify-center mb-6 text-black group-hover:rotate-12 transition-transform shadow-xl shadow-amber-500/20">
                            <ShieldCheck className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-serif text-white mb-3">Non-Contingent</h3>
                        <p className="text-sm text-amber-500/80 leading-relaxed font-medium">
                            Compete with cash buyers. Your offer stands out because it's not tied to your home sale.
                        </p>
                    </div>
                    <div className="p-10 flex flex-col items-center text-center group hover:bg-white/[0.02] transition-all">
                        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                            <Home className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-serif text-white mb-3">Seamless Transition</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Move into your new home first, then sell your old one at your leisure for top dollar.
                        </p>
                    </div>
                </div>

                {/* --- PROCESS ROADMAP --- */}
                <StrategyRoadmap />

                {/* --- INTERACTIVE CALCULATOR --- */}
                <BridgeCalculator
                    stateName={US_STATES.find(s => s.code === destinationState)?.name || destinationState || 'Your Destination'}
                    officerName={officer.name}
                    agentName={agent.name}
                />

                {/* --- STRATEGY COMPARISON --- */}
                <StrategyComparison />

                {/* --- PRE-APPROVAL & REFERRAL SECTION --- */}
                <div className="p-8 md:p-16 bg-[#0c0c0e]">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-serif text-white mb-4">Get Started Today</h2>
                            <p className="text-slate-400 font-light">Tell us where you're moving to get your specialized seller pre-approval.</p>
                        </div>

                        <Card className="bg-white/5 border-white/10 p-8 shadow-2xl backdrop-blur-sm text-slate-200">
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 ml-1">Destination State</label>
                                    <Select onValueChange={(v) => setDestinationState(v)}>
                                        <SelectTrigger className="bg-black/40 border-white/10 h-14 text-lg">
                                            <SelectValue placeholder="Select destination state..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#1a1a1c] border-white/10 text-slate-200">
                                            {US_STATES.map(state => (
                                                <SelectItem key={state.code} value={state.code} className="hover:bg-amber-500/20">
                                                    {state.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {destinationState && (
                                    <div className="space-y-12">
                                        <div className={`p-6 rounded-2xl border animate-in fade-in slide-in-from-top-4 duration-500 ${referralType === 'local'
                                            ? 'bg-emerald-500/10 border-emerald-500/20'
                                            : 'bg-blue-500/10 border-blue-500/20'
                                            }`}>
                                            <div className="flex gap-4">
                                                {referralType === 'local' ? (
                                                    <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                                                ) : (
                                                    <Info className="w-6 h-6 text-blue-400 flex-shrink-0" />
                                                )}
                                                <div>
                                                    <h4 className={`font-bold mb-1 ${referralType === 'local' ? 'text-emerald-500' : 'text-blue-400'}`}>
                                                        {referralType === 'local'
                                                            ? 'Direct Local Approval'
                                                            : 'Referral Partner Network'
                                                        }
                                                    </h4>
                                                    <p className="text-sm text-slate-400 leading-relaxed">
                                                        {referralType === 'local'
                                                            ? `Excellent! We are fully licensed in ${US_STATES.find(s => s.code === destinationState)?.name}. Our team will manage your pre-approval directly for a seamless experience.`
                                                            : `While we aren't directly licensed in ${US_STATES.find(s => s.code === destinationState)?.name}, we have an elite referral cloud for this state. We will match you with a top-tier partner who specializes in bridge strategies there.`
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {referralType === 'referral' && (
                                            <ReferralEducation stateName={US_STATES.find(s => s.code === destinationState)?.name || destinationState} />
                                        )}
                                    </div>
                                )}

                                <LeadRoutingForm
                                    stateName={US_STATES.find(s => s.code === destinationState)?.name || destinationState}
                                    isReferral={referralType === 'referral'}
                                    flyerSlug="bbys-strategy"
                                />
                            </div>
                        </Card>
                    </div>
                </div>

                {/* --- AGENT EXPERTISE --- */}
                <AgentExpertise
                    agentName={agent.name}
                    brokerage={agent.brokerage}
                />

                {/* --- SUCCESS GALLERY --- */}
                <SuccessGallery />

                {/* --- FOOTER --- */}
                <div className="bg-[#050505] p-8 md:p-12 border-t border-white/5">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        {/* LO */}
                        <div className="flex items-center gap-6 group cursor-pointer">
                            <FlyerProfileImage
                                src={officer.headshot}
                                alt={officer.name}
                                position={officer.headshotPosition}
                                className="w-20 h-20 rounded-full border-2 border-amber-500/30 group-hover:border-amber-500 transition-colors shadow-2xl"
                            />
                            <div>
                                <h4 className="text-xl font-serif text-white group-hover:text-amber-500 transition-colors">{officer.name}</h4>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-1">{officer.title}</p>
                                <p className="text-xs text-slate-600">NMLS #{officer.nmls} • {officer.phone}</p>
                            </div>
                        </div>

                        {/* Agent */}
                        <div className="flex items-center gap-6 md:flex-row-reverse text-right md:text-left group cursor-pointer">
                            <FlyerProfileImage
                                src={agent.headshot}
                                alt={agent.name}
                                position={agent.headshotPosition}
                                className="w-20 h-20 rounded-full border-2 border-amber-500/30 group-hover:border-amber-500 transition-colors shadow-2xl"
                            />
                            <div className="md:text-right">
                                <h4 className="text-xl font-serif text-white group-hover:text-amber-500 transition-colors">{agent.name}</h4>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-1">{agent.brokerage}</p>
                                <p className="text-xs text-slate-600">{agent.title} • {agent.phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* QR Code Section */}
                    {data.cta.showQRCode && data.cta.buttonUrl && (
                        <div className="mt-12 flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-700 delay-300">
                            <div className="bg-white p-2.5 rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                                <QRCodeSVG
                                    value={data.cta.buttonUrl}
                                    size={80}
                                    level="H"
                                    fgColor="#000000"
                                />
                            </div>
                            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.3em] bg-amber-500/5 px-4 py-1.5 rounded-full border border-amber-500/20">
                                {data.cta.qrLabel || "SCAN FOR APPROVAL"}
                            </span>
                        </div>
                    )}

                    <FlyerLegal data={data} className="mt-12 pt-8 border-white/5 border-t text-center" />
                </div>
            </div>
        </div>
    );
});

BBYSLayout.displayName = "BBYSLayout";
