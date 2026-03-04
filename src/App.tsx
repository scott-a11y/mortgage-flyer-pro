import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FlyerProvider } from "@/context/FlyerContext";
import ErrorBoundary from "@/components/ErrorBoundary";

// Lazy-load all route components for code splitting
const MarketingDashboard = lazy(() => import("./pages/MarketingDashboard"));
const PropertyFlyerBuilder = lazy(() => import("@/components/flyer/PropertyFlyerBuilder"));
const FlyerBuilder = lazy(() => import("@/components/flyer/FlyerBuilder").then(m => ({ default: m.FlyerBuilder })));
const LiveFlyer = lazy(() => import("./pages/LiveFlyer"));
const LivePropertyFlyer = lazy(() => import("./pages/LivePropertyFlyer"));
const LeadCapturePage = lazy(() => import("./pages/LeadCapturePage"));
const LeadsDashboard = lazy(() => import("./pages/LeadsDashboard"));
const BuyerAgentToolkit = lazy(() => import("./pages/BuyerAgentToolkit"));
const BuyerExperienceTour = lazy(() => import("./pages/BuyerExperienceTour"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

/**
 * Minimal full-screen loading spinner shown while lazy chunks download.
 */
function PageLoader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          border: "3px solid #e5e7eb",
          borderTopColor: "#8B6914",
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <FlyerProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<MarketingDashboard />} />
                  <Route path="/dashboard" element={<MarketingDashboard />} />
                  <Route path="/builder" element={<PropertyFlyerBuilder />} />
                  <Route path="/rate-engine" element={<FlyerBuilder />} />
                  <Route path="/property/:slug" element={<PropertyFlyerBuilder />} />
                  <Route path="/property-live/:slug" element={<LivePropertyFlyer />} />
                  <Route path="/lead/:slug" element={<LeadCapturePage />} />
                  <Route path="/leads" element={<LeadsDashboard />} />
                  <Route path="/buyer-agent" element={<BuyerAgentToolkit />} />
                  <Route path="/tour-live" element={<BuyerExperienceTour />} />
                  <Route path="/live/:slug" element={<LiveFlyer />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </FlyerProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
