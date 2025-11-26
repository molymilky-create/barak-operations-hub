// src/components/Sidebar.tsx
import React from "react";
import type { PageKey } from "../App";

interface SidebarProps {
  currentPage: PageKey;
  onChangePage: (page: PageKey) => void;
  isAdmin: boolean;
  openTasksCount: number;
  openLeadsCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onChangePage, isAdmin, openTasksCount, openLeadsCount }) => {
  const navClasses = (key: PageKey) =>
    `flex items-center justify-between gap-2 px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
      currentPage === key ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-blue-50"
    }`;

  return (
    <aside className="w-64 bg-white border-l border-slate-200 flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          {/* הלוגו – שים קובץ /public/logo.png עם הלוגו שלך */}
          <img src="/logo.png" alt="ברק ביטוחים" className="h-10 object-contain" />
        </div>
        <p className="mt-2 text-xs text-slate-500">ברק ביטוחים – ניהול משימות, לידים וחידושים.</p>
      </div>

      <nav className="flex-1 p-3 space-y-1 text-right">
        <button className={navClasses("dashboard")} onClick={() => onChangePage("dashboard")}>
          <span>🏠 דשבורד</span>
        </button>

        <button className={navClasses("myTasks")} onClick={() => onChangePage("myTasks")}>
          <span>✅ המשימות שלי</span>
          {openTasksCount > 0 && (
            <span className="text-[11px] bg-amber-100 text-amber-800 rounded-full px-2 py-0.5">{openTasksCount}</span>
          )}
        </button>

        {isAdmin && (
          <button className={navClasses("teamTasks")} onClick={() => onChangePage("teamTasks")}>
            <span>👥 משימות צוות</span>
          </button>
        )}

        <button className={navClasses("leads")} onClick={() => onChangePage("leads")}>
          <span>📇 לידים</span>
          {openLeadsCount > 0 && (
            <span className="text-[11px] bg-emerald-100 text-emerald-800 rounded-full px-2 py-0.5">
              {openLeadsCount}
            </span>
          )}
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
