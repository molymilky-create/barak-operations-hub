import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  CheckSquare,
  RefreshCw,
  DollarSign,
  Shield,
  FileText,
  Calculator,
  UserCog,
  Zap,
  Search,
  Plus,
} from "lucide-react";

interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const navigationItems = [
  { title: "לוח בקרה", url: "/", icon: LayoutDashboard, keywords: ["dashboard", "home", "ראשי"] },
  { title: "לידים", url: "/leads", icon: TrendingUp, keywords: ["leads", "לקוחות פוטנציאליים", "מכירות"] },
  { title: "משימות שלי", url: "/my-tasks", icon: CheckSquare, keywords: ["tasks", "todo", "משימות"] },
  { title: "לקוחות", url: "/clients", icon: Users, keywords: ["clients", "customers", "מבוטחים"] },
  { title: "חידושים", url: "/renewals", icon: RefreshCw, keywords: ["renewals", "פוליסות"] },
  { title: "גבייה", url: "/collections", icon: DollarSign, keywords: ["collections", "תשלומים", "חובות"] },
  { title: "תביעות", url: "/claims", icon: Shield, keywords: ["claims", "נזקים"] },
  { title: "אישורי קיום", url: "/certificates", icon: FileText, keywords: ["certificates", "אישורים"] },
  { title: "מחשבונים", url: "/calculators", icon: Calculator, keywords: ["calculators", "חישוב", "פרמיה"] },
  { title: "עובדים", url: "/employees", icon: UserCog, keywords: ["employees", "צוות", "חופשות"] },
  { title: "אוטומציות", url: "/workflows", icon: Zap, keywords: ["workflows", "automation", "תהליכים"] },
];

const quickActions = [
  { title: "ליד חדש", action: "new-lead", icon: Plus, keywords: ["new lead", "הוסף ליד"] },
  { title: "משימה חדשה", action: "new-task", icon: Plus, keywords: ["new task", "הוסף משימה"] },
  { title: "תביעה חדשה", action: "new-claim", icon: Plus, keywords: ["new claim", "הוסף תביעה"] },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open: controlledOpen, onOpenChange }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const navigate = useNavigate();

  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  const handleSelect = useCallback((value: string) => {
    setOpen(false);
    
    // Check if it's a navigation item
    const navItem = navigationItems.find(item => item.url === value);
    if (navItem) {
      navigate(value);
      return;
    }

    // Check if it's a quick action
    const action = quickActions.find(item => item.action === value);
    if (action) {
      switch (action.action) {
        case "new-lead":
          navigate("/leads?new=true");
          break;
        case "new-task":
          navigate("/my-tasks?new=true");
          break;
        case "new-claim":
          navigate("/claims?new=true");
          break;
      }
    }
  }, [navigate, setOpen]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="חפש דף, פעולה או לקוח..." className="text-right" />
      <CommandList>
        <CommandEmpty>
          <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
            <Search className="h-8 w-8" />
            <p>לא נמצאו תוצאות</p>
          </div>
        </CommandEmpty>
        
        <CommandGroup heading="פעולות מהירות">
          {quickActions.map((action) => (
            <CommandItem
              key={action.action}
              value={action.action}
              onSelect={handleSelect}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                <action.icon className="h-4 w-4" />
              </div>
              <span>{action.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="ניווט">
          {navigationItems.map((item) => (
            <CommandItem
              key={item.url}
              value={item.url}
              onSelect={handleSelect}
              keywords={item.keywords}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <item.icon className="h-4 w-4" />
              </div>
              <span>{item.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
