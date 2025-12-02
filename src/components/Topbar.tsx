import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { CommandPalette } from "./CommandPalette";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, Moon, Sun, Command } from "lucide-react";

const Topbar: React.FC = () => {
  const { user, loginAsAdmin, loginAsUser, logout, isAdmin } = useAuth();
  const [commandOpen, setCommandOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <>
      <header className="sticky top-0 z-40 h-16 bg-card/95 backdrop-blur-sm border-b border-border flex items-center justify-between px-6 shadow-sm">
        {/* Search / Command Palette Trigger */}
        <button
          onClick={() => setCommandOpen(true)}
          className="flex items-center gap-3 px-4 py-2 rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors text-muted-foreground w-72"
        >
          <Search className="h-4 w-4" />
          <span className="text-sm">חיפוש מהיר...</span>
          <kbd className="mr-auto flex items-center gap-1 rounded border border-border bg-background px-1.5 py-0.5 text-xs text-muted-foreground">
            <Command className="h-3 w-3" />K
          </kbd>
        </button>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* User Info */}
          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <div className="text-left">
              <p className="text-sm font-medium">{user ? user.name : "אורח"}</p>
              {user && (
                <Badge variant={isAdmin ? "default" : "secondary"} className="text-xs">
                  {isAdmin ? "מנהל" : "עובד"}
                </Badge>
              )}
            </div>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-destructive" />
          </Button>

          {/* Dark Mode Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2 pr-4 border-r border-border">
            <Button variant="outline" size="sm" onClick={loginAsAdmin}>
              כניסה כמנהל
            </Button>
            <Button variant="outline" size="sm" onClick={loginAsUser}>
              כניסה כעובד
            </Button>
            <Button variant="ghost" size="sm" onClick={logout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
              התנתקות
            </Button>
          </div>
        </div>
      </header>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
};

export default Topbar;
