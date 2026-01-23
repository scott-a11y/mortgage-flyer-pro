import { useRef, useState, useEffect } from "react";
import { FlyerPreview } from "./FlyerPreview";
import { EditorTabs } from "./EditorTabs";
import { TemplateManager } from "./TemplateManager";
import { ExportMenu } from "./ExportMenu";
import { Button } from "@/components/ui/button";
import { RotateCcw, Loader2, Share2, Sparkles } from "lucide-react";
import { useFlyer } from "@/context/FlyerContext";
import { SmartShareButton } from "../share/SmartShareButton";
import { useFlyerCapture } from "@/hooks/useFlyerCapture";

export function FlyerBuilder() {
  const { data, updateData, resetData, isLoading } = useFlyer();
  const { captureImage, isExporting: isCapturing } = useFlyerCapture();
  const [isExporting, setIsExporting] = useState(false);
  const [scale, setScale] = useState(1);
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scale flyer to fit preview container
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth - 64; // p-8
      const containerHeight = containerRef.current.clientHeight - 64;
      const flyerWidth = 612;
      const flyerHeight = 792;

      const scaleW = containerWidth / flyerWidth;
      const scaleH = containerHeight / flyerHeight;
      const newScale = Math.min(scaleW, scaleH, 1);
      setScale(newScale);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* HEADER: Tools & Navigation */}
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm backdrop-blur-sm bg-white/90">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded bg-primary text-white font-black text-xs">IA</div>
            <span className="text-slate-900 font-bold text-lg tracking-tight hidden sm:inline">IA LOANS</span>
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm">Pro</span>
          </div>

          <div className="flex items-center gap-2">
            <TemplateManager currentData={data} onLoadTemplate={updateData} />

            <div className="h-6 w-px bg-slate-200 mx-2" />

            <Button variant="ghost" size="sm" onClick={resetData} className="text-slate-500 hover:text-destructive transition-colors">
              <RotateCcw className="w-4 h-4 mr-1.5" />
              Reset
            </Button>

            <ExportMenu
              previewRef={previewRef}
              isExporting={isExporting}
              setIsExporting={setIsExporting}
            />
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 py-6 overflow-hidden">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-full min-h-0">

          {/* --- LEFT PANEL: EDITING & SHARING --- */}
          <div className="xl:col-span-4 flex flex-col gap-6 overflow-hidden">
            {/* 1. The Share Toolbar (Prominent & Easy Access) */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-lg shadow-blue-200/50 text-white">
              <h3 className="text-sm font-bold opacity-90 mb-4 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-white" />
                Distribute Flyer
              </h3>
              <SmartShareButton
                onGenerateBlob={() => captureImage(previewRef.current)}
                title={`Rate Update: Scott Little | IA Mortgage`}
                text={`Check out the latest mortgage rates from Scott Little at IA Mortgage. #MortgageRates #RealEstate`}
                isLoading={isCapturing}
              />
              <p className="mt-3 text-[10px] text-blue-100 text-center ">Tapping above opens your phone's native share menu. <br />Select Instagram Stories or Messages.</p>
            </div>

            {/* 2. The Editor Inputs */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col flex-1 min-h-0">
              <div className="p-4 border-b border-slate-100 bg-white flex items-center gap-2">
                <div className="p-1 px-2 rounded-md bg-amber-50 text-amber-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate-800 tracking-tight">Content Editor</span>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                <EditorTabs data={data} onChange={updateData} />
              </div>
            </div>
          </div>

          {/* --- RIGHT PANEL: LIVE PREVIEW --- */}
          <div
            ref={containerRef}
            className="xl:col-span-8 bg-slate-200/40 rounded-3xl flex items-center justify-center overflow-hidden border border-slate-300/40 bg-grid-slate-100 relative"
          >
            {/* Background Decorative Element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/30 blur-[100px] rounded-full pointer-events-none"></div>

            {/* The Flyer Container with Dynamic Scaling */}
            <div
              style={{
                transform: `scale(${scale})`,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                transition: 'transform 0.2s ease-out'
              }}
              className="origin-center shadow-2xl rounded-sm overflow-hidden bg-white"
            >
              <FlyerPreview ref={previewRef} data={data} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
