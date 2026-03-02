import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FlyerProvider } from "./context/FlyerContext";

const queryClient = new QueryClient();

// Placeholder component for missing pages
const ComingSoon = ({ pageName }: { pageName: string }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">{pageName}</h1>
      <p className="text-gray-600">This page is coming soon.</p>
    </div>
  </div>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <FlyerProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<ComingSoon pageName="Marketing Dashboard" />} />
              <Route path="/dashboard" element={<ComingSoon pageName="Marketing Dashboard" />} />
              <Route path="/dashboard/:agentId" element={<ComingSoon pageName="Marketing Dashboard" />} />
              <Route path="/builder" element={<ComingSoon pageName="Property Flyer Builder" />} />
              <Route path="/rate-engine" element={<ComingSoon pageName="Flyer Builder" />} />
              <Route path="/property/:slug" element={<ComingSoon pageName="Property Flyer Builder" />} />
              <Route path="/property-live/:slug" element={<ComingSoon pageName="Live Property Flyer" />} />
              <Route path="/live/:id" element={<ComingSoon pageName="Live Flyer" />} />
              <Route path="/lead-capture" element={<ComingSoon pageName="Lead Capture" />} />
              <Route path="/leads" element={<ComingSoon pageName="Leads Dashboard" />} />
              <Route path="/buyer-toolkit" element={<ComingSoon pageName="Buyer Toolkit" />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </FlyerProvider>
    </QueryClientProvider>
  );
};

export default App;