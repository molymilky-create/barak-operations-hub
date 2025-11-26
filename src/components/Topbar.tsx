// src/components/Topbar.tsx
import React from "react";
import { useAuth } from "../context/AuthContext";

const Topbar: React.FC = () => {
  const { user, loginAsAdmin, loginAsUser, logout, isAdmin } = useAuth();

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4">
      <div className="text-sm text-slate-600">
        שלום, <span className="font-semibold">{user ? user.name : "אורח"}</span>{" "}
        {user && (isAdmin ? "(מנהל)" : "(עובד)")}
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
  );
};

export default Topbar;
