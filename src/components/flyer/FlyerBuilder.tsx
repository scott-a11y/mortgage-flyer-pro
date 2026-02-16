import { useRef, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { FlyerPreview } from "./FlyerPreview";
import { EditorTabs } from "./EditorTabs";
import { TemplateManager } from "./TemplateManager";
import { ExportMenu } from "./ExportMenu";
import { Button } from "@/components/ui/button";
import { RotateCcw, Loader2, Share2, Sparkles, Layout, Database, Activity, Terminal, LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";
import { useFlyer } from "@/context/FlyerContext";
import { SmartShareButton } from "../share/SmartShareButton";
import { AgentToolkit } from "./AgentToolkit";
import { agentPartners } from "@/data/agentPartners";
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
      const isMobile = window.innerWidth < 1024;
      const offset = isMobile ? 24 : 120;
      const containerWidth = Math.max(containerRef.current.offsetWidth - offset, 300);
      const containerHeight = Math.max(containerRef.current.offsetHeight - offset, 400);
      const flyerWidth = 612;
      const flyerHeight = 792;

      const scaleW = containerWidth / flyerWidth;
      const scaleH = containerHeight / flyerHeight;
      const newScale = Math.min(scaleW, scaleH, 1.1);
      setScale(newScale);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#030304]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <Loader2 className="w-12 h-12 animate-spin text-cyan-500/20" />
            <Terminal className="w-5 h-5 text-cyan-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-cyan-500/80">System.Initialize</p>
            <div className="w-32 h-0.5 bg-cyan-950 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 w-1/2 animate-[loading_2s_infinite]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#030304] text-slate-300 flex flex-col overflow-hidden font-sans selection:bg-cyan-500/30">
      <Helmet><title>Rate Watch | Mortgage Flyer Pro</title></Helmet>
      {/* 1. GLOBAL TASKBAR (Materia Style) */}
      <header className="glass-header z-50 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-5 h-5 flex items-center justify-center border border-cyan-500/40 rounded-sm group-hover:border-cyan-500/80 transition-color">
              <LayoutGrid className="w-3 h-3 text-cyan-500" />
            </div>
            <span className="text-white font-black text-[10px] uppercase tracking-[0.2em] font-mono group-hover:text-cyan-400 transition-colors">Suite Dashboard</span>
          </Link>

          <div className="h-3 w-px bg-cyan-500/10 mx-1" />

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-cyan-500/5 border border-cyan-500/10">
              <div className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_5px_#00f2ff]" />
              <span className="text-[9px] uppercase tracking-widest text-cyan-500/60 font-mono font-bold">Uplink:Active</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-emerald-500/5 border border-emerald-500/10">
              <Activity className="w-2.5 h-2.5 text-emerald-500" />
              <span className="text-[9px] uppercase tracking-widest text-emerald-500/60 font-mono font-bold">Rates:Live</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetData}
            className="text-slate-500 hover:text-white hover:bg-cyan-500/5 transition-all text-[9px] font-mono h-6 px-3 gap-1.5 uppercase tracking-wider"
          >
            <RotateCcw className="w-3 h-3 opacity-40" />
            Clear_Memory
          </Button>
          <div className="h-3 w-px bg-cyan-500/10 mx-1" />
          <ExportMenu
            previewRef={previewRef}
            isExporting={isExporting}
            setIsExporting={setIsExporting}
          />
        </div>
      </header>

      {/* 2. CORE INTERFACE */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden lg:overflow-hidden overflow-y-auto lg:overflow-y-hidden">

        {/* A. NAV_CONTROL */}
        <aside className="dashboard-sidebar z-40">
          <div className="flex flex-col items-center gap-2">
            <SideTab icon={<Sparkles />} label="Composer" active={activeTab === "composer"} onClick={() => setActiveTab("composer")} />
            <SideTab icon={<Layout />} label="Library" active={activeTab === "library"} onClick={() => setActiveTab("library")} />
            <SideTab icon={<Share2 />} label="Broadcast" active={activeTab === "broadcast"} onClick={() => setActiveTab("broadcast")} />
          </div>

          <div className="mt-auto flex flex-col items-center gap-2 pb-2">
            <SideTab icon={<Database />} label="Registry" active={false} onClick={() => { }} />
            <button className="w-10 h-10 rounded border border-cyan-500/5 flex items-center justify-center text-cyan-500/20 hover:text-cyan-500/60 transition-colors">
              <Terminal className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* B. COMMAND_SURFACE */}
        <aside className="editor-panel z-30">
          {activeTab === "composer" && (
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-cyan-500/10 bg-gradient-to-br from-cyan-500/[0.03] to-transparent shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[9px] font-bold text-cyan-500 uppercase tracking-[0.3em] font-mono">Specimen_Config</h3>
                  <span className="text-[8px] text-cyan-500/40 font-mono font-bold px-1.5 py-0.5 border border-cyan-500/10 rounded-sm">ID: {data.broker.nmls.substring(0, 8)}</span>
                </div>
                <div className="flex items-center gap-2 p-1 bg-black/40 border border-cyan-500/10 rounded-sm">
                  <div className="w-1 h-8 bg-cyan-500 animate-pulse rounded-full" />
                  <p className="text-[10px] text-slate-400 font-medium px-2 leading-relaxed">Adjust the terminal parameters below to refine the flyer output.</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                <EditorTabs data={data} onChange={updateData} />
              </div>
            </div>
          )}

          {activeTab === "library" && (
            <div className="p-6 flex flex-col h-full">
              <h3 className="text-[9px] font-bold text-cyan-500 uppercase tracking-[0.3em] font-mono mb-6">Template_Library</h3>
              <TemplateManager currentData={data} onLoadTemplate={updateData} />
            </div>
          )}

          {activeTab === "broadcast" && (
            <div className="p-6 flex flex-col h-full overflow-y-auto custom-scrollbar">
              <h3 className="text-[9px] font-bold text-cyan-500 uppercase tracking-[0.3em] font-mono mb-6">Distribution_Control</h3>
              <div className="space-y-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono italic">// Partner_Payload</h4>
                  <AgentToolkit
                    data={data}
                    shareUrl={typeof window !== 'undefined' ? (
                      (() => {
                        const baseUrl = window.location.origin;
                        const brokerSlug = data.broker.name.toLowerCase().replace(/\s+/g, '-');
                        // Find if active realtor is a known partner
                        const partner = agentPartners.find(p => p.realtor.name === data.realtor.name);
                        if (partner) {
                          return `${baseUrl}/live/${brokerSlug}-${partner.id}`;
                        }
                        return `${baseUrl}/live/${brokerSlug}`;
                      })()
                    ) : ''}
                    onLoadTemplate={updateData}
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-cyan-500/10">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono italic">// Direct_Broadcast</h4>
                  <div className="p-6 border border-cyan-500/10 bg-cyan-500/[0.02] rounded-sm">
                    <p className="text-[11px] text-slate-400 mb-4 leading-relaxed font-mono uppercase tracking-tighter">Execute broad-spectrum post to social channels. All legal disclosures included.</p>
                    <SmartShareButton
                      onGenerateBlob={() => captureImage(previewRef.current)}
                      title={`Rate Update: ${data.broker.name} | ${data.company.name}`}
                      text={`Check out the latest mortgage rates from ${data.broker.name} at ${data.company.name}. #MortgageRates #RealEstate`}
                      isLoading={isCapturing}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* C. OBSERVATION_DECK */}
        <main className="preview-stage relative">
          {/* Atmosphere Enhancements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent rounded-full blur-[140px] opacity-20 pointer-events-none" />
          <div className="absolute inset-0 bg-grid-slate-100 pointer-events-none" />

          {/* Magnification Matrix */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 p-1 rounded border border-cyan-500/10 bg-black/80 backdrop-blur-xl shadow-2xl">
            <Button variant="ghost" size="sm" className="h-6 w-8 p-0 rounded-none hover:bg-cyan-500/10 text-cyan-500/40 hover:text-cyan-500 transition-colors text-[9px] font-mono" onClick={() => setScale(s => Math.max(s - 0.1, 0.2))}>DEC</Button>
            <div className="px-3 border-x border-cyan-500/10">
              <span className="text-[10px] font-mono font-bold text-cyan-500/80 tracking-tighter">MAG: {(scale * 100).toFixed(0)}%</span>
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-8 p-0 rounded-none hover:bg-cyan-500/10 text-cyan-500/40 hover:text-cyan-500 transition-colors text-[9px] font-mono" onClick={() => setScale(s => Math.min(s + 0.1, 1.5))}>INC</Button>
          </div>

          {/* The Specimen Holder */}
          <div
            ref={containerRef}
            className="w-full h-full flex items-center justify-center p-6 lg:p-20 overflow-hidden relative"
          >
            <div
              style={{
                transform: `scale(${scale})`,
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                width: '612px',
                height: '792px',
                flexShrink: 0,
                transformOrigin: 'center center'
              }}
              className="bg-white relative shadow-[0_40px_100px_rgba(0,0,0,0.9)] ring-1 ring-cyan-500/20"
            >
              <div className="absolute inset-0 border border-white/20 pointer-events-none z-10" />
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
      className={`relative w-10 h-10 rounded-sm flex items-center justify-center transition-all duration-300 group border ${active
        ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_rgba(0,242,255,0.1)]"
        : "text-slate-600 border-transparent hover:text-cyan-500/60 hover:bg-cyan-500/[0.02]"
        }`}
    >
      <div className="w-4 h-4">{icon}</div>
      <div className="absolute left-14 px-3 py-1.5 rounded-sm bg-[#0a0a0c] text-cyan-500/80 text-[8px] font-mono font-bold uppercase tracking-[0.3em] opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none z-50 border border-cyan-500/20 whitespace-nowrap">
        {label}
      </div>
    </button>
  );
}
