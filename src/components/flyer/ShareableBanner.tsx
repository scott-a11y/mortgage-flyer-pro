import { useRef, useState } from "react";
import { FlyerData } from "@/types/flyer";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Download, Loader2, Mail, Share2, Smartphone, Facebook, ShieldCheck, TrendingDown, Landmark, Copy } from "lucide-react";
import html2canvas from "html2canvas";
import { toast } from "sonner";

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
  email: { width: 600, height: 200, scale: 4 },
  social: { width: 1080, height: 1080, scale: 3 },
  stories: { width: 1080, height: 1920, scale: 3 },
  facebook: { width: 1640, height: 624, scale: 3 },
};

// Helper for soft headshots
function HeadshotImage({
  src,
  alt,
  size,
  positionY = 15,
  positionX = 50
}: {
  src: string;
  alt: string;
  size: number;
  positionY?: number;
  positionX?: number;
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
        objectPosition: `${positionX}% ${positionY}%`,
        flexShrink: 0,
        borderRadius: size / 2, // Circular
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      }}
    />
  );
}

// Gold accent color constant
const GOLD = "#D4AF37";
const ONYX = "#050505";

export function ShareableBanner({ data, shareUrl }: ShareableBannerProps) {
  const emailBannerRef = useRef<HTMLDivElement>(null);
  const socialBannerRef = useRef<HTMLDivElement>(null);
  const storiesBannerRef = useRef<HTMLDivElement>(null);
  const facebookBannerRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState<BannerFormat | null>(null);

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
      await preloadImages(ref.current);
      await new Promise(resolve => setTimeout(resolve, 200)); // Slight delay for fonts/images

      const canvas = await html2canvas(ref.current, {
        scale: bannerDimensions[format].scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        onclone: (clonedDoc) => {
          const clonedImages = clonedDoc.querySelectorAll('img');
          clonedImages.forEach((img) => img.crossOrigin = 'anonymous');
        }
      });

      const link = document.createElement("a");
      link.download = `private-client-update-${format}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();

      toast.success(`${format} banner downloaded!`);
    } catch (err) {
      console.error("Error generating banner:", err);
      toast.error("Failed to generate banner");
    } finally {
      setIsDownloading(null);
    }
  };

  // Strip percentages for Playfair displays if needed, ensuring clean data
  const rJumbo = data.rates.thirtyYearJumbo.replace('%', '');
  const rFixed30 = data.rates.thirtyYearFixed.replace('%', '');
  const rFixed15 = data.rates.fifteenYearFixed.replace('%', '');

  const isConventional = data.rateType === 'conventional';
  const label1 = isConventional ? '30-Yr Fixed' : 'Jumbo';
  const value1 = isConventional ? rFixed30 : rJumbo;
  const label3 = isConventional ? '15-Yr Fixed' : '15-Yr Acq.';

  // Fallback X position for Scott if missing
  // Fallback positions for Scott
  const getX = (name: string, x?: number) => x ?? (name.includes('Scott Little') ? 35 : 50);
  const getY = (name: string, y?: number) => name.includes('Scott Little') ? 15 : (y ?? 15);



  return (
    <div className="space-y-6">
      <div className="p-4 bg-muted/40 rounded-lg border space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Live Flyer Link</span>
          <Button size="sm" variant="ghost" className="h-8 gap-2" onClick={() => {
            navigator.clipboard.writeText(shareUrl);
            toast.success("Link copied to clipboard!");
          }}>
            <Copy className="w-4 h-4" />
            Copy Link
          </Button>
        </div>
        <div className="text-xs text-muted-foreground break-all font-mono bg-background p-2 rounded border">
          {shareUrl}
        </div>
      </div>

      {/* Email Banner Preview & Download */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Email Banner</span>
            <span className="text-xs text-muted-foreground">(600×200)</span>
          </div>
          <Button size="sm" variant="outline" onClick={() => downloadBanner("email")} disabled={isDownloading !== null}>
            {isDownloading === "email" ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Download className="w-4 h-4 mr-1.5" />}
            Download
          </Button>
        </div>

        {/* EMAIL BANNER DOM */}
        <div style={{ width: 600, height: 200, background: ONYX, overflow: 'hidden', position: 'relative' }} ref={emailBannerRef}>
          {/* Glow */}
          <div style={{ position: 'absolute', top: -50, left: 200, width: 200, height: 200, background: 'rgba(212, 175, 55, 0.15)', filter: 'blur(60px)', borderRadius: '50%' }} />

          <div style={{ display: 'flex', height: '100%', alignItems: 'center', padding: '0 24px', justifyContent: 'space-between', fontFamily: 'Inter, sans-serif' }}>

            {/* Left: Broker */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, zIndex: 10, width: 160 }}>
              {data.broker.headshot && <HeadshotImage src={data.broker.headshot} alt="" size={48} positionY={getY(data.broker.name, data.broker.headshotPosition)} positionX={getX(data.broker.name, data.broker.headshotPositionX)} />}
              <div>
                <div style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>{data.broker.name}</div>
                <div style={{ color: GOLD, fontSize: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>{data.broker.title}</div>
                <div style={{ color: '#666', fontSize: 8 }}>NMLS #{data.broker.nmls}</div>
              </div>
            </div>

            {/* Center: Rates Grid (Compact) */}
            <div style={{ display: 'flex', gap: 8, flex: 1, justifySelf: 'center', justifyContent: 'center' }}>
              {[
                { l: label1, v: value1 },
                { l: 'Bridge', v: 'Non-Contingent' },
                { l: label3, v: rFixed15 }
              ].map(r => (
                <div key={r.l} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 6, width: 85 }}>
                  <div style={{ color: '#666', fontSize: 7, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>{r.l}</div>
                  {r.l === 'Bridge' ? (
                    <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: r.v.length > 10 ? 9 : 10, fontStyle: 'italic', paddingTop: 4, letterSpacing: r.v.length > 10 ? -0.5 : 0 }}>{r.v}</div>
                  ) : (
                    <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 16 }}>{r.v}<span style={{ fontSize: 8, color: GOLD, fontStyle: 'italic' }}>%</span></div>
                  )}
                </div>
              ))}
            </div>

            {/* Right: Realtor */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexDirection: 'row-reverse', zIndex: 10, width: 160, textAlign: 'right' }}>
              {data.realtor.headshot && <HeadshotImage src={data.realtor.headshot} alt="" size={48} positionY={getY(data.realtor.name, data.realtor.headshotPosition)} positionX={getX(data.realtor.name, data.realtor.headshotPositionX)} />}
              <div>
                <div style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>{data.realtor.name}</div>
                <div style={{ color: GOLD, fontSize: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>{data.realtor.title}</div>
                <div style={{ color: '#666', fontSize: 8 }}>{data.realtor.name.split(' ')[0]}@...</div>
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
          <Button size="sm" variant="outline" onClick={() => downloadBanner("social")} disabled={isDownloading !== null}>
            {isDownloading === "social" ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Download className="w-4 h-4 mr-1.5" />}
            Download
          </Button>
        </div>

        {/* SOCIAL BANNER DOM */}
        {/* Preview scaled down */}
        <div style={{ width: 360, height: 360, overflow: 'hidden' }}>
          <div style={{ transform: 'scale(0.333)', transformOrigin: '0 0' }}>
            <div style={{ width: 1080, height: 1080, background: ONYX, display: 'flex', flexDirection: 'column', position: 'relative' }} ref={socialBannerRef}>
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, background: 'rgba(212, 175, 55, 0.1)', filter: 'blur(120px)', borderRadius: '50%' }} />

              {/* Header */}
              <div style={{ padding: '80px 40px', textAlign: 'center', zIndex: 10 }}>
                <div style={{ display: 'inline-block', padding: '8px 24px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 50, marginBottom: 30, background: 'rgba(255,255,255,0.03)' }}>
                  <span style={{ color: GOLD, fontSize: 14, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600 }}>Private Client Market Update</span>
                </div>
                <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 80, lineHeight: 1 }}>
                  Liquidity & <span style={{ background: `linear-gradient(to right, #FFE5A0, ${GOLD})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Acquisition.</span>
                </div>
              </div>

              {/* Grid */}
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 40, padding: '0 60px' }}>
                {/* Jumbo */}
                <div style={{ background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.05)', padding: 40, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={40} color={GOLD} style={{ marginBottom: 20, opacity: 0.8 }} />
                  <div style={{ color: '#555', fontSize: 14, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Jumbo Portfolio</div>
                  <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 72 }}>{rJumbo}<span style={{ fontSize: 24, fontStyle: 'italic', color: GOLD }}>%</span></div>
                  <div style={{ color: '#444', fontSize: 14, marginTop: 12 }}>Flexible underwriting for HNW liquidity.</div>
                </div>

                {/* Center - Bridge */}
                <div style={{ background: `linear-gradient(to bottom, rgba(212, 175, 55, 0.1), transparent)`, border: `1px solid ${GOLD}40`, padding: 40, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
                  <Landmark size={40} color={GOLD} style={{ marginBottom: 20 }} />
                  <div style={{ color: GOLD, fontSize: 14, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8, fontWeight: 700 }}>Bridge Strategy</div>
                  <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 36, fontStyle: 'italic' }}>Non-Contingent</div>
                  <div style={{ color: GOLD, fontSize: 14, marginTop: 12, opacity: 0.8 }}>Secure the asset first.</div>
                </div>

                {/* 15 Yr */}
                <div style={{ background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.05)', padding: 40, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingDown size={40} color={GOLD} style={{ marginBottom: 20, opacity: 0.8 }} />
                  <div style={{ color: '#555', fontSize: 14, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>15-Year Acq.</div>
                  <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 72 }}>{rFixed15}<span style={{ fontSize: 24, fontStyle: 'italic', color: GOLD }}>%</span></div>
                  <div style={{ color: '#444', fontSize: 14, marginTop: 12 }}>Accelerated equity strategy.</div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '40px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0a0a0c' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  {data.broker.headshot && <HeadshotImage src={data.broker.headshot} alt="" size={80} positionY={getY(data.broker.name, data.broker.headshotPosition)} positionX={getX(data.broker.name, data.broker.headshotPositionX)} />}
                  <div>
                    <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 24 }}>{data.broker.name}</div>
                    <div style={{ color: GOLD, fontSize: 14, letterSpacing: 1, textTransform: 'uppercase' }}>{data.broker.title}</div>
                    <div style={{ color: '#666', fontSize: 14 }}>NMLS #{data.broker.nmls}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <QRCodeSVG value={shareUrl} size={60} fgColor="white" bgColor="transparent" />
                  <div style={{ color: '#444', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', marginTop: 8 }}>Scan Me</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexDirection: 'row-reverse', textAlign: 'right' }}>
                  {data.realtor.headshot && <HeadshotImage src={data.realtor.headshot} alt="" size={80} positionY={getY(data.realtor.name, data.realtor.headshotPosition)} positionX={getX(data.realtor.name, data.realtor.headshotPositionX)} />}
                  <div>
                    <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 24 }}>{data.realtor.name}</div>
                    <div style={{ color: GOLD, fontSize: 14, letterSpacing: 1, textTransform: 'uppercase' }}>{data.realtor.title}</div>
                    <div style={{ color: '#666', fontSize: 14 }}>{data.realtor.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stories Banner */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Stories</span>
            <span className="text-xs text-muted-foreground">(1080×1920)</span>
          </div>
          <Button size="sm" variant="outline" onClick={() => downloadBanner("stories")} disabled={isDownloading !== null}>
            {isDownloading === "stories" ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Download className="w-4 h-4 mr-1.5" />}
            Download
          </Button>
        </div>
        {/* Helper for stories preview */}
        <div style={{ width: 216, height: 384, overflow: 'hidden', background: '#000', borderRadius: 8 }}>
          <div style={{ transform: 'scale(0.2)', transformOrigin: '0 0' }}>
            <div style={{ width: 1080, height: 1920, background: ONYX, position: 'relative', display: 'flex', flexDirection: 'column' }} ref={storiesBannerRef}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 600, background: 'linear-gradient(180deg, rgba(212,175,55,0.08), transparent)' }} />

              <div style={{ padding: '120px 80px', textAlign: 'center', zIndex: 10 }}>
                <div style={{ color: GOLD, fontSize: 20, letterSpacing: 6, textTransform: 'uppercase', marginBottom: 20 }}>Market Update</div>
                <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 100, lineHeight: 1 }}>
                  Liquidity & <span style={{ color: GOLD }}>Acquisition.</span>
                </div>
              </div>

              <div style={{ flex: 1, padding: '0 80px', display: 'flex', flexDirection: 'column', gap: 40 }}>
                {/* Cards Stacked */}
                <div style={{ background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.05)', padding: 60, textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ color: '#555', fontSize: 20, textTransform: 'uppercase', letterSpacing: 4, marginBottom: 16 }}>Jumbo Portfolio</div>
                  <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 140 }}>{rJumbo}<span style={{ fontSize: 40, fontStyle: 'italic', color: GOLD }}>%</span></div>
                </div>

                <div style={{ background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.05)', padding: 60, textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ color: '#555', fontSize: 20, textTransform: 'uppercase', letterSpacing: 4, marginBottom: 16 }}>15-Year Acq.</div>
                  <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 140 }}>{rFixed15}<span style={{ fontSize: 40, fontStyle: 'italic', color: GOLD }}>%</span></div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: '100px 80px', textAlign: 'center' }}>
                <div style={{ display: 'inline-block', background: 'white', padding: 20, borderRadius: 20, marginBottom: 40 }}>
                  <QRCodeSVG value={shareUrl} size={100} />
                </div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, color: 'white' }}>{data.broker.name} <span style={{ color: '#555', fontFamily: 'Inter' }}>x</span> {data.realtor.name}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Facebook Banner */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Facebook className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Facebook Cover</span>
            <span className="text-xs text-muted-foreground">(1640×624)</span>
          </div>
          <Button size="sm" variant="outline" onClick={() => downloadBanner("facebook")} disabled={isDownloading !== null}>
            {isDownloading === "facebook" ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Download className="w-4 h-4 mr-1.5" />}
            Download
          </Button>
        </div>

        {/* Preview */}
        <div style={{ width: 492, height: 187, overflow: 'hidden', borderRadius: 8, background: '#000' }}>
          <div style={{ transform: 'scale(0.3)', transformOrigin: '0 0' }}>
            <div style={{ width: 1640, height: 624, background: ONYX, position: 'relative', display: 'flex', padding: 60, alignItems: 'center' }} ref={facebookBannerRef}>
              {/* Left Text */}
              <div style={{ width: '40%' }}>
                <div style={{ color: GOLD, fontSize: 16, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 20 }}>Private Client Update</div>
                <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 80, lineHeight: 1 }}>
                  Liquidity & <span style={{ color: GOLD }}>Acquisition.</span>
                </div>
                <div style={{ display: 'flex', gap: 30, marginTop: 40 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {data.broker.headshot && <HeadshotImage src={data.broker.headshot} alt="" size={60} positionY={getY(data.broker.name, data.broker.headshotPosition)} positionX={getX(data.broker.name, data.broker.headshotPositionX)} />}
                    <div><div style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>{data.broker.name}</div><div style={{ color: '#666', fontSize: 14 }}>{data.broker.title}</div></div>
                  </div>
                </div>
              </div>

              {/* Right Rates */}
              <div style={{ flex: 1, display: 'flex', gap: 30 }}>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: 40, textAlign: 'center' }}>
                  <div style={{ color: '#666', fontSize: 14, textTransform: 'uppercase', letterSpacing: 2 }}>Jumbo</div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 80, color: 'white' }}>{rJumbo}</div>
                </div>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: 40, textAlign: 'center' }}>
                  <div style={{ color: '#666', fontSize: 14, textTransform: 'uppercase', letterSpacing: 2 }}>15-Yr Acq.</div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 80, color: 'white' }}>{rFixed15}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
