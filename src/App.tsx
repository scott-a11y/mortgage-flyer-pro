import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LiveFlyer from "./pages/LiveFlyer";
import LivePropertyFlyer from "./pages/LivePropertyFlyer";
import LeadCapturePage from "./pages/LeadCapturePage";
import LeadsDashboard from "./pages/LeadsDashboard";
import NotFound from "./pages/NotFound";
import { FlyerProvider } from "@/context/FlyerContext";
import MarketingDashboard from "./pages/MarketingDashboard";
import PropertyFlyerBuilder from "@/components/flyer/PropertyFlyerBuilder";
import { FlyerBuilder } from "@/components/flyer/FlyerBuilder";
import BuyerAgentToolkit from "./pages/BuyerAgentToolkit";
import BuyerExperienceTour from "./pages/BuyerExperienceTour";
import AdrianSOP from "./pages/AdrianSOP";
import AgentManagement from "./pages/AgentManagement";
import AICommandCenter from "@/components/AICommandCenter";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <FlyerProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MarketingDashboard />} />
              <Route path="/dashboard" element={<MarketingDashboard />} />
              <Route path="/dashboard/:agentId" element={<MarketingDashboard />} />
              <Route path="/builder" element={<PropertyFlyerBuilder />} />
              <Route path="/rate-engine" element={<FlyerBuilder />} />
              <Route path="/property/:slug" element={<PropertyFlyerBuilder />} />
              <Route path="/property-live/:slug" element={<LivePropertyFlyer />} />
              <Route path="/live/:id" element={<LiveFlyer />} />
              <Route path="/lead-capture" element={<LeadCapturePage />} />
              <Route path="/leads" element={<LeadsDashboard />} />
              <Route path="/buyer-toolkit" element={<BuyerAgentToolkit />} />
              <Route path="/buyer-tour" element={<BuyerExperienceTour />} />
              <Route path="/adrian-sop" element={<AdrianSOP />} />
              <Route path="/agents" element={<AgentManagement />} />
              <Route path="/ai" element={<AICommandCenter />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <AICommandCenter />
        </TooltipProvider>
      </FlyerProvider>
    </QueryClientProvider>
  );
};

export default App;