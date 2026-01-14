import { FlyerData, layoutTemplates, LayoutTemplate } from "@/types/flyer";
import { Label } from "@/components/ui/label";
import { Check, Layout } from "lucide-react";

interface LayoutSelectorProps {
  data: FlyerData;
  onChange: (data: FlyerData) => void;
}

export function LayoutSelector({ data, onChange }: LayoutSelectorProps) {
  const selectLayout = (layoutId: LayoutTemplate) => {
    onChange({
      ...data,
      layout: layoutId,
    });
  };

  return (
    <div className="editor-section">
      <div className="flex items-center gap-2 mb-1">
        <Layout className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-semibold text-foreground">Layout Template</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Choose a layout style for your flyer.
      </p>

      <div className="grid grid-cols-3 gap-3">
        {layoutTemplates.map((layout) => (
          <button
            key={layout.id}
            onClick={() => selectLayout(layout.id)}
            className={`flex flex-col items-center p-3 rounded-lg border text-center transition-all ${
              data.layout === layout.id
                ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
          >
            <div className="text-2xl mb-1.5">{layout.preview}</div>
            <span className="text-xs font-semibold">{layout.name}</span>
            <span className="text-[10px] text-muted-foreground leading-tight mt-0.5">
              {layout.description}
            </span>
            {data.layout === layout.id && (
              <Check className="w-4 h-4 text-primary mt-1.5" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
