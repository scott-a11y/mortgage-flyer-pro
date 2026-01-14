import { useRef, useState } from "react";
import { FlyerData } from "@/types/flyer";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Download, Loader2, Mail, Share2 } from "lucide-react";
import html2canvas from "html2canvas";
import { toast } from "sonner";

interface ShareableBannerProps {
  data: FlyerData;
  shareUrl: string;
}

type BannerFormat = "email" | "social";

interface BannerDimensions {
  width: number;
  height: number;
  scale: number;
}

const bannerDimensions: Record<BannerFormat, BannerDimensions> = {
  email: { width: 600, height: 300, scale: 2 },
  social: { width: 1080, height: 1080, scale: 2 },
};

export function ShareableBanner({ data, shareUrl }: ShareableBannerProps) {
  const emailBannerRef = useRef<HTMLDivElement>(null);
  const socialBannerRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState<BannerFormat | null>(null);

  const downloadBanner = async (format: BannerFormat) => {
    const ref = format === "email" ? emailBannerRef : socialBannerRef;
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

      toast.success(`${format === "email" ? "Email" : "Social"} banner downloaded!`);
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
            <span className="text-xs text-muted-foreground">(600×300)</span>
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

        {/* Email Banner (600x300) */}
        <div className="overflow-hidden rounded-lg border shadow-sm">
          <div
            ref={emailBannerRef}
            className="relative overflow-hidden"
            style={{
              width: 600,
              height: 300,
              background: `linear-gradient(135deg, ${themeSecondary} 0%, ${themeSecondary}ee 50%, ${themeColor}22 100%)`,
            }}
          >
            {/* Decorative elements */}
            <div
              className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20"
              style={{ background: themeColor, transform: "translate(30%, -30%)" }}
            />
            <div
              className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10"
              style={{ background: themeColor, transform: "translate(-30%, 30%)" }}
            />

            {/* Content */}
            <div className="relative z-10 h-full flex items-center justify-between p-6">
              {/* Left side - Branding and Rates */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-sm"
                    style={{ background: themeColor }}
                  >
                    IA
                  </div>
                  <div>
                    <div className="text-white font-semibold text-lg">IA Mortgage</div>
                    <div className="text-white/60 text-xs">NMLS #{data.company.nmls}</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-white/90 text-xs uppercase tracking-wider">Today's Rates</div>
                  <div className="flex gap-4">
                    <div className="bg-white/10 backdrop-blur rounded-lg px-3 py-2">
                      <div className="text-white/70 text-xs">30-Yr Fixed</div>
                      <div className="text-white font-bold text-xl">{data.rates.thirtyYearFixed}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur rounded-lg px-3 py-2">
                      <div className="text-white/70 text-xs">15-Yr Fixed</div>
                      <div className="text-white font-bold text-xl">{data.rates.fifteenYearFixed}</div>
                    </div>
                  </div>
                </div>

                <div className="text-white/50 text-[10px]">
                  As of {data.rates.dateGenerated} • Subject to change
                </div>
              </div>

              {/* Right side - QR Code and CTA */}
              <div className="flex flex-col items-center gap-3">
                <div className="bg-white p-2 rounded-lg shadow-lg">
                  <QRCodeSVG value={shareUrl} size={80} level="M" />
                </div>
                <div
                  className="px-4 py-2 rounded-full text-white text-sm font-semibold shadow-lg"
                  style={{ background: themeColor }}
                >
                  View Live Rates →
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

        {/* Social Banner (1080x1080) - Scaled down for preview */}
        <div className="overflow-hidden rounded-lg border shadow-sm">
          <div
            className="origin-top-left"
            style={{ transform: "scale(0.333)", transformOrigin: "top left", width: 1080, height: 1080 / 3 }}
          >
            <div
              ref={socialBannerRef}
              className="relative overflow-hidden"
              style={{
                width: 1080,
                height: 1080,
                background: `linear-gradient(180deg, ${themeSecondary} 0%, ${themeSecondary}f0 40%, ${themeColor}33 100%)`,
              }}
            >
              {/* Decorative circles */}
              <div
                className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-15"
                style={{ background: themeColor, transform: "translate(30%, -30%)" }}
              />
              <div
                className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10"
                style={{ background: themeColor, transform: "translate(-30%, 30%)" }}
              />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col items-center justify-between p-16">
                {/* Header */}
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-white text-3xl shadow-xl"
                      style={{ background: themeColor }}
                    >
                      IA
                    </div>
                  </div>
                  <div>
                    <div className="text-white font-bold text-4xl">IA Mortgage</div>
                    <div className="text-white/60 text-lg mt-1">NMLS #{data.company.nmls}</div>
                  </div>
                </div>

                {/* Rates */}
                <div className="text-center space-y-6">
                  <div className="text-white/80 text-xl uppercase tracking-widest">
                    Today's Mortgage Rates
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                      <div className="text-white/70 text-lg">30-Year Fixed</div>
                      <div className="text-white font-bold text-6xl mt-2">{data.rates.thirtyYearFixed}</div>
                      <div className="text-white/50 text-sm mt-1">APR {data.rates.thirtyYearFixedAPR}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                      <div className="text-white/70 text-lg">15-Year Fixed</div>
                      <div className="text-white font-bold text-6xl mt-2">{data.rates.fifteenYearFixed}</div>
                      <div className="text-white/50 text-sm mt-1">APR {data.rates.fifteenYearFixedAPR}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                      <div className="text-white/70 text-lg">30-Year Jumbo</div>
                      <div className="text-white font-bold text-6xl mt-2">{data.rates.thirtyYearJumbo}</div>
                      <div className="text-white/50 text-sm mt-1">APR {data.rates.thirtyYearJumboAPR}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                      <div className="text-white/70 text-lg">5/1 ARM</div>
                      <div className="text-white font-bold text-6xl mt-2">{data.rates.fiveOneArm}</div>
                      <div className="text-white/50 text-sm mt-1">APR {data.rates.fiveOneArmAPR}</div>
                    </div>
                  </div>
                </div>

                {/* Footer with QR and CTA */}
                <div className="flex items-center gap-8">
                  <div className="bg-white p-4 rounded-2xl shadow-xl">
                    <QRCodeSVG value={shareUrl} size={120} level="M" />
                  </div>
                  <div className="text-center">
                    <div
                      className="px-8 py-4 rounded-full text-white text-2xl font-bold shadow-xl"
                      style={{ background: themeColor }}
                    >
                      Scan for Live Rates
                    </div>
                    <div className="text-white/40 text-sm mt-3">
                      As of {data.rates.dateGenerated} • Rates subject to change
                    </div>
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
