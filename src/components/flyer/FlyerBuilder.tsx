import { useState, useRef } from "react";
import { FlyerData } from "@/types/flyer";
import { defaultFlyerData } from "@/data/defaultFlyerData";
import { FlyerPreview } from "./FlyerPreview";
import { EditorTabs } from "./EditorTabs";
import { TemplateManager } from "./TemplateManager";
import { ExportMenu } from "./ExportMenu";
import { Button } from "@/components/ui/button";
import { RotateCcw, Eye } from "lucide-react";
import { toast } from "sonner";

export function FlyerBuilder() {
  const [flyerData, setFlyerData] = useState<FlyerData>(defaultFlyerData);
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleReset = () => {
    setFlyerData(defaultFlyerData);
    toast.success("Flyer reset to defaults");
  };

  const handleLoadTemplate = (data: FlyerData) => {
    setFlyerData(data);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-lg px-3 py-1.5">
              <span className="text-primary-foreground font-bold text-sm">IA LOANS</span>
            </div>
            <div>
              <h1 className="font-bold text-foreground">Flyer Builder</h1>
              <p className="text-xs text-muted-foreground">Co-Branded Mortgage Rate Flyer Generator</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TemplateManager 
              currentData={flyerData} 
              onLoadTemplate={handleLoadTemplate} 
            />
            <Button variant="outline" size="sm" onClick={handleReset}>
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[400px_1fr] gap-6">
          {/* Editor Panel */}
          <div className="order-2 lg:order-1">
            <div className="sticky top-24">
              <EditorTabs data={flyerData} onChange={setFlyerData} />
            </div>
          </div>

          {/* Preview Panel */}
          <div className="order-1 lg:order-2 flex flex-col items-center">
            <div className="mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Live Preview — 8.5" × 11" Letter Size (TILA Compliant)
              </span>
            </div>
            <div className="overflow-auto max-w-full">
              <div className="transform origin-top scale-[0.85] lg:scale-100">
                <FlyerPreview ref={previewRef} data={flyerData} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
