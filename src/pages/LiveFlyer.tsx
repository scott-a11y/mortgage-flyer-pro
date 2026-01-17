import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FlyerData } from "@/types/flyer";
import { FlyerPreview } from "@/components/flyer/FlyerPreview";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertCircle, RefreshCw, Share2, MessageCircle, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import LuxuryFlyerLayout from "@/components/LuxuryFlyerLayout";
import html2canvas from "html2canvas";
import { SocialShareCard } from "@/components/share/SocialShareCard";
import { SmartShareButton } from "@/components/share/SmartShareButton";

export default function LiveFlyer() {
  const { slug } = useParams<{ slug: string }>();
  const [flyerData, setFlyerData] = useState<FlyerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshingRates, setIsRefreshingRates] = useState(false);
  const [lastRateUpdate, setLastRateUpdate] = useState<Date | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Ref for the social card capture (Must be at top level)
  const cardRef = useRef<HTMLDivElement>(null);

  const pageTitle = flyerData
    ? `${flyerData.broker.name} x ${flyerData.realtor.name} | Mortgage Rates`
    : "Live Mortgage Rates";

  const pageDescription = flyerData
    ? `View today's live mortgage rates for ${flyerData.regions.map(r => r.name).join(", ")}. Co-branded by ${flyerData.broker.name} and ${flyerData.realtor.name}.`
    : "View live mortgage rates and regional market insights.";

  const loadFlyer = async (flyerSlug: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: template, error: fetchError } = await supabase
        .from("flyer_templates")
        .select("*")
        .eq("slug", flyerSlug)
        .eq("is_published", true)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!template) {
        if (flyerSlug === 'scott-little') {
          console.log("Using Demo Mode fallback for scott-little");
          const { defaultFlyerData } = await import('@/data/defaultFlyerData');
          await fetchLiveRates(defaultFlyerData);
          return;
        }
        setError("Flyer not found or no longer available");
        return;
      }

      const templateData = template.data as unknown as FlyerData;
      await fetchLiveRates(templateData);
    } catch (err) {
      console.error("Error loading flyer:", err);
      if (flyerSlug === 'scott-little') {
        const { defaultFlyerData } = await import('@/data/defaultFlyerData');
        await fetchLiveRates(defaultFlyerData);
        return;
      }
      setError("Failed to load flyer");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      loadFlyer(slug);
    }
  }, [slug]);

  const fetchLiveRates = async (templateData: FlyerData) => {
    setIsRefreshingRates(true);

    // Detect if we should use silent simulation mode
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
    const isPlaceholder = !supabaseUrl || supabaseUrl.includes('placeholder.supabase.co');
    const isDemo = slug === 'scott-little';

    try {
      if (isPlaceholder) {
        throw new Error("Placeholder mode");
      }

      const { data: ratesData, error: ratesError } = await supabase.functions.invoke(
        "fetch-mortgage-rates"
      );

      if (ratesError) throw ratesError;

      const updatedFlyer: FlyerData = {
        ...templateData,
        rates: {
          thirtyYearFixed: ratesData.thirtyYearFixed || templateData.rates.thirtyYearFixed,
          thirtyYearFixedAPR: ratesData.thirtyYearFixedAPR || templateData.rates.thirtyYearFixedAPR,
          fifteenYearFixed: ratesData.fifteenYearFixed || templateData.rates.fifteenYearFixed || "5.790%",
          fifteenYearFixedAPR: ratesData.fifteenYearFixedAPR || templateData.rates.fifteenYearFixedAPR || "5.99%",
          thirtyYearJumbo: ratesData.thirtyYearJumbo || templateData.rates.thirtyYearJumbo,
          thirtyYearJumboAPR: ratesData.thirtyYearJumboAPR || templateData.rates.thirtyYearJumboAPR,
          fiveOneArm: ratesData.fiveOneArm || templateData.rates.fiveOneArm,
          fiveOneArmAPR: ratesData.fiveOneArmAPR || templateData.rates.fiveOneArmAPR,
          fha: ratesData.fha || templateData.rates.fha || "5.50%",
          fhaAPR: ratesData.fhaAPR || templateData.rates.fhaAPR || "6.68%",
          va: ratesData.va || templateData.rates.va || "5.50%",
          vaAPR: ratesData.vaAPR || templateData.rates.vaAPR || "5.72%",
          dateGenerated: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      setFlyerData(updatedFlyer);
      setLastRateUpdate(new Date());
    } catch (err) {
      console.error("Error fetching live rates:", err);

      // Resilient Fallback: Even if fetch fails, the flyer must look perfect
      setFlyerData({
        ...templateData,
        rates: {
          ...templateData.rates,
          dateGenerated: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        }
      });
      setLastRateUpdate(new Date());

      // Only show error toast if we're not in a fallback/demo state
      if (!isDemo && !isPlaceholder) {
        toast.error("Showing last saved rates");
      }
    } finally {
      setIsLoading(false);
      setIsRefreshingRates(false);
    }
  };

  const getShareUrl = () => {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocal && slug) {
      return `https://mortgage-flyer-pro.vercel.app/live/${slug}`;
    }
    return window.location.href;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareUrl());
    toast.success("Link copied to clipboard", {
      description: "Link updated to production URL for sharing."
    });
  };

  const handleShareImage = async () => {
    setIsGenerating(true);
    const toastId = toast.loading("Capturing flyer...");

    try {
      const blob = await generateSocialCard();
      if (!blob) throw new Error("Generation failed");

      // STRICT DEVICE DETECTION
      // navigator.share on Windows/macOS is unreliable for local file blobs (Outlook/Teams/etc)
      const ua = navigator.userAgent;
      const isWindows = /Win/i.test(ua);
      const isMac = /Mac/i.test(ua) && !('ontouchend' in document);
      const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(ua);

      const shouldNativeShare = isMobile && !isWindows && !isMac && !!navigator.share;
      console.log("Sharing Strategy:", { shouldNativeShare, isMobile, isWindows, isMac, ua });

      const file = new File([blob], 'rate-update.png', { type: 'image/png' });

      if (shouldNativeShare && navigator.canShare && navigator.canShare({ files: [file] })) {
        toast.dismiss(toastId);
        await navigator.share({
          files: [file],
          title: `Rate Update: ${flyerData?.broker.name}`,
          text: `Check out today's live rates from ${flyerData?.broker.name} at ${flyerData?.company.name}.`,
        });
      } else {
        // Desktop / Fallback (Windows/macOS)
        let copied = false;
        try {
          if (navigator.clipboard && window.ClipboardItem) {
            await navigator.clipboard.write([
              new ClipboardItem({ [blob.type]: blob })
            ]);
            copied = true;
          }
        } catch (clipErr) {
          console.warn("Clipboard failed:", clipErr);
        }

        // 2. Trigger Download (with delay for browser compatibility)
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mortgage-rates-${new Date().toISOString().split('T')[0]}.png`;
        link.style.display = 'none';
        document.body.appendChild(link);

        // Small delay ensures download works reliably
        setTimeout(() => {
          link.click();
          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }, 100);
        }, 100);

        toast.dismiss(toastId);
        if (copied) {
          toast.success("Image Ready!", {
            description: "Copied to clipboard + downloading to your computer."
          });
        } else {
          toast.success("Downloading...", {
            description: "Check your Downloads folder for the flyer image."
          });
        }
      }
    } catch (err) {
      console.error("Sharing failed:", err);
      toast.dismiss(toastId);
      toast.error("Could not share image", {
        description: "Please try 'Copy Link' instead."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTextClient = () => {
    const text = `Hi, check out today's live mortgage rates here: ${getShareUrl()}`;
    window.location.href = `sms:?&body=${encodeURIComponent(text)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
        <div className="text-center space-y-6 max-w-sm w-full px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 rounded-2xl p-8 border border-white/10 backdrop-blur-xl"
          >
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-xl font-medium mb-2">Fetching Live Rates</h2>
            <p className="text-white/40 text-sm">Securing today's latest market data from Freddie Mac...</p>
            <div className="mt-6 flex flex-col gap-2">
              <Skeleton className="h-4 w-full bg-white/5" />
              <Skeleton className="h-4 w-3/4 bg-white/5" />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
        <div className="text-center space-y-4 max-w-md p-8 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-xl">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <h1 className="text-xl font-semibold">{error}</h1>
          <p className="text-white/40">
            This flyer link may have expired or been removed. Please contact your loan officer for a fresh link.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()} className="mt-4 border-white/10 hover:bg-white/5">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!flyerData) return null;

  if (!flyerData) return null;
  const generateSocialCard = async () => {
    if (!cardRef.current) return null;

    // Helper: Wait for images to load
    const images = Array.from(cardRef.current.querySelectorAll('img')) as HTMLImageElement[];
    await Promise.all(images.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve; // Continue even if error
      });
    }));

    // Generate Canvas
    const canvas = await html2canvas(cardRef.current, {
      scale: 2, // 2x is enough for social (2160x2160)
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });

    return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  };

  return (
    <>
      <LuxuryFlyerLayout
        officer={{
          name: flyerData.broker.name,
          title: flyerData.broker.title,
          nmls: flyerData.broker.nmls,
          image: typeof flyerData.broker.headshot === 'string' ? flyerData.broker.headshot : "/placeholder-scott.jpg",
          imagePosition: flyerData.broker.headshotPosition,
          imagePositionX: flyerData.broker.headshotPositionX
        }}
        agent={{
          name: flyerData.realtor.name,
          title: flyerData.realtor.title,
          email: flyerData.realtor.email,
          image: typeof flyerData.realtor.headshot === 'string' ? flyerData.realtor.headshot : "/placeholder-celeste.jpg",
          imagePosition: flyerData.realtor.headshotPosition,
          imagePositionX: flyerData.realtor.headshotPositionX
        }}
        rates={{
          jumbo: flyerData.rates.thirtyYearJumbo.replace('%', ''),
          conventional: flyerData.rates.thirtyYearFixed.replace('%', ''),
          fifteenYear: flyerData.rates.fifteenYearFixed.replace('%', ''),
          fha: flyerData.rates.fha ? flyerData.rates.fha.replace('%', '') : '5.50',
          va: flyerData.rates.va ? flyerData.rates.va.replace('%', '') : '5.50'
        }}
        rateType={flyerData.rateType}
        lastUpdated={lastRateUpdate
          ? lastRateUpdate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
          : flyerData.rates.dateGenerated
        }
      />

      {/* Hidden Social Card for Capture: 
          Positioned off-screen but fully rendered to ensure html2canvas captures it correctly.
          Using visibility:hidden is more reliable than opacity:0 for preventing empty images.
      */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1,
          overflow: 'hidden',
          width: 1080,
          height: 1080
        }}
        aria-hidden="true"
      >
        <SocialShareCard ref={cardRef} data={flyerData} shareUrl={getShareUrl()} />
      </div>

      {/* SMART TOOLBAR: 
         - Mobile: Fixed at bottom, full width.
         - Desktop: Floats in the center bottom, rounded corners.
      */}
      <div className="fixed bottom-0 md:bottom-6 left-0 right-0 p-4 md:p-0 z-50 flex justify-center pointer-events-none">
        <div className="w-full max-w-md bg-slate-900/95 backdrop-blur-md border border-slate-800 p-4 md:rounded-2xl shadow-2xl pointer-events-auto">

          <div className="flex flex-col gap-3">

            {/* Primary Action */}
            <Button
              onClick={handleShareImage}
              disabled={isGenerating}
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold h-12 rounded-xl text-lg shadow-lg flex items-center justify-center gap-2"
            >
              {isGenerating ? <Loader2 className="animate-spin" /> : <Share2 className="w-5 h-5" />}
              Share Flyer Image
            </Button>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleTextClient}
                variant="secondary"
                className="bg-slate-800 text-white hover:bg-slate-700 h-11 rounded-lg border border-slate-700"
              >
                <MessageCircle className="w-4 h-4 mr-2 text-green-400" />
                Text Link
              </Button>

              <Button
                onClick={handleCopyLink}
                variant="secondary"
                className="bg-slate-800 text-white hover:bg-slate-700 h-11 rounded-lg border border-slate-700"
              >
                <LinkIcon className="w-4 h-4 mr-2 text-blue-400" />
                Copy Link
              </Button>
            </div>

            {/* Desktop Hint */}
            <p className="hidden md:block text-center text-[10px] text-slate-500">
              On desktop? 'Share' will download the image.
            </p>

          </div>
        </div>
      </div>
    </>
  );
}
