import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FlyerData } from "@/types/flyer";

interface RatesEditorProps {
  data: FlyerData;
  onChange: (data: FlyerData) => void;
}

export function RatesEditor({ data, onChange }: RatesEditorProps) {
  const updateRate = (field: keyof FlyerData["rates"], value: string) => {
    onChange({
      ...data,
      rates: { ...data.rates, [field]: value },
    });
  };

  return (
    <div className="editor-section">
      <h3 className="font-semibold text-foreground">Rate Information</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Update current mortgage rates. Include the % symbol.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="editor-label">30-Year Fixed</Label>
          <Input
            value={data.rates.thirtyYearFixed}
            onChange={(e) => updateRate("thirtyYearFixed", e.target.value)}
            placeholder="6.25%"
          />
        </div>

        <div className="space-y-2">
          <Label className="editor-label">15-Year Fixed</Label>
          <Input
            value={data.rates.fifteenYearFixed}
            onChange={(e) => updateRate("fifteenYearFixed", e.target.value)}
            placeholder="5.79%"
          />
        </div>

        <div className="space-y-2">
          <Label className="editor-label">30-Year Jumbo</Label>
          <Input
            value={data.rates.thirtyYearJumbo}
            onChange={(e) => updateRate("thirtyYearJumbo", e.target.value)}
            placeholder="6.40%"
          />
        </div>

        <div className="space-y-2">
          <Label className="editor-label">5/1 ARM</Label>
          <Input
            value={data.rates.fiveOneArm}
            onChange={(e) => updateRate("fiveOneArm", e.target.value)}
            placeholder="5.72%"
          />
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <Label className="editor-label">Date Generated</Label>
        <Input
          value={data.rates.dateGenerated}
          onChange={(e) => updateRate("dateGenerated", e.target.value)}
          placeholder="January 13, 2026"
        />
      </div>
    </div>
  );
}
