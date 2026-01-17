import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

console.log("main.tsx: Mounting React app...");
createRoot(document.getElementById("root")!).render(
    <HelmetProvider>
        <App />
        <Analytics />
        <SpeedInsights />
    </HelmetProvider>
);
