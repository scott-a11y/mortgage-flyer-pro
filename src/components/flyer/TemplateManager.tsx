import { useState, useEffect } from "react";
import { FlyerData } from "@/types/flyer";
import { SavedTemplate, TEMPLATE_STORAGE_KEY } from "@/data/defaultFlyerData";
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
import { Save, FolderOpen, Trash2, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface TemplateManagerProps {
  currentData: FlyerData;
  onLoadTemplate: (data: FlyerData) => void;
}

export function TemplateManager({ currentData, onLoadTemplate }: TemplateManagerProps) {
  const [templates, setTemplates] = useState<SavedTemplate[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(TEMPLATE_STORAGE_KEY);
    if (stored) {
      try {
        setTemplates(JSON.parse(stored));
      } catch {
        setTemplates([]);
      }
    }
  }, []);

  const saveTemplates = (newTemplates: SavedTemplate[]) => {
    localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(newTemplates));
    setTemplates(newTemplates);
  };

  const handleSave = () => {
    if (!templateName.trim()) {
      toast.error("Please enter a template name");
      return;
    }

    const newTemplate: SavedTemplate = {
      id: Date.now().toString(),
      name: templateName.trim(),
      data: currentData,
      createdAt: new Date().toISOString(),
    };

    const updated = [...templates, newTemplate];
    saveTemplates(updated);
    setTemplateName("");
    setSaveDialogOpen(false);
    toast.success(`Template "${newTemplate.name}" saved!`);
  };

  const handleLoad = (template: SavedTemplate) => {
    onLoadTemplate(template.data);
    toast.success(`Loaded template "${template.name}"`);
  };

  const handleDelete = (templateId: string, templateName: string) => {
    const updated = templates.filter(t => t.id !== templateId);
    saveTemplates(updated);
    toast.success(`Deleted template "${templateName}"`);
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
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-1.5" />
              Save Template
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
          {templates.length === 0 ? (
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
                    {new Date(template.createdAt).toLocaleDateString()}
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
