import { FlyerData } from "@/types/flyer";
import { Home, Phone, Mail, Globe } from "lucide-react";
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
        <div className="flyer-gradient-header px-6 py-5 flex flex-col items-center justify-center"
          style={{ height: "18%" }}>
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-white font-bold text-xl tracking-wide">IA LOANS</span>
            </div>
            <div className="h-6 w-px bg-white/30" />
            <div className="bg-flyer-gold rounded-lg px-4 py-2">
              <span className="text-flyer-charcoal font-bold text-sm tracking-wide">CENTURY 21</span>
            </div>
          </div>
          <h1 className="text-white text-2xl md:text-3xl font-bold text-center leading-tight">
            {data.marketCopy.headline}
          </h1>
          <p className="text-white/90 text-sm text-center mt-1">
            {data.marketCopy.subheading}
          </p>
        </div>

        {/* Rates Table Section - Warm neutral background */}
        <div className="bg-flyer-bg-warm px-6 py-4" style={{ height: "22%" }}>
          <div className="grid grid-cols-4 gap-3 h-full">
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
        <div className="px-6 py-3 border-y" style={{ borderColor: 'hsl(43, 38%, 56%, 0.3)', backgroundColor: 'hsl(43, 38%, 56%, 0.08)' }}>
          <p className="text-sm text-flyer-text-primary text-center italic">
            "{data.marketCopy.marketInsight}"
          </p>
        </div>

        {/* Regional Insights Section */}
        <div className="px-6 py-4 flex-1 bg-white">
          <h2 className="text-base font-bold text-flyer-gold-dark mb-3 text-center uppercase tracking-wide">
            Regional Market Insights
          </h2>
          <div className="grid grid-cols-3 gap-4 h-[calc(100%-2rem)]">
            {data.regions.map((region, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="w-4 h-4 text-flyer-gold-dark" />
                  <h3 className="font-bold text-flyer-charcoal text-sm">{region.name}</h3>
                </div>
                <p className="text-xs text-flyer-gold-dark mb-2 font-medium">
                  {region.cities}
                </p>
                <p className="text-xs text-flyer-text-primary leading-relaxed flex-1">
                  {region.insight}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section - Gold gradient */}
        <div className="px-6 py-4 flex flex-col items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(43, 38%, 56%, 0.15) 0%, hsl(210, 100%, 20%, 0.08) 100%)' }}>
          <p className="text-xs text-flyer-text-secondary mb-2">
            Ready to get started? Get pre-qualified in minutes!
          </p>
          <button className="bg-flyer-gold hover:bg-flyer-gold-dark text-flyer-charcoal font-bold py-3 px-8 rounded-lg shadow-lg text-sm uppercase tracking-wide transition-colors">
            {data.cta.buttonText}
          </button>
        </div>

        {/* Footer Section - Charcoal with Gold accents */}
        <div className="bg-flyer-charcoal px-6 py-4" style={{ height: "18%" }}>
          <div className="grid grid-cols-2 gap-4 h-full">
            {/* IA Loans / Broker Info */}
            <div className="flex flex-col justify-center border-r border-white/20 pr-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-white/10 rounded px-2 py-1">
                  <span className="text-white font-bold text-xs">IA LOANS</span>
                </div>
                <span className="text-white/60 text-xs">NMLS #{data.company.nmls}</span>
              </div>
              <p className="text-white font-semibold text-sm">{data.broker.name}</p>
              <p className="text-white/80 text-xs">{data.broker.title} • NMLS #{data.broker.nmls}</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-flyer-gold" />
                  <span className="text-white/90 text-xs">{data.broker.phone}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Mail className="w-3 h-3 text-flyer-gold" />
                <span className="text-white/90 text-xs">{data.broker.email}</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Globe className="w-3 h-3 text-flyer-gold" />
                <span className="text-white/90 text-xs">{data.company.website}</span>
              </div>
            </div>

            {/* Realtor Info - Century 21 Gold branding */}
            <div className="flex flex-col justify-center pl-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-flyer-gold rounded px-2 py-1">
                  <span className="text-flyer-charcoal font-bold text-xs">C21</span>
                </div>
                <span className="text-flyer-gold text-xs">{data.realtor.brokerage}</span>
              </div>
              <p className="text-white font-semibold text-sm">{data.realtor.name}</p>
              <p className="text-white/80 text-xs">Real Estate Professional</p>
              {data.realtor.phone && (
                <div className="flex items-center gap-1 mt-2">
                  <Phone className="w-3 h-3 text-flyer-gold" />
                  <span className="text-white/90 text-xs">{data.realtor.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-1 mt-1">
                <Mail className="w-3 h-3 text-flyer-gold" />
                <span className="text-white/90 text-xs">{data.realtor.email}</span>
              </div>
              {data.realtor.website && (
                <div className="flex items-center gap-1 mt-1">
                  <Globe className="w-3 h-3 text-flyer-gold" />
                  <span className="text-white/90 text-xs">{data.realtor.website}</span>
                </div>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-3 pt-2 border-t border-white/10">
            <p className="text-white/40 text-[8px] text-center leading-relaxed">
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
