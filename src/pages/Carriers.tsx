import { Send, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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

const Carriers = () => {
  const requests = [
    { id: 1, client: "דוד כהן", carrier: "הראל", type: "רכב מקיף", status: "draft", date: "10/12/2025", amount: "₪3,500" },
    { id: 2, client: "שרה לוי", carrier: "מגדל", type: "דירה", status: "sent", date: "09/12/2025", amount: "₪1,200" },
    { id: 3, client: "יוסי אברהם", carrier: "כלל", type: "בריאות", status: "approved", date: "08/12/2025", amount: "₪2,800" },
    { id: 4, client: "רחל מזרחי", carrier: "מנורה", type: "עסק", status: "pending", date: "07/12/2025", amount: "₪5,400" },
    { id: 5, client: "משה גולן", carrier: "הפניקס", type: "חיים", status: "rejected", date: "06/12/2025", amount: "₪4,200" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge className="bg-muted text-muted-foreground">טיוטה</Badge>;
      case "sent":
        return <Badge className="bg-primary text-primary-foreground">נשלח</Badge>;
      case "pending":
        return <Badge className="bg-warning text-warning-foreground">ממתין</Badge>;
      case "approved":
        return <Badge className="bg-success text-success-foreground">אושר</Badge>;
      case "rejected":
        return <Badge className="bg-destructive text-destructive-foreground">נדחה</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">בקשות למוביל</h1>
          <p className="text-muted-foreground">ניהול בקשות וטיוטות לחברות הביטוח</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          בקשה חדשה
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-muted-foreground">טיוטות</p>
              </div>
              <Send className="h-6 w-6 text-muted" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">15</p>
                <p className="text-sm text-muted-foreground">נשלחו</p>
              </div>
              <Send className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">אושרו</p>
              </div>
              <Send className="h-6 w-6 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">נדחו</p>
              </div>
              <Send className="h-6 w-6 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>לקוח</TableHead>
                <TableHead>מוביל</TableHead>
                <TableHead>סוג ביטוח</TableHead>
                <TableHead>תאריך</TableHead>
                <TableHead>סכום</TableHead>
                <TableHead>סטטוס</TableHead>
                <TableHead>פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.client}</TableCell>
                  <TableCell>{request.carrier}</TableCell>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>{request.date}</TableCell>
                  <TableCell className="font-bold text-primary">{request.amount}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      {request.status === "draft" ? "שלח" : "צפייה"}
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

export default Carriers;
