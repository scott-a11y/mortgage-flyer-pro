import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlyerData } from "@/types/flyer";
import { RatesEditor } from "./editors/RatesEditor";
import { MarketCopyEditor } from "./editors/MarketCopyEditor";
import { RegionsEditor } from "./editors/RegionsEditor";
import { ContactEditor } from "./editors/ContactEditor";
import { ThemeEditor } from "./editors/ThemeEditor";
import { LayoutSelector } from "./editors/LayoutSelector";
import { DollarSign, FileText, MapPin, Users, Palette } from "lucide-react";

interface EditorTabsProps {
  data: FlyerData;
  onChange: (data: FlyerData) => void;
}

export function EditorTabs({ data, onChange }: EditorTabsProps) {
  return (
    <Tabs defaultValue="rates" className="w-full">
      <TabsList className="grid w-full grid-cols-5 mb-4">
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
    </Tabs>
  );
}
