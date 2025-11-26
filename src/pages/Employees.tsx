import { UserCog, Calendar, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Employees = () => {
  const employees = [
    { id: 1, name: "שרה כהן", role: "סוכנת ביטוח", phone: "050-1234567", email: "sarah@barak.com", status: "active", initials: "ש" },
    { id: 2, name: "מיכל לוי", role: "סוכנת ביטוח", phone: "052-7654321", email: "michal@barak.com", status: "active", initials: "מ" },
    { id: 3, name: "דני אברהם", role: "מנהל משרד", phone: "054-9876543", email: "danny@barak.com", status: "active", initials: "ד" },
    { id: 4, name: "רון מזרחי", role: "סוכן ביטוח", phone: "053-4567890", email: "ron@barak.com", status: "vacation", initials: "ר" },
  ];

  const vacations = [
    { id: 1, employee: "רון מזרחי", startDate: "10/12/2025", endDate: "15/12/2025", days: 5, status: "approved" },
    { id: 2, employee: "שרה כהן", startDate: "20/12/2025", endDate: "25/12/2025", days: 5, status: "pending" },
    { id: 3, employee: "מיכל לוי", startDate: "01/01/2026", endDate: "07/01/2026", days: 7, status: "approved" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground">פעיל</Badge>;
      case "vacation":
        return <Badge className="bg-warning text-warning-foreground">בחופשה</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getVacationStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-success text-success-foreground">אושר</Badge>;
      case "pending":
        return <Badge className="bg-warning text-warning-foreground">ממתין</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">עובדים וחופשות</h1>
          <p className="text-muted-foreground">ניהול צוות ומעקב אחר חופשות</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          עובד חדש
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סה"כ עובדים</CardTitle>
            <UserCog className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 מהשנה שעברה</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">עובדים פעילים</CardTitle>
            <UserCog className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">11</div>
            <p className="text-xs text-muted-foreground">במשרד</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">בחופשה</CardTitle>
            <Calendar className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">השבוע</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>צוות העובדים</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {employees.map((employee) => (
              <div key={employee.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {employee.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{employee.name}</p>
                    <p className="text-sm text-muted-foreground">{employee.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-left">
                    <p className="text-sm text-foreground">{employee.phone}</p>
                    <p className="text-sm text-muted-foreground">{employee.email}</p>
                  </div>
                  {getStatusBadge(employee.status)}
                  <Button variant="outline" size="sm">
                    צפייה
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>חופשות</CardTitle>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              בקשת חופשה
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>עובד</TableHead>
                <TableHead>תאריך התחלה</TableHead>
                <TableHead>תאריך סיום</TableHead>
                <TableHead>ימים</TableHead>
                <TableHead>סטטוס</TableHead>
                <TableHead>פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vacations.map((vacation) => (
                <TableRow key={vacation.id}>
                  <TableCell className="font-medium">{vacation.employee}</TableCell>
                  <TableCell>{vacation.startDate}</TableCell>
                  <TableCell>{vacation.endDate}</TableCell>
                  <TableCell>{vacation.days}</TableCell>
                  <TableCell>{getVacationStatusBadge(vacation.status)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      {vacation.status === "pending" ? "אשר" : "צפייה"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Employees;
