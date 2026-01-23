import { useState, useEffect } from "react";
import { FlyerData } from "@/types/flyer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Save, FolderOpen, Trash2, ChevronDown, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { agentPartners, AgentPartnerProfile } from "@/data/agentPartners";
import { UserPlus, UserPlus2 } from "lucide-react";
import { AgentRegistrationForm } from "./AgentRegistrationForm";
import { RealtorContact } from "@/types/flyer";

interface SavedTemplate {
  id: string;
  name: string;
  data: FlyerData;
  created_at: string;
}

interface TemplateManagerProps {
  currentData: FlyerData;
  onLoadTemplate: (data: FlyerData) => void;
}

export function TemplateManager({ currentData, onLoadTemplate }: TemplateManagerProps) {
  const [templates, setTemplates] = useState<SavedTemplate[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [registeredPartners, setRegisteredPartners] = useState<AgentPartnerProfile[]>([]);
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);

  // Fetch templates from database (or localStorage fallback)
  useEffect(() => {
    fetchTemplates();
  }, []);

  const isSupabaseConfigured = () => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    return url && !url.includes('placeholder.supabase.co');
  };

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      let fetchedTemplates: SavedTemplate[] = [];

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('flyer_templates')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          fetchedTemplates = data.map(t => ({
            id: t.id,
            name: t.name,
            data: t.data as unknown as FlyerData,
            created_at: t.created_at
          }));
        }
      }

      // Load from localStorage as fallback or addition
      const localTemplatesJson = localStorage.getItem('flyer_templates_local');
      if (localTemplatesJson) {
        const localTemplates = JSON.parse(localTemplatesJson);
        // Merge without duplicates (by ID)
        const existingIds = new Set(fetchedTemplates.map(t => t.id));
        localTemplates.forEach((lt: SavedTemplate) => {
          if (!existingIds.has(lt.id)) {
            fetchedTemplates.push(lt);
          }
        });
      }

      setTemplates(fetchedTemplates.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ));
    } catch (error) {
      console.error('Error fetching templates:', error);
      if (isSupabaseConfigured()) {
        toast.error("Failed to load cloud templates");
      }
    } finally {
      setIsLoading(false);
    }

    // Fetch registered agents
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('agent_profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          const partners: AgentPartnerProfile[] = data.map(p => ({
            id: p.id,
            name: p.name,
            realtor: {
              name: p.name,
              title: p.title || "REALTOR®",
              phone: p.phone || "",
              email: p.email || "",
              brokerage: p.brokerage || "",
              website: p.website || "",
              headshot: p.headshot_url || "",
              license_number: p.license_number || ""
            } as any, // Using any here to bypass strict typing for now if needed, but should match RealtorContact
            colorTheme: {
              id: `custom-${p.id}`,
              name: p.brokerage || "Custom",
              primary: p.color_primary || "#000000",
              secondary: p.color_secondary || "#FFFFFF",
              accent: p.color_accent || "#D4AF37"
            }
          }));
          setRegisteredPartners(partners);
        }
      } catch (error) {
        console.error('Error fetching registered agents:', error);
      }
    }
  };

  const handleSave = async () => {
    if (!templateName.trim()) {
      toast.error("Please enter a template name");
      return;
    }

    setIsSaving(true);
    try {
      const newId = crypto.randomUUID();
      const createdAt = new Date().toISOString();
      const templateToSave: SavedTemplate = {
        id: newId,
        name: templateName.trim(),
        data: JSON.parse(JSON.stringify(currentData)),
        created_at: createdAt
      };

      // Try saving to Supabase if configured
      if (isSupabaseConfigured()) {
        try {
          const { error } = await supabase
            .from('flyer_templates')
            .insert([{
              id: newId,
              name: templateName.trim(),
              data: templateToSave.data as any
            }]);
          if (error) throw error;
        } catch (supaErr) {
          console.warn("Cloud save failed, using local only", supaErr);
        }
      }

      // Always save to localStorage for persistence/offline
      const localTemplatesJson = localStorage.getItem('flyer_templates_local');
      const localTemplates = localTemplatesJson ? JSON.parse(localTemplatesJson) : [];
      localTemplates.unshift(templateToSave);
      localStorage.setItem('flyer_templates_local', JSON.stringify(localTemplates));

      setTemplates(prev => [templateToSave, ...prev]);
      setTemplateName("");
      setSaveDialogOpen(false);
      toast.success(`Template "${templateToSave.name}" saved!`);
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error("Failed to save template");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoad = (template: SavedTemplate) => {
    onLoadTemplate(template.data);
    toast.success(`Loaded template "${template.name}"`);
  };

  const handleDelete = async (templateId: string, templateName: string) => {
    try {
      // Delete from Supabase if configured
      if (isSupabaseConfigured()) {
        await supabase
          .from('flyer_templates')
          .delete()
          .eq('id', templateId);
      }

      // Always delete from localStorage
      const localTemplatesJson = localStorage.getItem('flyer_templates_local');
      if (localTemplatesJson) {
        const localTemplates = JSON.parse(localTemplatesJson);
        const filtered = localTemplates.filter((t: SavedTemplate) => t.id !== templateId);
        localStorage.setItem('flyer_templates_local', JSON.stringify(filtered));
      }

      setTemplates(prev => prev.filter(t => t.id !== templateId));
      toast.success(`Deleted template "${templateName}"`);
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error("Failed to delete template");
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Registration Dialog */}
      <Dialog open={registrationDialogOpen} onOpenChange={setRegistrationDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="hidden md:flex gap-1.5 h-8 text-xs text-muted-foreground hover:text-primary">
            <UserPlus2 className="w-3.5 h-3.5" />
            Join as Partner
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Partner Registration</DialogTitle>
            <DialogDescription>
              Register your professional profile to appear in the partner registry.
            </DialogDescription>
          </DialogHeader>
          <AgentRegistrationForm onSuccess={() => {
            setRegistrationDialogOpen(false);
            fetchTemplates(); // Refresh both lists
          }} />
        </DialogContent>
      </Dialog>

      {/* Save Template Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Save className="w-4 h-4 mr-1.5" />
            Save
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Template</DialogTitle>
            <DialogDescription>
              Save your current flyer configuration as a template for future use.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Template name (e.g., 'Adrian - Portland')"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isSaving && handleSave()}
              disabled={isSaving}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-1.5" />
              )}
              {isSaving ? "Saving..." : "Save Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Load Template Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <FolderOpen className="w-4 h-4 mr-1.5" />
            Load
            <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Saved Templates</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {isLoading ? (
            <div className="px-2 py-3 text-sm text-muted-foreground text-center flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </div>
          ) : templates.length === 0 ? (
            <div className="px-2 py-3 text-sm text-muted-foreground text-center">
              No saved templates yet
            </div>
          ) : (
            templates.map((template) => (
              <DropdownMenuItem
                key={template.id}
                className="flex items-center justify-between cursor-pointer"
              >
                <button
                  className="flex-1 text-left"
                  onClick={() => handleLoad(template)}
                >
                  <span className="font-medium">{template.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {new Date(template.created_at).toLocaleDateString()}
                  </span>
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(template.id, template.name);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </DropdownMenuItem>
            ))
          )}

          <DropdownMenuSeparator />
          <DropdownMenuLabel className="flex items-center gap-2">
            <UserPlus className="w-3.5 h-3.5" />
            Partner Profiles
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {agentPartners.map((partner) => (
            <DropdownMenuItem
              key={partner.id}
              className="cursor-pointer"
              onClick={() => {
                onLoadTemplate({
                  ...currentData,
                  realtor: partner.realtor,
                  colorTheme: partner.colorTheme,
                });
                toast.success(`Switched to ${partner.name}'s profile`);
              }}
            >
              <div className="flex flex-col">
                <span className="font-medium">{partner.name}</span>
                <span className="text-[10px] text-muted-foreground">{partner.realtor.brokerage}</span>
              </div>
            </DropdownMenuItem>
          ))}

          {registeredPartners.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                Registered Partners
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {registeredPartners.map((partner) => (
                <DropdownMenuItem
                  key={partner.id}
                  className="cursor-pointer"
                  onClick={() => {
                    onLoadTemplate({
                      ...currentData,
                      realtor: partner.realtor,
                      colorTheme: partner.colorTheme,
                    });
                    toast.success(`Switched to ${partner.name}'s profile`);
                  }}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{partner.name}</span>
                    <span className="text-[10px] text-muted-foreground">{partner.realtor.brokerage}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-primary focus:text-primary font-medium"
            onClick={() => setRegistrationDialogOpen(true)}
          >
            <UserPlus2 className="w-4 h-4 mr-2" />
            Join as a Partner
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
