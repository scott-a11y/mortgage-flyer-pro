import { useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FlyerData } from "@/types/flyer";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertCircle, RefreshCw, Share2, MessageCircle, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { LuxuryLayout } from "@/components/flyer/layouts/LuxuryLayout";
import { ModernLayout } from "@/components/flyer/layouts/ModernLayout";
import { TraditionalLayout } from "@/components/flyer/layouts/TraditionalLayout";
import { BBYSLayout } from "@/components/flyer/layouts/BBYSLayout";
import { agentPartners } from "@/data/agentPartners";
import html2canvas from "html2canvas";
import { SocialShareCard } from "@/components/share/SocialShareCard";

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
        // Handle special demo slugs like 'scott-little' or 'scott-little-adrian-mitchell'
        if (flyerSlug.startsWith('scott-little')) {
          console.log("Using Demo Mode fallback for flyer:", flyerSlug);
          const { defaultFlyerData } = await import('@/data/defaultFlyerData');
          let baseData = { ...defaultFlyerData };

          // Extract partner ID: "scott-little-adrian-mitchell" -> "adrian-mitchell"
          // But "scott-little" alone -> "scott-little" which won't match any partner
          if (flyerSlug !== 'scott-little') {
            const partnerId = flyerSlug.substring('scott-little-'.length);
            console.log("Looking for partner with ID:", partnerId);
            const partner = agentPartners.find(p => p.id === partnerId);

            if (partner) {
              console.log("Found partner:", partner.name);
              baseData = {
                ...baseData,
                realtor: partner.realtor,
                colorTheme: partner.colorTheme
              };
            } else {
              console.warn("No partner found for ID:", partnerId);
            }
          }

          await fetchLiveRates(baseData);
          return;
        }
        setError("Flyer not found or no longer available");
        return;
      }

      const templateData = template.data as unknown as FlyerData;
      await fetchLiveRates(templateData);
    } catch (err) {
      console.error("Error loading flyer:", err);
      if (flyerSlug.startsWith('scott-little')) {
        const { defaultFlyerData } = await import('@/data/defaultFlyerData');
        let baseData = { ...defaultFlyerData };

        // Also try to load partner in error fallback
        if (flyerSlug !== 'scott-little') {
          const partnerId = flyerSlug.substring('scott-little-'.length);
          const partner = agentPartners.find(p => p.id === partnerId);
          if (partner) {
            baseData = { ...baseData, realtor: partner.realtor, colorTheme: partner.colorTheme };
          }
        }

        await fetchLiveRates(baseData);
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

  // Track page view for analytics
  useEffect(() => {
    if (!slug || !flyerData) return;

    const trackPageView = async () => {
      try {
        const referrer = document.referrer || 'Direct';
        const userAgent = navigator.userAgent;

        const { error } = await supabase.functions.invoke('track-flyer-view', {
          body: {
            flyer_slug: slug,
            referrer,
            user_agent: userAgent
          }
        });

        if (error) {
          console.warn('Analytics tracking failed:', error);
        }
      } catch (err) {
        console.warn('Analytics tracking error:', err);
      }
    };

    const timer = setTimeout(trackPageView, 1000);
    return () => clearTimeout(timer);
  }, [slug, flyerData]);


  const fetchLiveRates = async (templateData: FlyerData) => {
    setIsRefreshingRates(true);

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
    const isPlaceholder = !supabaseUrl || supabaseUrl.includes('placeholder.supabase.co');
    const isDemo = slug?.startsWith('scott-little');

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

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      toast.success("Link copied to clipboard");
    } catch (err) {
      console.error("Copy failed:", err);
      toast.error("Failed to copy link");
    }
  };

  const handleShareImage = async () => {
    setIsGenerating(true);
    const toastId = toast.loading("Capturing flyer...");

    try {
      const blob = await generateSocialCard();
      if (!blob) throw new Error("Generation failed");

      const ua = navigator.userAgent;
      const isWindows = /Win/i.test(ua);
      const isMac = /Mac/i.test(ua) && !('ontouchend' in document);
      const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(ua);

      const shouldNativeShare = isMobile && !isWindows && !isMac && !!navigator.share;
      const file = new File([blob], 'rate-update.png', { type: 'image/png' });

      if (shouldNativeShare && navigator.canShare && navigator.canShare({ files: [file] })) {
        toast.dismiss(toastId);
        await navigator.share({
          files: [file],
          title: `Rate Update: ${flyerData?.broker.name}`,
          text: `Check out today's live rates from ${flyerData?.broker.name}.`,
        });
      } else {
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

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mortgage-rates-${new Date().toISOString().split('T')[0]}.png`;
        link.style.display = 'none';
        document.body.appendChild(link);

        setTimeout(() => {
          link.click();
          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }, 2000);
        }, 100);

        toast.dismiss(toastId);
        if (copied) {
          toast.success("Image Ready!", { description: "Copied to clipboard + downloading." });
        } else {
          toast.success("Downloading...");
        }
      }
    } catch (err) {
      console.error("Sharing failed:", err);
      toast.dismiss(toastId);
      toast.error("Could not share image");
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
            <p className="text-white/40 text-sm">Securing today's latest market data...</p>
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
          <Button variant="outline" onClick={() => window.location.reload()} className="mt-4 border-white/10 hover:bg-white/5">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!flyerData) return null;

  const generateSocialCard = async () => {
    if (!cardRef.current) return null;
    const images = Array.from(cardRef.current.querySelectorAll('img')) as HTMLImageElement[];
    await Promise.all(images.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }));
    const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true, backgroundColor: null, logging: false });
    return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>

      {/* TOP MENU BAR */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-white/5 px-4 h-16 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Share2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-white font-medium text-sm leading-none mb-1">Mortgage Rate Flyer</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Live Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleShareImage} disabled={isGenerating} size="sm" className="bg-amber-500 hover:bg-amber-600 text-black font-bold h-9 rounded-lg px-4 shadow-lg flex items-center gap-2 transition-all active:scale-95">
            {isGenerating ? <Loader2 className="animate-spin w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">Share Flyer Image</span>
          </Button>

          <div className="flex items-center gap-1.5 ml-1 border-l border-white/10 pl-3">
            <Button onClick={handleTextClient} variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-white/5 h-9 w-9 sm:w-auto sm:px-3 rounded-lg flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-green-400" />
              <span className="hidden md:inline">Text</span>
            </Button>
            <Button onClick={handleCopyLink} variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-white/5 h-9 w-9 sm:w-auto sm:px-3 rounded-lg flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-blue-400" />
              <span className="hidden md:inline">Copy</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 pt-20 pb-12 flex flex-col items-center bg-[#0a0a0a] overflow-y-auto overflow-x-hidden">
        <div className="w-full max-w-[1024px] px-4 md:px-8 py-8">
          <div className="bg-[#0f0f11] rounded-3xl shadow-2xl ring-1 ring-white/10 overflow-visible relative mx-auto" style={{ width: 'fit-content' }}>
            {flyerData.layout === "modern" && <ModernLayout data={flyerData} />}
            {flyerData.layout === "traditional" && <TraditionalLayout data={flyerData} />}
            {flyerData.layout === "bbys" && <BBYSLayout data={flyerData} />}
            {(!flyerData.layout || flyerData.layout === "luxury") && (
              <LuxuryLayout data={flyerData} />
            )}
          </div>
        </div>

        <div style={{ position: 'absolute', top: '-10000px', left: 0, opacity: 0, pointerEvents: 'none', width: 1080, height: 1080 }} aria-hidden="true">
          <SocialShareCard ref={cardRef} data={flyerData} shareUrl={getShareUrl()} />
        </div>
      </div>
    </div>
  );
}
