import { useRef, useState, useEffect } from "react";
import { FlyerPreview } from "./FlyerPreview";
import { EditorTabs } from "./EditorTabs";
import { TemplateManager } from "./TemplateManager";
import { ExportMenu } from "./ExportMenu";
import { Button } from "@/components/ui/button";
import { RotateCcw, Loader2, Share2, Sparkles, Layout } from "lucide-react";
import { useFlyer } from "@/context/FlyerContext";
import { SmartShareButton } from "../share/SmartShareButton";
import { useFlyerCapture } from "@/hooks/useFlyerCapture";

export function FlyerBuilder() {
  const { data, updateData, resetData, isLoading } = useFlyer();
  const { captureImage, isExporting: isCapturing } = useFlyerCapture();
  const [isExporting, setIsExporting] = useState(false);
  const [scale, setScale] = useState(1);
  const [activeTab, setActiveTab] = useState("composer");
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scale flyer to fit preview container
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth - 100;
      const containerHeight = containerRef.current.offsetHeight - 100;
      const flyerWidth = 612;
      const flyerHeight = 792;

      const scaleW = containerWidth / flyerWidth;
      const scaleH = containerHeight / flyerHeight;
      const newScale = Math.min(scaleW, scaleH, 1.1); // Allow slight over-scale
      setScale(newScale);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0a0a0c]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Initializing Engine</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#0a0a0c] text-white flex flex-col overflow-hidden font-sans selection:bg-amber-500/30">
      {/* 1. TOP NAV */}
      <header className="h-16 shrink-0 z-50 glass-header flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/10">
              <span className="text-white font-black text-[11px]">IA</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black text-sm leading-none tracking-tight">IA LOANS</span>
              <span className="text-[9px] text-amber-500 font-black uppercase tracking-[0.25em] mt-1 opacity-90">Enterprise Portal</span>
            </div>
          </div>
          <div className="h-4 w-px bg-white/10 mx-2" />
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 ring-1 ring-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
            <span className="text-[9px] uppercase tracking-widest text-slate-400 font-black">Live Market Connector Active</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <TemplateManager currentData={data} onLoadTemplate={updateData} />
          <div className="h-6 w-px bg-white/5 mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={resetData}
            className="text-slate-400 hover:text-white hover:bg-white/5 transition-all text-[11px] h-9 px-4 rounded-xl border border-white/5 gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5 opacity-50" />
            Reset
          </Button>
          <ExportMenu
            previewRef={previewRef}
            isExporting={isExporting}
            setIsExporting={setIsExporting}
          />
        </div>
      </header>

      {/* 2. ENGINE WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">

        {/* A. COMMAND BAR */}
        <aside className="dashboard-sidebar z-40">
          <SideTab icon={<Sparkles />} label="Composer" active={activeTab === "composer"} onClick={() => setActiveTab("composer")} />
          <SideTab icon={<Layout />} label="Templates" active={activeTab === "templates"} onClick={() => setActiveTab("templates")} />
          <SideTab icon={<Share2 />} label="Broadcast" active={activeTab === "share"} onClick={() => setActiveTab("share")} />
          <div className="mt-auto mb-2 opacity-20 hover:opacity-100 transition-opacity">
            <SideTab icon={<Loader2 />} label="Logs" active={false} onClick={() => { }} />
          </div>
        </aside>

        {/* B. PROPERTY EDITOR */}
        <aside className="editor-panel z-30 shadow-2xl">
          {/* Quick Share Integration */}
          <div className="p-6 border-b border-white/5 bg-gradient-to-br from-blue-600/10 via-transparent to-transparent">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Broadcast</h3>
              <span className="text-[9px] text-slate-500 font-bold px-1.5 py-0.5 rounded bg-white/5">Ready</span>
            </div>
            <SmartShareButton
              onGenerateBlob={() => captureImage(previewRef.current)}
              title={`Rate Update: Scott Little | IA Mortgage`}
              text={`Check out the latest mortgage rates from Scott Little at IA Mortgage. #MortgageRates #RealEstate`}
              isLoading={isCapturing}
            />
          </div>

          {/* Primary Editor Surface */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-black text-white/40 uppercase tracking-[0.25em] flex items-center gap-2">
                <span className="w-1 h-3 bg-amber-500 rounded-full" />
                Parameter Tuning
              </h2>
            </div>
            <EditorTabs data={data} onChange={updateData} />
          </div>
        </aside>

        {/* C. PREVIEW STAGE */}
        <main className="preview-stage relative">
          {/* Stage Atmosphere */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%] bg-gradient-to-br from-[#1a1a24] via-transparent to-transparent rounded-full blur-[180px] opacity-30 pointer-events-none" />
          <div className="absolute inset-0 bg-grid-slate-100 opacity-[0.03] pointer-events-none" />

          {/* Magnification Controls */}
          <div className="absolute top-8 right-8 z-20 flex items-center gap-2 p-1.5 rounded-2xl bg-[#0a0a0c]/90 border border-white/10 backdrop-blur-3xl shadow-2xl ring-1 ring-white/5">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-xl hover:bg-white/10 text-slate-400 transition-colors" onClick={() => setScale(s => Math.max(s - 0.1, 0.2))}>-</Button>
            <div className="px-4 border-x border-white/10">
              <span className="text-[11px] font-mono font-black text-amber-500">{(scale * 100).toFixed(0)}%</span>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-xl hover:bg-white/10 text-slate-400 transition-colors" onClick={() => setScale(s => Math.min(s + 0.1, 1.5))}>+</Button>
          </div>

          {/* The Stage Floor */}
          <div
            ref={containerRef}
            className="w-full h-full flex items-center justify-center p-24 overflow-hidden relative"
          >
            {/* The Precision Specimen Wrapper */}
            <div
              style={{
                transform: `scale(${scale})`,
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                width: '612px',
                height: '792px',
                flexShrink: 0,
                transformOrigin: 'center center'
              }}
              className="premium-shadow rounded-[2px] overflow-hidden bg-white ring-[12px] ring-white/5 relative"
            >
              {/* Internal Shadow Overlays for Depth */}
              <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.05)] pointer-events-none z-10" />
              <FlyerPreview ref={previewRef} data={data} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function SideTab({ icon, active, onClick, label }: { icon: React.ReactNode, active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500 group border ${active
          ? "bg-amber-500 text-white border-amber-400 shadow-[0_10px_25px_rgba(245,158,11,0.25)]"
          : "text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/5"
        }`}
    >
      <div className="w-5 h-5">{icon}</div>
      <div className="absolute left-16 px-4 py-2.5 rounded-2xl bg-[#14141a] text-white text-[10px] font-black uppercase tracking-[0.25em] opacity-0 transform -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none z-50 shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10 backdrop-blur-2xl ring-1 ring-white/5">
        {label}
        <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#14141a] rotate-45 border-l border-b border-white/10" />
      </div>
    </button>
  );
}
