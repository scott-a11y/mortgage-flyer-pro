import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FlyerData } from "@/types/flyer";
import { FlyerPreview } from "@/components/flyer/FlyerPreview";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertCircle, RefreshCw, Share2, ShieldCheck, TrendingUp } from "lucide-react";
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
    try {
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
      setFlyerData(templateData);

      // Only show error toast if we're not in a fallback/demo state that already has data
      if (!templateData.broker.name || templateData.broker.name !== "Scott Little") {
        toast.error("Showing last saved rates");
      }
    } finally {
      setIsLoading(false);
      setIsRefreshingRates(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
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
          fha: flyerData.rates.fha ? flyerData.rates.fha.replace('%', '') : '5.50',
          va: flyerData.rates.va ? flyerData.rates.va.replace('%', '') : '5.50'
        }}
        rateType={flyerData.rateType}
        lastUpdated={lastRateUpdate
          ? lastRateUpdate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
          : flyerData.rates.dateGenerated
        }
      />

      {/* Hidden Social Card for Capture */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <SocialShareCard ref={cardRef} data={flyerData} shareUrl={window.location.href} />
      </div>

      {/* Smart Share Button (Mobile/Desktop Action) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full px-4 flex justify-center pointer-events-none">
        <div className="pointer-events-auto bg-[#050505]/90 backdrop-blur-md border border-white/10 p-4 shadow-2xl rounded-2xl max-w-sm w-full">
          <SmartShareButton
            onGenerateBlob={generateSocialCard}
            title={`Rate Update: Scott Little | IA Mortgage`}
            text={`Check out the latest mortgage rates from Scott Little at IA Mortgage. #MortgageRates #RealEstate`}
          />
        </div>
      </div>
    </>
  );
}
