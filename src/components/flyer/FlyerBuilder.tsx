import { useState, useRef } from "react";
import { FlyerData } from "@/types/flyer";
import { defaultFlyerData } from "@/data/defaultFlyerData";
import { FlyerPreview } from "./FlyerPreview";
import { EditorTabs } from "./EditorTabs";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw, FileImage, FileText } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

export function FlyerBuilder() {
  const [flyerData, setFlyerData] = useState<FlyerData>(defaultFlyerData);
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleReset = () => {
    setFlyerData(defaultFlyerData);
    toast.success("Flyer reset to defaults");
  };

  const exportToPNG = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `mortgage-flyer-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("PNG downloaded successfully!");
    } catch (error) {
      toast.error("Failed to export PNG");
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "letter",
      });
      pdf.addImage(imgData, "PNG", 0, 0, 8.5, 11);
      pdf.save(`mortgage-flyer-${Date.now()}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      toast.error("Failed to export PDF");
      console.error(error);
    } finally {
      setIsExporting(false);
    }
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
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-1.5" />
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToPNG}
              disabled={isExporting}
            >
              <FileImage className="w-4 h-4 mr-1.5" />
              PNG
            </Button>
            <Button
              size="sm"
              onClick={exportToPDF}
              disabled={isExporting}
            >
              <FileText className="w-4 h-4 mr-1.5" />
              PDF
            </Button>
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
              <Download className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Live Preview — 8.5" × 11" Letter Size
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
