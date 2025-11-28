// src/components/Sidebar.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Calculator,
  Brain,
  FileText,
  FolderOpen,
  Scale,
  UserCog,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navClasses = ({ isActive }: { isActive: boolean }) =>
  [
    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition",
    isActive
      ? "bg-sidebar-primary text-sidebar-primary-foreground"
      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
  ].join(" ");

const Sidebar: React.FC = () => {
  const { isAdmin } = useAuth();

  return (
    <aside className="w-64 bg-sidebar-background text-sidebar-foreground border-l border-sidebar-border flex flex-col">
      {/* לוגו / כותרת */}
      <div className="h-16 px-4 flex items-center border-b border-sidebar-border">
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight">
            ברק ביטוחים
          </span>
          <span className="text-xs text-sidebar-foreground/70">
            ניהול סוכנות – מרכז תפעול
          </span>
        </div>
      </div>

      {/* ניווט */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        <NavLink to="/" className={navClasses} end>
          <LayoutDashboard className="h-5 w-5" />
          דשבורד
        </NavLink>

        <NavLink to="/tasks/my" className={navClasses}>
          <ClipboardList className="h-5 w-5" />
          המשימות שלי
        </NavLink>

        <NavLink to="/tasks/team" className={navClasses}>
          <Users className="h-5 w-5" />
          משימות הצוות
        </NavLink>

        <NavLink to="/leads" className={navClasses}>
          <Users className="h-5 w-5" />
          לידים ו-CRM
        </NavLink>

        <NavLink to="/clients" className={navClasses}>
          <Users className="h-5 w-5" />
          מבוטחים
        </NavLink>

        <NavLink to="/policies" className={navClasses}>
          <FileText className="h-5 w-5" />
          פוליסות
        </NavLink>

        <NavLink to="/calculators" className={navClasses}>
          <Calculator className="h-5 w-5" />
          מחשבונים
        </NavLink>

        <NavLink to="/ai-assistant" className={navClasses}>
          <Brain className="h-5 w-5" />
          עוזר AI
        </NavLink>

        <NavLink to="/certificates" className={navClasses}>
          <FileText className="h-5 w-5" />
          אישורי קיום
        </NavLink>

        <NavLink to="/documents" className={navClasses}>
          <FolderOpen className="h-5 w-5" />
          מסמכים
        </NavLink>

        <NavLink to="/regulations" className={navClasses}>
          <Scale className="h-5 w-5" />
          חוקים וחוזרים
        </NavLink>

        <NavLink to="/employees" className={navClasses}>
          <UserCog className="h-5 w-5" />
          עובדים וחופשות
        </NavLink>

        {isAdmin && (
          <NavLink to="/commissions" className={navClasses}>
            <TrendingUp className="h-5 w-5" />
            עמלות ודוחות
          </NavLink>
        )}
      </nav>

      <div className="p-4 border-t border-sidebar-border text-center text-xs text-sidebar-foreground/60">
        © {new Date().getFullYear()} ברק ביטוחים
      </div>
    </aside>
  );
};

export default Sidebar;
