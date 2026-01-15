import { useRef, useState } from "react";
import { FlyerData } from "@/types/flyer";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Download, Loader2, Mail, Share2, Smartphone, Facebook } from "lucide-react";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import iaMortgageLogo from "@/assets/ia-mortgage-logo.png";

interface ShareableBannerProps {
  data: FlyerData;
  shareUrl: string;
}

type BannerFormat = "email" | "social" | "stories" | "facebook";

interface BannerDimensions {
  width: number;
  height: number;
  scale: number;
}

const bannerDimensions: Record<BannerFormat, BannerDimensions> = {
  email: { width: 600, height: 200, scale: 2 },
  social: { width: 1080, height: 1080, scale: 2 },
  stories: { width: 1080, height: 1920, scale: 2 },
  facebook: { width: 1640, height: 624, scale: 2 },
};

// Helper component for headshots - no frame, just the image
function HeadshotImage({ 
  src, 
  alt, 
  size, 
  position 
}: { 
  src: string; 
  alt: string; 
  size: number; 
  position: number;
}) {
  return (
    <img
      src={src}
      alt={alt}
      style={{ 
        width: size, 
        height: size, 
        objectFit: 'cover',
        objectPosition: 'center top',
        flexShrink: 0,
        borderRadius: 8
      }}
    />
  );
}

export function ShareableBanner({ data, shareUrl }: ShareableBannerProps) {
  const emailBannerRef = useRef<HTMLDivElement>(null);
  const socialBannerRef = useRef<HTMLDivElement>(null);
  const storiesBannerRef = useRef<HTMLDivElement>(null);
  const facebookBannerRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState<BannerFormat | null>(null);

  const downloadBanner = async (format: BannerFormat) => {
    const refs = { email: emailBannerRef, social: socialBannerRef, stories: storiesBannerRef, facebook: facebookBannerRef };
    const ref = refs[format];
    if (!ref.current) return;

    setIsDownloading(format);
    try {
      const canvas = await html2canvas(ref.current, {
        scale: bannerDimensions[format].scale,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      const link = document.createElement("a");
      link.download = `rate-flyer-${format}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      const formatLabels = { email: "Email", social: "Social", stories: "Stories", facebook: "Facebook" };
      toast.success(`${formatLabels[format]} banner downloaded!`);
    } catch (err) {
      console.error("Error generating banner:", err);
      toast.error("Failed to generate banner");
    } finally {
      setIsDownloading(null);
    }
  };

  const themeColor = data.colorTheme?.primary || "#8B6914";
  const themeSecondary = data.colorTheme?.secondary || "#1a1a2e";

  return (
    <div className="space-y-6">
      {/* Email Banner Preview & Download */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Email Banner</span>
            <span className="text-xs text-muted-foreground">(600×200)</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => downloadBanner("email")}
            disabled={isDownloading !== null}
          >
            {isDownloading === "email" ? (
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-1.5" />
            )}
            Download
          </Button>
        </div>

        {/* Email Banner (600x200) - Clean horizontal layout */}
        <div className="rounded-lg overflow-hidden" style={{ width: 600 }}>
          <div
            ref={emailBannerRef}
            style={{
              width: 600,
              height: 200,
              background: themeSecondary,
              fontFamily: 'system-ui, -apple-system, sans-serif',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Main content area */}
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '16px 24px',
            }}>
              {/* Left - Broker headshot + info */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                {data.broker.headshot && (
                  <HeadshotImage 
                    src={data.broker.headshot} 
                    alt={data.broker.name} 
                    size={60} 
                    position={data.broker.headshotPosition ?? 15} 
                  />
                )}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 12, lineHeight: 1.3 }}>{data.broker.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9 }}>NMLS #{data.broker.nmls}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 2 }}>{data.broker.phone}</div>
                </div>
              </div>

              {/* Center - Rates */}
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>30-Yr Fixed</div>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 18, lineHeight: 1.1 }}>{data.rates.thirtyYearFixed}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8 }}>{data.rates.thirtyYearFixedAPR} APR</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>15-Yr Fixed</div>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 18, lineHeight: 1.1 }}>{data.rates.fifteenYearFixed}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8 }}>{data.rates.fifteenYearFixedAPR} APR</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Jumbo</div>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 18, lineHeight: 1.1 }}>{data.rates.thirtyYearJumbo}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8 }}>{data.rates.thirtyYearJumboAPR} APR</div>
                </div>
              </div>

              {/* Right - Realtor headshot + info */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                {data.realtor.headshot && (
                  <HeadshotImage 
                    src={data.realtor.headshot} 
                    alt={data.realtor.name} 
                    size={60} 
                    position={data.realtor.headshotPosition ?? 25} 
                  />
                )}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 12, lineHeight: 1.3 }}>{data.realtor.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9 }}>{data.realtor.brokerage}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 2 }}>{data.realtor.phone}</div>
                </div>
              </div>
            </div>

            {/* Footer - integrated design without harsh line */}
            <div style={{ 
              background: 'rgba(255,255,255,0.05)',
              padding: '8px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              {/* Left - Branding */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {data.company.logo ? (
                  <img src={data.company.logo} alt={data.company.name} style={{ height: 28, maxWidth: 80, objectFit: 'contain' }} />
                ) : (
                  <div style={{ color: 'white', fontWeight: 600, fontSize: 12 }}>{data.company.name || 'IA Mortgage'}</div>
                )}
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8 }}>NMLS #{data.company.nmls}</div>
                </div>
              </div>

              {/* Center - QR and CTA */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ background: 'white', padding: 3, borderRadius: 4 }}>
                  <QRCodeSVG value={shareUrl} size={32} level="M" />
                </div>
                <div>
                  <div style={{ 
                    background: themeColor,
                    padding: '4px 10px',
                    borderRadius: 12,
                    color: 'white',
                    fontSize: 9,
                    fontWeight: 600
                  }}>
                    View Live Rates →
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 7, marginTop: 2, textAlign: 'center' }}>
                    As of {data.rates.dateGenerated}
                  </div>
                </div>
              </div>

              {/* Right - Disclaimer and website */}
              <div style={{ textAlign: 'right', maxWidth: 180 }}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9 }}>{data.company.website}</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 6, lineHeight: 1.2, marginTop: 2 }}>
                  Rates subject to change. Equal Housing Opportunity.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Banner Preview & Download */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Social Media Card</span>
            <span className="text-xs text-muted-foreground">(1080×1080)</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => downloadBanner("social")}
            disabled={isDownloading !== null}
          >
            {isDownloading === "social" ? (
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-1.5" />
            )}
            Download
          </Button>
        </div>

        {/* Social Banner (1080x1080) - Scaled for preview */}
        <div 
          className="rounded-lg border bg-muted/20"
          style={{ width: 360, height: 360, overflow: 'hidden' }}
        >
          <div style={{ transform: "scale(0.333)", transformOrigin: "top left", width: 1080, height: 1080 }}>
            <div
              ref={socialBannerRef}
              style={{
                width: 1080,
                height: 1080,
                background: `linear-gradient(180deg, ${themeSecondary} 0%, ${themeSecondary}f0 40%, ${themeColor}33 100%)`,
                fontFamily: 'system-ui, -apple-system, sans-serif',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 48,
              }}
            >
              {/* Header with contacts - side by side */}
              <div style={{ width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                {/* Broker */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {data.broker.headshot && (
                    <HeadshotImage 
                      src={data.broker.headshot} 
                      alt={data.broker.name} 
                      size={96} 
                      position={data.broker.headshotPosition ?? 15} 
                    />
                  )}
                  <div>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: 24 }}>{data.broker.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>NMLS #{data.broker.nmls}</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, marginTop: 4 }}>{data.broker.phone}</div>
                  </div>
                </div>

                {/* Realtor */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: 24 }}>{data.realtor.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>Lic# 134081</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 2 }}>{data.realtor.brokerage}</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, marginTop: 4 }}>{data.realtor.phone}</div>
                  </div>
                  {data.realtor.headshot && (
                    <HeadshotImage 
                      src={data.realtor.headshot} 
                      alt={data.realtor.name} 
                      size={96} 
                      position={data.realtor.headshotPosition ?? 25} 
                    />
                  )}
                </div>
              </div>

              {/* Rates */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 24, textTransform: 'uppercase', letterSpacing: 4 }}>
                  Today's Mortgage Rates
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
                  {[
                    { label: '30-Year Fixed', rate: data.rates.thirtyYearFixed, apr: data.rates.thirtyYearFixedAPR },
                    { label: '15-Year Fixed', rate: data.rates.fifteenYearFixed, apr: data.rates.fifteenYearFixedAPR },
                    { label: '30-Year Jumbo', rate: data.rates.thirtyYearJumbo, apr: data.rates.thirtyYearJumboAPR },
                    { label: '5/1 ARM', rate: data.rates.fiveOneArm, apr: data.rates.fiveOneArmAPR },
                  ].map((item) => (
                    <div key={item.label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 24 }}>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>{item.label}</div>
                      <div style={{ color: 'white', fontWeight: 700, fontSize: 60, marginTop: 8 }}>{item.rate}</div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18, marginTop: 8 }}>{item.apr} APR</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer with Branding + QR */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 40, width: '100%', justifyContent: 'center' }}>
                {/* Logo/Branding */}
                <div style={{ textAlign: 'center' }}>
                  <img src={data.company.logo || iaMortgageLogo} alt={data.company.name || 'IA Mortgage'} style={{ height: 90, maxWidth: 200, objectFit: 'contain' }} />
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, marginTop: 8 }}>NMLS #{data.company.nmls}</div>
                </div>

                {/* QR Code */}
                <div style={{ background: 'white', padding: 16, borderRadius: 16 }}>
                  <QRCodeSVG value={shareUrl} size={110} level="M" />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ background: themeColor, padding: '16px 32px', borderRadius: 40, color: 'white', fontSize: 24, fontWeight: 700 }}>
                    Scan for Live Rates
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16, marginTop: 12 }}>
                    As of {data.rates.dateGenerated} • Rates subject to change
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instagram Stories Banner Preview & Download */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Instagram Stories</span>
            <span className="text-xs text-muted-foreground">(1080×1920)</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => downloadBanner("stories")}
            disabled={isDownloading !== null}
          >
            {isDownloading === "stories" ? (
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-1.5" />
            )}
            Download
          </Button>
        </div>

        {/* Stories Banner (1080x1920) - Scaled for preview */}
        <div 
          className="rounded-lg border bg-muted/20"
          style={{ width: 216, height: 384, overflow: 'hidden' }}
        >
          <div style={{ transform: "scale(0.2)", transformOrigin: "top left", width: 1080, height: 1920 }}>
            <div
              ref={storiesBannerRef}
              style={{
                width: 1080,
                height: 1920,
                background: `linear-gradient(180deg, ${themeSecondary} 0%, ${themeSecondary}f0 50%, ${themeColor}44 100%)`,
                fontFamily: 'system-ui, -apple-system, sans-serif',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '64px 48px',
              }}
            >
              {/* Top Branding */}
              <div style={{ textAlign: 'center' }}>
                {data.company.logo ? (
                  <img src={data.company.logo} alt={data.company.name} style={{ height: 112, maxWidth: 220, objectFit: 'contain', margin: '0 auto' }} />
                ) : (
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 48 }}>{data.company.name || 'IA Mortgage'}</div>
                )}
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 24, marginTop: 16 }}>NMLS #{data.company.nmls}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 20, marginTop: 8 }}>{data.company.website}</div>
              </div>

              {/* Headline */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 30, textTransform: 'uppercase', letterSpacing: 4 }}>
                  Today's Rates
                </div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: 48, marginTop: 16 }}>
                  {data.rates.dateGenerated}
                </div>
              </div>

              {/* Rates - Vertical Stack */}
              <div style={{ width: '100%' }}>
                {[
                  { label: '30-Year Fixed', rate: data.rates.thirtyYearFixed, apr: data.rates.thirtyYearFixedAPR },
                  { label: '15-Year Fixed', rate: data.rates.fifteenYearFixed, apr: data.rates.fifteenYearFixedAPR },
                  { label: '30-Year Jumbo', rate: data.rates.thirtyYearJumbo, apr: data.rates.thirtyYearJumboAPR },
                  { label: '5/1 ARM', rate: data.rates.fiveOneArm, apr: data.rates.fiveOneArmAPR },
                ].map((item, i) => (
                  <div 
                    key={item.label} 
                    style={{ 
                      background: 'rgba(255,255,255,0.1)', 
                      borderRadius: 24, 
                      padding: 24, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      marginTop: i > 0 ? 20 : 0
                    }}
                  >
                    <div>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 20 }}>{item.label}</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 18 }}>{item.apr} APR</div>
                    </div>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: 56 }}>{item.rate}</div>
                  </div>
                ))}
              </div>

              {/* Bottom - Contacts and QR */}
              <div style={{ width: '100%' }}>
                {/* Contacts Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                  {/* Broker */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {data.broker.headshot && (
                      <HeadshotImage 
                        src={data.broker.headshot} 
                        alt={data.broker.name} 
                        size={80} 
                        position={data.broker.headshotPosition ?? 15} 
                      />
                    )}
                    <div>
                      <div style={{ color: 'white', fontWeight: 700, fontSize: 20 }}>{data.broker.name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>NMLS #{data.broker.nmls}</div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16 }}>{data.broker.phone}</div>
                    </div>
                  </div>

                  {/* Realtor */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: 'white', fontWeight: 700, fontSize: 20 }}>{data.realtor.name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>Lic# 134081</div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16 }}>{data.realtor.phone}</div>
                    </div>
                    {data.realtor.headshot && (
                      <HeadshotImage 
                        src={data.realtor.headshot} 
                        alt={data.realtor.name} 
                        size={80} 
                        position={data.realtor.headshotPosition ?? 25} 
                      />
                    )}
                  </div>
                </div>

                {/* QR and CTA */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
                  <div style={{ background: 'white', padding: 16, borderRadius: 16 }}>
                    <QRCodeSVG value={shareUrl} size={100} level="M" />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ background: themeColor, padding: '16px 32px', borderRadius: 40, color: 'white', fontSize: 24, fontWeight: 700 }}>
                      Scan for Live Rates
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 18, marginTop: 12 }}>
                      Rates subject to change
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Facebook Cover Banner Preview & Download */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Facebook className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Facebook Cover</span>
            <span className="text-xs text-muted-foreground">(1640×624)</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => downloadBanner("facebook")}
            disabled={isDownloading !== null}
          >
            {isDownloading === "facebook" ? (
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-1.5" />
            )}
            Download
          </Button>
        </div>

        {/* Facebook Cover (1640x624) - Scaled for preview */}
        <div 
          className="rounded-lg border bg-muted/20"
          style={{ width: 492, height: 187, overflow: 'hidden' }}
        >
          <div style={{ transform: "scale(0.3)", transformOrigin: "top left", width: 1640, height: 624 }}>
            <div
              ref={facebookBannerRef}
              style={{
                width: 1640,
                height: 624,
                background: `linear-gradient(135deg, ${themeSecondary} 0%, ${themeSecondary}f0 60%, ${themeColor}44 100%)`,
                fontFamily: 'system-ui, -apple-system, sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '40px 64px',
              }}
            >
              {/* Left - Contacts */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                {/* Broker */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  {data.broker.headshot && (
                    <HeadshotImage 
                      src={data.broker.headshot} 
                      alt={data.broker.name} 
                      size={112} 
                      position={data.broker.headshotPosition ?? 15} 
                    />
                  )}
                  <div>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: 24 }}>{data.broker.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18 }}>NMLS #{data.broker.nmls}</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, marginTop: 4 }}>{data.broker.phone}</div>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ width: 1, height: 96, background: 'rgba(255,255,255,0.2)' }} />

                {/* Realtor */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  {data.realtor.headshot && (
                    <HeadshotImage 
                      src={data.realtor.headshot} 
                      alt={data.realtor.name} 
                      size={112} 
                      position={data.realtor.headshotPosition ?? 25} 
                    />
                  )}
                  <div>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: 24 }}>{data.realtor.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18 }}>Lic# 134081</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, marginTop: 4 }}>{data.realtor.phone}</div>
                  </div>
                </div>
              </div>

              {/* Center - Rates */}
              <div style={{ display: 'flex', gap: 20 }}>
                {[
                  { label: '30-Year Fixed', rate: data.rates.thirtyYearFixed, apr: data.rates.thirtyYearFixedAPR },
                  { label: '15-Year Fixed', rate: data.rates.fifteenYearFixed, apr: data.rates.fifteenYearFixedAPR },
                  { label: '30-Yr Jumbo', rate: data.rates.thirtyYearJumbo, apr: data.rates.thirtyYearJumboAPR },
                ].map((item) => (
                  <div key={item.label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: '20px 24px', textAlign: 'center' }}>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16 }}>{item.label}</div>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: 48, marginTop: 4 }}>{item.rate}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, marginTop: 4 }}>{item.apr} APR</div>
                  </div>
                ))}
              </div>

              {/* Right - Branding & QR */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                {/* Branding */}
                <div style={{ textAlign: 'center' }}>
                  {data.company.logo ? (
                    <img src={data.company.logo} alt={data.company.name} style={{ height: 80, maxWidth: 160, objectFit: 'contain', margin: '0 auto' }} />
                  ) : (
                    <div style={{ color: 'white', fontWeight: 700, fontSize: 28 }}>{data.company.name || 'IA Mortgage'}</div>
                  )}
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, marginTop: 8 }}>NMLS #{data.company.nmls}</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginTop: 4 }}>{data.company.website}</div>
                </div>

                {/* QR */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <div style={{ background: 'white', padding: 12, borderRadius: 12 }}>
                    <QRCodeSVG value={shareUrl} size={90} level="M" />
                  </div>
                  <div style={{ background: themeColor, padding: '8px 20px', borderRadius: 40, color: 'white', fontSize: 16, fontWeight: 600 }}>
                    Scan for Live Rates
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
