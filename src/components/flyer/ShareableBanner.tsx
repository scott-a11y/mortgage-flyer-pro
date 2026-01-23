import { useRef, useState } from "react";
import { FlyerData } from "@/types/flyer";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Mail, Share2, Smartphone, Facebook, Copy } from "lucide-react";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import { EmailBanner } from "./banners/EmailBanner";
import { SocialBanner } from "./banners/SocialBanner";
import { StoriesBanner } from "./banners/StoriesBanner";
import { FacebookBanner } from "./banners/FacebookBanner";

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
      await new Promise(resolve => setTimeout(resolve, 200));

      const canvas = await html2canvas(ref.current, {
        scale: bannerDimensions[format].scale,
        useCORS: true,
        backgroundColor: "#050505",
        logging: false,
        onclone: (clonedDoc) => {
          const banner = clonedDoc.querySelector('[data-capture="banner"]');
          if (banner instanceof HTMLElement) {
            banner.style.transform = 'none';
          }
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

  // Rates formatting
  const rJumbo = data.rates.thirtyYearJumbo.replace('%', '');
  const rFixed30 = data.rates.thirtyYearFixed.replace('%', '');
  const rFixed15 = data.rates.fifteenYearFixed.replace('%', '');

  const isConventional = data.rateType === 'conventional';
  const label1 = isConventional ? '30-Yr Fixed' : 'Jumbo';
  const value1 = isConventional ? rFixed30 : rJumbo;
  const label3 = isConventional ? '15-Yr Fixed' : '15-Yr Acq.';

  return (
    <div className="space-y-8 pb-12">
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

      {/* Email Banner */}
      <BannerSection
        icon={<Mail className="w-4 h-4" />}
        title="Email Banner"
        size="600×200"
        format="email"
        isDownloading={isDownloading}
        onDownload={downloadBanner}
      >
        <div ref={emailBannerRef}>
          <EmailBanner data={data} label1={label1} value1={value1} label3={label3} rFixed15={rFixed15} />
        </div>
      </BannerSection>

      {/* Social Media Card */}
      <BannerSection
        icon={<Share2 className="w-4 h-4" />}
        title="Social Media Card"
        size="1080×1080"
        format="social"
        isDownloading={isDownloading}
        onDownload={downloadBanner}
        previewScale={0.333}
        previewWidth={360}
        previewHeight={360}
      >
        <div ref={socialBannerRef}>
          <SocialBanner data={data} rJumbo={rJumbo} rFixed15={rFixed15} shareUrl={shareUrl} />
        </div>
      </BannerSection>

      {/* Stories */}
      <BannerSection
        icon={<Smartphone className="w-4 h-4" />}
        title="Stories"
        size="1080×1920"
        format="stories"
        isDownloading={isDownloading}
        onDownload={downloadBanner}
        previewScale={0.2}
        previewWidth={216}
        previewHeight={384}
      >
        <div ref={storiesBannerRef}>
          <StoriesBanner data={data} rJumbo={rJumbo} rFixed15={rFixed15} shareUrl={shareUrl} />
        </div>
      </BannerSection>

      {/* Facebook Cover */}
      <BannerSection
        icon={<Facebook className="w-4 h-4" />}
        title="Facebook Cover"
        size="1640×624"
        format="facebook"
        isDownloading={isDownloading}
        onDownload={downloadBanner}
        previewScale={0.3}
        previewWidth={492}
        previewHeight={187}
      >
        <div ref={facebookBannerRef}>
          <FacebookBanner data={data} rJumbo={rJumbo} rFixed15={rFixed15} />
        </div>
      </BannerSection>

    </div>
  );
}

function BannerSection({
  icon,
  title,
  size,
  format,
  isDownloading,
  onDownload,
  children,
  previewScale = 1,
  previewWidth,
  previewHeight
}: {
  icon: React.ReactNode;
  title: string;
  size: string;
  format: BannerFormat;
  isDownloading: BannerFormat | null;
  onDownload: (f: BannerFormat) => void;
  children: React.ReactNode;
  previewScale?: number;
  previewWidth?: number;
  previewHeight?: number;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{icon}</span>
          <span className="text-sm font-medium">{title}</span>
          <span className="text-xs text-muted-foreground">({size})</span>
        </div>
        <Button size="sm" variant="outline" onClick={() => onDownload(format)} disabled={isDownloading !== null}>
          {isDownloading === format ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Download className="w-4 h-4 mr-1.5" />}
          Download
        </Button>
      </div>
      <div
        className="overflow-hidden rounded-lg border bg-black shadow-inner"
        style={{ width: previewWidth, height: previewHeight }}
      >
        <div style={{ transform: `scale(${previewScale})`, transformOrigin: '0 0' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
