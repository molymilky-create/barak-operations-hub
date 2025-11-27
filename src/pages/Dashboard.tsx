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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { tasks, employees, leads, policies } = useData();
  const { isAdmin } = useAuth();
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

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            דשבורד הסוכנות
          </h1>
          <p className="text-muted-foreground text-lg">
            תמונת מצב כללית על העבודה בסוכנות ברק ביטוחים
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate("/leads")} className="gap-2">
            <Plus className="h-4 w-4" />
            ליד חדש
          </Button>
          <Button onClick={() => navigate("/my-tasks")} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            משימה חדשה
          </Button>
        </div>
      </div>

      {/* כרטיסי סטטוס */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              מספר עובדים
            </CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{employees.length}</div>
            <p className="text-xs text-muted-foreground mt-1">עובדים פעילים</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-secondary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              משימות פתוחות
            </CardTitle>
            <CheckSquare className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{openTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              מתוך {totalTasks} משימות
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              משימות באיחור
            </CardTitle>
            <AlertCircle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">
              {overdueTasks}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              דורשות טיפול מיידי
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              לידים פתוחים
            </CardTitle>
            <Sparkles className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{openLeads}</div>
            <p className="text-xs text-muted-foreground mt-1">
              הזדמנויות חדשות
            </p>
          </CardContent>
        </Card>
      </div>

      {/* משימות היום שלי */}
      {todaysTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Calendar className="h-5 w-5 text-primary" />
              המשימות שלי להיום
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todaysTasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{task.title}</h4>
                  {task.relatedClientName && (
                    <p className="text-sm text-muted-foreground mt-1">
                      לקוח: {task.relatedClientName}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      task.priority === "CRITICAL"
                        ? "destructive"
                        : task.priority === "HIGH"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {task.priority === "CRITICAL"
                      ? "קריטי"
                      : task.priority === "HIGH"
                      ? "גבוה"
                      : task.priority === "NORMAL"
                      ? "רגיל"
                      : "נמוך"}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate("/my-tasks")}
                  >
                    פתח
                  </Button>
                </div>
              </div>
            ))}
            {todaysTasks.length > 5 && (
              <Button
                variant="link"
                className="w-full"
                onClick={() => navigate("/my-tasks")}
              >
                הצג את כל המשימות ({todaysTasks.length})
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* פעולה הבאה בלידים */}
      {upcomingLeads.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-success" />
              לידים הדורשים פעולה בקרוב
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{lead.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {lead.nextActionNotes || "אין הערות"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{lead.nextActionDate}</Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate("/leads")}
                  >
                    פתח
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* תכונות עתידיות */}
      {isAdmin && (
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <TrendingUp className="h-5 w-5 text-primary" />
              תכונות בהמשך
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>חידושים בחודש הקרוב - מעקב אחר פוליסות שצריך לחדש</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>גבייה פתוחה - סטטוס תשלומים והתראות</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>לידים חדשים - מעקב אחר לקוחות פוטנציאליים</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>בקשות/טיוטות ממתינות לתשובת חברת הביטוח</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>דוחות עמלות וניתוח רווחיות</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
