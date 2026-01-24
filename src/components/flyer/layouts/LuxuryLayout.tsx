import { FlyerData } from "@/types/flyer";
import { ArrowUpRight, ShieldCheck, TrendingDown, Landmark, Building2, Flag } from "lucide-react";
import { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FlyerProfileImage } from "../shared/FlyerProfileImage";
import { FlyerLegal } from "../shared/FlyerLegal";

interface LayoutProps {
  data: FlyerData;
}

export const LuxuryLayout = forwardRef<HTMLDivElement, LayoutProps>(
  ({ data }, ref) => {
    // PREPARE DATA
    const jumboRate = data.rates.thirtyYearJumbo.replace('%', '');
    const jumboAPR = data.rates.thirtyYearJumboAPR;
    const fixed30Rate = data.rates.thirtyYearFixed.replace('%', '');
    const fixed30APR = data.rates.thirtyYearFixedAPR;
    const fixed15Rate = data.rates.fifteenYearFixed.replace('%', '');
    const fixed15APR = data.rates.fifteenYearFixedAPR;
    const fhaRate = data.rates.fha ? data.rates.fha.replace('%', '') : '5.50';
    const fhaAPR = data.rates.fhaAPR;
    const vaRate = data.rates.va ? data.rates.va.replace('%', '') : '5.50';
    const vaAPR = data.rates.vaAPR;

    const isConv = data.rateType === 'conventional';
    const isGov = data.rateType === 'government';

    // Left Card
    const label1 = isGov ? 'FHA 30-YEAR' : (isConv ? '30-YEAR FIXED' : 'JUMBO PORTFOLIO');
    const rate1 = isGov ? fhaRate : (isConv ? fixed30Rate : jumboRate);
    const apr1 = isGov ? fhaAPR : (isConv ? fixed30APR : jumboAPR);
    const desc1 = isGov ? "Low down payment FHA financing." : "Flexible underwriting for HNW liquidity.";

    // Right Card
    const label3 = isGov ? 'VA 30-YEAR' : (isConv ? '15-YEAR FIXED' : '15-YEAR ACQ.');
    const rate3 = isGov ? vaRate : (isConv ? fixed15Rate : fixed15Rate);
    const apr3 = isGov ? vaAPR : (isConv ? fixed15APR : fixed15APR);
    const desc3 = isGov ? "Zero down payment for eligible veterans." : "Accelerated equity strategy.";

    return (
      <div
        ref={ref}
        data-capture="flyer"
        className="bg-[#050505] w-[612px] h-[792px] shadow-2xl flex flex-col relative overflow-hidden text-slate-200"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {/* AMBIENT GLOW CIRCLE */}
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/5 blur-[100px] rounded-full pointer-events-none z-0"></div>
        <div className="absolute top-[50px] left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-[#1a1a10] blur-[60px] rounded-full pointer-events-none z-0"></div>

        {/* --- HEADER --- */}
        <div className="relative z-10 px-8 pt-12 pb-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-1.5 rounded-full border border-white/10 mb-8 bg-[#11110a]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-200 font-medium font-sans">
              {isGov ? 'Government Loan Update' : 'PRIVATE CLIENT MARKET UPDATE'}
            </span>
          </div>

          <h1 className="text-[54px] font-serif text-white tracking-tight leading-[1.1] mb-6">
            {isGov ? (
              <>Security & <span className="text-amber-500">Stability.</span></>
            ) : (
              <>Liquidity & <br /><span className="text-amber-500">Acquisition.</span></>
            )}
          </h1>
        </div>

        {/* --- DATA GRID --- */}
        <div className="grid grid-cols-3 divide-x divide-white/5 bg-[#0a0a0c] border-y border-white/5 relative z-10">

          {/* Left Card */}
          <div className="p-8 pb-10 flex flex-col items-center text-center">
            <div className={`mb-6 p-4 rounded-full bg-[#050505] border border-white/5`}>
              {isGov ? <Building2 className="w-5 h-5 text-slate-400" /> : <ShieldCheck className="w-5 h-5 text-slate-400" />}
            </div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 font-sans">{label1}</h3>
            <div className="flex items-start justify-center gap-0.5 mb-1">
              <span className="text-6xl font-light text-white tracking-tighter leading-none">{rate1}</span>
              <span className={`text-2xl font-serif italic mt-1 text-emerald-400/80`}>%</span>
            </div>
            <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-6 font-sans">APR {apr1}</div>
            <p className="text-[10px] text-slate-500 px-2 leading-relaxed font-sans max-w-[140px]">
              {desc1}
            </p>
          </div>

          {/* Bridge Strategy (Hero) */}
          <div className="p-8 pb-10 bg-[#0a0a0c] flex flex-col items-center text-center relative">
            <div className="mb-6 p-4 rounded-full bg-amber-500/5 border border-amber-500/20 text-amber-500">
              <Landmark className="w-5 h-5" />
            </div>
            <h3 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-6 font-sans">BRIDGE STRATEGY</h3>
            <div className="flex flex-col items-center justify-center h-[70px] mb-5">
              <span className="text-[32px] leading-tight font-serif text-white italic">Non-</span>
              <span className="text-[32px] leading-tight font-serif text-white italic">Contingent</span>
            </div>
            <p className="text-[10px] text-amber-500 px-2 leading-relaxed font-sans">
              Secure the asset first.
            </p>
          </div>

          {/* Right Card */}
          <div className="p-8 pb-10 flex flex-col items-center text-center">
            <div className={`mb-6 p-4 rounded-full bg-[#050505] border border-white/5`}>
              {isGov ? <Flag className="w-5 h-5 text-slate-400" /> : <TrendingDown className="w-5 h-5 text-slate-400" />}
            </div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 font-sans">{label3}</h3>
            <div className="flex items-start justify-center gap-0.5 mb-1">
              <span className="text-6xl font-light text-white tracking-tighter leading-none">{rate3}</span>
              <span className={`text-2xl font-serif italic mt-1 text-emerald-400/80`}>%</span>
            </div>
            <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-6 font-sans">APR {apr3}</div>
            <p className="text-[10px] text-slate-500 px-2 leading-relaxed font-sans max-w-[140px]">
              {desc3}
            </p>
          </div>
        </div>

        {/* --- FOOTER (TEAM) --- */}
        <div className="bg-[#050505] flex-1 flex flex-col justify-end">
          <div className="px-10 pb-10 flex items-end justify-between relative">

            {/* Scott Little */}
            <div className="flex items-center gap-4 w-[240px]">
              <FlyerProfileImage
                src={data.broker.headshot}
                alt={data.broker.name}
                position={data.broker.headshotPosition}
                className="w-16 h-16 rounded-full border-2 border-amber-500/30 shadow-lg"
              />
              <div className="text-left">
                <div className="text-white font-serif text-[22px] tracking-wide leading-tight">{data.broker.name}</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase mb-0.5">{data.company.name}</div>
                <div className="text-[9px] text-amber-500 uppercase tracking-[0.2em] font-bold">{data.broker.title}</div>
                <div className="text-[9px] text-slate-500 tracking-widest mt-1 lowercase">{data.broker.phone} • {data.broker.email}</div>
              </div>
            </div>

            {/* QR Code Center */}
            <div className="flex flex-col items-center translate-y-2">
              <div className="bg-[#050505] p-2 border border-white/10 rounded-xl mb-3 shadow-2xl">
                {data.cta.buttonUrl && (
                  <div className="p-1 px-1 bg-white rounded-lg overflow-hidden">
                    <QRCodeSVG value={data.cta.buttonUrl} size={64} level="H" />
                  </div>
                )}
              </div>
              <div className="text-[8px] text-slate-500 uppercase tracking-[0.3em] font-sans">SCAN ME</div>
            </div>

            {/* Realtor */}
            <div className="flex items-center gap-4 w-[240px]">
              <FlyerProfileImage
                src={data.realtor.headshot}
                alt={data.realtor.name}
                position={data.realtor.headshotPosition}
                className="w-16 h-16 rounded-full border-2 border-amber-500/30 shadow-lg"
              />
              <div className="text-left">
                <div className="text-white font-serif text-[22px] tracking-wide leading-tight">{data.realtor.name}</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase mb-0.5">{data.realtor.brokerage}</div>
                <div className="text-[9px] text-amber-500 uppercase tracking-[0.2em] font-bold">{data.realtor.title}</div>
                <div className="text-[9px] text-slate-500 tracking-widest mt-1 lowercase">{data.realtor.phone} • {data.realtor.email}</div>
              </div>
            </div>
          </div>

          {/* COMPLIANCE FOOTER */}
          <FlyerLegal data={data} className="pb-6 border-none opacity-40 uppercase tracking-[0.15em]" />
        </div>
      </div>
    );
  }
);

LuxuryLayout.displayName = "LuxuryLayout";
