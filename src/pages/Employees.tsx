import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, UserCog, Calendar, Plus, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Employees = () => {
  const { toast } = useToast();
  const [showVacationForm, setShowVacationForm] = useState(false);

  const employees = [
    { id: 1, name: "דוד כהן", role: "סוכן ביטוח", email: "david@barak.com", phone: "050-1234567", status: "active" },
    { id: 2, name: "שרה לוי", role: "מנהלת משרד", email: "sarah@barak.com", phone: "052-7654321", status: "active" },
    { id: 3, name: "יוסי אברהם", role: "סוכן ביטוח", email: "yossi@barak.com", phone: "054-9876543", status: "active" },
    { id: 4, name: "רחל מזרחי", role: "רכזת שירות", email: "rachel@barak.com", phone: "053-4567890", status: "vacation" },
  ];

  const vacations = [
    { id: 1, employee: "רחל מזרחי", from: "2024-12-25", to: "2024-12-30", days: 6, status: "approved", reason: "חופשה משפחתית" },
    { id: 2, employee: "יוסי אברהם", from: "2025-01-10", to: "2025-01-15", days: 6, status: "pending", reason: "חופשה" },
  ];

  const activeEmployees = employees.filter((e) => e.status === "active").length;
  const onVacation = employees.filter((e) => e.status === "vacation").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground">פעיל</Badge>;
      case "vacation":
        return <Badge variant="secondary">בחופשה</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getVacationStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-success text-success-foreground">אושר</Badge>;
      case "pending":
        return <Badge variant="secondary">ממתין לאישור</Badge>;
      case "rejected":
        return <Badge variant="destructive">נדחה</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleVacationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "בקשת חופשה נשלחה",
      description: "הבקשה נשלחה לאישור המנהל",
    });
    setShowVacationForm(false);
  };

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">עובדים וחופשות</h1>
          <p className="text-muted-foreground text-lg">
            ניהול צוות העובדים ובקשות חופשה
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowVacationForm(!showVacationForm)} className="gap-2">
            <Calendar className="h-4 w-4" />
            בקש חופשה
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            עובד חדש
          </Button>
        </div>
      </div>

      {/* סטטיסטיקות */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              סך עובדים
            </CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{employees.length}</div>
            <p className="text-xs text-muted-foreground mt-1">עובדים במערכת</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              עובדים פעילים
            </CardTitle>
            <UserCog className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{activeEmployees}</div>
            <p className="text-xs text-muted-foreground mt-1">זמינים כרגע</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-secondary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              בחופשה
            </CardTitle>
            <Calendar className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{onVacation}</div>
            <p className="text-xs text-muted-foreground mt-1">עובדים בחופשה</p>
          </CardContent>
        </Card>
      </div>

      {/* טופס בקשת חופשה */}
      {showVacationForm && (
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle>בקשת חופשה חדשה</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVacationSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="from">מתאריך</Label>
                  <Input id="from" type="date" required />
                </div>
                <div>
                  <Label htmlFor="to">עד תאריך</Label>
                  <Input id="to" type="date" required />
                </div>
              </div>
              <div>
                <Label htmlFor="reason">סיבת החופשה</Label>
                <Input id="reason" placeholder="חופשה משפחתית, נסיעה לחו״ל וכו׳" />
              </div>
              <div className="flex gap-3">
                <Button type="submit">שלח בקשה</Button>
                <Button type="button" variant="outline" onClick={() => setShowVacationForm(false)}>
                  ביטול
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* רשימת עובדים */}
      <Card>
        <CardHeader>
          <CardTitle>רשימת עובדים</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {employees.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-all duration-300 hover:scale-[1.01]"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {employee.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg">{employee.name}</h3>
                    <p className="text-sm text-muted-foreground">{employee.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {employee.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {employee.phone}
                    </div>
                  </div>
                  {getStatusBadge(employee.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* טבלת חופשות */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            חופשות קרובות
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>עובד</TableHead>
                <TableHead>מתאריך</TableHead>
                <TableHead>עד תאריך</TableHead>
                <TableHead>ימים</TableHead>
                <TableHead>סיבה</TableHead>
                <TableHead>סטטוס</TableHead>
                <TableHead>פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vacations.map((vacation) => (
                <TableRow key={vacation.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{vacation.employee}</TableCell>
                  <TableCell>{vacation.from}</TableCell>
                  <TableCell>{vacation.to}</TableCell>
                  <TableCell>{vacation.days} ימים</TableCell>
                  <TableCell>{vacation.reason}</TableCell>
                  <TableCell>{getVacationStatusBadge(vacation.status)}</TableCell>
                  <TableCell>
                    {vacation.status === "pending" && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="hover:scale-105 transition-transform">
                          אשר
                        </Button>
                        <Button size="sm" variant="destructive" className="hover:scale-105 transition-transform">
                          דחה
                        </Button>
                      </div>
                    )}
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
