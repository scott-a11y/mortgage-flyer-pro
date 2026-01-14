import { FlyerData } from "@/types/flyer";
import { Phone, Mail, Globe, User, Diamond, Sparkles } from "lucide-react";
import { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";

interface LayoutProps {
  data: FlyerData;
}

export const LuxuryLayout = forwardRef<HTMLDivElement, LayoutProps>(
  ({ data }, ref) => {
    const theme = data.colorTheme;
    const primaryColor = theme?.primary || "#B5A26E";
    const secondaryColor = theme?.secondary || "#1C1C1C";
    const goldAccent = "#D4AF37";

    return (
      <div
        ref={ref}
        className="bg-[#0a0a0a] w-[612px] h-[792px] shadow-2xl flex flex-col overflow-hidden relative"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2" style={{ borderColor: goldAccent }} />
        <div className="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2" style={{ borderColor: goldAccent }} />
        <div className="absolute bottom-0 left-0 w-20 h-20 border-l-2 border-b-2" style={{ borderColor: goldAccent }} />
        <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2" style={{ borderColor: goldAccent }} />

        {/* Elegant Header */}
        <div className="px-8 py-6 text-center relative z-10">
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${goldAccent})` }} />
            <Diamond className="w-4 h-4" style={{ color: goldAccent }} />
            <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${goldAccent}, transparent)` }} />
          </div>
          
          <div className="flex items-center justify-center gap-8 mb-4">
            {data.company.logo ? (
              <img src={data.company.logo} alt={data.company.name} className="h-8 object-contain invert" />
            ) : (
              <span className="text-white font-light text-lg tracking-[0.3em] uppercase">IA Mortgage</span>
            )}
            <span style={{ color: goldAccent }} className="text-2xl">|</span>
            {data.realtor.logo ? (
              <img src={data.realtor.logo} alt={data.realtor.brokerage} className="h-8 object-contain" />
            ) : (
              <span style={{ color: goldAccent }} className="font-light text-lg tracking-widest uppercase">
                {data.realtor.brokerage.split(' ').slice(0, 2).join(' ')}
              </span>
            )}
          </div>

          <h1 className="text-white text-2xl font-light tracking-wide mb-2">
            {data.marketCopy.headline}
          </h1>
          <p className="text-sm tracking-widest uppercase" style={{ color: goldAccent }}>
            {data.marketCopy.subheading}
          </p>
        </div>

        {/* Luxury Rate Cards */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "30-Year Fixed", rate: data.rates.thirtyYearFixed, apr: data.rates.thirtyYearFixedAPR },
              { label: "15-Year Fixed", rate: data.rates.fifteenYearFixed, apr: data.rates.fifteenYearFixedAPR },
              { label: "30-Year Jumbo", rate: data.rates.thirtyYearJumbo, apr: data.rates.thirtyYearJumboAPR },
              { label: "5/1 ARM", rate: data.rates.fiveOneArm, apr: data.rates.fiveOneArmAPR },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-3 text-center relative"
                style={{ 
                  background: `linear-gradient(180deg, ${goldAccent}15 0%, transparent 100%)`,
                  border: `1px solid ${goldAccent}40`
                }}
              >
                <span className="text-[9px] font-light uppercase tracking-widest block mb-1" style={{ color: goldAccent }}>
                  {item.label}
                </span>
                <span className="text-2xl font-light text-white block">
                  {item.rate}
                </span>
                <span className="text-[9px] text-gray-500 block">
                  APR {item.apr}
                </span>
              </div>
            ))}
          </div>
          <p className="text-center text-[8px] text-gray-600 mt-2 tracking-widest uppercase">
            Rates as of {data.rates.dateGenerated}
          </p>
        </div>

        {/* Market Insight - Luxury Quote */}
        <div className="px-10 py-4">
          <div className="text-center">
            <Sparkles className="w-4 h-4 mx-auto mb-2" style={{ color: goldAccent }} />
            <p className="text-white/80 text-[11px] italic leading-relaxed font-light">
              "{data.marketCopy.marketInsight}"
            </p>
          </div>
        </div>

        {/* Premium Regional Insights */}
        <div className="px-6 py-3 flex-1">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12" style={{ backgroundColor: goldAccent }} />
            <h2 className="text-[10px] tracking-[0.25em] uppercase" style={{ color: goldAccent }}>
              Exclusive Market Insights
            </h2>
            <div className="h-px w-12" style={{ backgroundColor: goldAccent }} />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {data.regions.map((region, idx) => (
              <div key={idx} className="text-center">
                <h3 className="text-white font-light text-[12px] mb-1 tracking-wide">{region.name}</h3>
                <p className="text-[9px] mb-1.5" style={{ color: goldAccent }}>{region.cities}</p>
                <p className="text-[9px] text-gray-500 leading-relaxed font-light">{region.insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Luxury CTA */}
        <div className="px-8 py-4">
          <div 
            className="flex items-center justify-between p-4"
            style={{ 
              border: `1px solid ${goldAccent}`,
              background: `linear-gradient(90deg, ${goldAccent}10, transparent, ${goldAccent}10)`
            }}
          >
            <div>
              <p className="text-white text-[12px] font-light tracking-wide">
                Begin Your Exclusive Journey
              </p>
              <p className="text-[10px] text-gray-500">Private consultation available</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                className="font-light py-2.5 px-8 text-[10px] uppercase tracking-[0.2em]"
                style={{ backgroundColor: goldAccent, color: "#0a0a0a" }}
              >
                {data.cta.buttonText}
              </button>
              {data.cta.showQRCode && data.cta.buttonUrl && (
                <div className="p-1.5" style={{ backgroundColor: "white" }}>
                  <QRCodeSVG 
                    value={data.cta.buttonUrl} 
                    size={44}
                    level="M"
                    fgColor="#0a0a0a"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Premium Footer */}
        <div className="px-6 py-4" style={{ backgroundColor: "#050505" }}>
          <div className="grid grid-cols-2 gap-6">
            {/* Broker */}
            <div className="flex gap-4 items-center">
              {data.broker.headshot ? (
                <div className="flex-shrink-0 w-16 h-16">
                  <img 
                    src={data.broker.headshot} 
                    alt={data.broker.name}
                    className="w-16 h-16 rounded-full object-cover"
                    style={{ border: `1px solid ${goldAccent}`, aspectRatio: "1/1", objectPosition: "center top" }}
                  />
                </div>
              ) : (
                <div 
                  className="w-16 h-16 flex items-center justify-center"
                  style={{ border: `1px solid ${goldAccent}30` }}
                >
                  <User className="w-6 h-6" style={{ color: goldAccent }} />
                </div>
              )}
              <div>
                <p className="text-white font-light text-[13px] tracking-wide">{data.broker.name}</p>
                <p className="text-[9px]" style={{ color: goldAccent }}>{data.broker.title}</p>
                <p className="text-gray-600 text-[8px]">NMLS #{data.broker.nmls}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Phone className="w-2.5 h-2.5" style={{ color: goldAccent }} />
                  <span className="text-white/80 text-[9px]">{data.broker.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-2.5 h-2.5" style={{ color: goldAccent }} />
                  <span className="text-white/80 text-[9px]">{data.broker.email}</span>
                </div>
              </div>
            </div>

            {/* Realtor */}
            <div className="flex gap-4 items-center justify-end">
              <div className="text-right">
                <p className="text-white font-light text-[13px] tracking-wide">{data.realtor.name}</p>
                <p className="text-[9px]" style={{ color: goldAccent }}>{data.realtor.brokerage}</p>
                <p className="text-gray-600 text-[8px]">{data.realtor.title}</p>
                <div className="flex items-center gap-2 mt-1.5 justify-end">
                  <span className="text-white/80 text-[9px]">{data.realtor.phone}</span>
                  <Phone className="w-2.5 h-2.5" style={{ color: goldAccent }} />
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-white/80 text-[9px]">{data.realtor.email}</span>
                  <Mail className="w-2.5 h-2.5" style={{ color: goldAccent }} />
                </div>
              </div>
              <div className="flex-shrink-0 w-16 h-16">
                {data.realtor.headshot ? (
                  <img 
                    src={data.realtor.headshot} 
                    alt={data.realtor.name}
                    className="w-16 h-16 rounded-full object-cover"
                    style={{ border: `1px solid ${goldAccent}`, aspectRatio: "1/1", objectPosition: "center top" }}
                  />
                ) : (
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ border: `1px solid ${goldAccent}30` }}
                  >
                    <User className="w-6 h-6" style={{ color: goldAccent }} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-3 pt-2" style={{ borderTop: `1px solid ${goldAccent}20` }}>
            <p className="text-gray-700 text-[6px] text-center tracking-wide">
              Equal Housing Opportunity. NMLS #{data.company.nmls}. Rates for informational purposes only. Subject to change. 
              APR reflects total loan cost. Contact {data.broker.name} at {data.broker.phone} for personalized rates.
            </p>
          </div>
        </div>
      </div>
    );
  }
);

LuxuryLayout.displayName = "LuxuryLayout";
