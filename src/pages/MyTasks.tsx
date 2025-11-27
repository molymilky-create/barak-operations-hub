import { useState } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import type { TaskStatus, TaskKind, TaskPriority } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckSquare, AlertCircle, Clock, Filter, Plus } from "lucide-react";

const statusLabels: Record<TaskStatus, string> = {
  OPEN: "פתוחה",
  IN_PROGRESS: "בטיפול",
  WAITING_CLIENT: "ממתינה ללקוח",
  WAITING_COMPANY: "ממתינה לחברת ביטוח",
  WAITING_MANAGER_REVIEW: "ממתינה לאישור מנהל",
  DONE: "סגורה",
  CANCELLED: "בוטלה",
};

const kindLabels: Record<TaskKind, string> = {
  LEAD: "ליד",
  RENEWAL: "חידוש",
  COLLECTION: "גבייה",
  CARRIER_REQUEST: "בקשה לחברת ביטוח",
  CERTIFICATE: "אישור קיום",
  SERVICE: "שירות",
  OTHER: "אחר",
};

const priorityLabels: Record<TaskPriority, string> = {
  LOW: "נמוכה",
  NORMAL: "רגילה",
  HIGH: "גבוהה",
  CRITICAL: "דחופה",
};

const MyTasks: React.FC = () => {
  const { tasks, updateTaskStatus } = useData();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">יש להתחבר כדי לראות משימות.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const [statusFilter, setStatusFilter] = useState<TaskStatus | "ALL">("ALL");
  const [kindFilter, setKindFilter] = useState<TaskKind | "ALL">("ALL");

  const myTasks = tasks.filter((t) => t.assignedToUserId === user.id);

  const filtered = myTasks.filter((t) => {
    if (statusFilter !== "ALL" && t.status !== statusFilter) return false;
    if (kindFilter !== "ALL" && t.kind !== kindFilter) return false;
    return true;
  });

  const openTasks = myTasks.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS").length;
  const overdueTasks = myTasks.filter(
    (t) =>
      t.dueDate < new Date().toISOString().slice(0, 10) &&
      t.status !== "DONE" &&
      t.status !== "CANCELLED"
  ).length;
  const completedTasks = myTasks.filter((t) => t.status === "DONE").length;

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "CRITICAL":
        return "destructive";
      case "HIGH":
        return "default";
      case "NORMAL":
        return "secondary";
      case "LOW":
        return "outline";
    }
  };

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">המשימות שלי</h1>
          <p className="text-muted-foreground text-lg">
            כל המשימות שמוקצות אליך במקום אחד
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          משימה חדשה
        </Button>
      </div>

      {/* סטטיסטיקות */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              משימות פתוחות
            </CardTitle>
            <CheckSquare className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{openTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">דורשות טיפול</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              באיחור
            </CardTitle>
            <AlertCircle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{overdueTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">דורשות טיפול מיידי</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              הושלמו
            </CardTitle>
            <CheckSquare className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{completedTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">בחודש הנוכחי</p>
          </CardContent>
        </Card>
      </div>

      {/* פילטרים */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 grid md:grid-cols-2 gap-4">
              <div>
                <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="כל הסטטוסים" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">כל הסטטוסים</SelectItem>
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={kindFilter} onValueChange={(v: any) => setKindFilter(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="כל הסוגים" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">כל הסוגים</SelectItem>
                    {Object.entries(kindLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* טבלת משימות */}
      <Card>
        <CardHeader>
          <CardTitle>משימות ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>כותרת</TableHead>
                <TableHead>לקוח קשור</TableHead>
                <TableHead>סוג</TableHead>
                <TableHead>עדיפות</TableHead>
                <TableHead>תאריך יעד</TableHead>
                <TableHead>סטטוס</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((task) => {
                const isOverdue =
                  task.dueDate < new Date().toISOString().slice(0, 10) &&
                  task.status !== "DONE" &&
                  task.status !== "CANCELLED";

                return (
                  <TableRow key={task.id} className={isOverdue ? "bg-destructive/5" : ""}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {isOverdue && <AlertCircle className="h-4 w-4 text-destructive" />}
                        {task.title}
                      </div>
                    </TableCell>
                    <TableCell>{task.relatedClientName || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{kindLabels[task.kind]}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityColor(task.priority)}>
                        {priorityLabels[task.priority]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {task.dueDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={task.status}
                        onValueChange={(v: TaskStatus) => updateTaskStatus(task.id, v)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(statusLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              אין משימות לפי הסינון הנוכחי
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyTasks;
