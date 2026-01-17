import { FlyerData } from "@/types/flyer";
import { ArrowUpRight, ShieldCheck, TrendingDown, Landmark, Building2, Flag } from "lucide-react";
import { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";

interface LayoutProps {
  data: FlyerData;
}

export const LuxuryLayout = forwardRef<HTMLDivElement, LayoutProps>(
  ({ data }, ref) => {
    // PREPARE DATA
    const jumboRate = data.rates.thirtyYearJumbo.replace('%', '');
    const fixed30Rate = data.rates.thirtyYearFixed.replace('%', '');
    const fixed15Rate = data.rates.fifteenYearFixed.replace('%', '');
    const fhaRate = data.rates.fha ? data.rates.fha.replace('%', '') : '5.50';
    const vaRate = data.rates.va ? data.rates.va.replace('%', '') : '5.50';

    const isConv = data.rateType === 'conventional';
    const isGov = data.rateType === 'government';

    // Left Card
    const label1 = isGov ? 'FHA 30-Year' : (isConv ? '30-Year Fixed' : 'Jumbo Portfolio');
    const rate1 = isGov ? fhaRate : (isConv ? fixed30Rate : jumboRate);

    // Right Card
    const label3 = isGov ? 'VA 30-Year' : (isConv ? '15-Year Fixed' : '15-Year Acq.');
    const rate3 = isGov ? vaRate : (isConv ? fixed15Rate : fixed15Rate);

    return (
      <div
        ref={ref}
        className="bg-[#050505] w-[612px] h-[792px] shadow-2xl flex flex-col relative overflow-hidden text-slate-200"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {/* AMBIENT GLOW */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none"></div>

        {/* --- HEADER --- */}
        <div className="relative z-10 px-8 pt-10 pb-6 text-center border-b border-white/5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-[8px] uppercase tracking-[0.2em] text-slate-400 font-medium font-sans">
              {isGov ? 'Government Loan Update' : 'Private Client Market Update'}
            </span>
          </div>

          <h1 className="text-4xl font-serif text-white tracking-tight mb-3">
            {isGov ? (
              <>Security & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-500">Stability.</span></>
            ) : (
              <>Liquidity & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Acquisition.</span></>
            )}
          </h1>

          <p className="text-slate-400 max-w-sm mx-auto text-[10px] leading-relaxed font-sans font-light">
            {isGov
              ? "Accessible financing solutions with government-backed security. Low down payment options for your future."
              : "Strategic financing structures designed for the complex portfolio. Leverage equity to secure your next property without contingency."
            }
          </p>
        </div>

        {/* --- DATA GRID --- */}
        <div className="grid grid-cols-3 divide-x divide-white/5 bg-[#0a0a0c] border-b border-white/5">

          {/* Left Card */}
          <div className="p-6 flex flex-col items-center text-center group">
            <div className={`mb-3 p-3 rounded-full bg-slate-900 border border-white/10 transition-colors ${isGov ? 'group-hover:border-blue-500/30' : ''}`}>
              {isGov ? <Building2 className="w-4 h-4 text-slate-400" /> : <ShieldCheck className="w-4 h-4 text-slate-400" />}
            </div>
            <h3 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 font-sans">{label1}</h3>
            <div className="flex items-start justify-center gap-0.5 mb-1">
              <span className="text-3xl font-light text-white tracking-tighter">{rate1}</span>
              <span className={`text-xs font-serif italic mt-1 ${isGov ? 'text-blue-500/80' : 'text-amber-500/80'}`}>%</span>
            </div>
            <p className="text-[8px] text-slate-500 px-1 leading-relaxed font-sans">
              {isGov ? "Low down payment FHA financing." : "Flexible underwriting for high-net-worth liquidity."}
            </p>
          </div>

          {/* Bridge Strategy (Hero) */}
          <div className="p-6 bg-gradient-to-b from-amber-900/10 to-transparent flex flex-col items-center text-center relative">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-40"></div>
            <div className="mb-3 p-3 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Landmark className="w-4 h-4" />
            </div>
            <h3 className="text-[9px] font-bold text-amber-500 uppercase tracking-widest mb-1 font-sans">Bridge Strategy</h3>
            <div className="flex items-center justify-center h-[36px]">
              <span className="text-xl font-serif text-white italic">Non-Contingent</span>
            </div>
            <p className="text-[8px] text-amber-500/80 px-1 leading-relaxed mt-1 font-sans">
              Buy before you sell. <span className="text-slate-500">Secure the asset first.</span>
            </p>
          </div>

          {/* Right Card */}
          <div className="p-6 flex flex-col items-center text-center">
            <div className={`mb-3 p-3 rounded-full bg-slate-900 border border-white/10 transition-colors ${isGov ? 'group-hover:border-red-500/30' : ''}`}>
              {isGov ? <Flag className="w-4 h-4 text-slate-400" /> : <TrendingDown className="w-4 h-4 text-slate-400" />}
            </div>
            <h3 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 font-sans">{label3}</h3>
            <div className="flex items-start justify-center gap-0.5 mb-1">
              <span className="text-3xl font-light text-white tracking-tighter">{rate3}</span>
              <span className={`text-xs font-serif italic mt-1 ${isGov ? 'text-red-500/80' : 'text-emerald-500/80'}`}>%</span>
            </div>
            <p className="text-[8px] text-slate-500 px-1 leading-relaxed font-sans">
              {isGov ? "Zero down payment for eligible veterans." : "Accelerated equity strategy for rapid pay-down."}
            </p>
          </div>
        </div>

        {/* --- MARKET INSIGHTS (Replacing the list with a clean paragraph) --- */}
        <div className="flex-1 p-8 flex flex-col justify-center items-center text-center bg-[#050505]">
          <div className="w-12 h-px bg-white/10 mb-6"></div>
          <p className="text-amber-500/60 text-[9px] uppercase tracking-widest font-sans mb-3">Regional Market Insight</p>
          <p className="text-white/80 font-serif italic text-lg leading-relaxed max-w-md">
            "{data.marketCopy.marketInsight}"
          </p>
          <div className="w-12 h-px bg-white/10 mt-6"></div>
        </div>

        {/* --- FOOTER (TEAM) --- */}
        <div className="bg-[#050505] p-8 flex items-center justify-between border-t border-white/10">

          {/* Scott */}
          <div className="flex items-center gap-4">
            {data.broker.headshot ? (
              <img
                src={data.broker.headshot}
                alt={data.broker.name}
                className="w-12 h-12 rounded-full border border-slate-800 object-cover"
                style={{ objectPosition: `${data.broker.headshotPositionX ?? (data.broker.name.includes("Scott Little") ? 35 : 50)}% ${data.broker.name.includes("Scott Little") ? 15 : (data.broker.headshotPosition ?? 15)}%` }}
              />
            ) : null}
            <div className="text-left font-sans">
              <div className="text-white font-serif text-sm tracking-wide">{data.broker.name}</div>
              <div className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">{data.broker.title}</div>
              <div className="text-[8px] text-slate-600">NMLS #{data.broker.nmls}</div>
              <div className="text-[8px] text-slate-600 mt-0.5">{data.broker.phone} (M)</div>
            </div>
          </div>

          {/* QR Code / CTA */}
          <div className="text-center">
            {data.cta.showQRCode && data.cta.buttonUrl && (
              <div className="bg-white p-1.5 rounded-sm inline-block mb-2">
                <QRCodeSVG value={data.cta.buttonUrl} size={40} />
              </div>
            )}
            <div className="text-[7px] text-slate-500 uppercase tracking-widest font-sans">Scan for Analysis</div>
          </div>

          {/* Celeste */}
          <div className="flex items-center gap-4 flex-row-reverse text-right">
            {data.realtor.headshot ? (
              <img
                src={data.realtor.headshot}
                alt={data.realtor.name}
                className="w-12 h-12 rounded-full border border-slate-800 object-cover"
                style={{ objectPosition: `${data.realtor.headshotPositionX ?? (data.realtor.name.includes("Scott Little") ? 35 : 50)}% ${data.realtor.name.includes("Scott Little") ? 15 : (data.realtor.headshotPosition ?? 15)}%` }}
              />
            ) : null}
            <div className="font-sans">
              <div className="text-white font-serif text-sm tracking-wide">{data.realtor.name}</div>
              <div className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">{data.realtor.title}</div>
              <div className="text-[8px] text-slate-600">{data.realtor.email}</div>
              <div className="text-[8px] text-slate-600 mt-0.5">{data.realtor.phone}</div>
            </div>
          </div>
        </div>

        {/* COMPLIANCE FOOTER */}
        <div className="pb-4 pt-0 px-8 bg-[#050505] text-center">
          <p className="text-[7px] text-slate-700 font-sans">
            Equal Housing Opportunity. Rates subject to change. NMLS #{data.company.nmls}. {data.realtor.brokerage}.
          </p>
        </div>
      </div>
    );
  }
);

LuxuryLayout.displayName = "LuxuryLayout";
