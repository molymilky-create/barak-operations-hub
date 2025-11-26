import { LayoutDashboard, Users, RefreshCw, DollarSign, TrendingUp, CheckSquare, Send, FileText, BookOpen, Calculator, UserCog, Bot } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "לוח בקרה", url: "/", icon: LayoutDashboard },
  { title: "לקוחות ופוליסות", url: "/clients", icon: Users },
  { title: "חידושים", url: "/renewals", icon: RefreshCw },
  { title: "גבייה", url: "/collections", icon: DollarSign },
  { title: "לידים", url: "/leads", icon: TrendingUp },
  { title: "משימות", url: "/tasks", icon: CheckSquare },
  { title: "בקשות למוביל", url: "/carriers", icon: Send },
  { title: "מסמכים", url: "/documents", icon: FileText },
  { title: "תקנון", url: "/regulations", icon: BookOpen },
  { title: "מחשבונים", url: "/calculators", icon: Calculator },
  { title: "עובדים וחופשות", url: "/employees", icon: UserCog },
  { title: "עוזר AI", url: "/ai-assistant", icon: Bot },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">ב</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-sidebar-foreground">ברק ביטוח</span>
            <span className="text-xs text-sidebar-foreground/70">מערכת ניהול</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
