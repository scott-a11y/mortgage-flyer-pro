import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlyerData } from "@/types/flyer";
import { RatesEditor } from "./editors/RatesEditor";
import { MarketCopyEditor } from "./editors/MarketCopyEditor";
import { RegionsEditor } from "./editors/RegionsEditor";
import { ContactEditor } from "./editors/ContactEditor";
import { ThemeEditor } from "./editors/ThemeEditor";
import { LayoutSelector } from "./editors/LayoutSelector";
import { ShareableBanner } from "./ShareableBanner";
import { DollarSign, FileText, MapPin, Users, Palette, Image } from "lucide-react";

interface EditorTabsProps {
  data: FlyerData;
  onChange: (data: FlyerData) => void;
}

export function EditorTabs({ data, onChange }: EditorTabsProps) {
  // Generate share URL for banners
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/live/${encodeURIComponent(data.broker.name.toLowerCase().replace(/\s+/g, '-'))}`
    : '';

  return (
    <Tabs defaultValue="rates" className="w-full">
      <TabsList className="grid w-full grid-cols-6 mb-4">
        <TabsTrigger value="rates" className="flex items-center gap-1.5 text-xs">
          <DollarSign className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Rates</span>
        </TabsTrigger>
        <TabsTrigger value="copy" className="flex items-center gap-1.5 text-xs">
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Headlines</span>
        </TabsTrigger>
        <TabsTrigger value="regions" className="flex items-center gap-1.5 text-xs">
          <MapPin className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Regions</span>
        </TabsTrigger>
        <TabsTrigger value="contacts" className="flex items-center gap-1.5 text-xs">
          <Users className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Contacts</span>
        </TabsTrigger>
        <TabsTrigger value="style" className="flex items-center gap-1.5 text-xs">
          <Palette className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Style</span>
        </TabsTrigger>
        <TabsTrigger value="banners" className="flex items-center gap-1.5 text-xs">
          <Image className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Banners</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="rates" className="mt-0">
        <RatesEditor data={data} onChange={onChange} />
      </TabsContent>

      <TabsContent value="copy" className="mt-0">
        <MarketCopyEditor data={data} onChange={onChange} />
      </TabsContent>

      <TabsContent value="regions" className="mt-0">
        <RegionsEditor data={data} onChange={onChange} />
      </TabsContent>

      <TabsContent value="contacts" className="mt-0">
        <ContactEditor data={data} onChange={onChange} />
      </TabsContent>

      <TabsContent value="style" className="mt-0 space-y-6">
        <LayoutSelector data={data} onChange={onChange} />
        <ThemeEditor data={data} onChange={onChange} />
      </TabsContent>

      <TabsContent value="banners" className="mt-0">
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Download ready-to-share banners for email signatures and social media.
          </div>
          <div className="overflow-x-auto">
            <ShareableBanner data={data} shareUrl={shareUrl} />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
