import { FlyerData } from "@/types/flyer";
import { Button } from "@/components/ui/button";
import { Trash2, Edit3, Mail, Copy, Check, ExternalLink, Smartphone, Share2, Info, Layout, Plus, UserPlus, Search, ChevronDown, User, Building, MapPin } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useFlyer } from "@/context/FlyerContext";
import { AgentPartner } from "@/data/agentPartners";
import { ImageUploader } from "./editors/ImageUploader";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AgentToolkitProps {
    data: FlyerData;
    shareUrl: string;
    onLoadTemplate?: (data: FlyerData) => void;
}

const LOCAL_STORAGE_KEY = "mortgage-flyer-custom-partners";

export function AgentToolkit({ data, shareUrl, onLoadTemplate }: AgentToolkitProps) {
    const { partners, savePartner, deletePartner } = useFlyer();
    const [copiedLink, setCopiedLink] = useState(false);
    const [copiedGuide, setCopiedGuide] = useState(false);
    const [open, setOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingPartner, setEditingPartner] = useState<AgentPartner | null>(null);

    // UI-only state for images in the dialog
    const [tempHeadshot, setTempHeadshot] = useState("");
    const [tempLogo, setTempLogo] = useState("");

    const activePartner = useMemo(() => {
        return partners.find(p => p.realtor.name === data.realtor.name);
    }, [partners, data.realtor.name]);

    const handleSwitchPartner = (partner: AgentPartner) => {
        if (onLoadTemplate) {
            onLoadTemplate({
                ...data,
                realtor: partner.realtor,
                colorTheme: partner.colorTheme,
            });
            toast.success(`Switched to ${partner.name}`);
            setOpen(false);
        }
    };

    const handleSavePartner = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const name = formData.get("name") as string;
        const id = editingPartner?.id || name.toLowerCase().replace(/\s+/g, '-');

        const updatedPartner: AgentPartner = {
            id: id,
            name: name,
            realtor: {
                name: name,
                title: formData.get("title") as string,
                phone: formData.get("phone") as string,
                email: formData.get("email") as string,
                brokerage: formData.get("brokerage") as string,
                website: formData.get("website") as string,
                headshot: tempHeadshot || editingPartner?.realtor.headshot || "",
                logo: tempLogo || editingPartner?.realtor.logo || "",
                headshotPosition: editingPartner?.realtor.headshotPosition || 50,
            },
            colorTheme: editingPartner?.colorTheme || partners[0].colorTheme,
        };

        savePartner(updatedPartner);

        setIsAddDialogOpen(false);
        setEditingPartner(null);
        setTempHeadshot("");
        setTempLogo("");
        toast.success(`Agent ${name} ${editingPartner ? 'updated' : 'added'}!`);

        handleSwitchPartner(updatedPartner);
    };

    const handleDeletePartner = (id: string) => {
        if (confirm("Are you sure you want to remove this agent from your directory?")) {
            deletePartner(id);
            toast.success("Agent removed from registry");
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
            {/* SEARCHABLE DROPDOWN SELECTION */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono italic">// Select_Partner</h4>

                    {/* ADD/EDIT DIALOG */}
                    <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                        setIsAddDialogOpen(open);
                        if (!open) {
                            setEditingPartner(null);
                            setTempHeadshot("");
                            setTempLogo("");
                        } else if (editingPartner) {
                            setTempHeadshot(editingPartner.realtor.headshot || "");
                            setTempLogo(editingPartner.realtor.logo || "");
                        }
                    }}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-[9px] text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 gap-1.5 font-bold uppercase tracking-wider">
                                <Plus className="w-3 h-3" />
                                Add Agent
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#0f0f11] border-cyan-500/20 text-white sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="text-cyan-400 font-serif italic tracking-wide">
                                    {editingPartner ? `Edit ${editingPartner.name}` : "Register New Partner Agent"}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSavePartner} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-[10px] uppercase tracking-widest text-slate-500">Full Name</Label>
                                        <Input id="name" name="name" required defaultValue={editingPartner ? editingPartner.name : ""} className="bg-black/50 border-cyan-500/10" placeholder="Adrian Mitchell" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="brokerage" className="text-[10px] uppercase tracking-widest text-slate-500">Brokerage</Label>
                                        <Input id="brokerage" name="brokerage" required defaultValue={editingPartner ? editingPartner.realtor.brokerage : ""} className="bg-black/50 border-cyan-500/10" placeholder="Century 21" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <ImageUploader
                                            label="Agent Headshot"
                                            value={tempHeadshot || editingPartner?.realtor.headshot || ""}
                                            onChange={setTempHeadshot}
                                            placeholder="Upload photo"
                                            className="bg-black/40 border-cyan-500/10"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <ImageUploader
                                            label="Brokerage Logo"
                                            value={tempLogo || editingPartner?.realtor.logo || ""}
                                            onChange={setTempLogo}
                                            placeholder="Upload logo"
                                            className="bg-black/40 border-cyan-500/10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-[10px] uppercase tracking-widest text-slate-500">Professional Title</Label>
                                    <Input id="title" name="title" required defaultValue={editingPartner ? editingPartner.realtor.title : ""} className="bg-black/50 border-cyan-500/10" placeholder="Real Estate Advisor" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-[10px] uppercase tracking-widest text-slate-500">Email Address</Label>
                                        <Input id="email" name="email" type="email" required defaultValue={editingPartner ? editingPartner.realtor.email : ""} className="bg-black/50 border-cyan-500/10" placeholder="agent@worksrealestate.co" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-[10px] uppercase tracking-widest text-slate-500">Phone Number</Label>
                                        <Input id="phone" name="phone" required defaultValue={editingPartner ? editingPartner.realtor.phone : ""} className="bg-black/50 border-cyan-500/10" placeholder="(123) 456-7890" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="website" className="text-[10px] uppercase tracking-widest text-slate-500">Website URL (Optional)</Label>
                                    <Input id="website" name="website" defaultValue={editingPartner ? editingPartner.realtor.website : ""} className="bg-black/50 border-cyan-500/10" placeholder="www.example.com" />
                                </div>
                                <DialogFooter className="pt-4 flex items-center justify-between gap-2">
                                    {editingPartner && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => handleDeletePartner(editingPartner.id)}
                                            className="text-red-500 hover:text-red-400 hover:bg-red-500/10 h-11 px-4"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                        </Button>
                                    )}
                                    <Button type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold uppercase tracking-widest text-xs h-12">
                                        {editingPartner ? "Update Registry Entry" : "Save to Agent Registry"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex gap-2">
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="flex-1 justify-between bg-black/40 border-cyan-500/10 text-slate-200 hover:bg-black/60 hover:border-cyan-500/30 h-11"
                            >
                                <div className="flex items-center gap-2 overflow-hidden">
                                    {activePartner ? (
                                        <>
                                            <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-800 border border-white/10 shrink-0">
                                                {activePartner.realtor.headshot ? (
                                                    <img src={activePartner.realtor.headshot} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-cyan-400">
                                                        {activePartner.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="truncate font-medium">{activePartner.name}</span>
                                            <span className="text-[9px] text-slate-500 uppercase tracking-tighter truncate opacity-60">({activePartner.realtor.brokerage})</span>
                                        </>
                                    ) : (
                                        <span className="text-slate-500">Select an agent...</span>
                                    )}
                                </div>
                                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-[#0f0f11] border-cyan-500/20">
                            <Command className="bg-transparent">
                                <CommandInput placeholder="Search system registry..." className="text-white border-none focus:ring-0" />
                                <CommandList className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                    <CommandEmpty className="py-6 text-center text-xs text-slate-500">No agents found.</CommandEmpty>
                                    <CommandGroup heading="System Partners" className="px-2 text-[10px] text-slate-500 uppercase tracking-widest p-2">
                                        {partners.map((partner) => (
                                            <CommandItem
                                                key={partner.id}
                                                value={partner.name}
                                                onSelect={() => handleSwitchPartner(partner)}
                                                className="flex items-center gap-3 p-3 cursor-pointer rounded-md hover:bg-cyan-500/10 aria-selected:bg-cyan-500/20"
                                            >
                                                <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-800 border border-white/10 flex-shrink-0">
                                                    {partner.realtor.headshot ? (
                                                        <img src={partner.realtor.headshot} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-cyan-500/60">
                                                            {partner.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-xs font-bold text-white truncate">{partner.name}</span>
                                                    <span className="text-[9px] text-slate-400 truncate uppercase tracking-tighter">{partner.realtor.brokerage}</span>
                                                </div>
                                                {activePartner?.id === partner.id && <Check className="ml-auto h-4 w-4 text-cyan-400" />}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>

                    {activePartner && (
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                                setEditingPartner(activePartner);
                                setIsAddDialogOpen(true);
                            }}
                            className="bg-black/40 border-cyan-500/10 text-cyan-500/60 hover:text-cyan-400 hover:bg-cyan-500/10 h-11 w-11 shrink-0"
                        >
                            <Edit3 className="w-4 h-4" />
                        </Button>
                    )}
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

