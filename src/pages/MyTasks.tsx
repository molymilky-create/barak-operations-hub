import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import type { TaskPriority, TaskStatus } from "@/types";

const MyTasks = () => {
  const { tasks, updateTaskStatus } = useData();
  const { user } = useAuth();

  // סינון משימות של המשתמש הנוכחי
  const myTasks = tasks.filter((task) => task.assignedToUserId === user?.id);

  const openTasks = myTasks.filter((t) => t.status === "OPEN");
  const urgentTasks = myTasks.filter((t) => t.priority === "HIGH" || t.priority === "CRITICAL");
  const completedThisWeek = myTasks.filter((t) => t.status === "DONE");

  const getPriorityBadge = (priority: TaskPriority) => {
    const variants: Record<TaskPriority, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      LOW: { variant: "secondary", label: "נמוכה" },
      NORMAL: { variant: "outline", label: "רגילה" },
      HIGH: { variant: "default", label: "גבוהה" },
      CRITICAL: { variant: "destructive", label: "קריטית" },
    };
    return <Badge variant={variants[priority].variant}>{variants[priority].label}</Badge>;
  };

  const getStatusLabel = (status: TaskStatus) => {
    const labels: Record<TaskStatus, string> = {
      OPEN: "פתוחה",
      IN_PROGRESS: "בטיפול",
      WAITING_CLIENT: "ממתין ללקוח",
      WAITING_COMPANY: "ממתין לחברה",
      WAITING_MANAGER_REVIEW: "ממתין לאישור מנהל",
      DONE: "הושלמה",
      CANCELLED: "בוטלה",
    };
    return labels[status];
  };

  const handleToggleComplete = (taskId: string, currentStatus: TaskStatus) => {
    const newStatus = currentStatus === "DONE" ? "OPEN" : "DONE";
    updateTaskStatus(taskId, newStatus);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">המשימות שלי</h1>
        <p className="text-muted-foreground mt-1">כל המשימות שהוקצו לך</p>
      </div>

      {/* סיכום */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>משימות פתוחות</CardDescription>
            <CardTitle className="text-3xl">{openTasks.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>משימות דחופות</CardDescription>
            <CardTitle className="text-3xl">{urgentTasks.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>הושלמו השבוע</CardDescription>
            <CardTitle className="text-3xl">{completedThisWeek.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* רשימת משימות */}
      <Card>
        <CardHeader>
          <CardTitle>המשימות שלי</CardTitle>
          <CardDescription>סה"כ {myTasks.length} משימות</CardDescription>
        </CardHeader>
        <CardContent>
          {myTasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">אין משימות להצגה</p>
          ) : (
            <div className="space-y-3">
              {myTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  <Checkbox
                    checked={task.status === "DONE"}
                    onCheckedChange={() => handleToggleComplete(task.id, task.status)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className={`font-medium ${
                          task.status === "DONE" ? "line-through text-muted-foreground" : "text-foreground"
                        }`}
                      >
                        {task.title}
                      </h3>
                      {getPriorityBadge(task.priority)}
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>סטטוס: {getStatusLabel(task.status)}</span>
                      {task.dueDate && <span>תאריך יעד: {task.dueDate}</span>}
                      {task.relatedClientName && <span>לקוח: {task.relatedClientName}</span>}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    ערוך
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyTasks;
