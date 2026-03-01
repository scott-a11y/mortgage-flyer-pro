import { useState, useRef } from "react";
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyListing, formatCurrency } from "@/types/property";
import { FlyerData } from "@/types/flyer";
import { Download, Copy, Instagram, Mail, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import { toast } from "sonner";

interface MarketingKitModalProps {
    property: PropertyListing;
    flyerData: FlyerData;
}

export function MarketingKitModal({ property, flyerData }: MarketingKitModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    
    // Refs for social containers
    const igSquareRef = useRef<HTMLDivElement>(null);
    const igStoryRef = useRef<HTMLDivElement>(null);

    const theme = flyerData.colorTheme;
    const heroImg = property.images.hero;

    const handleDownloadSocial = async (ref: React.RefObject<HTMLDivElement>, filename: string) => {
        if (!ref.current) return;
        setIsExporting(true);
        try {
            const canvas = await html2canvas(ref.current, {
                scale: 2, // High-res
                useCORS: true,
                backgroundColor: theme.primary,
            });
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `${filename}.png`;
            link.href = dataUrl;
            link.click();
            toast.success("Graphic downloaded!");
        } catch (e) {
            console.error(e);
            toast.error("Failed to generate image.");
        } finally {
            setIsExporting(false);
        }
    };

    const generateEmailHtml = () => {
        const logoOrHeadshotUrl = window.location.origin + (flyerData.realtor.logo || flyerData.realtor.headshot);
        const heroUrl = window.location.origin + heroImg;
        // Super minimal, table-based or inline-css based HTML for max compatibility
        return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: Helvetica, Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 40px 20px; text-align: center; background-color: ${theme.primary}; border-bottom: 4px solid ${theme.secondary};">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; line-height: 1.2;">Just Listed in ${property.specs.city}</h1>
                            <p style="margin: 10px 0 0 0; color: ${theme.secondary}; font-size: 16px; font-weight: bold; letter-spacing: 1px;">&mdash; SPECIAL FINANCING AVAILABLE &mdash;</p>
                        </td>
                    </tr>
                    <!-- Hero Image -->
                    <tr>
                        <td align="center">
                            <img src="${heroUrl}" width="600" alt="Property Hero" style="width: 100%; max-width: 600px; display: block;" />
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px; text-align: center;">
                            <h2 style="margin: 0; font-size: 24px; color: #1f2937;">${property.features.headline}</h2>
                            <p style="margin: 15px 0 25px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">${property.features.subheadline}</p>
                            
                            <!-- Key Stats -->
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px;">
                                <tr>
                                    <td align="center" style="width: 33%; border-right: 1px solid #e5e7eb;">
                                        <div style="font-size: 22px; font-weight: bold; color: ${theme.primary};">${property.specs.bedrooms}</div>
                                        <div style="font-size: 12px; color: #6b7280; text-transform: uppercase;">Beds</div>
                                    </td>
                                    <td align="center" style="width: 33%; border-right: 1px solid #e5e7eb;">
                                        <div style="font-size: 22px; font-weight: bold; color: ${theme.primary};">${property.specs.bathrooms}</div>
                                        <div style="font-size: 12px; color: #6b7280; text-transform: uppercase;">Baths</div>
                                    </td>
                                    <td align="center" style="width: 33%;">
                                        <div style="font-size: 22px; font-weight: bold; color: ${theme.primary};">${property.specs.squareFootage}</div>
                                        <div style="font-size: 12px; color: #6b7280; text-transform: uppercase;">Sq Ft</div>
                                    </td>
                                </tr>
                            </table>

                            <!-- Pricing -->
                            <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                                <div style="font-size: 14px; color: #6b7280; text-transform: uppercase; font-weight: bold;">Offered at</div>
                                <div style="font-size: 32px; font-weight: bold; color: #111827;">${formatCurrency(property.specs.listPrice)}</div>
                                <div style="margin-top: 10px; font-size: 15px; color: ${theme.primary};">Own it for as low as <strong>${property.financing ? property.financing.downPaymentPercent : 5}% down</strong>!</div>
                            </div>
                            
                            <!-- Market Insight -->
                            <div style="text-align: left; background-color: ${theme.primary}05; padding: 20px; border-left: 4px solid ${theme.secondary}; margin-bottom: 30px;">
                                <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #374151;"><i>"${flyerData.marketCopy.marketInsight}"</i></p>
                            </div>

                            <!-- CTA Button -->
                            <a href="${window.location.origin}/property-live/${flyerData.layout || 'seattle-condo-celeste-5down'}" style="display: inline-block; background-color: ${theme.primary}; color: #ffffff; text-decoration: none; padding: 16px 32px; font-size: 16px; font-weight: bold; border-radius: 6px; text-transform: uppercase;">View Live Tour & Finance Math</a>
                        </td>
                    </tr>
                    <!-- Footer Info -->
                    <tr>
                        <td align="center" style="padding: 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                            <img src="${logoOrHeadshotUrl}" style="width: 80px; height: 80px; border-radius: 40px; margin-bottom: 15px; object-fit: cover;" />
                            <div style="font-size: 16px; font-weight: bold; color: #111827;">${flyerData.realtor.name}</div>
                            <div style="font-size: 14px; color: #6b7280; margin-bottom: 15px;">${flyerData.realtor.brokerage}</div>
                            <div style="font-size: 14px; color: #374151;">
                                <a href="tel:${flyerData.realtor.phone.replace(/[^0-9+]/g, '')}" style="color: ${theme.primary}; text-decoration: none;">${flyerData.realtor.phone}</a>
                                &nbsp;|&nbsp;
                                <a href="mailto:${flyerData.realtor.email}" style="color: ${theme.primary}; text-decoration: none;">${flyerData.realtor.email}</a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `.trim();
    };

    const copyEmailHtml = async () => {
        try {
            await navigator.clipboard.writeText(generateEmailHtml());
            toast.success("HTML copied to clipboard!", { description: "Paste this directly into Mailchimp or your CRM source code editor." });
        } catch {
            toast.error("Failed to copy text.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all">
                    <Instagram className="w-4 h-4 mr-2" />
                    Marketing Kit
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl bg-slate-950 border-white/10 text-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black tracking-tight">One-Click Marketing Assets</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Everything your agent needs to distribute this property on day 1. Beautifully branded, auto-generated, and ready to post.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="social" className="mt-6">
                    <TabsList className="bg-slate-900 border border-white/5">
                        <TabsTrigger value="social" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
                            Instagram / Facebook
                        </TabsTrigger>
                        <TabsTrigger value="email" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                            CRM Email Blast
                        </TabsTrigger>
                    </TabsList>

                    {/* SOCIAL GRAPHICS */}
                    <TabsContent value="social" className="mt-6 space-y-8">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            
                            {/* Instagram Grid Post Container */}
                            <div className="flex-1 w-full space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-slate-300 flex items-center gap-2">
                                        <Instagram className="w-4 h-4 text-purple-400" />
                                        Grid Post (1080x1080)
                                    </h3>
                                    <Button 
                                        size="sm" 
                                        className="bg-purple-600 hover:bg-purple-700"
                                        onClick={() => handleDownloadSocial(igSquareRef, `IG_Post_${property.specs.address}`)}
                                        disabled={isExporting}
                                    >
                                        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                                        Download PNG
                                    </Button>
                                </div>
                                <div className="p-4 rounded-xl border border-white/10 bg-black/50 overflow-hidden flex justify-center">
                                    {/* The hidden renderable container */}
                                    <div 
                                        ref={igSquareRef}
                                        style={{ width: "540px", height: "540px", backgroundColor: theme.primary }}
                                        className="relative flex flex-col justify-between overflow-hidden shadow-2xl scale-75 origin-top md:scale-100"
                                    >
                                        <div className="absolute top-0 right-0 p-6 z-10 text-right">
                                            <div className="px-4 py-2 bg-white/95 backdrop-blur-md rounded-full shadow-xl">
                                                <p className="text-lg font-black" style={{ color: theme.primary }}>JUST LISTED</p>
                                            </div>
                                        </div>
                                        <div className="h-[60%] w-full">
                                            <img src={heroImg} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="flex-1 p-8 flex flex-col justify-center relative">
                                            <div className="absolute top-0 left-8 right-8 h-1" style={{ backgroundColor: theme.secondary }} />
                                            <p className="text-3xl font-black text-white tracking-tight leading-tight mt-2">
                                                {formatCurrency(property.specs.listPrice)}
                                            </p>
                                            <p className="text-lg font-medium text-white/80 mt-1">
                                                {property.specs.address}, {property.specs.city}
                                            </p>
                                            <div className="flex items-center gap-4 mt-6">
                                                <div className="px-3 py-1 bg-white/10 border border-white/20 rounded text-sm text-white font-bold">
                                                    {property.specs.bedrooms} Beds
                                                </div>
                                                <div className="px-3 py-1 bg-white/10 border border-white/20 rounded text-sm text-white font-bold">
                                                    {property.specs.bathrooms} Baths
                                                </div>
                                                <div className="px-3 py-1 rounded text-sm font-bold bg-amber-500 text-black">
                                                    Own from ${property.financing?.estimatedMonthlyPI || 0}/mo
                                                </div>
                                            </div>
                                            <div className="absolute bottom-6 right-6 flex items-center gap-3">
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-white uppercase">{flyerData.realtor.name}</p>
                                                    <p className="text-xs text-white/60">{flyerData.realtor.brokerage}</p>
                                                </div>
                                                <img src={flyerData.realtor.headshot} className="w-12 h-12 rounded-full object-cover border-2 border-white/20" alt="" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Instagram Story Container */}
                            <div className="md:w-[320px] shrink-0 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-slate-300 flex items-center gap-2">
                                        <Instagram className="w-4 h-4 text-pink-400" />
                                        Story
                                    </h3>
                                    <Button 
                                        size="sm" 
                                        className="bg-pink-600 hover:bg-pink-700"
                                        onClick={() => handleDownloadSocial(igStoryRef, `IG_Story_${property.specs.address}`)}
                                        disabled={isExporting}
                                    >
                                        <Download className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="p-4 rounded-xl border border-white/10 bg-black/50 overflow-hidden flex justify-center">
                                    {/* The hidden renderable container */}
                                    <div 
                                        ref={igStoryRef}
                                        style={{ width: "270px", height: "480px", backgroundColor: theme.primary }}
                                        className="relative flex flex-col justify-end overflow-hidden shadow-2xl"
                                    >
                                        <img src={heroImg} className="absolute inset-0 w-full h-full object-cover" alt="" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
                                        
                                        <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-1 bg-white rounded-full shadow-2xl">
                                            <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: theme.primary }}>NEW LISTING</p>
                                        </div>
                                        
                                        <div className="relative z-10 p-6 w-full text-center pb-8">
                                            <p className="text-2xl font-black text-white tracking-tight drop-shadow-md">
                                                {formatCurrency(property.specs.listPrice)}
                                            </p>
                                            <p className="text-sm font-bold text-white/90 drop-shadow-md mb-4 leading-tight">
                                                {property.specs.address}
                                            </p>
                                            
                                            <div className="bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-xl mb-12">
                                                <p className="text-xs text-amber-400 font-bold mb-1 uppercase tracking-wider">Buy With</p>
                                                <p className="text-lg font-black text-white">{property.financing?.downPaymentPercent || 5}% DOWN</p>
                                                <p className="text-[10px] text-white/70 mt-1 uppercase">Special Financing Options</p>
                                            </div>
                                            
                                            {/* Area for agent to put "LINK IN BIO" or sticker */}
                                            <div className="h-10 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center bg-white/5">
                                                <p className="text-[10px] text-white/50 uppercase font-bold text-center">Place Link Sticker Here</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* EMAIL BLAST HTML */}
                    <TabsContent value="email" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-slate-300 flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-blue-400" />
                                        HTML Code
                                    </h3>
                                    <Button onClick={copyEmailHtml} className="bg-blue-600 hover:bg-blue-700">
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy Code
                                    </Button>
                                </div>
                                <div className="p-4 rounded-xl border border-white/10 bg-black/50 relative overflow-hidden h-[500px]">
                                    <pre className="text-xs text-slate-400 font-mono h-full overflow-y-auto whitespace-pre-wrap">
                                        {generateEmailHtml()}
                                    </pre>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <h3 className="font-bold text-slate-300 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    Live Preview
                                </h3>
                                <div className="p-0 rounded-xl border border-white/10 bg-white overflow-hidden h-[500px]">
                                    <iframe 
                                        srcDoc={generateEmailHtml()} 
                                        className="w-full h-full border-0"
                                        title="Email Preview"
                                    />
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
