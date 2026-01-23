import { FlyerData } from "@/types/flyer";
import { QRCodeSVG } from "qrcode.react";
import { ArrowRight } from "lucide-react";

interface MortgageBannerProps {
  data: FlyerData;
  shareUrl: string;
}

export function MortgageBanner({ data, shareUrl }: MortgageBannerProps) {
  return (
    <div className="w-full max-w-3xl mx-auto bg-zinc-900 rounded-xl overflow-hidden shadow-2xl">
      {/* Main Content Area */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-6 items-center">

          {/* LEFT: Broker */}
          <div className="flex items-center gap-3">
            <div>
              <p className="text-white font-semibold text-sm">{data.broker.name}</p>
              <p className="text-zinc-500 text-xs">NMLS #{data.broker.nmls}</p>
              <p className="text-zinc-400 text-xs mt-1">{data.broker.phone}</p>
              <a
                href="https://www.iamortgage.org"
                className="text-zinc-400 text-xs hover:text-white transition-colors"
              >
                www.iamortgage.org
              </a>
            </div>
          </div>

          {/* CENTER: Rates */}
          <div className="flex gap-2 justify-center">
            {[
              { label: "30-YR FIXED", rate: data.rates.thirtyYearFixed, apr: data.rates.thirtyYearFixedAPR },
              { label: "15-YR FIXED", rate: data.rates.fifteenYearFixed, apr: data.rates.fifteenYearFixedAPR },
              { label: "JUMBO", rate: data.rates.thirtyYearJumbo, apr: data.rates.thirtyYearJumboAPR },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-zinc-800 rounded-lg px-3 py-2 text-center min-w-[80px]"
              >
                <p className="text-zinc-500 text-[10px] uppercase tracking-wide">{item.label}</p>
                <p className="text-white font-bold text-lg leading-tight">{item.rate}</p>
                <p className="text-zinc-500 text-[10px]">{item.apr} APR</p>
              </div>
            ))}
          </div>

          {/* RIGHT: Realtor */}
          <div className="flex items-center gap-3 justify-end">
            <div className="text-right">
              <p className="text-white font-semibold text-sm">{data.realtor.name}</p>
              <p className="text-zinc-500 text-xs">{data.realtor.title}</p>
              <p className="text-zinc-500 text-[11px]">{data.realtor.brokerage}</p>
              <p className="text-zinc-400 text-xs mt-1">{data.realtor.phone}</p>
              <a
                href={`mailto:${data.realtor.email}`}
                className="text-zinc-400 text-xs block hover:text-white transition-colors"
              >
                {data.realtor.email}
              </a>
              {data.realtor.website && (
                <a
                  href={`https://${data.realtor.website}`}
                  className="text-zinc-400 text-xs hover:text-white transition-colors"
                >
                  {data.realtor.website}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bar */}
      <div className="bg-zinc-800/50 px-6 py-3">
        <div className="flex items-center justify-between">

          {/* Button */}
          <button className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 transition-colors">
            View Live Rates <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Disclaimer / Date */}
          <div className="text-center flex-1 px-4">
            <p className="text-zinc-400 text-[10px]">
              As of {data.rates.dateGenerated}
            </p>
            <p className="text-zinc-500 text-[9px]">
              Rates subject to change. Equal Housing Opportunity.
            </p>
          </div>

          {/* QR Code */}
          <div className="bg-white p-1.5 rounded-md">
            <QRCodeSVG value={shareUrl} size={36} level="M" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MortgageBanner;
