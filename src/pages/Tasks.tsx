import { CheckSquare, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const Tasks = () => {
  const tasks = [
    { id: 1, title: "צור קשר עם דוד כהן לגבי חידוש פוליסה", priority: "high", assignee: "שרה", dueDate: "היום", completed: false },
    { id: 2, title: "שלח הצעת מחיר ליוסי אברהם - ביטוח רכב", priority: "high", assignee: "מיכל", dueDate: "מחר", completed: false },
    { id: 3, title: "עדכן מסמכים לפוליסה של רחל מזרחי", priority: "medium", assignee: "דני", dueDate: "15/12", completed: false },
    { id: 4, title: "בדוק סטטוס תביעה של משה גולן", priority: "medium", assignee: "שרה", dueDate: "16/12", completed: true },
    { id: 5, title: "הכן דוח חודשי למנהל", priority: "low", assignee: "מיכל", dueDate: "20/12", completed: false },
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-destructive text-destructive-foreground">דחוף</Badge>;
      case "medium":
        return <Badge className="bg-warning text-warning-foreground">בינוני</Badge>;
      case "low":
        return <Badge className="bg-primary text-primary-foreground">נמוך</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">משימות</h1>
          <p className="text-muted-foreground">ניהול משימות יומיומיות לעובדים</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          משימה חדשה
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">משימות פתוחות</p>
              </div>
              <CheckSquare className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">משימות דחופות</p>
              </div>
              <CheckSquare className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">28</p>
                <p className="text-sm text-muted-foreground">הושלמו השבוע</p>
              </div>
              <CheckSquare className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-accent transition-colors ${
                task.completed ? "opacity-60" : ""
              }`}
            >
              <Checkbox checked={task.completed} />
              <div className="flex-1">
                <p className={`font-medium ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  {getPriorityBadge(task.priority)}
                  <span className="text-sm text-muted-foreground">אחראי: {task.assignee}</span>
                  <span className="text-sm text-muted-foreground">• {task.dueDate}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                ערוך
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Tasks;
