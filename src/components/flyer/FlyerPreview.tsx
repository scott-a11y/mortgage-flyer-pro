import { FlyerData, LayoutTemplate } from "@/types/flyer";
import { forwardRef } from "react";
import { ModernLayout, TraditionalLayout, LuxuryLayout } from "./layouts";

interface FlyerPreviewProps {
  data: FlyerData;
}

export const FlyerPreview = forwardRef<HTMLDivElement, FlyerPreviewProps>(
  ({ data }, ref) => {
    const layout = data.layout || "modern";

    switch (layout) {
      case "traditional":
        return <TraditionalLayout ref={ref} data={data} />;
      case "luxury":
        return <LuxuryLayout ref={ref} data={data} />;
      case "modern":
      default:
        return <ModernLayout ref={ref} data={data} />;
    }
  }
);

FlyerPreview.displayName = "FlyerPreview";
