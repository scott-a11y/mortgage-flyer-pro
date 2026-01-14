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
  email: { width: 600, height: 200, scale: 2 },
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

        {/* Email Banner (600x200) */}
        <div className="overflow-hidden rounded-lg border shadow-sm">
          <div
            ref={emailBannerRef}
            className="relative overflow-hidden"
            style={{
              width: 600,
              height: 200,
              background: `linear-gradient(135deg, ${themeSecondary} 0%, ${themeSecondary}ee 50%, ${themeColor}22 100%)`,
            }}
          >
            {/* Decorative elements */}
            <div
              className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20"
              style={{ background: themeColor, transform: "translate(30%, -30%)" }}
            />

            {/* Content */}
            <div className="relative z-10 h-full flex items-center justify-between px-4 py-3">
              {/* Left side - Contacts (stacked horizontally) */}
              <div className="flex items-center gap-3" style={{ width: 200 }}>
                {/* Broker */}
                <div className="flex items-center gap-1.5">
                  {data.broker.headshot && (
                    <img
                      src={data.broker.headshot}
                      alt={data.broker.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                      style={{ objectPosition: `center ${data.broker.headshotPosition ?? 25}%` }}
                    />
                  )}
                  <div className="min-w-0">
                    <div className="text-white font-semibold text-[10px] truncate leading-tight">{data.broker.name}</div>
                    <div className="text-white/80 text-[9px] leading-tight">{data.broker.phone}</div>
                  </div>
                </div>
                {/* Realtor */}
                <div className="flex items-center gap-1.5">
                  {data.realtor.headshot && (
                    <img
                      src={data.realtor.headshot}
                      alt={data.realtor.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                      style={{ objectPosition: `center ${data.realtor.headshotPosition ?? 25}%` }}
                    />
                  )}
                  <div className="min-w-0">
                    <div className="text-white font-semibold text-[10px] truncate leading-tight">{data.realtor.name}</div>
                    <div className="text-white/80 text-[9px] leading-tight">{data.realtor.phone}</div>
                  </div>
                </div>
              </div>

              {/* Center - Branding & Rates */}
              <div className="flex-1 px-3">
                <div className="flex items-center gap-1.5 justify-center mb-1">
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center font-bold text-white text-[10px]"
                    style={{ background: themeColor }}
                  >
                    IA
                  </div>
                  <div className="text-white font-semibold text-xs">IA Mortgage</div>
                </div>
                <div className="flex gap-2 justify-center">
                  <div className="bg-white/10 backdrop-blur rounded px-2.5 py-1.5 text-center">
                    <div className="text-white/70 text-[9px]">30-Yr Fixed</div>
                    <div className="text-white font-bold text-base leading-tight">{data.rates.thirtyYearFixed}</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded px-2.5 py-1.5 text-center">
                    <div className="text-white/70 text-[9px]">15-Yr Fixed</div>
                    <div className="text-white font-bold text-base leading-tight">{data.rates.fifteenYearFixed}</div>
                  </div>
                </div>
                <div className="text-white/50 text-[8px] text-center mt-1">
                  As of {data.rates.dateGenerated} • NMLS #{data.company.nmls}
                </div>
              </div>

              {/* Right side - QR Code and CTA */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="bg-white p-1 rounded shadow-lg">
                  <QRCodeSVG value={shareUrl} size={55} level="M" />
                </div>
                <div
                  className="px-2 py-1 rounded-full text-white text-[10px] font-semibold shadow-lg"
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
              <div className="relative z-10 h-full flex flex-col items-center justify-between p-12">
                {/* Header with branding and contacts */}
                <div className="w-full flex items-center justify-between">
                  {/* Broker */}
                  <div className="flex items-center gap-4">
                    {data.broker.headshot && (
                      <img
                        src={data.broker.headshot}
                        alt={data.broker.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-white/30 shadow-xl"
                        style={{ objectPosition: `center ${data.broker.headshotPosition ?? 25}%` }}
                      />
                    )}
                    <div>
                      <div className="text-white font-bold text-xl">{data.broker.name}</div>
                      <div className="text-white/60 text-sm">{data.broker.title}</div>
                      <div className="text-white/80 text-sm mt-1">{data.broker.phone}</div>
                    </div>
                  </div>

                  {/* Center - IA Branding */}
                  <div className="text-center">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-white text-2xl shadow-xl mx-auto"
                      style={{ background: themeColor }}
                    >
                      IA
                    </div>
                    <div className="text-white font-bold text-2xl mt-2">IA Mortgage</div>
                    <div className="text-white/60 text-sm">NMLS #{data.company.nmls}</div>
                  </div>

                  {/* Realtor */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-white font-bold text-xl">{data.realtor.name}</div>
                      <div className="text-white/60 text-sm">{data.realtor.title}</div>
                      <div className="text-white/80 text-sm mt-1">{data.realtor.phone}</div>
                    </div>
                    {data.realtor.headshot && (
                      <img
                        src={data.realtor.headshot}
                        alt={data.realtor.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-white/30 shadow-xl"
                        style={{ objectPosition: `center ${data.realtor.headshotPosition ?? 25}%` }}
                      />
                    )}
                  </div>
                </div>

                {/* Rates */}
                <div className="text-center space-y-5">
                  <div className="text-white/80 text-xl uppercase tracking-widest">
                    Today's Mortgage Rates
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5">
                      <div className="text-white/70 text-base">30-Year Fixed</div>
                      <div className="text-white font-bold text-5xl mt-1">{data.rates.thirtyYearFixed}</div>
                      <div className="text-white/50 text-sm mt-1">APR {data.rates.thirtyYearFixedAPR}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5">
                      <div className="text-white/70 text-base">15-Year Fixed</div>
                      <div className="text-white font-bold text-5xl mt-1">{data.rates.fifteenYearFixed}</div>
                      <div className="text-white/50 text-sm mt-1">APR {data.rates.fifteenYearFixedAPR}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5">
                      <div className="text-white/70 text-base">30-Year Jumbo</div>
                      <div className="text-white font-bold text-5xl mt-1">{data.rates.thirtyYearJumbo}</div>
                      <div className="text-white/50 text-sm mt-1">APR {data.rates.thirtyYearJumboAPR}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5">
                      <div className="text-white/70 text-base">5/1 ARM</div>
                      <div className="text-white font-bold text-5xl mt-1">{data.rates.fiveOneArm}</div>
                      <div className="text-white/50 text-sm mt-1">APR {data.rates.fiveOneArmAPR}</div>
                    </div>
                  </div>
                </div>

                {/* Footer with QR and CTA */}
                <div className="flex items-center gap-6">
                  <div className="bg-white p-3 rounded-2xl shadow-xl">
                    <QRCodeSVG value={shareUrl} size={100} level="M" />
                  </div>
                  <div className="text-center">
                    <div
                      className="px-6 py-3 rounded-full text-white text-xl font-bold shadow-xl"
                      style={{ background: themeColor }}
                    >
                      Scan for Live Rates
                    </div>
                    <div className="text-white/40 text-sm mt-2">
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
