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
import { Save, FolderOpen, Trash2, ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

  // Fetch templates from database
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('flyer_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setTemplates(data?.map(t => ({
        id: t.id,
        name: t.name,
        data: t.data as unknown as FlyerData,
        created_at: t.created_at
      })) || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error("Failed to load templates");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!templateName.trim()) {
      toast.error("Please enter a template name");
      return;
    }

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('flyer_templates')
        .insert([{
          name: templateName.trim(),
          data: JSON.parse(JSON.stringify(currentData))
        }])
        .select()
        .single();

      if (error) throw error;

      const newTemplate: SavedTemplate = {
        id: data.id,
        name: data.name as string,
        data: data.data as unknown as FlyerData,
        created_at: data.created_at
      };

      setTemplates(prev => [newTemplate, ...prev]);
      setTemplateName("");
      setSaveDialogOpen(false);
      toast.success(`Template "${newTemplate.name}" saved!`);
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
      const { error } = await supabase
        .from('flyer_templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;

      setTemplates(prev => prev.filter(t => t.id !== templateId));
      toast.success(`Deleted template "${templateName}"`);
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error("Failed to delete template");
    }
  };

  return (
    <div className="flex items-center gap-2">
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
              placeholder="Template name (e.g., 'Celeste - Kirkland')"
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
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
