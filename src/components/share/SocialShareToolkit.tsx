import { useState } from "react";
import {
    Share2,
    Copy,
    Check,
    Instagram,
    Facebook,
    Linkedin,
    MessageCircle,
    Mail,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PropertyListing } from "@/types/property";
import { FlyerData } from "@/types/flyer";

interface SocialShareToolkitProps {
    property: PropertyListing;
    flyerData: FlyerData;
    onClose?: () => void;
}

// Platform-specific caption generators
const generateCaptions = (property: PropertyListing, flyerData: FlyerData) => {
    const { specs, features } = property;
    const price = specs.listPrice.toLocaleString();
    const beds = specs.bedrooms;
    const baths = specs.bathrooms;
    const sqft = specs.squareFootage.toLocaleString();
    const address = specs.address;
    const city = specs.city;
    const state = specs.state;
    const agentName = flyerData.realtor.name;
    const agentPhone = flyerData.realtor.phone;

    return {
        instagram: {
            caption: `🏡 JUST LISTED in ${city}!\n\n${features.headline}\n\n📍 ${address}, ${city}, ${state}\n💰 $${price}\n🛏️ ${beds} Beds | 🛁 ${baths} Baths | 📐 ${sqft} SF\n\n✨ ${features.bulletPoints?.[0] || ''}\n✨ ${features.bulletPoints?.[1] || ''}\n\n📞 Contact me for a private showing!\n${agentName} | ${agentPhone}\n\n#JustListed #RealEstate #${city.replace(/\s/g, '')} #NewListing #DreamHome #HomeForSale #RealEstateAgent #HouseHunting #PropertyForSale #LuxuryRealEstate`,
            hashtags: `#JustListed #RealEstate #${city.replace(/\s/g, '')} #NewListing #DreamHome`,
        },
        facebook: {
            caption: `🏠 NEW LISTING ALERT! 🏠\n\n${features.headline}\n\n📍 ${address}, ${city}, ${state} ${specs.zip}\n💵 $${price}\n\n🛏️ ${beds} Bedrooms\n🛁 ${baths} Bathrooms  \n📐 ${sqft} Square Feet\n📅 Built in ${specs.yearBuilt}\n\nHIGHLIGHTS:\n${features.bulletPoints?.slice(0, 4).map(b => `✓ ${b}`).join('\n') || ''}\n\n🔑 Ready to schedule a showing? Contact me today!\n\n${agentName}\n📱 ${agentPhone}\n\n#JustListed #${city.replace(/\s/g, '')}Homes #DreamHome`,
        },
        linkedin: {
            caption: `🏠 Excited to announce a new listing in ${city}, ${state}!\n\n${features.headline}\n\nProperty Details:\n• Address: ${address}, ${city}, ${state}\n• List Price: $${price}\n• ${beds} Bed | ${baths} Bath | ${sqft} SF\n• Year Built: ${specs.yearBuilt}\n\nThis property offers:\n${features.bulletPoints?.slice(0, 3).map(b => `→ ${b}`).join('\n') || ''}\n\nInterested buyers or know someone looking in ${city}? Let's connect!\n\n${agentName}\n${flyerData.realtor.brokerage}\n${agentPhone}\n\n#RealEstate #NewListing #${city.replace(/\s/g, '')} #HomeBuyers`,
        },
        text: {
            caption: `Hi! I wanted to share an amazing property with you:\n\n${address}, ${city}\n$${price} | ${beds}BR/${baths}BA | ${sqft}SF\n\n${features.headline}\n\nWould you like to schedule a showing?\n\n- ${agentName}\n${agentPhone}`,
        },
        email: {
            subject: `Just Listed: ${address}, ${city} - $${price}`,
            body: `Hi,\n\nI wanted to share this beautiful new listing with you!\n\n${features.headline}\n\n📍 ${address}, ${city}, ${state} ${specs.zip}\n💰 List Price: $${price}\n\nProperty Details:\n• ${beds} Bedrooms, ${baths} Bathrooms\n• ${sqft} Square Feet\n• Built in ${specs.yearBuilt}\n• ${specs.lotSize} Lot\n\nHighlights:\n${features.bulletPoints?.slice(0, 5).map(b => `• ${b}`).join('\n') || ''}\n\nWould you like to schedule a private showing? Let me know!\n\nBest regards,\n${agentName}\n${flyerData.realtor.brokerage}\n${agentPhone}${flyerData.realtor.email ? `\n${flyerData.realtor.email}` : ''}`,
        }
    };
};

export function SocialShareToolkit({ property, flyerData, onClose }: SocialShareToolkitProps) {
    const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);
    const captions = generateCaptions(property, flyerData);
    const accentColor = flyerData.colorTheme?.secondary || "#F59E0B";

    const handleCopy = async (text: string, platform: string) => {
        await navigator.clipboard.writeText(text);
        setCopiedPlatform(platform);
        toast.success(`${platform} caption copied!`);
        setTimeout(() => setCopiedPlatform(null), 2000);
    };

    const handleShare = (platform: string) => {
        const shareUrl = window.location.origin + `/lead/${property.specs.city.toLowerCase().replace(/\s/g, '-')}`;

        switch (platform) {
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
                break;
            case 'linkedin':
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
                break;
            case 'text':
                window.open(`sms:?body=${encodeURIComponent(captions.text.caption + '\n\n' + shareUrl)}`, '_blank');
                break;
            case 'email':
                window.open(`mailto:?subject=${encodeURIComponent(captions.email.subject)}&body=${encodeURIComponent(captions.email.body + '\n\nView property: ' + shareUrl)}`, '_blank');
                break;
        }
    };

    const platforms = [
        {
            id: 'instagram',
            name: 'Instagram',
            icon: Instagram,
            color: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400',
            caption: captions.instagram.caption,
            note: 'Copy & paste to Instagram'
        },
        {
            id: 'facebook',
            name: 'Facebook',
            icon: Facebook,
            color: 'bg-blue-600',
            caption: captions.facebook.caption,
            canShare: true
        },
        {
            id: 'linkedin',
            name: 'LinkedIn',
            icon: Linkedin,
            color: 'bg-blue-700',
            caption: captions.linkedin.caption,
            canShare: true
        },
        {
            id: 'text',
            name: 'Text Message',
            icon: MessageCircle,
            color: 'bg-green-500',
            caption: captions.text.caption,
            canShare: true
        },
        {
            id: 'email',
            name: 'Email',
            icon: Mail,
            color: 'bg-slate-600',
            caption: captions.email.body,
            canShare: true
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                </div>
                <div>
                    <h3 className="font-bold text-white">AI-Generated Captions</h3>
                    <p className="text-xs text-slate-400">Ready to post on any platform</p>
                </div>
            </div>

            <div className="space-y-3">
                {platforms.map((platform) => (
                    <div
                        key={platform.id}
                        className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg ${platform.color} flex items-center justify-center`}>
                                    <platform.icon className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <div className="font-semibold text-white text-sm">{platform.name}</div>
                                    {platform.note && (
                                        <div className="text-[10px] text-slate-500">{platform.note}</div>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleCopy(platform.caption, platform.name)}
                                    className="h-8 border-slate-700 text-slate-300 hover:text-white gap-1.5"
                                >
                                    {copiedPlatform === platform.name ? (
                                        <Check className="w-3 h-3 text-green-400" />
                                    ) : (
                                        <Copy className="w-3 h-3" />
                                    )}
                                    Copy
                                </Button>
                                {platform.canShare && (
                                    <Button
                                        size="sm"
                                        onClick={() => handleShare(platform.id)}
                                        className="h-8 font-semibold"
                                        style={{ backgroundColor: accentColor, color: '#1e1e1e' }}
                                    >
                                        <Share2 className="w-3 h-3 mr-1" />
                                        Share
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className="text-xs text-slate-400 bg-slate-900/50 p-3 rounded-lg max-h-24 overflow-y-auto whitespace-pre-wrap">
                            {platform.caption.slice(0, 200)}...
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Quick share buttons for embedding in other components
export function QuickShareButtons({ property, flyerData }: { property: PropertyListing; flyerData: FlyerData }) {
    const captions = generateCaptions(property, flyerData);
    const shareUrl = window.location.origin + `/lead/${property.specs.city.toLowerCase().replace(/\s/g, '-')}`;

    const handleQuickShare = async (platform: string) => {
        switch (platform) {
            case 'copy':
                await navigator.clipboard.writeText(shareUrl);
                toast.success('Link copied!');
                break;
            case 'text':
                window.open(`sms:?body=${encodeURIComponent(captions.text.caption + '\n\n' + shareUrl)}`, '_blank');
                break;
            case 'email':
                window.open(`mailto:?subject=${encodeURIComponent(captions.email.subject)}&body=${encodeURIComponent(captions.email.body + '\n\nView property: ' + shareUrl)}`, '_blank');
                break;
        }
    };

    return (
        <div className="flex gap-2">
            <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuickShare('copy')}
                className="h-9 gap-2 border-slate-700"
            >
                <Copy className="w-4 h-4" />
                Copy Link
            </Button>
            <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuickShare('text')}
                className="h-9 gap-2 border-slate-700"
            >
                <MessageCircle className="w-4 h-4" />
                Text
            </Button>
            <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuickShare('email')}
                className="h-9 gap-2 border-slate-700"
            >
                <Mail className="w-4 h-4" />
                Email
            </Button>
        </div>
    );
}
