import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FlyerData, RegionInfo } from "@/types/flyer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MapPin } from "lucide-react";

interface RegionsEditorProps {
  data: FlyerData;
  onChange: (data: FlyerData) => void;
}

export function RegionsEditor({ data, onChange }: RegionsEditorProps) {
  const updateRegion = (index: 0 | 1 | 2, field: keyof RegionInfo, value: string) => {
    const newRegions = [...data.regions] as [RegionInfo, RegionInfo, RegionInfo];
    newRegions[index] = { ...newRegions[index], [field]: value };
    onChange({
      ...data,
      regions: newRegions,
    });
  };

  return (
    <div className="editor-section">
      <h3 className="font-semibold text-foreground">Regional Market Insights</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Customize each region's information and market insights.
      </p>

      <Accordion type="single" collapsible defaultValue="region-0" className="w-full">
        {data.regions.map((region, idx) => (
          <AccordionItem key={idx} value={`region-${idx}`}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-flyer-gold" />
                <span className="font-medium">{region.name || `Region ${idx + 1}`}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label className="editor-label">Region Name</Label>
                <Input
                  value={region.name}
                  onChange={(e) => updateRegion(idx as 0 | 1 | 2, "name", e.target.value)}
                  placeholder="Oregon"
                />
              </div>

              <div className="space-y-2">
                <Label className="editor-label">Cities / Areas</Label>
                <Input
                  value={region.cities}
                  onChange={(e) => updateRegion(idx as 0 | 1 | 2, "cities", e.target.value)}
                  placeholder="Portland, Salem, Central Oregon"
                />
              </div>

              <div className="space-y-2">
                <Label className="editor-label">Market Insight</Label>
                <Textarea
                  value={region.insight}
                  onChange={(e) => updateRegion(idx as 0 | 1 | 2, "insight", e.target.value)}
                  placeholder="Market conditions and buyer opportunities..."
                  rows={3}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
