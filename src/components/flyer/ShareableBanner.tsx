import { useRef, useState } from "react";
import { FlyerData } from "@/types/flyer";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Download, Loader2, Mail, Share2, Smartphone, Facebook } from "lucide-react";
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
  email: { width: 600, height: 200, scale: 2 },
  social: { width: 1080, height: 1080, scale: 2 },
  stories: { width: 1080, height: 1920, scale: 2 },
  facebook: { width: 1640, height: 624, scale: 2 },
};

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

        {/* Email Banner (600x200) - Clean 2-row layout */}
        <div className="rounded-lg border" style={{ width: 600, overflow: 'hidden' }}>
          <div
            ref={emailBannerRef}
            style={{
              width: 600,
              height: 200,
              background: `linear-gradient(135deg, ${themeSecondary} 0%, ${themeSecondary} 70%, ${themeColor}40 100%)`,
            }}
          >
            {/* Row 1: Contacts and Branding */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              {/* Left - Broker */}
              <div className="flex items-center gap-3">
                {data.broker.headshot && (
                  <img
                    src={data.broker.headshot}
                    alt={data.broker.name}
                    className="rounded-lg object-cover border-2 border-white/30"
                    style={{ 
                      width: 48, 
                      height: 48, 
                      objectPosition: `center ${data.broker.headshotPosition ?? 15}%`
                    }}
                  />
                )}
                <div>
                  <div className="text-white font-semibold text-xs leading-tight">{data.broker.name}</div>
                  <div className="text-white/50 text-[9px] leading-tight">NMLS #{data.broker.nmls}</div>
                  <div className="text-white/70 text-[10px] leading-tight">{data.broker.phone}</div>
                </div>
              </div>

              {/* Center - Branding */}
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-sm"
                  style={{ background: themeColor }}
                >
                  IA
                </div>
                <div>
                  <div className="text-white font-bold text-sm leading-tight">IA Mortgage</div>
                  <div className="text-white/50 text-[9px]">NMLS #{data.company.nmls}</div>
                  <div className="text-white/60 text-[8px]">{data.company.website}</div>
                </div>
              </div>

              {/* Right - Realtor */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-white font-semibold text-xs leading-tight">{data.realtor.name}</div>
                  <div className="text-white/50 text-[9px] leading-tight">Lic# 134081</div>
                  <div className="text-white/70 text-[10px] leading-tight">{data.realtor.phone}</div>
                </div>
                {data.realtor.headshot && (
                  <img
                    src={data.realtor.headshot}
                    alt={data.realtor.name}
                    className="rounded-lg object-cover border-2 border-white/30"
                    style={{ 
                      width: 48, 
                      height: 48, 
                      objectPosition: `center ${data.realtor.headshotPosition ?? 25}%`
                    }}
                  />
                )}
              </div>
            </div>

            {/* Row 2: Rates and CTA */}
            <div className="flex items-center justify-between px-5 pb-4 pt-2">
              {/* Left - Rates with APR */}
              <div className="flex gap-3">
                <div className="bg-white/15 rounded-lg px-3 py-2 text-center">
                  <div className="text-white/60 text-[7px] uppercase tracking-wide">30-Year Fixed</div>
                  <div className="text-white font-bold text-lg leading-none">{data.rates.thirtyYearFixed}</div>
                  <div className="text-white/50 text-[8px]">{data.rates.thirtyYearFixedAPR} APR</div>
                </div>
                <div className="bg-white/15 rounded-lg px-3 py-2 text-center">
                  <div className="text-white/60 text-[7px] uppercase tracking-wide">15-Year Fixed</div>
                  <div className="text-white font-bold text-lg leading-none">{data.rates.fifteenYearFixed}</div>
                  <div className="text-white/50 text-[8px]">{data.rates.fifteenYearFixedAPR} APR</div>
                </div>
                <div className="bg-white/15 rounded-lg px-3 py-2 text-center">
                  <div className="text-white/60 text-[7px] uppercase tracking-wide">30-Yr Jumbo</div>
                  <div className="text-white font-bold text-lg leading-none">{data.rates.thirtyYearJumbo}</div>
                  <div className="text-white/50 text-[8px]">{data.rates.thirtyYearJumboAPR} APR</div>
                </div>
              </div>

              {/* Right - QR and CTA */}
              <div className="flex items-center gap-3">
                <div className="bg-white p-1.5 rounded-lg">
                  <QRCodeSVG value={shareUrl} size={50} level="M" />
                </div>
                <div className="flex flex-col items-start gap-1">
                  <div
                    className="px-3 py-1.5 rounded-full text-white text-[10px] font-semibold whitespace-nowrap"
                    style={{ background: themeColor }}
                  >
                    View Live Rates →
                  </div>
                  <div className="text-white/40 text-[8px]">
                    As of {data.rates.dateGenerated}
                  </div>
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
        <div 
          className="rounded-lg border bg-muted/20"
          style={{ width: 360, height: 360, overflow: 'hidden' }}
        >
          <div
            style={{ 
              transform: "scale(0.333)", 
              transformOrigin: "top left",
              width: 1080,
              height: 1080,
            }}
          >
            <div
              ref={socialBannerRef}
              style={{
                width: 1080,
                height: 1080,
                background: `linear-gradient(180deg, ${themeSecondary} 0%, ${themeSecondary}f0 40%, ${themeColor}33 100%)`,
              }}
            >
              {/* Content */}
              <div className="h-full flex flex-col items-center justify-between p-12">
                {/* Header with branding and contacts */}
                <div className="w-full flex items-center justify-between">
                  {/* Broker */}
                  <div className="flex items-center gap-4">
                    {data.broker.headshot && (
                      <img
                        src={data.broker.headshot}
                        alt={data.broker.name}
                        className="w-24 h-24 rounded-2xl object-cover border-4 border-white/20"
                        style={{ objectPosition: `center ${data.broker.headshotPosition ?? 15}%` }}
                      />
                    )}
                    <div>
                      <div className="text-white font-bold text-2xl">{data.broker.name}</div>
                      <div className="text-white/50 text-base">NMLS #{data.broker.nmls}</div>
                      <div className="text-white/70 text-base mt-1">{data.broker.phone}</div>
                    </div>
                  </div>

                  {/* Center - IA Branding */}
                  <div className="text-center">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-white text-3xl mx-auto"
                      style={{ background: themeColor }}
                    >
                      IA
                    </div>
                    <div className="text-white font-bold text-2xl mt-3">IA Mortgage</div>
                    <div className="text-white/50 text-base">NMLS #{data.company.nmls}</div>
                  </div>

                  {/* Realtor */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-white font-bold text-2xl">{data.realtor.name}</div>
                      <div className="text-white/50 text-base">Lic# 134081</div>
                      <div className="text-white/70 text-base mt-1">{data.realtor.phone}</div>
                    </div>
                    {data.realtor.headshot && (
                      <img
                        src={data.realtor.headshot}
                        alt={data.realtor.name}
                        className="w-24 h-24 rounded-2xl object-cover border-4 border-white/20"
                        style={{ objectPosition: `center ${data.realtor.headshotPosition ?? 25}%` }}
                      />
                    )}
                  </div>
                </div>

                {/* Rates */}
                <div className="text-center">
                  <div className="text-white/70 text-2xl uppercase tracking-widest">
                    Today's Mortgage Rates
                  </div>

                  <div className="grid grid-cols-2 gap-6 mt-6">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                      <div className="text-white/60 text-lg">30-Year Fixed</div>
                      <div className="text-white font-bold text-6xl mt-2">{data.rates.thirtyYearFixed}</div>
                      <div className="text-white/50 text-lg mt-2">{data.rates.thirtyYearFixedAPR} APR</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                      <div className="text-white/60 text-lg">15-Year Fixed</div>
                      <div className="text-white font-bold text-6xl mt-2">{data.rates.fifteenYearFixed}</div>
                      <div className="text-white/50 text-lg mt-2">{data.rates.fifteenYearFixedAPR} APR</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                      <div className="text-white/60 text-lg">30-Year Jumbo</div>
                      <div className="text-white font-bold text-6xl mt-2">{data.rates.thirtyYearJumbo}</div>
                      <div className="text-white/50 text-lg mt-2">{data.rates.thirtyYearJumboAPR} APR</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                      <div className="text-white/60 text-lg">5/1 ARM</div>
                      <div className="text-white font-bold text-6xl mt-2">{data.rates.fiveOneArm}</div>
                      <div className="text-white/50 text-lg mt-2">{data.rates.fiveOneArmAPR} APR</div>
                    </div>
                  </div>
                </div>

                {/* Footer with QR and CTA */}
                <div className="flex items-center gap-8">
                  <div className="bg-white p-4 rounded-2xl">
                    <QRCodeSVG value={shareUrl} size={110} level="M" />
                  </div>
                  <div className="text-center">
                    <div
                      className="px-8 py-4 rounded-full text-white text-2xl font-bold"
                      style={{ background: themeColor }}
                    >
                      Scan for Live Rates
                    </div>
                    <div className="text-white/40 text-base mt-3">
                      As of {data.rates.dateGenerated} • Rates subject to change
                    </div>
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

        {/* Stories Banner (1080x1920) - Scaled down for preview */}
        <div 
          className="rounded-lg border bg-muted/20"
          style={{ width: 216, height: 384, overflow: 'hidden' }}
        >
          <div
            style={{ 
              transform: "scale(0.2)", 
              transformOrigin: "top left",
              width: 1080,
              height: 1920,
            }}
          >
            <div
              ref={storiesBannerRef}
              style={{
                width: 1080,
                height: 1920,
                background: `linear-gradient(180deg, ${themeSecondary} 0%, ${themeSecondary}f0 50%, ${themeColor}44 100%)`,
              }}
            >
              {/* Content */}
              <div className="h-full flex flex-col items-center justify-between py-16 px-12">
                {/* Top Branding */}
                <div className="text-center">
                  <div
                    className="w-28 h-28 rounded-3xl flex items-center justify-center font-bold text-white text-5xl mx-auto"
                    style={{ background: themeColor }}
                  >
                    IA
                  </div>
                  <div className="text-white font-bold text-4xl mt-6">IA Mortgage</div>
                  <div className="text-white/50 text-2xl">NMLS #{data.company.nmls}</div>
                  <div className="text-white/60 text-xl mt-2">{data.company.website}</div>
                </div>

                {/* Headline */}
                <div className="text-center">
                  <div className="text-white/70 text-3xl uppercase tracking-widest">
                    Today's Rates
                  </div>
                  <div className="text-white font-bold text-6xl mt-4">
                    {data.rates.dateGenerated}
                  </div>
                </div>

                {/* Rates - Vertical Stack */}
                <div className="w-full space-y-5">
                  <div className="bg-white/10 rounded-3xl p-6 flex items-center justify-between">
                    <div>
                      <div className="text-white/60 text-xl">30-Year Fixed</div>
                      <div className="text-white/40 text-lg">{data.rates.thirtyYearFixedAPR} APR</div>
                    </div>
                    <div className="text-white font-bold text-7xl">{data.rates.thirtyYearFixed}</div>
                  </div>
                  <div className="bg-white/10 rounded-3xl p-6 flex items-center justify-between">
                    <div>
                      <div className="text-white/60 text-xl">15-Year Fixed</div>
                      <div className="text-white/40 text-lg">{data.rates.fifteenYearFixedAPR} APR</div>
                    </div>
                    <div className="text-white font-bold text-7xl">{data.rates.fifteenYearFixed}</div>
                  </div>
                  <div className="bg-white/10 rounded-3xl p-6 flex items-center justify-between">
                    <div>
                      <div className="text-white/60 text-xl">30-Year Jumbo</div>
                      <div className="text-white/40 text-lg">{data.rates.thirtyYearJumboAPR} APR</div>
                    </div>
                    <div className="text-white font-bold text-7xl">{data.rates.thirtyYearJumbo}</div>
                  </div>
                  <div className="bg-white/10 rounded-3xl p-6 flex items-center justify-between">
                    <div>
                      <div className="text-white/60 text-xl">5/1 ARM</div>
                      <div className="text-white/40 text-lg">{data.rates.fiveOneArmAPR} APR</div>
                    </div>
                    <div className="text-white font-bold text-7xl">{data.rates.fiveOneArm}</div>
                  </div>
                </div>

                {/* Bottom - Contacts and QR */}
                <div className="w-full">
                  {/* Contacts Row */}
                  <div className="flex items-center justify-between mb-8">
                    {/* Broker */}
                    <div className="flex items-center gap-4">
                      {data.broker.headshot && (
                        <img
                          src={data.broker.headshot}
                          alt={data.broker.name}
                          className="w-20 h-20 rounded-2xl object-cover border-3 border-white/20"
                          style={{ objectPosition: `center ${data.broker.headshotPosition ?? 15}%` }}
                        />
                      )}
                      <div>
                        <div className="text-white font-bold text-xl">{data.broker.name}</div>
                        <div className="text-white/50 text-base">NMLS #{data.broker.nmls}</div>
                        <div className="text-white/70 text-base">{data.broker.phone}</div>
                      </div>
                    </div>

                    {/* Realtor */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-white font-bold text-xl">{data.realtor.name}</div>
                        <div className="text-white/50 text-base">Lic# 134081</div>
                        <div className="text-white/70 text-base">{data.realtor.phone}</div>
                      </div>
                      {data.realtor.headshot && (
                        <img
                          src={data.realtor.headshot}
                          alt={data.realtor.name}
                          className="w-20 h-20 rounded-2xl object-cover border-3 border-white/20"
                          style={{ objectPosition: `center ${data.realtor.headshotPosition ?? 25}%` }}
                        />
                      )}
                    </div>
                  </div>

                  {/* QR and CTA */}
                  <div className="flex items-center justify-center gap-8">
                    <div className="bg-white p-4 rounded-2xl">
                      <QRCodeSVG value={shareUrl} size={100} level="M" />
                    </div>
                    <div className="text-center">
                      <div
                        className="px-8 py-4 rounded-full text-white text-2xl font-bold"
                        style={{ background: themeColor }}
                      >
                        Scan for Live Rates
                      </div>
                      <div className="text-white/40 text-lg mt-3">
                        Rates subject to change
                      </div>
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

        {/* Facebook Cover (1640x624) - Scaled down for preview */}
        <div 
          className="rounded-lg border bg-muted/20"
          style={{ width: 492, height: 187, overflow: 'hidden' }}
        >
          <div
            style={{ 
              transform: "scale(0.3)", 
              transformOrigin: "top left",
              width: 1640,
              height: 624,
            }}
          >
            <div
              ref={facebookBannerRef}
              style={{
                width: 1640,
                height: 624,
                background: `linear-gradient(135deg, ${themeSecondary} 0%, ${themeSecondary}f0 60%, ${themeColor}44 100%)`,
              }}
            >
              {/* Content */}
              <div className="h-full flex items-center justify-between px-16 py-10">
                {/* Left - Contacts */}
                <div className="flex items-center gap-8">
                  {/* Broker */}
                  <div className="flex items-center gap-5">
                    {data.broker.headshot && (
                      <img
                        src={data.broker.headshot}
                        alt={data.broker.name}
                        className="w-28 h-28 rounded-2xl object-cover border-4 border-white/20"
                        style={{ objectPosition: `center ${data.broker.headshotPosition ?? 15}%` }}
                      />
                    )}
                    <div>
                      <div className="text-white font-bold text-2xl">{data.broker.name}</div>
                      <div className="text-white/50 text-lg">NMLS #{data.broker.nmls}</div>
                      <div className="text-white/70 text-lg mt-1">{data.broker.phone}</div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-px h-24 bg-white/20" />

                  {/* Realtor */}
                  <div className="flex items-center gap-5">
                    {data.realtor.headshot && (
                      <img
                        src={data.realtor.headshot}
                        alt={data.realtor.name}
                        className="w-28 h-28 rounded-2xl object-cover border-4 border-white/20"
                        style={{ objectPosition: `center ${data.realtor.headshotPosition ?? 25}%` }}
                      />
                    )}
                    <div>
                      <div className="text-white font-bold text-2xl">{data.realtor.name}</div>
                      <div className="text-white/50 text-lg">Lic# 134081</div>
                      <div className="text-white/70 text-lg mt-1">{data.realtor.phone}</div>
                    </div>
                  </div>
                </div>

                {/* Center - Rates */}
                <div className="flex gap-5">
                  <div className="bg-white/10 rounded-2xl px-6 py-5 text-center">
                    <div className="text-white/60 text-base">30-Year Fixed</div>
                    <div className="text-white font-bold text-5xl mt-1">{data.rates.thirtyYearFixed}</div>
                    <div className="text-white/50 text-base mt-1">{data.rates.thirtyYearFixedAPR} APR</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl px-6 py-5 text-center">
                    <div className="text-white/60 text-base">15-Year Fixed</div>
                    <div className="text-white font-bold text-5xl mt-1">{data.rates.fifteenYearFixed}</div>
                    <div className="text-white/50 text-base mt-1">{data.rates.fifteenYearFixedAPR} APR</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl px-6 py-5 text-center">
                    <div className="text-white/60 text-base">30-Yr Jumbo</div>
                    <div className="text-white font-bold text-5xl mt-1">{data.rates.thirtyYearJumbo}</div>
                    <div className="text-white/50 text-base mt-1">{data.rates.thirtyYearJumboAPR} APR</div>
                  </div>
                </div>

                {/* Right - Branding & QR */}
                <div className="flex items-center gap-8">
                  {/* Branding */}
                  <div className="text-center">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-white text-3xl mx-auto"
                      style={{ background: themeColor }}
                    >
                      IA
                    </div>
                    <div className="text-white font-bold text-2xl mt-3">IA Mortgage</div>
                    <div className="text-white/50 text-base">NMLS #{data.company.nmls}</div>
                    <div className="text-white/60 text-sm mt-1">{data.company.website}</div>
                  </div>

                  {/* QR */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-white p-3 rounded-xl">
                      <QRCodeSVG value={shareUrl} size={90} level="M" />
                    </div>
                    <div
                      className="px-5 py-2 rounded-full text-white text-base font-semibold"
                      style={{ background: themeColor }}
                    >
                      Scan for Live Rates
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
