import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Dividendos from "./pages/Dividendos";
import DataCom from "./pages/DataCom";
import Valuation from "./pages/Valuation";
import Economia from "./pages/Economia";
import AppLayout from "./layouts/AppLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {!isLoggedIn ? (
              <>
                <Route path="*" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route element={<AppLayout onLogout={() => setIsLoggedIn(false)} />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dividendos" element={<Dividendos />} />
                  <Route path="/data-com" element={<DataCom />} />
                  <Route path="/valuation" element={<Valuation />} />
                  <Route path="/economia" element={<Economia />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
