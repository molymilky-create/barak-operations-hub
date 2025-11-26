// src/components/Sidebar.tsx
import React from "react";
import { useAuth } from "../context/AuthContext";

interface Props {
  currentPage: string;
  onChangePage: (page: string) => void;
}

const Sidebar: React.FC<Props> = ({ currentPage, onChangePage }) => {
  const { isAdmin } = useAuth();

  const itemClasses = (active: boolean) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition ${
      active ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-blue-50"
    }`;

  return (
    <aside className="w-64 bg-white border-l border-slate-200 flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <div className="text-lg font-bold text-slate-800">ברק ביטוחים – מערכת</div>
        <p className="mt-1 text-xs text-slate-500">ניהול משימות, חידושים, לידים ועוד.</p>
      </div>
      <nav className="flex-1 p-3 space-y-1 text-right text-sm">
        <div className={itemClasses(currentPage === "dashboard")} onClick={() => onChangePage("dashboard")}>
          🏠 דשבורד
        </div>
        <div className={itemClasses(currentPage === "myTasks")} onClick={() => onChangePage("myTasks")}>
          ✅ המשימות שלי
        </div>
        {isAdmin && (
          <div className={itemClasses(currentPage === "teamTasks")} onClick={() => onChangePage("teamTasks")}>
            👀 משימות צוות
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
