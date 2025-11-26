import { DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Collections = () => {
  const collections = [
    { id: 1, client: "דני אלמוג", policy: "רכב מקיף", amount: "₪3,500", dueDate: "01/12/2025", daysOverdue: 0, status: "current" },
    { id: 2, client: "מיכל ברקוביץ", policy: "דירה", amount: "₪1,200", dueDate: "25/11/2025", daysOverdue: 5, status: "overdue" },
    { id: 3, client: "אבי גרינברג", policy: "בריאות", amount: "₪2,800", dueDate: "15/11/2025", daysOverdue: 15, status: "overdue" },
    { id: 4, client: "לאה הרצוג", policy: "עסק", amount: "₪5,400", dueDate: "10/12/2025", daysOverdue: 0, status: "upcoming" },
    { id: 5, client: "יונתן זיו", policy: "חיים", amount: "₪4,200", dueDate: "05/11/2025", daysOverdue: 25, status: "overdue" },
  ];

  const getStatusBadge = (status: string, daysOverdue: number) => {
    switch (status) {
      case "current":
        return <Badge className="bg-success text-success-foreground">שולם</Badge>;
      case "upcoming":
        return <Badge className="bg-primary text-primary-foreground">קרוב</Badge>;
      case "overdue":
        return <Badge className="bg-destructive text-destructive-foreground">איחור {daysOverdue} ימים</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">גבייה</h1>
        <p className="text-muted-foreground">ניהול תשלומים וגבייה מלקוחות</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">הכנסות החודש</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₪187,400</div>
            <p className="text-xs text-muted-foreground">+15% מהחודש שעבר</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">חובות פתוחים</CardTitle>
            <DollarSign className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₪34,200</div>
            <p className="text-xs text-muted-foreground">23 לקוחות</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">איחורים</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₪11,500</div>
            <p className="text-xs text-muted-foreground">דורש טיפול מיידי</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>לקוח</TableHead>
                <TableHead>סוג פוליסה</TableHead>
                <TableHead>סכום</TableHead>
                <TableHead>תאריך פירעון</TableHead>
                <TableHead>סטטוס</TableHead>
                <TableHead>פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collections.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.client}</TableCell>
                  <TableCell>{item.policy}</TableCell>
                  <TableCell className="font-bold text-primary">{item.amount}</TableCell>
                  <TableCell>{item.dueDate}</TableCell>
                  <TableCell>{getStatusBadge(item.status, item.daysOverdue)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      {item.status === "overdue" ? "שלח תזכורת" : "צפייה"}
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

export default Collections;
