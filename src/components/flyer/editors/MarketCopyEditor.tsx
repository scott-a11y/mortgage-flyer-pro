import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FlyerData } from "@/types/flyer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Loader2, QrCode } from "lucide-react";

interface MarketCopyEditorProps {
  data: FlyerData;
  onChange: (data: FlyerData) => void;
}

export function MarketCopyEditor({ data, onChange }: MarketCopyEditorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const updateCopy = (field: keyof FlyerData["marketCopy"], value: string) => {
    onChange({
      ...data,
      marketCopy: { ...data.marketCopy, [field]: value },
    });
  };

  const updateCTA = (field: keyof FlyerData["cta"], value: string) => {
    onChange({
      ...data,
      cta: { ...data.cta, [field]: value },
    });
  };

  const generateAIInsights = async () => {
    setIsGenerating(true);
    try {
      const { data: responseData, error } = await supabase.functions.invoke(
        "generate-market-insights",
        {
          body: {
            rates: data.rates,
            regions: data.regions,
            broker: data.broker,
            realtor: data.realtor,
          },
        }
      );

      if (error) {
        throw error;
      }

      if (responseData?.error) {
        throw new Error(responseData.error);
      }

      const insights = responseData.insights;

      // Update market copy
      onChange({
        ...data,
        marketCopy: {
          headline: insights.headline || data.marketCopy.headline,
          subheading: insights.subheading || data.marketCopy.subheading,
          marketInsight: insights.marketInsight || data.marketCopy.marketInsight,
        },
        // Update region insights if provided
        regions: data.regions.map((region, index) => {
          const aiRegion = insights.regionInsights?.find(
            (r: any) => r.name.toLowerCase().includes(region.name.toLowerCase().split(" ")[0])
          );
          return {
            ...region,
            insight: aiRegion?.insight || region.insight,
          };
        }) as [typeof data.regions[0], typeof data.regions[1], typeof data.regions[2]],
      });

      toast({
        title: "AI Insights Generated!",
        description: "Your market copy has been updated with AI-generated content.",
      });
    } catch (error) {
      console.error("Error generating insights:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Could not generate AI insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="editor-section">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-semibold text-foreground">Headlines & Copy</h3>
            <p className="text-xs text-muted-foreground">
              Customize the main messaging on your flyer.
            </p>
          </div>
          <Button
            onClick={generateAIInsights}
            disabled={isGenerating}
            size="sm"
            className="gap-2"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isGenerating ? "Generating..." : "AI Generate"}
          </Button>
        </div>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label className="editor-label">Main Headline</Label>
            <Input
              value={data.marketCopy.headline}
              onChange={(e) => updateCopy("headline", e.target.value)}
              placeholder="Sub-6% Mortgage Rates Are Here!"
            />
          </div>

          <div className="space-y-2">
            <Label className="editor-label">Subheading</Label>
            <Input
              value={data.marketCopy.subheading}
              onChange={(e) => updateCopy("subheading", e.target.value)}
              placeholder="Take advantage of competitive rates..."
            />
          </div>

          <div className="space-y-2">
            <Label className="editor-label">Key Market Insight</Label>
            <Textarea
              value={data.marketCopy.marketInsight}
              onChange={(e) => updateCopy("marketInsight", e.target.value)}
              placeholder="Current market conditions..."
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="editor-section">
        <h3 className="font-semibold text-foreground">Call-to-Action</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Customize the CTA button text, link, and QR code.
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="editor-label">Button Text</Label>
            <Input
              value={data.cta.buttonText}
              onChange={(e) => updateCTA("buttonText", e.target.value)}
              placeholder="Start My Pre-Qualification"
            />
          </div>

          <div className="space-y-2">
            <Label className="editor-label">Application URL (for QR code)</Label>
            <Input
              value={data.cta.buttonUrl}
              onChange={(e) => updateCTA("buttonUrl", e.target.value)}
              placeholder="https://www.iamortgage.org/apply"
            />
            <p className="text-[10px] text-muted-foreground">
              This URL will be encoded in the QR code for easy mobile access.
            </p>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium">Show QR Code</Label>
                <p className="text-[10px] text-muted-foreground">
                  Display scannable QR code on the flyer
                </p>
              </div>
            </div>
            <Switch
              checked={data.cta.showQRCode}
              onCheckedChange={(checked) => 
                onChange({
                  ...data,
                  cta: { ...data.cta, showQRCode: checked }
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
