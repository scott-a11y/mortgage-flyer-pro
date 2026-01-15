import { FlyerData } from "@/types/flyer";
import { Phone, Mail, Globe, User, MapPin, TrendingUp } from "lucide-react";
import { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";

interface LayoutProps {
  data: FlyerData;
}

export const TraditionalLayout = forwardRef<HTMLDivElement, LayoutProps>(
  ({ data }, ref) => {
    const theme = data.colorTheme;
    const primaryColor = theme?.primary || "#B5A26E";
    const secondaryColor = theme?.secondary || "#1C1C1C";

    return (
      <div
        ref={ref}
        className="bg-white w-[612px] h-[792px] shadow-2xl flex flex-col overflow-hidden"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        {/* Classic Header with border */}
        <div 
          className="px-6 py-5 text-center"
          style={{ 
            backgroundColor: "#fefefe",
            borderBottom: `3px double ${primaryColor}`
          }}
        >
          <div className="flex items-center justify-center gap-8 mb-3">
            {data.company.logo ? (
              <img src={data.company.logo} alt={data.company.name} className="h-14 max-w-[160px] object-contain" />
            ) : (
              <div className="px-5 py-2.5" style={{ backgroundColor: secondaryColor }}>
                <span className="text-white font-bold text-base tracking-widest">IA MORTGAGE</span>
              </div>
            )}
            <div className="text-3xl font-light" style={{ color: primaryColor }}>×</div>
            {data.realtor.logo ? (
              <img src={data.realtor.logo} alt={data.realtor.brokerage} className="h-14 max-w-[160px] object-contain" />
            ) : (
              <div className="px-5 py-2.5" style={{ backgroundColor: primaryColor }}>
                <span style={{ color: secondaryColor }} className="font-bold text-base tracking-wide">
                  {data.realtor.brokerage}
                </span>
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: secondaryColor }}>
            {data.marketCopy.headline}
          </h1>
          <p className="text-sm italic" style={{ color: primaryColor }}>
            {data.marketCopy.subheading}
          </p>
        </div>

        {/* Rates in Traditional Table Format */}
        <div className="px-6 py-4" style={{ backgroundColor: "#f9f8f5" }}>
          <h2 className="text-center text-xs font-bold uppercase tracking-widest mb-3" style={{ color: primaryColor }}>
            Current Mortgage Rates
          </h2>
          <table className="w-full text-center" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${primaryColor}` }}>
                <th className="py-2 text-[10px] font-bold uppercase" style={{ color: secondaryColor }}>Loan Type</th>
                <th className="py-2 text-[10px] font-bold uppercase" style={{ color: secondaryColor }}>Rate</th>
                <th className="py-2 text-[10px] font-bold uppercase" style={{ color: secondaryColor }}>APR</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "30-Year Fixed", rate: data.rates.thirtyYearFixed, apr: data.rates.thirtyYearFixedAPR },
                { label: "15-Year Fixed", rate: data.rates.fifteenYearFixed, apr: data.rates.fifteenYearFixedAPR },
                { label: "30-Year Jumbo", rate: data.rates.thirtyYearJumbo, apr: data.rates.thirtyYearJumboAPR },
                { label: "5/1 ARM", rate: data.rates.fiveOneArm, apr: data.rates.fiveOneArmAPR },
              ].map((item, idx) => (
                <tr key={idx} style={{ borderBottom: `1px solid ${primaryColor}30` }}>
                  <td className="py-2 text-[11px]" style={{ color: secondaryColor }}>{item.label}</td>
                  <td className="py-2 text-lg font-bold" style={{ color: primaryColor }}>{item.rate}</td>
                  <td className="py-2 text-[11px] text-gray-600">{item.apr}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-center text-[8px] text-gray-500 mt-2 italic">
            Rates effective {data.rates.dateGenerated}. Subject to change without notice.
          </p>
        </div>

        {/* Market Insight Quote Box */}
        <div className="px-8 py-3">
          <div 
            className="p-4 relative"
            style={{ 
              backgroundColor: `${primaryColor}08`,
              borderLeft: `4px solid ${primaryColor}`
            }}
          >
            <div className="text-3xl absolute -top-2 left-2" style={{ color: primaryColor }}>"</div>
            <p className="text-[11px] text-gray-700 italic pl-4">
              {data.marketCopy.marketInsight}
            </p>
          </div>
        </div>

        {/* Regional Markets - Horizontal Cards */}
        <div className="px-6 py-3 flex-1">
          <h2 className="text-center text-xs font-bold uppercase tracking-widest mb-3" style={{ color: primaryColor }}>
            Serving Your Community
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {data.regions.map((region, idx) => (
              <div 
                key={idx} 
                className="p-3 rounded"
                style={{ backgroundColor: `${secondaryColor}05`, border: `1px solid ${primaryColor}20` }}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <MapPin className="w-3 h-3" style={{ color: primaryColor }} />
                  <h3 className="font-bold text-[11px]" style={{ color: secondaryColor }}>{region.name}</h3>
                </div>
                <p className="text-[9px] mb-1" style={{ color: primaryColor }}>{region.cities}</p>
                <p className="text-[9px] text-gray-600 leading-relaxed">{region.insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div 
          className="px-6 py-3 flex items-center justify-between"
          style={{ backgroundColor: primaryColor }}
        >
          <div>
            <p className="text-[11px] font-bold" style={{ color: secondaryColor }}>
              Ready to Find Your Dream Home?
            </p>
            <p className="text-[10px]" style={{ color: `${secondaryColor}cc` }}>
              Get pre-qualified today with personalized service.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              className="font-bold py-2 px-5 rounded text-[11px] uppercase tracking-wide"
              style={{ backgroundColor: secondaryColor, color: "white" }}
            >
              {data.cta.buttonText}
            </button>
            {data.cta.showQRCode && data.cta.buttonUrl && (
              <div className="bg-white p-1.5 rounded">
                <QRCodeSVG 
                  value={data.cta.buttonUrl} 
                  size={44}
                  level="M"
                  fgColor={secondaryColor}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer with Contact Info */}
        <div className="px-4 py-4" style={{ backgroundColor: secondaryColor }}>
          <div className="grid grid-cols-2 gap-4">
            {/* Broker - Side by side, no frame */}
            <div className="flex items-center gap-3 pr-4" style={{ borderRight: `1px solid ${primaryColor}40` }}>
              {data.broker.headshot ? (
                <img 
                  src={data.broker.headshot} 
                  alt={data.broker.name}
                  className="w-14 h-14 object-cover flex-shrink-0 rounded-lg"
                  style={{ objectPosition: 'center top' }}
                />
              ) : (
                <div 
                  className="w-14 h-14 flex items-center justify-center flex-shrink-0 rounded-lg"
                  style={{ backgroundColor: `${primaryColor}30` }}
                >
                  <User className="w-6 h-6" style={{ color: primaryColor }} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-[12px]">{data.broker.name}</p>
                <p className="text-[9px]" style={{ color: primaryColor }}>{data.broker.title}</p>
                <p className="text-white/60 text-[8px]">NMLS #{data.broker.nmls}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Phone className="w-2.5 h-2.5" style={{ color: primaryColor }} />
                  <span className="text-white text-[9px]">{data.broker.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-2.5 h-2.5" style={{ color: primaryColor }} />
                  <span className="text-white text-[9px]">{data.broker.email}</span>
                </div>
              </div>
            </div>

            {/* Realtor - Side by side, no frame */}
            <div className="flex items-center gap-3 pl-2">
              {data.realtor.headshot ? (
                <img 
                  src={data.realtor.headshot} 
                  alt={data.realtor.name}
                  className="w-14 h-14 object-cover flex-shrink-0 rounded-lg"
                  style={{ objectPosition: 'center top' }}
                />
              ) : (
                <div 
                  className="w-14 h-14 flex items-center justify-center flex-shrink-0 rounded-lg"
                  style={{ backgroundColor: `${primaryColor}30` }}
                >
                  <User className="w-6 h-6" style={{ color: primaryColor }} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-[12px]">{data.realtor.name}</p>
                <p className="text-[9px]" style={{ color: primaryColor }}>{data.realtor.brokerage}</p>
                <p className="text-white/60 text-[8px]">{data.realtor.title}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Phone className="w-2.5 h-2.5" style={{ color: primaryColor }} />
                  <span className="text-white text-[9px]">{data.realtor.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-2.5 h-2.5" style={{ color: primaryColor }} />
                  <span className="text-white text-[9px]">{data.realtor.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-3 pt-2" style={{ borderTop: `1px solid ${primaryColor}30` }}>
            <p className="text-white/30 text-[6px] text-center">
              Equal Housing Opportunity. NMLS #{data.company.nmls}. Rates for informational purposes only, subject to change. 
              APR reflects total loan cost. Actual rates vary. Not a commitment to lend. All loans subject to approval. 
              Contact {data.broker.name} at {data.broker.phone} for details.
            </p>
          </div>
        </div>
      </div>
    );
  }
);

TraditionalLayout.displayName = "TraditionalLayout";
