import { useRef, useState } from "react";
import { FlyerPreview } from "./FlyerPreview";
import { EditorTabs } from "./EditorTabs";
import { TemplateManager } from "./TemplateManager";
import { ExportMenu } from "./ExportMenu";
import { Button } from "@/components/ui/button";
import { RotateCcw, Loader2, Share2, Sparkles } from "lucide-react";
import { useFlyer } from "@/context/FlyerContext";
import { SmartShareButton } from "../share/SmartShareButton";

export function FlyerBuilder() {
  const { data, updateData, resetData, isLoading } = useFlyer();
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* HEADER: Tools & Navigation */}
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm backdrop-blur-sm bg-white/80">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-primary font-bold text-lg tracking-tight">IA LOANS</span>
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm">Pro</span>
          </div>

          <div className="flex items-center gap-2">
            <TemplateManager currentData={data} onLoadTemplate={updateData} />

            <div className="h-6 w-px bg-border mx-2" />

            <Button variant="ghost" size="sm" onClick={resetData} className="text-muted-foreground hover:text-destructive">
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
      <main className="container mx-auto px-4 py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-100px)]">

          {/* --- LEFT PANEL: EDITING & SHARING --- */}
          <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2 pb-20">
            {/* 1. The Share Toolbar (Prominent & Easy Access) */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-blue-600" />
                Distribute Flyer
              </h3>
              <SmartShareButton
                onGenerateBlob={async () => {
                  const { default: html2canvas } = await import('html2canvas');
                  if (!previewRef.current) return null;
                  const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true });
                  return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                }}
                title={`Rate Update: Scott Little | IA Mortgage`}
                text={`Check out the latest mortgage rates from Scott Little at IA Mortgage. #MortgageRates #RealEstate`}
              />
            </div>

            {/* 2. The Editor Inputs */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-bold text-slate-700">Content Editor</span>
              </div>
              <EditorTabs data={data} onChange={updateData} />
            </div>
          </div>

          {/* --- RIGHT PANEL: LIVE PREVIEW --- */}
          <div className="lg:col-span-8 bg-slate-100/50 rounded-2xl p-8 flex items-start justify-center overflow-y-auto border border-slate-200/60 backdrop-blur-3xl">
            {/* The Flyer Container */}
            <div className="w-full max-w-[800px] shadow-2xl transition-all duration-300 origin-top hover:scale-[1.01]">
              <FlyerPreview ref={previewRef} data={data} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
