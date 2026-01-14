import { useState } from "react";
import { FlyerData } from "@/types/flyer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link2, Copy, Check, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ShareLinkDialogProps {
  currentData: FlyerData;
}

function generateSlug(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function ShareLinkDialog({ currentData }: ShareLinkDialogProps) {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [templateName, setTemplateName] = useState("");

  const handleCreateLink = async () => {
    if (!templateName.trim()) {
      toast.error("Please enter a name for this flyer");
      return;
    }

    setIsCreating(true);
    try {
      const slug = generateSlug();
      
      const { data, error } = await supabase
        .from("flyer_templates")
        .insert([
          {
            name: templateName.trim(),
            data: JSON.parse(JSON.stringify(currentData)),
            slug: slug,
            is_published: true,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const baseUrl = window.location.origin;
      const url = `${baseUrl}/flyer/${slug}`;
      setShareUrl(url);
      toast.success("Live flyer link created!");
    } catch (err) {
      console.error("Error creating share link:", err);
      toast.error("Failed to create share link");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenLink = () => {
    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }
  };

  const handleClose = () => {
    setOpen(false);
    // Reset state after dialog closes
    setTimeout(() => {
      setShareUrl(null);
      setTemplateName("");
      setCopied(false);
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => isOpen ? setOpen(true) : handleClose()}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Link2 className="w-4 h-4" />
          Live Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-primary" />
            Create Live Flyer Link
          </DialogTitle>
          <DialogDescription>
            Generate a shareable link that always shows current rates. Perfect for emailing to realtors and clients!
          </DialogDescription>
        </DialogHeader>

        {!shareUrl ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="flyer-name">Flyer Name</Label>
              <Input
                id="flyer-name"
                placeholder="e.g., Spring 2025 Rates - Celeste"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                disabled={isCreating}
              />
              <p className="text-xs text-muted-foreground">
                This helps you identify the flyer later
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                How it works
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Rates update automatically when viewed</li>
                <li>• Share via email, text, or social media</li>
                <li>• Works on any device</li>
                <li>• No login required for viewers</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800 font-medium mb-2">
                ✓ Your live flyer link is ready!
              </p>
              <div className="flex gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="bg-white text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleOpenLink}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Preview Link
            </Button>
          </div>
        )}

        <DialogFooter>
          {!shareUrl ? (
            <>
              <Button variant="outline" onClick={handleClose} disabled={isCreating}>
                Cancel
              </Button>
              <Button onClick={handleCreateLink} disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4 mr-2" />
                    Create Live Link
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={handleClose}>Done</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
