import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Calculators from "./pages/Calculators";
import Clients from "./pages/Clients";
import Leads from "./pages/Leads";
import MyTasks from "./pages/MyTasks";
import TeamTasks from "./pages/TeamTasks";
import Renewals from "./pages/Renewals";
import Collections from "./pages/Collections";
import Certificates from "./pages/Certificates";
import Documents from "./pages/Documents";
import Regulations from "./pages/Regulations";
import Employees from "./pages/Employees";
import Commissions from "./pages/Commissions";
import NotFound from "./pages/NotFound";
import { useAuth } from "./context/AuthContext";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calculators" element={<Calculators />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/my-tasks" element={<MyTasks />} />
          <Route path="/team-tasks" element={<TeamTasks />} />
          <Route path="/renewals" element={<Renewals />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/regulations" element={<Regulations />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/commissions" element={<Commissions />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
