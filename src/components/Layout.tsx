// src/components/Layout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import AIAssistantPanel from "./AIAssistantPanel";

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-slate-100" dir="rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
      <AIAssistantPanel />
    </div>
  );
};

export default Layout;
