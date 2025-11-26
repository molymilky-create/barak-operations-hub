import { Calendar, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Renewals = () => {
  const renewals = [
    { id: 1, client: "משה גולן", policy: "רכב מקיף", policyNumber: "POL-2024-001", renewalDate: "15/12/2025", premium: "₪3,500", status: "pending", daysLeft: 5 },
    { id: 2, client: "עדי ישראלי", policy: "דירה", policyNumber: "POL-2024-002", renewalDate: "18/12/2025", premium: "₪1,200", status: "contacted", daysLeft: 8 },
    { id: 3, client: "טל אשר", policy: "בריאות", policyNumber: "POL-2024-003", renewalDate: "22/12/2025", premium: "₪2,800", status: "pending", daysLeft: 12 },
    { id: 4, client: "נועה דהן", policy: "עסק", policyNumber: "POL-2024-004", renewalDate: "25/12/2025", premium: "₪5,400", status: "renewed", daysLeft: 15 },
    { id: 5, client: "רון פרידמן", policy: "חיים", policyNumber: "POL-2024-005", renewalDate: "28/12/2025", premium: "₪4,200", status: "contacted", daysLeft: 18 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-warning text-warning-foreground">ממתין ליצירת קשר</Badge>;
      case "contacted":
        return <Badge className="bg-primary text-primary-foreground">יצרנו קשר</Badge>;
      case "renewed":
        return <Badge className="bg-success text-success-foreground">חודש</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">חידושים</h1>
        <p className="text-muted-foreground">מעקב אחר פוליסות הדורשות חידוש</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">חידושים השבוע</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">דורש טיפול מיידי</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">חידושים החודש</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">מתוכננים</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">חודשו החודש</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">+15% מהחודש שעבר</p>
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
                <TableHead>מספר פוליסה</TableHead>
                <TableHead>תאריך חידוש</TableHead>
                <TableHead>פרמיה</TableHead>
                <TableHead>ימים עד חידוש</TableHead>
                <TableHead>סטטוס</TableHead>
                <TableHead>פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renewals.map((renewal) => (
                <TableRow key={renewal.id}>
                  <TableCell className="font-medium">{renewal.client}</TableCell>
                  <TableCell>{renewal.policy}</TableCell>
                  <TableCell className="text-muted-foreground">{renewal.policyNumber}</TableCell>
                  <TableCell>{renewal.renewalDate}</TableCell>
                  <TableCell className="font-bold text-primary">{renewal.premium}</TableCell>
                  <TableCell>
                    <span className={renewal.daysLeft <= 7 ? "text-warning font-medium" : ""}>
                      {renewal.daysLeft} ימים
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(renewal.status)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      צור קשר
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

export default Renewals;
