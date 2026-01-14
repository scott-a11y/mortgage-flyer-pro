import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FlyerData } from "@/types/flyer";
import { FlyerPreview } from "@/components/flyer/FlyerPreview";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LiveFlyer() {
  const { slug } = useParams<{ slug: string }>();
  const [flyerData, setFlyerData] = useState<FlyerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshingRates, setIsRefreshingRates] = useState(false);
  const [lastRateUpdate, setLastRateUpdate] = useState<Date | null>(null);

  useEffect(() => {
    if (slug) {
      loadFlyer(slug);
    }
  }, [slug]);

  const loadFlyer = async (flyerSlug: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch the template by slug
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
      
      // Fetch live rates
      await fetchLiveRates(templateData);
    } catch (err) {
      console.error("Error loading flyer:", err);
      setError("Failed to load flyer");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLiveRates = async (templateData: FlyerData) => {
    setIsRefreshingRates(true);
    try {
      const { data: ratesData, error: ratesError } = await supabase.functions.invoke(
        "fetch-mortgage-rates"
      );

      if (ratesError) throw ratesError;

      // Update flyer with live rates
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
      // Still show the flyer with stored rates
      setFlyerData(templateData);
      toast.error("Could not fetch live rates, showing last saved rates");
    } finally {
      setIsRefreshingRates(false);
    }
  };

  const handleRefreshRates = () => {
    if (flyerData) {
      fetchLiveRates(flyerData);
      toast.success("Refreshing rates...");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading live rates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center space-y-4 max-w-md p-8">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <h1 className="text-xl font-semibold">{error}</h1>
          <p className="text-muted-foreground">
            This flyer link may have expired or been removed.
          </p>
        </div>
      </div>
    );
  }

  if (!flyerData) return null;

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Live rates indicator */}
        <div className="mb-4 flex items-center justify-between bg-background rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Live Rates
              {lastRateUpdate && (
                <span className="ml-2 text-xs">
                  Updated {lastRateUpdate.toLocaleTimeString()}
                </span>
              )}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefreshRates}
            disabled={isRefreshingRates}
          >
            <RefreshCw className={`w-4 h-4 mr-1.5 ${isRefreshingRates ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Flyer preview - centered and styled for viewing */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <FlyerPreview data={flyerData} />
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            Rates are subject to change. Contact us for personalized quotes.
          </p>
        </div>
      </div>
    </div>
  );
}
