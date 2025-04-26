import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import { GuidedTour } from '@/components/GuidedTour';
import { useState } from "react";
import { CarValueCalculator } from "@/components/CarValueCalculator";
import { SavedListings } from "@/components/SavedListings";

const queryClient = new QueryClient();

const App = () => {
  const [localState, setLocalState] = useState(() => {
    const saved = localStorage.getItem('carValueCalculator');
    return saved ? JSON.parse(saved) : { savedListings: [], lists: [] };
  });

  const isFirstTimeUser = localState.savedListings.length === 0 && localState.lists.length === 0;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <GuidedTour isFirstTimeUser={isFirstTimeUser} />
          <Routes>
            <Route path="/" element={<Index />} />
            {/* Redirect all unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
