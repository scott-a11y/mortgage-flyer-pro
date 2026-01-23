import { useState, useRef, useEffect } from "react";
import { FlyerData } from "@/types/flyer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Send, Copy, Check, Loader2, Download, ExternalLink, Mail, MessageSquare, Info, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import iaMortgageLogo from "@/assets/ia-mortgage-logo.png";
import { track } from "@vercel/analytics";

interface SendToClientDialogProps {
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

export function SendToClientDialog({ currentData }: SendToClientDialogProps) {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const clientName = templateName.split(' - ')[0] || 'there';

  const emailSubject = encodeURIComponent(`Your Personalized Mortgage Rates - ${currentData.rates.dateGenerated}`);
  const emailBody = encodeURIComponent(
    `Hi ${clientName},

I wanted to share today's mortgage rates with you! I've put together a personalized rate sheet that shows our current offerings.

🔗 View your live rates here: ${shareUrl || ''}

What you'll see:
• Current 30-year, 15-year, and Jumbo rates
• Rate comparison tools
• My contact information for questions

The rates are updated regularly, so you'll always see the most current information.

If you have any questions or would like to discuss your options, please don't hesitate to reach out!

Best regards,
${currentData.broker.name}
${currentData.broker.phone}
NMLS #${currentData.broker.nmls}

${currentData.company.name || 'IA Mortgage'}
${currentData.company.website || ''}`
  );

  const smsBody = encodeURIComponent(
    `Hi ${clientName}! Here are today's mortgage rates just for you: ${shareUrl || ''} - ${currentData.broker.name}, ${currentData.broker.phone}`
  );

  const handleEmailShare = () => {
    window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`, '_blank');
    toast.success("Opening email composer...");
  };

  const handleSMSShare = () => {
    // Use sms: protocol which works on both mobile and some desktop apps
    window.open(`sms:?body=${smsBody}`, '_blank');
    toast.success("Opening SMS composer...");
  };

  const handleCreateLink = async () => {
    if (!templateName.trim()) {
      toast.error("Please enter a name for this flyer");
      return;
    }

    setIsCreating(true);
    try {
      const slug = generateSlug();

      const { data: flyer, error } = await supabase
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

      // Track flyer generation
      track('FlyerGenerated', {
        flyerId: flyer?.id,
        flyerName: templateName.trim(),
        broker: currentData.broker.name,
        realtor: currentData.realtor.name,
        layout: currentData.layout || 'modern',
        source: 'send_to_client'
      });

      const baseUrl = window.location.origin;
      const url = `${baseUrl}/flyer/${slug}`;
      setShareUrl(url);
      toast.success("Live link created! Ready to share.");
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
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const preloadImages = async (container: HTMLElement): Promise<void> => {
    const images = container.querySelectorAll('img');
    const imagePromises = Array.from(images).map((img) => {
      return new Promise<void>((resolve) => {
        if (img.complete && img.naturalHeight !== 0) {
          resolve();
        } else {
          const newImg = new Image();
          newImg.crossOrigin = 'anonymous';
          newImg.onload = () => resolve();
          newImg.onerror = () => resolve();
          newImg.src = img.src;
        }
      });
    });
    await Promise.all(imagePromises);
  };

  const handleDownloadBanner = async () => {
    if (!bannerRef.current) return;

    setIsDownloading(true);
    try {
      await preloadImages(bannerRef.current);
      await new Promise(resolve => setTimeout(resolve, 200));

      const canvas = await html2canvas(bannerRef.current, {
        scale: 4, // Higher scale for sharper images
        useCORS: true,
        backgroundColor: "#050505",
        logging: false,
        imageTimeout: 15000,
        onclone: (clonedDoc) => {
          const banner = clonedDoc.querySelector('[data-capture="banner"]');
          if (banner instanceof HTMLElement) {
            banner.style.transform = 'none';
          }
          // Ensure images in cloned doc have crossOrigin set
          const images = clonedDoc.querySelectorAll('img');
          images.forEach((img) => {
            img.crossOrigin = 'anonymous';
          });
        }
      });

      const link = document.createElement("a");
      link.download = `rate-banner-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();

      toast.success("Banner downloaded!");
    } catch (err) {
      console.error("Error generating banner:", err);
      toast.error("Failed to download banner");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    closeTimeoutRef.current = setTimeout(() => {
      setShareUrl(null);
      setTemplateName("");
      setCopied(false);
    }, 200);
  };

  const themeColor = currentData.colorTheme?.primary || "#8B6914";
  const themeSecondary = currentData.colorTheme?.secondary || "#1a1a2e";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => isOpen ? setOpen(true) : handleClose()}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 bg-primary hover:bg-primary/90">
          <Send className="w-4 h-4" />
          Send to Client
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" />
            Send Rates to Client
          </DialogTitle>
          <DialogDescription>
            Create a co-branded link and banner to share with your clients
          </DialogDescription>
        </DialogHeader>

        {!shareUrl ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="client-name">Name this flyer</Label>
              <Input
                id="client-name"
                placeholder="e.g., John Smith - Home Purchase"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                disabled={isCreating}
                autoFocus
              />
            </div>

            <Button
              onClick={handleCreateLink}
              disabled={isCreating || !templateName.trim()}
              className="w-full"
              size="lg"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Create Shareable Link
                </>
              )}
            </Button>

            <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
              <strong>What you'll get:</strong> A live link + downloadable banner showing current rates and QR code.
            </div>
          </div>
        ) : (
          <div className="space-y-5 py-4">
            {/* Step 1: Copy Link */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">1</div>
                <span className="font-medium">Copy the link</span>
              </div>
              <div className="flex gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="text-sm font-mono"
                />
                <Button
                  onClick={handleCopy}
                  className="shrink-0 gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Step 2: Download Banner */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">2</div>
                <span className="font-medium">Download the banner image</span>
              </div>

              {/* Banner Preview */}
              <div className="rounded-lg overflow-hidden border" style={{ width: '100%' }}>
                <div
                  ref={bannerRef}
                  data-capture="banner"
                  style={{
                    width: 600,
                    height: 220,
                    background: themeSecondary,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    display: 'flex',
                    flexDirection: 'column',
                    transform: 'scale(0.72)',
                    transformOrigin: 'top left',
                  }}
                >
                  {/* Main content area */}
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 24px',
                  }}>
                    {/* Left - Broker */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: 'white', fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>{currentData.broker.name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9 }}>NMLS #{currentData.broker.nmls}</div>
                        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 2 }}>{currentData.broker.phone}</div>
                      </div>
                    </div>

                    {/* Center - Rates */}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>30-Yr Fixed</div>
                        <div style={{ color: 'white', fontWeight: 700, fontSize: 18, lineHeight: 1.1 }}>{currentData.rates.thirtyYearFixed}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8 }}>{currentData.rates.thirtyYearFixedAPR} APR</div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>15-Yr Fixed</div>
                        <div style={{ color: 'white', fontWeight: 700, fontSize: 18, lineHeight: 1.1 }}>{currentData.rates.fifteenYearFixed}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8 }}>{currentData.rates.fifteenYearFixedAPR} APR</div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Jumbo</div>
                        <div style={{ color: 'white', fontWeight: 700, fontSize: 18, lineHeight: 1.1 }}>{currentData.rates.thirtyYearJumbo}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8 }}>{currentData.rates.thirtyYearJumboAPR} APR</div>
                      </div>
                    </div>

                    {/* Right - Realtor */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: 'white', fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>{currentData.realtor.name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9 }}>{currentData.realtor.brokerage}</div>
                        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 2 }}>{currentData.realtor.phone}</div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    padding: '8px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <img src={currentData.company.logo || iaMortgageLogo} alt={currentData.company.name || 'IA Mortgage'} crossOrigin="anonymous" style={{ height: 32, maxWidth: 100, objectFit: 'contain' }} />
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8 }}>NMLS #{currentData.company.nmls}</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ background: 'white', padding: 3, borderRadius: 4 }}>
                        <QRCodeSVG value={shareUrl} size={32} level="M" />
                      </div>
                      <div>
                        <div style={{
                          background: themeColor,
                          padding: '4px 10px',
                          borderRadius: 12,
                          color: 'white',
                          fontSize: 9,
                          fontWeight: 600
                        }}>
                          View Live Rates →
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 8, marginTop: 3, textAlign: 'center', fontWeight: 500 }}>
                          {shareUrl.replace('https://', '').replace('http://', '')}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 6, marginTop: 1, textAlign: 'center' }}>
                          As of {currentData.rates.dateGenerated}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', maxWidth: 180 }}>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9 }}>{currentData.company.website}</div>
                      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 6, lineHeight: 1.2, marginTop: 2 }}>
                        Rates subject to change. Equal Housing Opportunity.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleDownloadBanner}
                disabled={isDownloading}
                variant="outline"
                className="w-full"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download Banner Image
                  </>
                )}
              </Button>
            </div>

            {/* Step 3: Quick Share */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">3</div>
                <span className="font-medium">Quick share options</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pl-8">
                <Button
                  onClick={handleEmailShare}
                  variant="outline"
                  className="gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </Button>
                <Button
                  onClick={handleSMSShare}
                  variant="outline"
                  className="gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Text/SMS
                </Button>
              </div>

              <p className="text-xs text-muted-foreground pl-8">
                Click to open a pre-filled message. Remember to attach the banner image!
              </p>
            </div>

            {/* Sharing Instructions */}
            <div className="border rounded-lg overflow-hidden">
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">How to share with clients</span>
                </div>
                {showInstructions ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              {showInstructions && (
                <div className="p-4 pt-0 space-y-4 text-sm border-t bg-muted/30">
                  <div>
                    <h4 className="font-medium mb-2">📧 Via Email</h4>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                      <li>Click the "Email" button above to open a pre-filled message</li>
                      <li>Add your client's email address</li>
                      <li>Attach the downloaded banner image</li>
                      <li>Personalize the message if needed and send!</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">💬 Via Text Message</h4>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                      <li>Click the "Text/SMS" button to open a pre-filled message</li>
                      <li>Add your client's phone number</li>
                      <li>Optionally attach the banner image (MMS)</li>
                      <li>Send!</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">📱 Via Social Media / Other Apps</h4>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                      <li>Copy the link using the button above</li>
                      <li>Download the banner image</li>
                      <li>Open your preferred app (WhatsApp, Messenger, etc.)</li>
                      <li>Paste the link and attach the banner</li>
                    </ol>
                  </div>

                  <div className="bg-primary/10 rounded-lg p-3 text-xs">
                    <strong className="text-primary">💡 Pro Tip:</strong>
                    <span className="text-muted-foreground"> The QR code on the banner links directly to the live rates page. Clients can scan it from a printed flyer or screenshot!</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => window.open(shareUrl, "_blank")} className="flex-1 gap-1.5">
                <ExternalLink className="w-4 h-4" />
                Preview
              </Button>
              <Button onClick={handleClose} className="flex-1">
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
