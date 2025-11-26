// src/components/Layout.tsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import Sidebar from "./Sidebar";
import type { PageKey } from "../App";

interface LayoutProps {
  currentPage: PageKey;
  onChangePage: (page: PageKey) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentPage, onChangePage, children }) => {
  const { user, loginAsAdmin, loginAsUser, logout, isAdmin } = useAuth();
  const { tasks, leads } = useData();

  const myOpenTasks = user
    ? tasks.filter((t) => t.assignedToUserId === user.id && t.status !== "DONE" && t.status !== "CANCELLED")
    : [];

  const openLeads = leads.filter((l) => ["NEW", "CONTACTED", "QUOTED"].includes(l.status));

  return (
    <div className="min-h-screen flex bg-slate-100" dir="rtl">
      <Sidebar
        currentPage={currentPage}
        onChangePage={onChangePage}
        isAdmin={isAdmin}
        openTasksCount={myOpenTasks.length}
        openLeadsCount={openLeads.length}
      />
      <div className="flex-1 flex flex-col">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4">
          <div className="text-sm text-slate-600">
            שלום, <span className="font-semibold">{user?.name}</span> {isAdmin ? "(מנהל)" : "(עובד)"}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button onClick={loginAsAdmin} className="px-2 py-1 rounded border border-slate-300 hover:bg-slate-100">
              כניסה כמנהל
            </button>
            <button onClick={loginAsUser} className="px-2 py-1 rounded border border-slate-300 hover:bg-slate-100">
              כניסה כעובד
            </button>
            <button onClick={logout} className="px-2 py-1 rounded border border-red-300 text-red-700 hover:bg-red-50">
              התנתקות
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
