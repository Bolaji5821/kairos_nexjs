import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import App from "./App.tsx";
import "./index.css";
import queryClient from "./lib/query.ts";
import { initSentry } from "./lib/sentry.ts";

// Initialize Sentry before rendering the app
initSentry();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Toaster richColors position="top-right" />
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
