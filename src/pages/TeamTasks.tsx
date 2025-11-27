import React, { useState } from "react";
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
import { CheckSquare, AlertCircle, Users, CheckCircle2, Filter } from "lucide-react";

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

const TeamTasks: React.FC = () => {
  const { tasks, employees, updateTaskStatus } = useData();
  const { user, isAdmin } = useAuth();

  const [statusFilter, setStatusFilter] = useState<TaskStatus | "ALL">("ALL");
  const [kindFilter, setKindFilter] = useState<TaskKind | "ALL">("ALL");
  const [employeeFilter, setEmployeeFilter] = useState<string>("ALL");

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              מסך זה נגיש למנהלים בלבד.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filtered = tasks.filter((t) => {
    if (statusFilter !== "ALL" && t.status !== statusFilter) return false;
    if (kindFilter !== "ALL" && t.kind !== kindFilter) return false;
    if (employeeFilter !== "ALL" && t.assignedToUserId !== employeeFilter) return false;
    return true;
  });

  const openTasks = tasks.filter(
    (t) => t.status !== "DONE" && t.status !== "CANCELLED"
  ).length;

  const awaitingReview = tasks.filter(
    (t) => t.requiresManagerReview && t.status === "WAITING_MANAGER_REVIEW"
  ).length;

  const completedToday = tasks.filter(
    (t) =>
      t.status === "DONE" &&
      t.managerApprovedAt === new Date().toISOString().slice(0, 10)
  ).length;

  const handleApprove = (taskId: string) => {
    updateTaskStatus(taskId, "DONE");
  };

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

  const getEmployeeName = (userId: string) => {
    const employee = employees.find((e) => e.id === userId);
    return employee ? employee.name : "לא ידוע";
  };

  return (
    <div className="space-y-8" dir="rtl">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">משימות הצוות</h1>
        <p className="text-muted-foreground text-lg">
          מעקב אחר כל המשימות בצוות, סטטוס ואישורים
        </p>
        <Badge variant="outline" className="mt-2">נגיש למנהלים בלבד</Badge>
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
            <p className="text-xs text-muted-foreground mt-1">בכל הצוות</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ממתינות לאישור
            </CardTitle>
            <AlertCircle className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{awaitingReview}</div>
            <p className="text-xs text-muted-foreground mt-1">דורשות אישור מנהל</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              אושרו היום
            </CardTitle>
            <CheckCircle2 className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{completedToday}</div>
            <p className="text-xs text-muted-foreground mt-1">משימות שהושלמו</p>
          </CardContent>
        </Card>
      </div>

      {/* פילטרים */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 grid md:grid-cols-3 gap-4">
              <div>
                <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="כל העובדים" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">כל העובדים</SelectItem>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
          <CardTitle>כל המשימות ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>כותרת</TableHead>
                <TableHead>אחראי</TableHead>
                <TableHead>לקוח</TableHead>
                <TableHead>סוג</TableHead>
                <TableHead>עדיפות</TableHead>
                <TableHead>תאריך יעד</TableHead>
                <TableHead>סטטוס</TableHead>
                <TableHead>פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((task) => {
                const needsReview =
                  task.requiresManagerReview &&
                  task.status === "WAITING_MANAGER_REVIEW";

                return (
                  <TableRow
                    key={task.id}
                    className={needsReview ? "bg-warning/5" : ""}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {needsReview && (
                          <AlertCircle className="h-4 w-4 text-warning" />
                        )}
                        {task.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {getEmployeeName(task.assignedToUserId)}
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
                    <TableCell>{task.dueDate}</TableCell>
                    <TableCell>
                      <Select
                        value={task.status}
                        onValueChange={(v: TaskStatus) =>
                          updateTaskStatus(task.id, v)
                        }
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
                    <TableCell>
                      {needsReview && (
                        <Button
                          size="sm"
                          onClick={() => handleApprove(task.id)}
                          className="gap-2"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          אשר
                        </Button>
                      )}
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

export default TeamTasks;
