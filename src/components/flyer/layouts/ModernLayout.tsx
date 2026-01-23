import React, { forwardRef } from "react";
import { FlyerData } from "@/types/flyer";
import { Phone, Mail, MapPin } from "lucide-react";
import { FlyerProfileImage } from "../shared/FlyerProfileImage";
import { FlyerLegal } from "../shared/FlyerLegal";

interface LayoutProps {
  data: FlyerData;
}

export const ModernLayout = forwardRef<HTMLDivElement, LayoutProps>(({ data }, ref) => {
  // Safe access to broker data
  const broker = data.broker;
  // Realtor acts as the co-brander
  const realtor = data.realtor;

  return (
    <div ref={ref} data-capture="flyer" className="w-[612px] h-[792px] bg-white shadow-none overflow-hidden flex flex-col relative">
      {/* Hero Section */}
      <div className="relative h-[45%] w-full bg-slate-200">
        <img
          src={data.company.logo || "https://placehold.co/800x600/png?text=Property+Update"}
          alt="Property"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <h1 className="text-5xl font-bold text-white mb-2 leading-tight drop-shadow-lg">{data.marketCopy.headline || "Market Update"}</h1>
          <div className="flex items-center gap-2 text-white/90">
            <MapPin className="w-5 h-5 text-amber-500" />
            <p className="text-xl font-medium">{data.regions[0].name || "Greater Seattle Area"}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 grid grid-cols-12 gap-8 bg-white">

        {/* Left Column: Stats & Description */}
        <div className="col-span-8 flex flex-col gap-8">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
              <span className="block text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">30-Yr Fixed</span>
              <span className="block text-3xl font-bold text-slate-900">{data.rates.thirtyYearFixed}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
              <span className="block text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Jumbo Port.</span>
              <span className="block text-3xl font-bold text-blue-600">{data.rates.thirtyYearJumbo}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
              <span className="block text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">15-Yr Fixed</span>
              <span className="block text-3xl font-bold text-slate-900">{data.rates.fifteenYearFixed}</span>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <h3 className="text-xl font-bold text-slate-900 mb-3">Market Insight</h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{data.marketCopy.marketInsight}</p>
          </div>
        </div>

        {/* Right Column: Profiles (The Footer) */}
        <div className="col-span-4 flex flex-col justify-end gap-4">

          {/* Main Broker Card - CENTERED */}
          <div className="bg-slate-950 text-white rounded-2xl p-6 relative overflow-hidden text-center flex flex-col items-center shadow-xl">
            <FlyerProfileImage
              src={broker.headshot}
              alt={broker.name}
              position={broker.headshotPosition}
              className="w-20 h-20 rounded-full border-2 border-amber-500/20 mb-4 shadow-inner"
            />
            <div className="flex items-center justify-center gap-2 mb-1">
              <h3 className="text-xl font-serif text-amber-500 font-medium tracking-wide">
                {broker.name || "Scott Little"}
              </h3>
              {data.company.logo && (
                <img src={data.company.logo} alt="IA Loans" className="h-5 w-auto object-contain opacity-80" />
              )}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
              {broker.title || "Mortgage Broker"}
            </p>

            <div className="w-full pt-4 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-300">
                <Phone className="w-3 h-3 text-amber-500/50" /> {broker.phone}
              </div>
              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-300">
                <Mail className="w-3 h-3 text-amber-500/50" /> {broker.email}
              </div>
              <p className="text-[9px] text-slate-500 mt-2">NMLS #{broker.nmls}</p>
            </div>
          </div>

          {/* Co-Brand Card (Realtor) */}
          {realtor && realtor.name && (
            <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3 border border-slate-200">
              <FlyerProfileImage
                src={realtor.headshot}
                alt={realtor.name}
                position={realtor.headshotPosition}
                className="w-10 h-10 rounded-full border border-slate-200"
              />
              <div className="text-left overflow-hidden">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-xs font-bold text-slate-900 truncate">{realtor.name}</p>
                  {realtor.logo && (
                    <img src={realtor.logo} alt="Brokerage" className="h-4 w-auto object-contain opacity-70" />
                  )}
                </div>
                <p className="text-[10px] text-slate-500 truncate mb-1">{realtor.brokerage || "Real Estate Professional"}</p>
                <div className="flex flex-col gap-0.5 text-[9px] text-slate-400">
                  <div className="flex items-center gap-1"><Phone className="w-2.5 h-2.5 opacity-50" /> {realtor.phone}</div>
                  <div className="flex items-center gap-1"><Mail className="w-2.5 h-2.5 opacity-50" /> {realtor.email}</div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer Legal */}
      <FlyerLegal data={data} className="p-3 bg-slate-50" />
    </div>
  );
});

ModernLayout.displayName = "ModernLayout";
