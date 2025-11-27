// src/App.tsx
import React, { useState } from "react";
import MyTasks from "./pages/MyTasks";
import TeamTasks from "./pages/TeamTasks";
import Leads from "./pages/Leads";
import { useAuth } from "./context/AuthContext";

export type PageKey = "MY_TASKS" | "TEAM_TASKS" | "LEADS";

const App: React.FC = () => {
  const [page, setPage] = useState<PageKey>("MY_TASKS");
  const { user, isAdmin, loginAsAdmin, loginAsUser, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100" dir="rtl">
      {/* טופ-בר */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-800">ברק ביטוחים – מערכת ניהול סוכנות</h1>
          <p className="text-xs text-slate-500 mt-1">
            משימות, לידים, חידושים וגבייה – הכול במקום אחד, בצורה פשוטה וברורה.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-600">
            מחובר כ:{" "}
            <span className="font-semibold">{user ? `${user.name} (${isAdmin ? "מנהל" : "עובד"})` : "לא מחובר"}</span>
          </span>
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

      {/* ניווט עיקרי */}
      <nav className="bg-white border-b border-slate-200 px-4 py-2 flex gap-2 text-sm">
        <button
          onClick={() => setPage("MY_TASKS")}
          className={`px-3 py-1 rounded-full border ${
            page === "MY_TASKS"
              ? "bg-blue-600 text-white border-blue-600"
              : "border-slate-300 text-slate-700 hover:bg-slate-100"
          }`}
        >
          המשימות שלי
        </button>

        {isAdmin && (
          <button
            onClick={() => setPage("TEAM_TASKS")}
            className={`px-3 py-1 rounded-full border ${
              page === "TEAM_TASKS"
                ? "bg-blue-600 text-white border-blue-600"
                : "border-slate-300 text-slate-700 hover:bg-slate-100"
            }`}
          >
            משימות הצוות (מנהל)
          </button>
        )}

        <button
          onClick={() => setPage("LEADS")}
          className={`px-3 py-1 rounded-full border ${
            page === "LEADS"
              ? "bg-blue-600 text-white border-blue-600"
              : "border-slate-300 text-slate-700 hover:bg-slate-100"
          }`}
        >
          לידים
        </button>
      </nav>

      {/* תוכן הדף */}
      <main className="p-4">
        {page === "MY_TASKS" && <MyTasks />}
        {page === "TEAM_TASKS" && <TeamTasks />}
        {page === "LEADS" && <Leads />}
      </main>
    </div>
  );
};

export default App;
