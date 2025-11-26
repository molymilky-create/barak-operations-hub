// src/components/Sidebar.tsx
import React from "react";

interface SidebarProps {
  currentPage: "dashboard" | "myTasks" | "teamTasks" | "leads";
  onChangePage: (page: "dashboard" | "myTasks" | "teamTasks" | "leads") => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onChangePage }) => {
  const itemClasses = (active: boolean) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
      active ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-blue-50"
    }`;

  return (
    <aside className="w-64 bg-white border-l border-slate-200 flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold">ברק ביטוחים – מערכת</span>
        </div>
        <p className="mt-2 text-xs text-slate-500">ניהול משימות, חידושים, לידים ועוד.</p>
      </div>
      <nav className="flex-1 p-3 space-y-1 text-right">
        <button className={itemClasses(currentPage === "dashboard")} onClick={() => onChangePage("dashboard")}>
          🏠 דשבורד
        </button>
        <button className={itemClasses(currentPage === "myTasks")} onClick={() => onChangePage("myTasks")}>
          ✅ המשימות שלי
        </button>
        <button className={itemClasses(currentPage === "teamTasks")} onClick={() => onChangePage("teamTasks")}>
          👥 משימות צוות
        </button>
        <button className={itemClasses(currentPage === "leads")} onClick={() => onChangePage("leads")}>
          📇 לידים
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
