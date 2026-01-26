import { FlyerData } from "@/types/flyer";
import { Button } from "@/components/ui/button";
import { Mail, Copy, Check, ExternalLink, Smartphone, Share2, Info, Layout } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { agentPartners } from "@/data/agentPartners";

interface AgentToolkitProps {
    data: FlyerData;
    shareUrl: string;
    onLoadTemplate?: (data: FlyerData) => void;
}

export function AgentToolkit({ data, shareUrl, onLoadTemplate }: AgentToolkitProps) {
    const [copiedLink, setCopiedLink] = useState(false);
    const [copiedGuide, setCopiedGuide] = useState(false);

    const activePartnerId = data.realtor.name.toLowerCase().replace(/\s+/g, '-');

    const handleSwitchPartner = (partnerId: string) => {
        const partner = agentPartners.find(p => p.id === partnerId);
        if (partner && onLoadTemplate) {
            onLoadTemplate({
                ...data,
                realtor: partner.realtor,
                colorTheme: partner.colorTheme,
            });
            toast.success(`Switched to ${partner.name}`);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopiedLink(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopiedLink(false), 2000);
    };

    const agentGuide = `
Partner Marketing Guide for ${data.realtor.name}:

1. LIVE FLYER LINK:
Share this link in your social media bios, email signatures, or via text to clients. The rates update automatically.
URL: ${shareUrl}

2. SOCIAL BANNERS:
Use the downloadable banners for Instagram Stories, Facebook posts, and Email signatures. 

3. QR CODE CONVERSION:
Every asset includes a QR code that links directly to our co-branded pre-approval page.

Contact ${data.broker.name} at ${data.broker.phone} for any questions!
  `.trim();

    const handleCopyGuide = () => {
        navigator.clipboard.writeText(agentGuide);
        setCopiedGuide(true);
        toast.success("Marketing guide copied!");
        setTimeout(() => setCopiedGuide(false), 2000);
    };

    const emailSubject = encodeURIComponent(`Your Updated Rate Flyer & Marketing Kit - ${data.rates.dateGenerated}`);
    const emailBody = encodeURIComponent(`Hi ${data.realtor.name.split(' ')[0]},
 
I've updated your co-branded mortgage flyer with today's live rates. You can share this link directly with your clients or in your social media bios—the rates will stay current automatically:
 
🔗 Live Flyer: ${shareUrl}
 
I've also generated custom banners for your Instagram Stories and Facebook posts (see below/attached).
 
Each asset includes a QR code that links directly back to our co-branded pre-approval portal.
 
Let me know if you need anything else to get these in front of your clients!
 
Best,
${data.broker.name}
${data.broker.phone}`);

    const handleEmailAgent = () => {
        window.open(`mailto:${data.realtor.email}?subject=${emailSubject}&body=${emailBody}`, '_blank');
        toast.success("Opening email to agent...");
    };

    return (
        <div className="space-y-6">
            {/* Pinned Partners Swiper-style list */}
            <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono italic">// Pinned_Partners</h4>
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {agentPartners.map((partner) => (
                        <button
                            key={partner.id}
                            onClick={() => handleSwitchPartner(partner.id)}
                            className={`flex-shrink-0 flex items-center gap-2 p-2 rounded border transition-all ${activePartnerId === partner.id
                                    ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-400"
                                    : "bg-black/40 border-cyan-500/5 text-slate-500 hover:border-cyan-500/20 hover:text-slate-300"
                                }`}
                        >
                            <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-800 flex-shrink-0 border border-white/10">
                                {partner.realtor.headshot ? (
                                    <img src={partner.realtor.headshot} alt={partner.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-cyan-500/40">
                                        {partner.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <span className="text-[10px] font-bold whitespace-nowrap">{partner.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {/* Primary Action */}
                <Button
                    onClick={handleEmailAgent}
                    className="w-full h-12 bg-cyan-600 hover:bg-cyan-700 text-white gap-2 font-bold shadow-[0_0_20px_rgba(8,145,178,0.2)] uppercase tracking-widest text-xs"
                >
                    <Mail className="w-5 h-5" />
                    Email Resources to {data.realtor.name.split(' ')[0]}
                </Button>

                <div className="grid grid-cols-2 gap-3">
                    <Button
                        variant="outline"
                        onClick={handleCopyLink}
                        className="border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400 gap-2 h-10 text-[10px] uppercase tracking-wider font-bold"
                    >
                        {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        Copy Live Link
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleCopyGuide}
                        className="border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400 gap-2 h-10 text-[10px] uppercase tracking-wider font-bold"
                    >
                        {copiedGuide ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        Copy Mini Guide
                    </Button>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-cyan-500/10">
                <h4 className="text-[10px] font-bold text-cyan-500/60 uppercase tracking-[0.2em] font-mono flex items-center gap-2">
                    <Info className="w-3 h-3" />
                    Sharing Strategy
                </h4>

                <div className="grid grid-cols-1 gap-2">
                    <StrategyCard
                        icon={<Share2 className="w-3.5 h-3.5" />}
                        title="Social Bio"
                        desc="Add the Live Link to Instagram/TikTok 'Link in Bio'."
                    />
                    <StrategyCard
                        icon={<Smartphone className="w-3.5 h-3.5" />}
                        title="SMS Warm Lead"
                        desc="Text the link to buyers actively searching this weekend."
                    />
                    <StrategyCard
                        icon={<Layout className="w-3.5 h-3.5" />}
                        title="Open House"
                        desc="Print the Luxury flyer (Standard 8.5x11) for house tours."
                    />
                </div>
            </div>
        </div>
    );
}

function StrategyCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="p-3 rounded border border-cyan-500/5 bg-cyan-500/[0.01] flex items-start gap-3">
            <div className="text-cyan-500/40 pt-0.5">{icon}</div>
            <div>
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-0.5">{title}</p>
                <p className="text-[10px] text-slate-500 leading-relaxed font-mono">{desc}</p>
            </div>
        </div>
    );
}
