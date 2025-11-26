import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { Outlet } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Renewals from "./pages/Renewals";
import Collections from "./pages/Collections";
import Leads from "./pages/Leads";
import Tasks from "./pages/Tasks";
import Carriers from "./pages/Carriers";
import Documents from "./pages/Documents";
import Regulations from "./pages/Regulations";
import Calculators from "./pages/Calculators";
import Employees from "./pages/Employees";
import AIAssistant from "./pages/AIAssistant";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route element={<AppLayout><Outlet /></AppLayout>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/renewals" element={<Renewals />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/carriers" element={<Carriers />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/regulations" element={<Regulations />} />
            <Route path="/calculators" element={<Calculators />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
