// src/components/Sidebar.tsx
import React from "react";

interface SidebarProps {
  currentPage: "dashboard" | "myTasks" | "teamTasks" | "leads";
  onChangePage: (page: "dashboard" | "myTasks" | "teamTasks" | "leads") => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onChangePage }) => {
  const itemClasses = (active: boolean) =>
    `w-full flex items-center justify-between gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
      active ? "bg-blue-600 text-white shadow-sm" : "text-slate-700 hover:bg-blue-50"
    }`;

  return (
    <aside className="w-60 bg-white border-l border-slate-200 flex flex-col">
      {/* לוגו וכותרת */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <img
            src="https://barak-korb.co.il/wp-content/uploads/2024/01/logo.png"
            alt="ברק ביטוחים"
            className="h-9 object-contain"
          />
          <div>
            <div className="text-sm font-bold text-slate-800">ברק ביטוחים</div>
            <div className="text-[11px] text-slate-500">מרכז ניהול סוכנות – דשבורד, לידים, משימות ועוד</div>
          </div>
        </div>
      </div>

      {/* ניווט */}
      <nav className="flex-1 p-3 space-y-1 text-right">
        <button className={itemClasses(currentPage === "dashboard")} onClick={() => onChangePage("dashboard")}>
          <span className="flex items-center gap-2">
            <span>🏠</span>
            <span>דשבורד</span>
          </span>
        </button>

        <button className={itemClasses(currentPage === "myTasks")} onClick={() => onChangePage("myTasks")}>
          <span className="flex items-center gap-2">
            <span>✅</span>
            <span>המשימות שלי</span>
          </span>
        </button>

        <button className={itemClasses(currentPage === "teamTasks")} onClick={() => onChangePage("teamTasks")}>
          <span className="flex items-center gap-2">
            <span>👥</span>
            <span>משימות צוות</span>
          </span>
        </button>

        <button className={itemClasses(currentPage === "leads")} onClick={() => onChangePage("leads")}>
          <span className="flex items-center gap-2">
            <span>📇</span>
            <span>לידים</span>
          </span>
        </button>
      </nav>

      <div className="p-3 border-t border-slate-200 text-[10px] text-slate-400 text-center">
        בנוי עבור סוכן ביטוח – פשוט, ברור, מותאם גם לסוכנים ותיקים
      </div>
    </aside>
  );
};

export default Sidebar;
