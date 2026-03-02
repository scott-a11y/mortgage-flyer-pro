import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileImage, FileText, ChevronDown, Instagram, Facebook, Mail, Linkedin, Printer, CreditCard, Eye } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { ExportFormat, exportFormats } from "@/types/flyer";

interface ExportMenuProps {
  previewRef: React.RefObject<HTMLDivElement>;
  isExporting: boolean;
  setIsExporting: (value: boolean) => void;
}

const formatIcons: Record<ExportFormat, React.ReactNode> = {
  letter: <FileText className="w-4 h-4" />,
  "letter-hires": <Printer className="w-4 h-4" />,
  postcard: <CreditCard className="w-4 h-4" />,
  instagram: <Instagram className="w-4 h-4" />,
  facebook: <Facebook className="w-4 h-4" />,
  linkedin: <Linkedin className="w-4 h-4" />,
  "email-sig": <Mail className="w-4 h-4" />,
};

export function ExportMenu({ previewRef, isExporting, setIsExporting }: ExportMenuProps) {
  const exportToPNG = async (scale: number = 2, filename?: string) => {
    if (!previewRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        onclone: (clonedDoc) => {
          const element = clonedDoc.body.querySelector('[data-capture="flyer"]');
          if (element instanceof HTMLElement) {
            element.style.transform = 'none';
            element.style.margin = '0';
          }
        }
      });
      const link = document.createElement("a");
      link.download = filename || `mortgage-flyer-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
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
        scale: 3, // Higher quality for PDF
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        onclone: (clonedDoc) => {
          const element = clonedDoc.body.querySelector('[data-capture="flyer"]');
          if (element instanceof HTMLElement) {
            element.style.transform = 'none';
          }
        }
      });
      const imgData = canvas.toDataURL("image/png", 1.0);
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

  const exportPrintReady = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    try {
      // 300 DPI for print = scale 4 (approximately)
      const canvas = await html2canvas(previewRef.current, {
        scale: 4,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `mortgage-flyer-print-300dpi-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
      toast.success("Print-ready PNG (300 DPI) downloaded!");
    } catch (error) {
      toast.error("Failed to export print-ready PNG");
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportSocialFormat = async (format: ExportFormat) => {
    if (!previewRef.current) return;
    setIsExporting(true);

    const config = exportFormats.find(f => f.format === format);
    if (!config) return;

    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: config.scale,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        onclone: (clonedDoc) => {
          const element = clonedDoc.body.querySelector('[data-capture="flyer"]');
          if (element instanceof HTMLElement) {
            element.style.transform = 'none';
          }
        }
      });

      // Create a new canvas with the target dimensions
      const targetCanvas = document.createElement("canvas");
      targetCanvas.width = config.width;
      targetCanvas.height = config.height;
      const ctx = targetCanvas.getContext("2d");

      if (ctx) {
        // Use white background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, config.width, config.height);

        // Calculate scaling to fit content
        const scale = Math.min(
          config.width / canvas.width,
          config.height / canvas.height
        );

        const scaledWidth = canvas.width * scale;
        const scaledHeight = canvas.height * scale;
        const x = (config.width - scaledWidth) / 2;
        const y = (config.height - scaledHeight) / 2;

        ctx.drawImage(canvas, x, y, scaledWidth, scaledHeight);
      }

      const link = document.createElement("a");
      link.download = `mortgage-flyer-${format}-${Date.now()}.png`;
      link.href = targetCanvas.toDataURL("image/png", 1.0);
      link.click();
      toast.success(`${config.label} downloaded!`);
    } catch (error) {
      toast.error("Failed to export");
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" disabled={isExporting}>
          <Download className="w-4 h-4 mr-1.5" />
          {isExporting ? "Exporting..." : "Export"}
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Print Formats</DropdownMenuLabel>
        <DropdownMenuItem onClick={exportToPDF} disabled={isExporting}>
          <FileText className="w-4 h-4 mr-2" />
          Letter PDF (8.5×11)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportPrintReady} disabled={isExporting}>
          <Printer className="w-4 h-4 mr-2" />
          Print-Ready PNG (300 DPI)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportToPNG(2)} disabled={isExporting}>
          <FileImage className="w-4 h-4 mr-2" />
          High-Res PNG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportSocialFormat("postcard")} disabled={isExporting}>
          <CreditCard className="w-4 h-4 mr-2" />
          Postcard (6×4)
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Social Media</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => exportSocialFormat("instagram")} disabled={isExporting}>
          <Instagram className="w-4 h-4 mr-2" />
          Instagram Story (1080×1920)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportSocialFormat("facebook")} disabled={isExporting}>
          <Facebook className="w-4 h-4 mr-2" />
          Facebook Post (1200×630)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportSocialFormat("linkedin")} disabled={isExporting}>
          <Linkedin className="w-4 h-4 mr-2" />
          LinkedIn Post (1200×627)
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Other</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => exportSocialFormat("email-sig")} disabled={isExporting}>
          <Mail className="w-4 h-4 mr-2" />
          Email Signature (600×200)
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <div className="px-2 py-2.5 bg-emerald-500/10 rounded-md mx-2 mb-1 mt-1 border border-emerald-500/20">
          <p className="text-[10px] text-emerald-400 font-medium leading-tight">
            <span className="font-bold flex items-center gap-1 mb-1"><Eye className="w-3 h-3" /> Pro Tip</span>
            PDFs are static! For text messages and mobile, click <strong className="text-white">Get Live Link</strong> instead to share an interactive mobile page.
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
