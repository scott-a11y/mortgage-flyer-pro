import { FlyerData } from "@/types/flyer";
import { Home, Phone, Mail, Globe, User } from "lucide-react";
import { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";

interface LayoutProps {
  data: FlyerData;
}

export const ModernLayout = forwardRef<HTMLDivElement, LayoutProps>(
  ({ data }, ref) => {
    const theme = data.colorTheme;
    const primaryColor = theme?.primary || "#B5A26E";
    const secondaryColor = theme?.secondary || "#1C1C1C";

    return (
      <div
        ref={ref}
        className="bg-white w-[612px] h-[792px] shadow-2xl flex flex-col overflow-hidden"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Header Section */}
        <div 
          className="px-6 py-4 flex flex-col items-center justify-center"
          style={{ 
            height: "14%",
            background: `linear-gradient(135deg, ${secondaryColor} 0%, ${secondaryColor}ee 100%)`
          }}
        >
          <div className="flex items-center gap-6 mb-2">
            {data.company.logo ? (
              <img src={data.company.logo} alt={data.company.name} className="h-12 max-w-[140px] object-contain" />
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-white font-bold text-base tracking-wide">IA LOANS</span>
              </div>
            )}
            <div className="h-8 w-px bg-white/30" />
            {data.realtor.logo ? (
              <img src={data.realtor.logo} alt={data.realtor.brokerage} className="h-12 max-w-[140px] object-contain bg-white/90 rounded px-3 py-1.5" />
            ) : (
              <div className="rounded-lg px-4 py-2" style={{ backgroundColor: primaryColor }}>
                <span style={{ color: secondaryColor }} className="font-bold text-sm tracking-wide">
                  {data.realtor.brokerage.split(' ').slice(0, 2).join(' ')}
                </span>
              </div>
            )}
          </div>
          <h1 className="text-white text-xl font-bold text-center leading-tight">
            {data.marketCopy.headline}
          </h1>
          <p className="text-white/90 text-xs text-center mt-1">
            {data.marketCopy.subheading}
          </p>
        </div>

        {/* Rates Table Section with APR */}
        <div className="px-4 py-3" style={{ height: "22%", backgroundColor: "#f8f7f4" }}>
          <div className="grid grid-cols-4 gap-2 h-[calc(100%-1.5rem)]">
            {[
              { label: "30-Year Fixed", rate: data.rates.thirtyYearFixed, apr: data.rates.thirtyYearFixedAPR },
              { label: "15-Year Fixed", rate: data.rates.fifteenYearFixed, apr: data.rates.fifteenYearFixedAPR },
              { label: "30-Year Jumbo", rate: data.rates.thirtyYearJumbo, apr: data.rates.thirtyYearJumboAPR },
              { label: "5/1 ARM", rate: data.rates.fiveOneArm, apr: data.rates.fiveOneArmAPR },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg p-2 flex flex-col items-center justify-center shadow-sm"
                style={{ borderColor: `${primaryColor}30`, borderWidth: 1 }}
              >
                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-0.5">
                  {item.label}
                </span>
                <span className="text-xl font-bold" style={{ color: secondaryColor }}>
                  {item.rate}
                </span>
                <span className="text-[9px] text-gray-500">
                  APR: {item.apr}
                </span>
              </div>
            ))}
          </div>
          <p className="text-center text-[9px] text-gray-500 mt-1.5">
            Rates as of {data.rates.dateGenerated} • Subject to change • APR reflects total loan cost
          </p>
        </div>

        {/* Market Insight Banner */}
        <div className="px-6 py-2 border-y" style={{ borderColor: `${primaryColor}30`, backgroundColor: `${primaryColor}10` }}>
          <p className="text-[10px] text-gray-700 text-center italic">
            "{data.marketCopy.marketInsight}"
          </p>
        </div>

        {/* Regional Insights Section */}
        <div className="px-5 py-3 flex-1 bg-white">
          <h2 className="text-xs font-bold mb-2 text-center uppercase tracking-wide" style={{ color: primaryColor }}>
            Regional Market Insights
          </h2>
          <div className="grid grid-cols-3 gap-3 h-[calc(100%-1.25rem)]">
            {data.regions.map((region, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="flex items-center gap-1.5 mb-1">
                  <Home className="w-3 h-3" style={{ color: primaryColor }} />
                  <h3 className="font-bold text-[11px]" style={{ color: secondaryColor }}>{region.name}</h3>
                </div>
                <p className="text-[9px] font-medium mb-1" style={{ color: primaryColor }}>
                  {region.cities}
                </p>
                <p className="text-[9px] text-gray-600 leading-relaxed flex-1">
                  {region.insight}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section with QR Code */}
        <div 
          className="px-4 py-3 flex items-center justify-center gap-4"
          style={{ background: `linear-gradient(135deg, ${primaryColor}15 0%, ${secondaryColor}08 100%)` }}
        >
          <div className="flex flex-col items-center">
            <p className="text-[10px] text-gray-600 mb-1.5">
              Ready to get started? Get pre-qualified in minutes!
            </p>
            <button 
              className="font-bold py-2 px-6 rounded-lg shadow text-xs uppercase tracking-wide"
              style={{ backgroundColor: primaryColor, color: secondaryColor }}
            >
              {data.cta.buttonText}
            </button>
          </div>
          {data.cta.showQRCode && data.cta.buttonUrl && (
            <div className="bg-white p-1.5 rounded-lg shadow-sm">
              <QRCodeSVG 
                value={data.cta.buttonUrl} 
                size={56}
                level="M"
                fgColor={secondaryColor}
              />
              <p className="text-[7px] text-center text-gray-500 mt-0.5">Scan to apply</p>
            </div>
          )}
        </div>

        {/* Footer Section */}
        <div className="px-4 py-3" style={{ height: "20%", backgroundColor: secondaryColor }}>
          <div className="grid grid-cols-2 gap-3 h-[calc(100%-2.5rem)]">
            {/* Broker Info */}
            <div className="flex gap-2.5 border-r border-white/20 pr-3">
              <div className="flex-shrink-0 w-12 h-12">
                {data.broker.headshot ? (
                  <img 
                    src={data.broker.headshot} 
                    alt={data.broker.name}
                    className="w-12 h-12 rounded-full object-cover"
                    style={{ borderColor: `${primaryColor}80`, borderWidth: 2, aspectRatio: "1/1", objectPosition: "center 25%" }}
                  />
                ) : (
                  <div 
                    className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"
                    style={{ borderColor: "rgba(255,255,255,0.2)", borderWidth: 2 }}
                  >
                    <User className="w-5 h-5 text-white/60" />
                  </div>
                )}
              </div>
              
              <div className="flex flex-col justify-center min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {data.company.logo ? (
                    <img src={data.company.logo} alt={data.company.name} className="h-6 max-w-[80px] object-contain" />
                  ) : (
                    <div className="bg-white/10 rounded px-2 py-0.5">
                      <span className="text-white font-bold text-[9px]">IA LOANS</span>
                    </div>
                  )}
                  <span className="text-white/50 text-[8px]">NMLS #{data.company.nmls}</span>
                </div>
                <p className="text-white font-semibold text-[11px] truncate">{data.broker.name}</p>
                <p className="text-white/70 text-[9px]">{data.broker.title} • NMLS #{data.broker.nmls}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Phone className="w-2 h-2" style={{ color: primaryColor }} />
                  <span className="text-white/90 text-[9px]">{data.broker.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-2 h-2" style={{ color: primaryColor }} />
                  <span className="text-white/90 text-[9px] truncate">{data.broker.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-2 h-2" style={{ color: primaryColor }} />
                  <span className="text-white/90 text-[9px]">{data.company.website}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 pl-3">
              <div className="flex-shrink-0 w-12 h-12">
                {data.realtor.headshot ? (
                  <img 
                    src={data.realtor.headshot} 
                    alt={data.realtor.name}
                    className="w-12 h-12 rounded-full object-cover"
                    style={{ borderColor: primaryColor, borderWidth: 2, aspectRatio: "1/1", objectPosition: "center 25%" }}
                  />
                ) : (
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${primaryColor}30`, borderColor: `${primaryColor}80`, borderWidth: 2 }}
                  >
                    <User className="w-5 h-5" style={{ color: primaryColor }} />
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {data.realtor.logo ? (
                    <img src={data.realtor.logo} alt={data.realtor.brokerage} className="h-6 max-w-[80px] object-contain" />
                  ) : (
                    <div className="rounded px-2 py-0.5" style={{ backgroundColor: primaryColor }}>
                      <span style={{ color: secondaryColor }} className="font-bold text-[9px]">C21</span>
                    </div>
                  )}
                </div>
                <p className="text-white font-semibold text-[11px] truncate">{data.realtor.name}</p>
                <p className="text-[9px] truncate" style={{ color: primaryColor }}>{data.realtor.brokerage}</p>
                <p className="text-white/70 text-[9px]">{data.realtor.title}</p>
                {data.realtor.phone && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Phone className="w-2 h-2" style={{ color: primaryColor }} />
                    <span className="text-white/90 text-[9px]">{data.realtor.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Mail className="w-2 h-2" style={{ color: primaryColor }} />
                  <span className="text-white/90 text-[9px] truncate">{data.realtor.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Disclaimer */}
          <div className="mt-2 pt-1.5 border-t border-white/10">
            <p className="text-white/40 text-[6px] text-center leading-relaxed">
              Equal Housing Opportunity. NMLS #{data.company.nmls}. Rates shown are for informational purposes only and are subject to change without notice. 
              APR (Annual Percentage Rate) reflects the total cost of the loan including fees, points, and other costs. Actual rates may vary based on credit score, 
              loan amount, down payment, and other factors. This is not a commitment to lend or a guarantee of rates. All loans subject to credit approval and underwriting. 
              Contact {data.broker.name} at {data.broker.phone} for current rates and personalized quotes.
            </p>
          </div>
        </div>
      </div>
    );
  }
);

ModernLayout.displayName = "ModernLayout";
