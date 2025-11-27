// src/components/Topbar.tsx
import React from "react";
import { useAuth } from "../context/AuthContext";

const Topbar: React.FC = () => {
  const { user, loginAsAdmin, loginAsUser, logout, isAdmin } = useAuth();

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shadow-sm">
      <div className="text-sm text-muted-foreground">
        שלום, <span className="font-bold text-foreground text-lg">{user ? user.name : "אורח"}</span>{" "}
        {user && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full mr-2">{isAdmin ? "מנהל" : "עובד"}</span>}
      </div>
      <div className="flex items-center gap-3">
        <button onClick={loginAsAdmin} className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm font-medium">
          כניסה כמנהל
        </button>
        <button onClick={loginAsUser} className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm font-medium">
          כניסה כעובד
        </button>
        <button onClick={logout} className="px-4 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-sm font-medium">
          התנתקות
        </button>
      </div>
    </header>
  );
};

export default Topbar;
