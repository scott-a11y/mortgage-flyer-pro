import { FlyerData } from "@/types/flyer";
import { Home, Phone, Mail, Globe, User, Building } from "lucide-react";
import { forwardRef } from "react";

interface FlyerPreviewProps {
  data: FlyerData;
}

export const FlyerPreview = forwardRef<HTMLDivElement, FlyerPreviewProps>(
  ({ data }, ref) => {
    return (
      <div
        ref={ref}
        className="bg-white w-[612px] h-[792px] shadow-2xl flex flex-col overflow-hidden"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Header Section - Navy Blue with Gold accent */}
        <div className="flyer-gradient-header px-6 py-4 flex flex-col items-center justify-center"
          style={{ height: "16%" }}>
          <div className="flex items-center gap-4 mb-2">
            {/* IA Loans Logo */}
            {data.company.logo ? (
              <img src={data.company.logo} alt={data.company.name} className="h-10 object-contain" />
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-white font-bold text-lg tracking-wide">IA LOANS</span>
              </div>
            )}
            <div className="h-6 w-px bg-white/30" />
            {/* Realtor Brokerage Logo */}
            {data.realtor.logo ? (
              <img src={data.realtor.logo} alt={data.realtor.brokerage} className="h-10 object-contain bg-white/90 rounded px-2 py-1" />
            ) : (
              <div className="bg-flyer-gold rounded-lg px-4 py-2">
                <span className="text-flyer-charcoal font-bold text-sm tracking-wide">
                  {data.realtor.brokerage.split(' ').slice(0, 2).join(' ')}
                </span>
              </div>
            )}
          </div>
          <h1 className="text-white text-xl md:text-2xl font-bold text-center leading-tight">
            {data.marketCopy.headline}
          </h1>
          <p className="text-white/90 text-sm text-center mt-1">
            {data.marketCopy.subheading}
          </p>
        </div>

        {/* Rates Table Section - Warm neutral background */}
        <div className="bg-flyer-bg-warm px-6 py-3" style={{ height: "20%" }}>
          <div className="grid grid-cols-4 gap-3 h-[calc(100%-1.5rem)]">
            {[
              { label: "30-Year Fixed", value: data.rates.thirtyYearFixed },
              { label: "15-Year Fixed", value: data.rates.fifteenYearFixed },
              { label: "30-Year Jumbo", value: data.rates.thirtyYearJumbo },
              { label: "5/1 ARM", value: data.rates.fiveOneArm },
            ].map((rate, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg p-3 flex flex-col items-center justify-center shadow-sm border border-flyer-gold/20"
              >
                <span className="text-xs font-medium text-flyer-text-secondary uppercase tracking-wide mb-1">
                  {rate.label}
                </span>
                <span className="text-2xl font-bold text-flyer-navy">
                  {rate.value}
                </span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-flyer-text-secondary mt-2">
            Rates as of {data.rates.dateGenerated} • Subject to change • Contact for personalized quote
          </p>
        </div>

        {/* Market Insight Banner - Gold accent */}
        <div className="px-6 py-2 border-y" style={{ borderColor: 'hsl(43, 38%, 56%, 0.3)', backgroundColor: 'hsl(43, 38%, 56%, 0.08)' }}>
          <p className="text-xs text-flyer-text-primary text-center italic">
            "{data.marketCopy.marketInsight}"
          </p>
        </div>

        {/* Regional Insights Section */}
        <div className="px-6 py-3 flex-1 bg-white">
          <h2 className="text-sm font-bold text-flyer-gold-dark mb-2 text-center uppercase tracking-wide">
            Regional Market Insights
          </h2>
          <div className="grid grid-cols-3 gap-3 h-[calc(100%-1.5rem)]">
            {data.regions.map((region, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <Home className="w-3.5 h-3.5 text-flyer-gold-dark" />
                  <h3 className="font-bold text-flyer-charcoal text-xs">{region.name}</h3>
                </div>
                <p className="text-[10px] text-flyer-gold-dark mb-1 font-medium">
                  {region.cities}
                </p>
                <p className="text-[10px] text-flyer-text-primary leading-relaxed flex-1">
                  {region.insight}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section - Gold gradient */}
        <div className="px-6 py-3 flex flex-col items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(43, 38%, 56%, 0.15) 0%, hsl(210, 100%, 20%, 0.08) 100%)' }}>
          <p className="text-xs text-flyer-text-secondary mb-1.5">
            Ready to get started? Get pre-qualified in minutes!
          </p>
          <button className="bg-flyer-gold hover:bg-flyer-gold-dark text-flyer-charcoal font-bold py-2.5 px-6 rounded-lg shadow-lg text-sm uppercase tracking-wide transition-colors">
            {data.cta.buttonText}
          </button>
        </div>

        {/* Footer Section - Charcoal with headshots and branding */}
        <div className="bg-flyer-charcoal px-4 py-3" style={{ height: "22%" }}>
          <div className="grid grid-cols-2 gap-3 h-[calc(100%-2rem)]">
            {/* IA Loans / Broker Info */}
            <div className="flex gap-3 border-r border-white/20 pr-3">
              {/* Broker Headshot */}
              <div className="flex-shrink-0">
                {data.broker.headshot ? (
                  <img 
                    src={data.broker.headshot} 
                    alt={data.broker.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-flyer-gold/50"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20">
                    <User className="w-6 h-6 text-white/60" />
                  </div>
                )}
              </div>
              
              <div className="flex flex-col justify-center min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {data.company.logo ? (
                    <img src={data.company.logo} alt={data.company.name} className="h-5 object-contain" />
                  ) : (
                    <div className="bg-white/10 rounded px-1.5 py-0.5">
                      <span className="text-white font-bold text-[10px]">IA LOANS</span>
                    </div>
                  )}
                  <span className="text-white/50 text-[9px]">NMLS #{data.company.nmls}</span>
                </div>
                <p className="text-white font-semibold text-xs truncate">{data.broker.name}</p>
                <p className="text-white/70 text-[10px]">{data.broker.title} • NMLS #{data.broker.nmls}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Phone className="w-2.5 h-2.5 text-flyer-gold" />
                  <span className="text-white/90 text-[10px]">{data.broker.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-2.5 h-2.5 text-flyer-gold" />
                  <span className="text-white/90 text-[10px] truncate">{data.broker.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-2.5 h-2.5 text-flyer-gold" />
                  <span className="text-white/90 text-[10px]">{data.company.website}</span>
                </div>
              </div>
            </div>

            {/* Realtor Info - Century 21 Gold branding */}
            <div className="flex gap-3 pl-3">
              {/* Realtor Headshot */}
              <div className="flex-shrink-0">
                {data.realtor.headshot ? (
                  <img 
                    src={data.realtor.headshot} 
                    alt={data.realtor.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-flyer-gold"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-flyer-gold/20 flex items-center justify-center border-2 border-flyer-gold/50">
                    <User className="w-6 h-6 text-flyer-gold" />
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {data.realtor.logo ? (
                    <img src={data.realtor.logo} alt={data.realtor.brokerage} className="h-5 object-contain" />
                  ) : (
                    <div className="bg-flyer-gold rounded px-1.5 py-0.5">
                      <span className="text-flyer-charcoal font-bold text-[10px]">C21</span>
                    </div>
                  )}
                </div>
                <p className="text-white font-semibold text-xs truncate">{data.realtor.name}</p>
                <p className="text-flyer-gold text-[10px] truncate">{data.realtor.brokerage}</p>
                <p className="text-white/70 text-[10px]">{data.realtor.title}</p>
                {data.realtor.phone && (
                  <div className="flex items-center gap-1 mt-1">
                    <Phone className="w-2.5 h-2.5 text-flyer-gold" />
                    <span className="text-white/90 text-[10px]">{data.realtor.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Mail className="w-2.5 h-2.5 text-flyer-gold" />
                  <span className="text-white/90 text-[10px] truncate">{data.realtor.email}</span>
                </div>
                {data.realtor.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="w-2.5 h-2.5 text-flyer-gold" />
                    <span className="text-white/90 text-[10px]">{data.realtor.website}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-2 pt-1.5 border-t border-white/10">
            <p className="text-white/40 text-[7px] text-center leading-relaxed">
              Equal Housing Opportunity. Rates subject to change without notice. This is not a commitment to lend. 
              Programs, rates, terms and conditions subject to change. All loans subject to credit approval.
            </p>
          </div>
        </div>
      </div>
    );
  }
);

FlyerPreview.displayName = "FlyerPreview";
