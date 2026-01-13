import { FlyerData, brokerageThemes, ColorTheme } from "@/types/flyer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Palette } from "lucide-react";
import { useState } from "react";

interface ThemeEditorProps {
  data: FlyerData;
  onChange: (data: FlyerData) => void;
}

export function ThemeEditor({ data, onChange }: ThemeEditorProps) {
  const [customTheme, setCustomTheme] = useState<ColorTheme>({
    id: "custom",
    name: "Custom",
    primary: data.colorTheme?.primary || "#B5A26E",
    secondary: data.colorTheme?.secondary || "#1C1C1C",
    accent: data.colorTheme?.accent || "#D4AF37",
  });

  const selectTheme = (theme: ColorTheme) => {
    onChange({
      ...data,
      colorTheme: theme,
    });
  };

  const applyCustomTheme = () => {
    onChange({
      ...data,
      colorTheme: { ...customTheme, id: "custom", name: "Custom" },
    });
  };

  const updateCustomColor = (field: keyof Pick<ColorTheme, "primary" | "secondary" | "accent">, value: string) => {
    setCustomTheme(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="editor-section">
      <h3 className="font-semibold text-foreground">Brokerage Theme</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Choose a preset brokerage theme or create custom colors.
      </p>

      {/* Preset Themes */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {brokerageThemes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => selectTheme(theme)}
            className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
              data.colorTheme?.id === theme.id
                ? "border-primary ring-2 ring-primary/20"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="flex gap-0.5">
              <div
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: theme.primary }}
              />
              <div
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: theme.secondary }}
              />
              <div
                className="w-4 h-4 rounded-sm border"
                style={{ backgroundColor: theme.accent }}
              />
            </div>
            <span className="text-xs font-medium truncate flex-1">{theme.name}</span>
            {data.colorTheme?.id === theme.id && (
              <Check className="w-3 h-3 text-primary flex-shrink-0" />
            )}
          </button>
        ))}
      </div>

      {/* Custom Theme */}
      <div className="border rounded-lg p-3 space-y-3">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-muted-foreground" />
          <Label className="font-medium text-sm">Custom Colors</Label>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Primary</Label>
            <div className="flex gap-1">
              <input
                type="color"
                value={customTheme.primary}
                onChange={(e) => updateCustomColor("primary", e.target.value)}
                className="w-8 h-8 rounded border cursor-pointer"
              />
              <Input
                value={customTheme.primary}
                onChange={(e) => updateCustomColor("primary", e.target.value)}
                className="text-xs h-8"
                placeholder="#B5A26E"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Secondary</Label>
            <div className="flex gap-1">
              <input
                type="color"
                value={customTheme.secondary}
                onChange={(e) => updateCustomColor("secondary", e.target.value)}
                className="w-8 h-8 rounded border cursor-pointer"
              />
              <Input
                value={customTheme.secondary}
                onChange={(e) => updateCustomColor("secondary", e.target.value)}
                className="text-xs h-8"
                placeholder="#1C1C1C"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Accent</Label>
            <div className="flex gap-1">
              <input
                type="color"
                value={customTheme.accent}
                onChange={(e) => updateCustomColor("accent", e.target.value)}
                className="w-8 h-8 rounded border cursor-pointer"
              />
              <Input
                value={customTheme.accent}
                onChange={(e) => updateCustomColor("accent", e.target.value)}
                className="text-xs h-8"
                placeholder="#D4AF37"
              />
            </div>
          </div>
        </div>

        <Button size="sm" onClick={applyCustomTheme} className="w-full">
          Apply Custom Theme
        </Button>
      </div>
    </div>
  );
}
