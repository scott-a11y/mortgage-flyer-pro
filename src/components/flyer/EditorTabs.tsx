import { FlyerData } from "@/types/flyer";
import { RatesEditor } from "./editors/RatesEditor";
import { MarketCopyEditor } from "./editors/MarketCopyEditor";
import { RegionsEditor } from "./editors/RegionsEditor";
import { ContactEditor } from "./editors/ContactEditor";
import { ThemeEditor } from "./editors/ThemeEditor";
import { LayoutSelector } from "./editors/LayoutSelector";
import { ShareableBanner } from "./ShareableBanner";
import { DollarSign, FileText, MapPin, Users, Palette, Image, ShieldCheck, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface EditorTabsProps {
  data: FlyerData;
  onChange: (data: FlyerData) => void;
}

export function EditorTabs({ data, onChange }: EditorTabsProps) {
  // Generate share URL for banners
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/live/${encodeURIComponent(data.broker.name.toLowerCase().replace(/\s+/g, '-'))}`
    : '';

  return (
    <div className="space-y-12 pb-20">
      {/* 1. RATES MATRIX */}
      <section className="space-y-4">
        <SectionHeader icon={<DollarSign className="w-3.5 h-3.5" />} title="Financial.Matrix" index="01" />
        <div className="pl-4 border-l border-cyan-500/5">
          <RatesEditor data={data} onChange={onChange} />
        </div>
      </section>

      {/* 2. COPY ENGINE */}
      <section className="space-y-4">
        <SectionHeader icon={<FileText className="w-3.5 h-3.5" />} title="Headline.Engine" index="02" />
        <div className="pl-4 border-l border-cyan-500/5">
          <MarketCopyEditor data={data} onChange={onChange} />
        </div>
      </section>

      {/* 3. GEOSPATIAL DATA */}
      <section className="space-y-4">
        <SectionHeader icon={<MapPin className="w-3.5 h-3.5" />} title="Geospatial.Config" index="03" />
        <div className="pl-4 border-l border-cyan-500/5">
          <RegionsEditor data={data} onChange={onChange} />
        </div>
      </section>

      {/* 4. IDENTITY REGISTRY */}
      <section className="space-y-4">
        <SectionHeader icon={<Users className="w-3.5 h-3.5" />} title="Identity.Registry" index="04" />
        <div className="pl-4 border-l border-cyan-500/5">
          <ContactEditor data={data} onChange={onChange} />
        </div>
      </section>

      {/* 5. VISUAL SCHEMATIC */}
      <section className="space-y-4">
        <SectionHeader icon={<Palette className="w-3.5 h-3.5" />} title="Visual.Schematic" index="05" />
        <div className="pl-4 border-l border-cyan-500/5 space-y-6">
          <LayoutSelector data={data} onChange={onChange} />
          <ThemeEditor data={data} onChange={onChange} />
        </div>
      </section>

      {/* 6. BROADCAST ASSETS */}
      <section className="space-y-4">
        <SectionHeader icon={<Image className="w-3.5 h-3.5" />} title="Broadcast.Assets" index="06" />
        <div className="pl-4 border-l border-cyan-500/5">
          <div className="text-[10px] text-cyan-500/40 font-mono mb-4 flex items-center gap-2">
            <ShieldCheck className="w-3 h-3" />
            System generated social and email assets.
          </div>
          <ShareableBanner data={data} shareUrl={shareUrl} />
        </div>
      </section>

      {/* SYSTEM STATUS FOOTER */}
      <div className="pt-10 border-t border-cyan-500/5 flex items-center justify-between opacity-20">
        <span className="text-[8px] font-mono font-bold uppercase tracking-widest">Buffer.Status: Nominal</span>
        <span className="text-[8px] font-mono font-bold uppercase tracking-widest">End_Of_Stream</span>
      </div>
    </div>
  );
}

function SectionHeader({ icon, title, index }: { icon: React.ReactNode, title: string, index: string }) {
  return (
    <div className="flex items-center gap-3 group">
      <div className="flex items-center gap-1.5 min-w-[32px]">
        <span className="text-[8px] font-mono text-cyan-500/30 font-bold">{index}</span>
        <div className="w-1.5 h-1.5 bg-cyan-500/20 rounded-full group-hover:bg-cyan-500 transition-colors" />
      </div>
      <div className="flex items-center gap-2 text-cyan-500/60 group-hover:text-cyan-400 transition-colors">
        {icon}
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] font-mono">{title}</h3>
      </div>
      <div className="flex-1 h-px bg-cyan-500/5" />
      <ChevronRight className="w-3 h-3 text-cyan-500/10 group-hover:translate-x-1 transition-transform" />
    </div>
  );
}
