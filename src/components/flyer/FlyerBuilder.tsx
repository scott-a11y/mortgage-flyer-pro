import { useRef, useState } from "react";
import { FlyerPreview } from "./FlyerPreview";
import { EditorTabs } from "./EditorTabs";
import { TemplateManager } from "./TemplateManager";
import { ExportMenu } from "./ExportMenu";
import { Button } from "@/components/ui/button";
import { RotateCcw, Loader2, Share2 } from "lucide-react";
import { useFlyer } from "@/context/FlyerContext";
import { SmartShareButton } from "../share/SmartShareButton";

export function FlyerBuilder() {
  console.log("FlyerBuilder: rendering...");
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
      {/* 1. HEADER - Global Controls Only */}
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-primary font-bold text-lg tracking-tight">IA LOANS</span>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Pro</span>
          </div>

          <div className="flex items-center gap-2">
            <TemplateManager currentData={data} onLoadTemplate={updateData} />

            <div className="h-6 w-px bg-border mx-1" />

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

      {/* 2. MAIN WORKSPACE */}
      <main className="container mx-auto px-4 py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">

          {/* LEFT PANEL: Editor & Share Tools */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-100px)] pb-10">
            {/* Editor Inputs */}
            <EditorTabs data={data} onChange={updateData} />

            {/* SHARE TOOLBAR - Moved HERE so it is OUTSIDE the flyer */}
            <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-blue-600" />
                Ready to Post?
              </h3>

              <SmartShareButton
                onGenerateBlob={async () => {
                  const { default: html2canvas } = await import('html2canvas');
                  if (!previewRef.current) return null;
                  const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true });
                  return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                }}
                title={`Rate Update: ${data.marketCopy.headline || "Market Update"}`}
                text={`Check out the latest mortgage rates for ${data.regions[0].name || "local market"}. #RealEstate`}
              />
            </div>
          </div>

          {/* RIGHT PANEL: The Pure Flyer Preview */}
          <div className="lg:col-span-7 xl:col-span-8 bg-slate-100 rounded-xl p-8 flex items-start justify-center overflow-auto border border-slate-200">
            {/* This DIV is what gets exported. It contains NO buttons. */}
            <div className="w-full max-w-[800px] shadow-2xl transition-transform duration-300 bg-white">
              <FlyerPreview ref={previewRef} data={data} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
