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
import { Download, FileImage, FileText, ChevronDown, Instagram, Facebook, Mail } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { ExportFormat } from "@/types/flyer";

interface ExportMenuProps {
  previewRef: React.RefObject<HTMLDivElement>;
  isExporting: boolean;
  setIsExporting: (value: boolean) => void;
}

const formatConfigs: Record<ExportFormat, { icon: React.ReactNode; label: string; width: number; height: number }> = {
  letter: { icon: <FileText className="w-4 h-4" />, label: "Letter PDF (8.5×11)", width: 612, height: 792 },
  instagram: { icon: <Instagram className="w-4 h-4" />, label: "Instagram Story", width: 1080, height: 1920 },
  facebook: { icon: <Facebook className="w-4 h-4" />, label: "Facebook Post", width: 1200, height: 630 },
  "email-sig": { icon: <Mail className="w-4 h-4" />, label: "Email Signature", width: 600, height: 200 },
};

export function ExportMenu({ previewRef, isExporting, setIsExporting }: ExportMenuProps) {
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

  const exportSocialFormat = async (format: ExportFormat) => {
    if (!previewRef.current) return;
    setIsExporting(true);
    
    const config = formatConfigs[format];
    
    try {
      // For social formats, we'll scale and crop the preview
      const canvas = await html2canvas(previewRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      // Create a new canvas with the target dimensions
      const targetCanvas = document.createElement("canvas");
      targetCanvas.width = config.width;
      targetCanvas.height = config.height;
      const ctx = targetCanvas.getContext("2d");
      
      if (ctx) {
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
      link.href = targetCanvas.toDataURL("image/png");
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
          Export
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Print Formats</DropdownMenuLabel>
        <DropdownMenuItem onClick={exportToPDF} disabled={isExporting}>
          <FileText className="w-4 h-4 mr-2" />
          Letter PDF (8.5×11)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPNG} disabled={isExporting}>
          <FileImage className="w-4 h-4 mr-2" />
          High-Res PNG
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Social Media</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => exportSocialFormat("instagram")} disabled={isExporting}>
          <Instagram className="w-4 h-4 mr-2" />
          Instagram Story
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportSocialFormat("facebook")} disabled={isExporting}>
          <Facebook className="w-4 h-4 mr-2" />
          Facebook Post
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Other</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => exportSocialFormat("email-sig")} disabled={isExporting}>
          <Mail className="w-4 h-4 mr-2" />
          Email Signature
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
