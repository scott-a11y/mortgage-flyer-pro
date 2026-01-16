import { useEffect, useState } from "react";
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

export default function LiveFlyer() {
  const { slug } = useParams<{ slug: string }>();
  const [flyerData, setFlyerData] = useState<FlyerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshingRates, setIsRefreshingRates] = useState(false);
  const [lastRateUpdate, setLastRateUpdate] = useState<Date | null>(null);

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
        setError("Flyer not found or no longer available");
        return;
      }

      const templateData = template.data as unknown as FlyerData;
      await fetchLiveRates(templateData);
    } catch (err) {
      console.error("Error loading flyer:", err);
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
          fifteenYearFixed: ratesData.fifteenYearFixed || templateData.rates.fifteenYearFixed,
          fifteenYearFixedAPR: ratesData.fifteenYearFixedAPR || templateData.rates.fifteenYearFixedAPR,
          thirtyYearJumbo: ratesData.thirtyYearJumbo || templateData.rates.thirtyYearJumbo,
          thirtyYearJumboAPR: ratesData.thirtyYearJumboAPR || templateData.rates.thirtyYearJumboAPR,
          fiveOneArm: ratesData.fiveOneArm || templateData.rates.fiveOneArm,
          fiveOneArmAPR: ratesData.fiveOneArmAPR || templateData.rates.fiveOneArmAPR,
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
      toast.error("Showing last saved rates");
    } finally {
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden selection:bg-primary selection:text-black">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="container max-w-5xl mx-auto px-4 py-8 md:py-12 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10 opacity-30 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4"
        >
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 border border-primary/30">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Live Market Data
              </div>
              <div className="bg-white/5 text-white/60 px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-widest border border-white/10 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3" />
                NMLS Verified
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-light tracking-tight">
              Personalized Rate Sheet
            </h1>
            {lastRateUpdate && (
              <p className="text-white/40 text-sm mt-1">
                Updated at {lastRateUpdate.toLocaleTimeString()} • Powered by Freddie Mac
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="border-white/10 bg-white/5 hover:bg-white/10 transition-all rounded-full h-10 px-6"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchLiveRates(flyerData)}
              disabled={isRefreshingRates}
              className="border-white/10 bg-white/5 hover:bg-white/10 transition-all rounded-full h-10 px-6"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshingRates ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-b from-primary/20 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          <div className="relative bg-[#0a0a0a] rounded-xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden border border-white/5 flex flex-col items-center">
            <div className="w-full max-w-full overflow-x-auto overflow-y-hidden pb-4 md:pb-0 scrollbar-hide">
              <div className="transform scale-[0.85] md:scale-100 py-4 md:py-0 origin-top">
                <FlyerPreview data={flyerData} />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center md:text-left">
            <TrendingUp className="w-6 h-6 text-primary mb-3 mx-auto md:mx-0" />
            <h3 className="text-sm font-medium mb-1">Live Updates</h3>
            <p className="text-xs text-white/40 leading-relaxed">
              These rates are fetched in real-time. Refresh this page anytime for the latest market data.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center md:text-left">
            <ShieldCheck className="w-6 h-6 text-primary mb-3 mx-auto md:mx-0" />
            <h3 className="text-sm font-medium mb-1">Secure & Official</h3>
            <p className="text-xs text-white/40 leading-relaxed">
              Data is sourced directly from Freddie Mac’s Primary Mortgage Market Survey (PMMS).
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center md:text-left">
            <Loader2 className="w-6 h-6 text-primary mb-3 mx-auto md:mx-0" />
            <h3 className="text-sm font-medium mb-1">Instant Pre-Qual</h3>
            <p className="text-xs text-white/40 leading-relaxed">
              Click the "Apply Now" button on the flyer to start your loan application instantly.
            </p>
          </div>
        </motion.div>

        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-medium mb-4">
            Compliance & Disclosures
          </p>
          <p className="text-[10px] text-white/30 max-w-3xl mx-auto leading-relaxed px-4">
            Equal Housing Opportunity. Rates are for informational purposes only and are subject to change.
            APR reflects total loan cost including estimated fees and points. This is not a commitment to lend.
            Registered NMLS #{flyerData.broker.nmls} and #{flyerData.company.nmls}.
          </p>
        </div>
      </div>
    </div>
  );
}
