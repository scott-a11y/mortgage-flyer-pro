import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FlyerData } from "@/types/flyer";

interface MarketCopyEditorProps {
  data: FlyerData;
  onChange: (data: FlyerData) => void;
}

export function MarketCopyEditor({ data, onChange }: MarketCopyEditorProps) {
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

  return (
    <div className="space-y-4">
      <div className="editor-section">
        <h3 className="font-semibold text-foreground">Headlines & Copy</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Customize the main messaging on your flyer.
        </p>

        <div className="space-y-4">
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
          Customize the CTA button text and link.
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
            <Label className="editor-label">Button URL</Label>
            <Input
              value={data.cta.buttonUrl}
              onChange={(e) => updateCTA("buttonUrl", e.target.value)}
              placeholder="https://www.iamortgage.org/apply"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
