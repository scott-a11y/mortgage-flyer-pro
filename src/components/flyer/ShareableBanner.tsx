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
      crossOrigin="anonymous"
      style={{ 
        width: size, 
        height: size, 
        objectFit: 'cover',
        objectPosition: `center ${position}%`,
        flexShrink: 0,
        borderRadius: 8,
        imageRendering: 'high-quality' as any,
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

  // Preload images before capture to ensure they render properly
  const preloadImages = async (container: HTMLElement): Promise<void> => {
    const images = container.querySelectorAll('img');
    const imagePromises = Array.from(images).map((img) => {
      return new Promise<void>((resolve) => {
        if (img.complete && img.naturalHeight !== 0) {
          resolve();
        } else {
          const newImg = new Image();
          newImg.crossOrigin = 'anonymous';
          newImg.onload = () => resolve();
          newImg.onerror = () => resolve();
          newImg.src = img.src;
        }
      });
    });
    await Promise.all(imagePromises);
  };

  const downloadBanner = async (format: BannerFormat) => {
    const refs = { email: emailBannerRef, social: socialBannerRef, stories: storiesBannerRef, facebook: facebookBannerRef };
    const ref = refs[format];
    if (!ref.current) return;

    setIsDownloading(format);
    try {
      // Wait for all images to load
      await preloadImages(ref.current);
      
      // Small delay to ensure browser has rendered images
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(ref.current, {
        scale: bannerDimensions[format].scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        imageTimeout: 15000,
        onclone: (clonedDoc) => {
          // Ensure images in cloned document have crossOrigin set
          const clonedImages = clonedDoc.querySelectorAll('img');
          clonedImages.forEach((img) => {
            img.crossOrigin = 'anonymous';
          });
        }
      });

      const link = document.createElement("a");
      link.download = `rate-flyer-${format}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
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
              padding: '16px 20px',
            }}>
              {/* Left - Broker (horizontal: headshot | info) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 140 }}>
                {data.broker.headshot && (
                  <HeadshotImage 
                    src={data.broker.headshot} 
                    alt={data.broker.name} 
                    size={60} 
                    position={data.broker.headshotPosition ?? 15} 
                  />
                )}
                <div>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 12, lineHeight: 1.3 }}>{data.broker.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9 }}>NMLS #{data.broker.nmls}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 2 }}>{data.broker.phone}</div>
                  <div style={{ color: 'white', fontSize: 9, fontWeight: 500, marginTop: 1 }}>www.iamortgage.org</div>
                </div>
              </div>

              {/* Center - Rates */}
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '10px 14px', textAlign: 'center', minWidth: 75 }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>30-Yr Fixed</div>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 20, lineHeight: 1.2 }}>{data.rates.thirtyYearFixed}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8 }}>{data.rates.thirtyYearFixedAPR} APR</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '10px 14px', textAlign: 'center', minWidth: 75 }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>15-Yr Fixed</div>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 20, lineHeight: 1.2 }}>{data.rates.fifteenYearFixed}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8 }}>{data.rates.fifteenYearFixedAPR} APR</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '10px 14px', textAlign: 'center', minWidth: 75 }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Jumbo</div>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 20, lineHeight: 1.2 }}>{data.rates.thirtyYearJumbo}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8 }}>{data.rates.thirtyYearJumboAPR} APR</div>
                </div>
              </div>

              {/* Right - Realtor (horizontal: info | headshot) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 140 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 12, lineHeight: 1.3 }}>{data.realtor.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9 }}>{data.realtor.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 8 }}>{data.realtor.brokerage}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 2 }}>{data.realtor.phone}</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 9 }}>{data.realtor.email}</div>
                  {data.realtor.website && (
                    <div style={{ color: 'white', fontSize: 9, fontWeight: 500, marginTop: 1 }}>{data.realtor.website}</div>
                  )}
                </div>
                {data.realtor.headshot && (
                  <HeadshotImage 
                    src={data.realtor.headshot} 
                    alt={data.realtor.name} 
                    size={60} 
                    position={data.realtor.headshotPosition ?? 25} 
                  />
                )}
              </div>
            </div>

            {/* Footer - View Rates button, QR right */}
            <div style={{ 
              background: 'rgba(255,255,255,0.05)',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              {/* Left - CTA Button and date */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ 
                  background: themeColor,
                  padding: '6px 14px',
                  borderRadius: 14,
                  color: 'white',
                  fontSize: 10,
                  fontWeight: 600
                }}>
                  View Live Rates →
                </div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 7 }}>
                  As of {data.rates.dateGenerated}
                </div>
              </div>

              {/* Center - Disclaimer */}
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 6, lineHeight: 1.2 }}>
                  Rates subject to change. Equal Housing Opportunity.
                </div>
              </div>

              {/* Right - QR Code */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ background: 'white', padding: 3, borderRadius: 4 }}>
                  <QRCodeSVG value={shareUrl} size={32} level="M" />
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
              {/* Header with contacts - full width row */}
              <div style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 16,
                padding: '20px 32px',
              }}>
                {/* Broker - left aligned */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  {data.broker.headshot && (
                    <HeadshotImage 
                      src={data.broker.headshot} 
                      alt={data.broker.name} 
                      size={80} 
                      position={data.broker.headshotPosition ?? 15} 
                    />
                  )}
                  <div>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: 26 }}>{data.broker.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>NMLS #{data.broker.nmls}</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, marginTop: 4 }}>{data.broker.phone}</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, fontWeight: 500 }}>www.iamortgage.org</div>
                  </div>
                </div>

                {/* Realtor - right aligned */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: 26 }}>{data.realtor.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>{data.realtor.title}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>{data.realtor.brokerage}</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, marginTop: 4 }}>{data.realtor.phone}</div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15 }}>{data.realtor.email}</div>
                    {data.realtor.website && (
                      <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, fontWeight: 500 }}>{data.realtor.website}</div>
                    )}
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

              {/* Footer - QR left, website centered */}
              <div style={{ 
                background: 'rgba(255,255,255,0.05)',
                padding: '24px 40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                borderRadius: 16,
              }}>
                {/* Left - QR Code and CTA */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ background: 'white', padding: 12, borderRadius: 12 }}>
                    <QRCodeSVG value={shareUrl} size={90} level="M" />
                  </div>
                  <div>
                    <div style={{ 
                      background: themeColor,
                      padding: '12px 24px',
                      borderRadius: 24,
                      color: 'white',
                      fontSize: 20,
                      fontWeight: 600
                    }}>
                      View Live Rates →
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 8, textAlign: 'center' }}>
                      As of {data.rates.dateGenerated}
                    </div>
                  </div>
                </div>

                {/* Center - Website */}
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ color: 'white', fontSize: 28, fontWeight: 600, letterSpacing: 1 }}>www.iamortgage.org</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, lineHeight: 1.3, marginTop: 8 }}>
                    Rates subject to change. Equal Housing Opportunity.
                  </div>
                </div>

                {/* Right - Spacer for balance */}
                <div style={{ width: 200 }} />
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
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>{data.realtor.title}</div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{data.realtor.brokerage}</div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 2 }}>{data.realtor.phone}</div>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{data.realtor.email}</div>
                      {data.realtor.website && (
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{data.realtor.website}</div>
                      )}
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

                {/* Footer - QR left, website centered */}
                <div style={{ 
                  background: 'rgba(255,255,255,0.05)',
                  padding: '24px 32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  borderRadius: 16,
                }}>
                  {/* Left - QR Code and CTA */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ background: 'white', padding: 12, borderRadius: 12 }}>
                      <QRCodeSVG value={shareUrl} size={80} level="M" />
                    </div>
                    <div>
                      <div style={{ 
                        background: themeColor,
                        padding: '10px 20px',
                        borderRadius: 20,
                        color: 'white',
                        fontSize: 18,
                        fontWeight: 600
                      }}>
                        View Live Rates →
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 6, textAlign: 'center' }}>
                        As of {data.rates.dateGenerated}
                      </div>
                    </div>
                  </div>

                  {/* Center - Website */}
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ color: 'white', fontSize: 24, fontWeight: 600, letterSpacing: 1 }}>www.iamortgage.org</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, lineHeight: 1.3, marginTop: 6 }}>
                      Rates subject to change. Equal Housing Opportunity.
                    </div>
                  </div>

                  {/* Right - Spacer for balance */}
                  <div style={{ width: 160 }} />
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
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>{data.realtor.title}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 2 }}>{data.realtor.brokerage}</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, marginTop: 4 }}>{data.realtor.phone}</div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16 }}>{data.realtor.email}</div>
                    {data.realtor.website && (
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>{data.realtor.website}</div>
                    )}
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

              {/* Right - QR left, website centered footer section */}
              <div style={{ 
                background: 'rgba(255,255,255,0.08)',
                padding: '20px 28px',
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                borderRadius: 16,
              }}>
                {/* QR Code */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ background: 'white', padding: 10, borderRadius: 10 }}>
                    <QRCodeSVG value={shareUrl} size={70} level="M" />
                  </div>
                  <div>
                    <div style={{ 
                      background: themeColor,
                      padding: '8px 16px',
                      borderRadius: 20,
                      color: 'white',
                      fontSize: 14,
                      fontWeight: 600
                    }}>
                      View Live Rates →
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 4, textAlign: 'center' }}>
                      As of {data.rates.dateGenerated}
                    </div>
                  </div>
                </div>

                {/* Website centered */}
                <div style={{ textAlign: 'center', minWidth: 180 }}>
                  <div style={{ color: 'white', fontSize: 18, fontWeight: 600, letterSpacing: 0.5 }}>www.iamortgage.org</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, lineHeight: 1.3, marginTop: 4 }}>
                    Rates subject to change. Equal Housing Opportunity.
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
