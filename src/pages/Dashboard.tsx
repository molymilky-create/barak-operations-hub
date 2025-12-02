import React from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  CheckSquare,
  AlertCircle,
  FileText,
  Sparkles,
  TrendingUp,
  Plus,
  Calendar,
  ArrowUpRight,
  Clock,
  RefreshCw,
  DollarSign,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { tasks, employees, leads, policies } = useData();
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();

  const totalTasks = tasks.length;
  const openTasks = tasks.filter(
    (t) => t.status !== "DONE" && t.status !== "CANCELLED"
  ).length;
  const overdueTasks = tasks.filter(
    (t) =>
      t.dueDate < new Date().toISOString().slice(0, 10) &&
      t.status !== "DONE" &&
      t.status !== "CANCELLED"
  ).length;

  const openLeads = leads.filter((l) => 
    ["NEW", "CONTACTED", "QUOTED"].includes(l.status)
  ).length;
  const newLeads = leads.filter((l) => l.status === "NEW").length;

  const todaysTasks = tasks.filter(
    (t) =>
      t.dueDate === new Date().toISOString().slice(0, 10) &&
      t.status !== "DONE" &&
      t.status !== "CANCELLED"
  );

  const upcomingLeads = leads.filter(
    (l) =>
      l.nextActionDate &&
      l.nextActionDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  ).slice(0, 5);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "בוקר טוב";
    if (hour < 17) return "צהריים טובים";
    return "ערב טוב";
  };

  return (
    <div className="space-y-8 fade-in" dir="rtl">
      {/* Header with greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground text-balance">
            {greeting()}, {user?.name || "אורח"} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            הנה תמונת מצב על הסוכנות שלך להיום
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/leads")} className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            ליד חדש
          </Button>
          <Button onClick={() => navigate("/my-tasks")} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            משימה חדשה
          </Button>
        </div>
      </div>

      {/* Stats Grid - Clean, modern design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="stat-card group cursor-pointer" onClick={() => navigate("/my-tasks")}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">משימות פתוחות</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold">{openTasks}</span>
                  <span className="text-sm text-muted-foreground">/ {totalTasks}</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <CheckSquare className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-sm text-primary">
              <span>צפה במשימות</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card group cursor-pointer" onClick={() => navigate("/my-tasks")}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">באיחור</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-destructive">{overdueTasks}</span>
                  <span className="text-sm text-muted-foreground">משימות</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-sm text-destructive">
              <span>טפל עכשיו</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card group cursor-pointer" onClick={() => navigate("/leads")}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">לידים פתוחים</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-success">{openLeads}</span>
                  {newLeads > 0 && (
                    <Badge variant="secondary" className="text-xs">+{newLeads} חדשים</Badge>
                  )}
                </div>
              </div>
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
                <Sparkles className="h-6 w-6 text-success" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-sm text-success">
              <span>נהל לידים</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card group cursor-pointer" onClick={() => navigate("/clients")}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">פוליסות פעילות</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold">{policies.length}</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                <FileText className="h-6 w-6 text-secondary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-sm text-secondary">
              <span>צפה בלקוחות</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tasks for Today */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Calendar className="h-5 w-5 text-primary" />
                המשימות שלי להיום
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/my-tasks")}>
                הצג הכל
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {todaysTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <CheckSquare className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">אין משימות להיום</p>
                <Button variant="link" size="sm" onClick={() => navigate("/my-tasks")}>
                  הוסף משימה חדשה
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {todaysTasks.slice(0, 5).map((task, idx) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={() => navigate("/my-tasks")}
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className={`h-2 w-2 rounded-full ${
                      task.priority === "CRITICAL" ? "bg-destructive" :
                      task.priority === "HIGH" ? "bg-warning" : "bg-muted-foreground"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{task.title}</p>
                      {task.relatedClientName && (
                        <p className="text-sm text-muted-foreground truncate">
                          {task.relatedClientName}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={
                        task.priority === "CRITICAL" ? "destructive" :
                        task.priority === "HIGH" ? "default" : "secondary"
                      }
                      className="shrink-0"
                    >
                      {task.priority === "CRITICAL" ? "קריטי" :
                       task.priority === "HIGH" ? "גבוה" :
                       task.priority === "NORMAL" ? "רגיל" : "נמוך"}
                    </Badge>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">פעולות מהירות</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-3"
              onClick={() => navigate("/leads")}
            >
              <div className="h-9 w-9 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <div className="text-right">
                <p className="font-medium">הוסף ליד חדש</p>
                <p className="text-xs text-muted-foreground">לקוח פוטנציאלי</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-3"
              onClick={() => navigate("/renewals")}
            >
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <RefreshCw className="h-4 w-4 text-primary" />
              </div>
              <div className="text-right">
                <p className="font-medium">חידושי פוליסות</p>
                <p className="text-xs text-muted-foreground">עקוב אחר חידושים</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-3"
              onClick={() => navigate("/collections")}
            >
              <div className="h-9 w-9 rounded-lg bg-secondary/10 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-secondary" />
              </div>
              <div className="text-right">
                <p className="font-medium">גבייה</p>
                <p className="text-xs text-muted-foreground">מעקב תשלומים</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-3"
              onClick={() => navigate("/calculators")}
            >
              <div className="h-9 w-9 rounded-lg bg-warning/10 flex items-center justify-center">
                <FileText className="h-4 w-4 text-warning" />
              </div>
              <div className="text-right">
                <p className="font-medium">מחשבון פרמיה</p>
                <p className="text-xs text-muted-foreground">חשב הצעת מחיר</p>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Leads needing action */}
      {upcomingLeads.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Clock className="h-5 w-5 text-warning" />
                לידים הדורשים טיפול השבוע
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/leads")}>
                הצג הכל
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {upcomingLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/30 transition-all cursor-pointer group"
                  onClick={() => navigate("/leads")}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{lead.name}</h4>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {lead.nextActionNotes || "אין הערות"}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="h-3 w-3 ml-1" />
                      {lead.nextActionDate}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
