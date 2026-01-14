import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { FlyerData } from "@/types/flyer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Building, User, Home } from "lucide-react";
import { ImageUploader } from "./ImageUploader";

interface ContactEditorProps {
  data: FlyerData;
  onChange: (data: FlyerData) => void;
}

export function ContactEditor({ data, onChange }: ContactEditorProps) {
  const updateBroker = (field: keyof FlyerData["broker"], value: string | number) => {
    onChange({
      ...data,
      broker: { ...data.broker, [field]: value },
    });
  };

  const updateCompany = (field: keyof FlyerData["company"], value: string) => {
    onChange({
      ...data,
      company: { ...data.company, [field]: value },
    });
  };

  const updateRealtor = (field: keyof FlyerData["realtor"], value: string | number) => {
    onChange({
      ...data,
      realtor: { ...data.realtor, [field]: value },
    });
  };

  return (
    <div className="editor-section">
      <h3 className="font-semibold text-foreground">Contact Information</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Update broker, company, and realtor contact details with photos and logos.
      </p>

      <Accordion type="multiple" defaultValue={["broker", "realtor"]} className="w-full">
        {/* Broker Info */}
        <AccordionItem value="broker">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-flyer-light-blue" />
              <span className="font-medium">Mortgage Broker</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <ImageUploader
              label="Headshot Photo"
              value={data.broker.headshot}
              onChange={(url) => updateBroker("headshot", url)}
              type="headshot"
              placeholder="Upload a professional headshot"
            />
            
            {/* Headshot Position Slider */}
            {data.broker.headshot && (
              <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
                <Label className="editor-label flex items-center gap-2">
                  <span>Photo Position</span>
                  <span className="text-muted-foreground text-xs font-normal">
                    (Adjust vertical crop)
                  </span>
                </Label>
                <div className="flex items-center gap-4">
                  {/* Preview circle */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden border-2 border-primary/50">
                    <img 
                      src={data.broker.headshot}
                      alt="Position preview"
                      className="w-full h-full object-cover"
                      style={{ objectPosition: `center ${data.broker.headshotPosition ?? 25}%` }}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Slider
                      value={[data.broker.headshotPosition ?? 25]}
                      onValueChange={(value) => updateBroker("headshotPosition", value[0])}
                      min={0}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>Top (0%)</span>
                      <span className="font-medium">{data.broker.headshotPosition ?? 25}%</span>
                      <span>Bottom (100%)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="editor-label">Name</Label>
                <Input
                  value={data.broker.name}
                  onChange={(e) => updateBroker("name", e.target.value)}
                  placeholder="Scott Little"
                />
              </div>
              <div className="space-y-2">
                <Label className="editor-label">Title</Label>
                <Input
                  value={data.broker.title}
                  onChange={(e) => updateBroker("title", e.target.value)}
                  placeholder="Mortgage Broker"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="editor-label">Phone</Label>
                <Input
                  value={data.broker.phone}
                  onChange={(e) => updateBroker("phone", e.target.value)}
                  placeholder="(360) 606-1106"
                />
              </div>
              <div className="space-y-2">
                <Label className="editor-label">NMLS #</Label>
                <Input
                  value={data.broker.nmls}
                  onChange={(e) => updateBroker("nmls", e.target.value)}
                  placeholder="130371"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="editor-label">Email</Label>
              <Input
                value={data.broker.email}
                onChange={(e) => updateBroker("email", e.target.value)}
                placeholder="scott@ialoans.com"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Company Info */}
        <AccordionItem value="company">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-flyer-navy" />
              <span className="font-medium">IA Loans Company</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <ImageUploader
              label="Company Logo"
              value={data.company.logo}
              onChange={(url) => updateCompany("logo", url)}
              type="logo"
              placeholder="Upload IA Loans logo"
            />
            <div className="space-y-2">
              <Label className="editor-label">Company Name</Label>
              <Input
                value={data.company.name}
                onChange={(e) => updateCompany("name", e.target.value)}
                placeholder="Imagination Age Mortgage"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="editor-label">Phone 1</Label>
                <Input
                  value={data.company.phone1}
                  onChange={(e) => updateCompany("phone1", e.target.value)}
                  placeholder="(360) 606-1106"
                />
              </div>
              <div className="space-y-2">
                <Label className="editor-label">Phone 2</Label>
                <Input
                  value={data.company.phone2}
                  onChange={(e) => updateCompany("phone2", e.target.value)}
                  placeholder="(503) 573-0960"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="editor-label">Website</Label>
                <Input
                  value={data.company.website}
                  onChange={(e) => updateCompany("website", e.target.value)}
                  placeholder="www.iamortgage.org"
                />
              </div>
              <div className="space-y-2">
                <Label className="editor-label">Company NMLS #</Label>
                <Input
                  value={data.company.nmls}
                  onChange={(e) => updateCompany("nmls", e.target.value)}
                  placeholder="1731464"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Realtor Info */}
        <AccordionItem value="realtor">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-flyer-gold" />
              <span className="font-medium">Real Estate Partner</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <ImageUploader
                label="Agent Headshot"
                value={data.realtor.headshot}
                onChange={(url) => updateRealtor("headshot", url)}
                type="headshot"
                placeholder="Agent photo"
              />
              <ImageUploader
                label="Brokerage Logo"
                value={data.realtor.logo}
                onChange={(url) => updateRealtor("logo", url)}
                type="logo"
                placeholder="Brokerage logo"
              />
            </div>
            
            {/* Realtor Headshot Position Slider */}
            {data.realtor.headshot && (
              <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
                <Label className="editor-label flex items-center gap-2">
                  <span>Photo Position</span>
                  <span className="text-muted-foreground text-xs font-normal">
                    (Adjust vertical crop)
                  </span>
                </Label>
                <div className="flex items-center gap-4">
                  {/* Preview circle */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden border-2 border-primary/50">
                    <img 
                      src={data.realtor.headshot}
                      alt="Position preview"
                      className="w-full h-full object-cover"
                      style={{ objectPosition: `center ${data.realtor.headshotPosition ?? 25}%` }}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Slider
                      value={[data.realtor.headshotPosition ?? 25]}
                      onValueChange={(value) => updateRealtor("headshotPosition", value[0])}
                      min={0}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>Top (0%)</span>
                      <span className="font-medium">{data.realtor.headshotPosition ?? 25}%</span>
                      <span>Bottom (100%)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="editor-label">Agent Name</Label>
                <Input
                  value={data.realtor.name}
                  onChange={(e) => updateRealtor("name", e.target.value)}
                  placeholder="Celeste Zarling"
                />
              </div>
              <div className="space-y-2">
                <Label className="editor-label">Title</Label>
                <Input
                  value={data.realtor.title}
                  onChange={(e) => updateRealtor("title", e.target.value)}
                  placeholder="Real Estate Professional"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="editor-label">Phone</Label>
                <Input
                  value={data.realtor.phone}
                  onChange={(e) => updateRealtor("phone", e.target.value)}
                  placeholder="(425) 420-4887"
                />
              </div>
              <div className="space-y-2">
                <Label className="editor-label">Email</Label>
                <Input
                  value={data.realtor.email}
                  onChange={(e) => updateRealtor("email", e.target.value)}
                  placeholder="cmzarling@gmail.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="editor-label">Brokerage Name</Label>
              <Input
                value={data.realtor.brokerage}
                onChange={(e) => updateRealtor("brokerage", e.target.value)}
                placeholder="Century 21 North Homes - Kirkland"
              />
            </div>
            <div className="space-y-2">
              <Label className="editor-label">Website</Label>
              <Input
                value={data.realtor.website}
                onChange={(e) => updateRealtor("website", e.target.value)}
                placeholder="www.century21northhomes.com"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
