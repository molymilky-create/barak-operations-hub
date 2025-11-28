// src/components/Topbar.tsx
import React from "react";
import { useAuth } from "../context/AuthContext";

const Topbar: React.FC = () => {
  const { user, loginAsAdmin, loginAsUser, logout, isAdmin } = useAuth();

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shadow-sm">
      <div className="flex flex-col gap-1">
        <div className="text-sm text-muted-foreground">
          שלום, <span className="font-bold text-foreground text-lg">{user ? user.name : "אורח"}</span>
        </div>
        {user && (
          <span className="inline-flex items-center text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            {isAdmin ? "מנהל סוכנות" : "עובד סוכנות"}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 text-sm">
        <button
          onClick={loginAsAdmin}
          className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
        >
          כניסה כמנהל
        </button>
        <button
          onClick={loginAsUser}
          className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
        >
          כניסה כעובד
        </button>
        <button
          onClick={logout}
          className="px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
        >
          התנתקות
        </button>
      </div>
    </header>
  );
};

export default Topbar;
