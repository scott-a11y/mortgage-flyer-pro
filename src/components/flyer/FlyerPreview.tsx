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
        {/* Header Section - 20% */}
        <div className="flyer-gradient-header px-6 py-5 flex flex-col items-center justify-center"
          style={{ height: "18%" }}>
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-white font-bold text-xl tracking-wide">IA LOANS</span>
            </div>
          </div>
          <h1 className="text-white text-2xl md:text-3xl font-bold text-center leading-tight">
            {data.marketCopy.headline}
          </h1>
          <p className="text-white/90 text-sm text-center mt-1">
            {data.marketCopy.subheading}
          </p>
        </div>

        {/* Rates Table Section - 22% */}
        <div className="bg-flyer-bg-neutral px-6 py-4" style={{ height: "22%" }}>
          <div className="grid grid-cols-4 gap-3 h-full">
            {[
              { label: "30-Year Fixed", value: data.rates.thirtyYearFixed },
              { label: "15-Year Fixed", value: data.rates.fifteenYearFixed },
              { label: "30-Year Jumbo", value: data.rates.thirtyYearJumbo },
              { label: "5/1 ARM", value: data.rates.fiveOneArm },
            ].map((rate, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg p-3 flex flex-col items-center justify-center shadow-sm border border-gray-100"
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

        {/* Market Insight Banner */}
        <div className="bg-flyer-navy/5 px-6 py-3 border-y border-flyer-navy/10">
          <p className="text-sm text-flyer-text-primary text-center italic">
            "{data.marketCopy.marketInsight}"
          </p>
        </div>

        {/* Regional Insights Section - 28% */}
        <div className="px-6 py-4 flex-1">
          <h2 className="text-base font-bold text-flyer-navy mb-3 text-center uppercase tracking-wide">
            Regional Market Insights
          </h2>
          <div className="grid grid-cols-3 gap-4 h-[calc(100%-2rem)]">
            {data.regions.map((region, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="w-4 h-4 text-flyer-gold" />
                  <h3 className="font-bold text-flyer-navy text-sm">{region.name}</h3>
                </div>
                <p className="text-xs text-flyer-text-secondary mb-2 font-medium">
                  {region.cities}
                </p>
                <p className="text-xs text-flyer-text-primary leading-relaxed flex-1">
                  {region.insight}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section - 12% */}
        <div className="bg-gradient-to-r from-flyer-light-blue/10 to-flyer-gold/10 px-6 py-4 flex flex-col items-center justify-center">
          <p className="text-xs text-flyer-text-secondary mb-2">
            Ready to get started? Get pre-qualified in minutes!
          </p>
          <button className="flyer-gradient-cta text-white font-bold py-3 px-8 rounded-lg shadow-lg text-sm uppercase tracking-wide">
            {data.cta.buttonText}
          </button>
        </div>

        {/* Footer Section - 18% */}
        <div className="bg-flyer-navy px-6 py-4" style={{ height: "18%" }}>
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
                  <Phone className="w-3 h-3 text-white/60" />
                  <span className="text-white/90 text-xs">{data.broker.phone}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Mail className="w-3 h-3 text-white/60" />
                <span className="text-white/90 text-xs">{data.broker.email}</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Globe className="w-3 h-3 text-white/60" />
                <span className="text-white/90 text-xs">{data.company.website}</span>
              </div>
            </div>

            {/* Realtor Info */}
            <div className="flex flex-col justify-center pl-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-flyer-gold/80 rounded px-2 py-1">
                  <span className="text-white font-bold text-xs">C21</span>
                </div>
                <span className="text-white/60 text-xs">{data.realtor.brokerage}</span>
              </div>
              <p className="text-white font-semibold text-sm">{data.realtor.name}</p>
              <p className="text-white/80 text-xs">Real Estate Professional</p>
              {data.realtor.phone && (
                <div className="flex items-center gap-1 mt-2">
                  <Phone className="w-3 h-3 text-white/60" />
                  <span className="text-white/90 text-xs">{data.realtor.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-1 mt-1">
                <Mail className="w-3 h-3 text-white/60" />
                <span className="text-white/90 text-xs">{data.realtor.email}</span>
              </div>
              {data.realtor.website && (
                <div className="flex items-center gap-1 mt-1">
                  <Globe className="w-3 h-3 text-white/60" />
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
