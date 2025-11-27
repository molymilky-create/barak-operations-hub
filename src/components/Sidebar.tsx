// src/components/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import barakLogo from "../assets/barak-logo.png";
import {
  LayoutDashboard,
  Calculator,
  Users,
  Sparkles,
  CheckSquare,
  RotateCw,
  CreditCard,
  FileText,
  FolderOpen,
  Scale,
  UserCog,
  TrendingUp,
} from "lucide-react";

const navClasses = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${
    isActive
      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
  }`;

const Sidebar = () => {
  const { isAdmin } = useAuth();

  return (
    <aside className="w-72 bg-sidebar border-l border-sidebar-border flex flex-col shadow-lg">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center justify-center">
          <img
            src={barakLogo}
            alt="ברק ביטוחים"
            className="h-20 object-contain"
          />
        </div>
        <p className="mt-3 text-sm text-sidebar-foreground/90 text-center leading-relaxed font-medium">
          מערכת ניהול מתקדמת
        </p>
      </div>
      <nav className="flex-1 p-4 space-y-1.5 text-right overflow-y-auto">
        <NavLink to="/" className={navClasses} end>
          <LayoutDashboard className="h-5 w-5" />
          דשבורד
        </NavLink>
        <NavLink to="/calculators" className={navClasses}>
          <Calculator className="h-5 w-5" />
          מחשבונים
        </NavLink>
        <NavLink to="/clients" className={navClasses}>
          <Users className="h-5 w-5" />
          לקוחות ופוליסות
        </NavLink>
        <NavLink to="/leads" className={navClasses}>
          <Sparkles className="h-5 w-5" />
          לידים
        </NavLink>
        <NavLink to="/my-tasks" className={navClasses}>
          <CheckSquare className="h-5 w-5" />
          המשימות שלי
        </NavLink>
        {isAdmin && (
          <NavLink to="/team-tasks" className={navClasses}>
            <CheckSquare className="h-5 w-5" />
            משימות הצוות
          </NavLink>
        )}
        <NavLink to="/renewals" className={navClasses}>
          <RotateCw className="h-5 w-5" />
          חידושים
        </NavLink>
        <NavLink to="/collections" className={navClasses}>
          <CreditCard className="h-5 w-5" />
          גבייה
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
      <div className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/60 text-center">
          © 2024 ברק ביטוחים
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
