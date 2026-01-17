import React, { forwardRef } from "react";
import { FlyerData } from "@/types/flyer";

interface LayoutProps {
  data: FlyerData;
}

export const ModernLayout = forwardRef<HTMLDivElement, LayoutProps>(({ data }, ref) => {
  // HELPER: Robust image checker using existing Broker data
  const profileImage = data.broker.headshot && data.broker.headshot.length > 0
    ? data.broker.headshot
    : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

  return (
    <div ref={ref} className="w-full h-full bg-white shadow-none overflow-hidden flex flex-col relative print:shadow-none">
      {/* Hero Image Section */}
      <div className="relative h-2/5 w-full bg-slate-100">
        <img
          src={"https://placehold.co/800x600/png?text=Property+Image"}
          alt="Property"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
          <h1 className="text-4xl font-bold text-white mb-2">{data.marketCopy.headline || "Market Update"}</h1>
          <p className="text-xl text-white/90">{data.regions[0].name || "Local Market"}</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Left Column: Property Details (Mapped to Market Data) */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <span className="block text-slate-500 text-sm uppercase font-bold">30-Yr Fixed</span>
              <span className="block text-2xl font-bold text-slate-900">{data.rates.thirtyYearFixed}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <span className="block text-slate-500 text-sm uppercase font-bold">Jumbo</span>
              <span className="block text-2xl font-bold text-blue-600">{data.rates.thirtyYearJumbo}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <span className="block text-slate-500 text-sm uppercase font-bold">Refi ARM</span>
              <span className="block text-2xl font-bold text-slate-900">{data.rates.fiveOneArm}</span>
            </div>
          </div>

          <div className="prose text-slate-600 max-w-none">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Market Insight</h3>
            <p className="whitespace-pre-wrap">{data.marketCopy.marketInsight}</p>
          </div>
        </div>

        {/* Right Column: Profile Card (Correctly Centered) */}
        <div className="md:col-span-1 flex flex-col justify-end">
          <div className="bg-slate-950 text-white rounded-xl p-6 border border-slate-800 relative overflow-hidden">
            {/* Background pattern effect (optional) */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-slate-800 rounded-full opacity-20 blur-xl"></div>

            <div className="flex flex-col items-center text-center space-y-4 relative z-10">
              {/* Profile Image - Fixed to use the variable defined above */}
              <div className="relative">
                <img
                  src={profileImage}
                  alt={data.broker.name || "Agent"}
                  className="w-24 h-24 rounded-full border-4 border-amber-500 object-cover shadow-md bg-slate-800"
                />
              </div>

              <div className="space-y-1 w-full">
                <h3 className="text-xl font-serif text-amber-500 font-medium tracking-wide">
                  {data.broker.name || "Mortgage Broker"}
                </h3>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {data.broker.title || "Mortgage Broker"}
                </p>
                <p className="text-sm font-medium text-slate-500">
                  NMLS #{data.broker.nmls || "000000"}
                </p>
              </div>

              <div className="w-full pt-4 mt-2 border-t border-slate-800 space-y-1">
                <p className="text-xs text-slate-400 truncate">
                  {data.broker.email}
                </p>
                <p className="text-xs text-slate-400">
                  {data.broker.phone}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="bg-slate-100 p-4 text-[10px] text-slate-400 text-center leading-relaxed">
        {data.marketCopy.marketInsight ? "Rates subject to change. Equal Housing Opportunity." : "Rates subject to change."}
      </div>
    </div>
  );
});

ModernLayout.displayName = "ModernLayout";
