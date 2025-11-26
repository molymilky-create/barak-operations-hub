import { TrendingUp, Phone, Mail, UserPlus } from "lucide-react";
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

const Leads = () => {
  const leads = [
    { id: 1, name: "אורי כץ", phone: "050-1234567", email: "uri@example.com", source: "אתר", interest: "רכב", status: "new", date: "10/12/2025" },
    { id: 2, name: "תמר לביא", phone: "052-7654321", email: "tamar@example.com", source: "המלצה", interest: "דירה", status: "contacted", date: "09/12/2025" },
    { id: 3, name: "גיא נחמן", phone: "054-9876543", email: "guy@example.com", source: "פייסבוק", interest: "בריאות", status: "meeting", date: "08/12/2025" },
    { id: 4, name: "רותי שפירא", phone: "053-4567890", email: "ruth@example.com", source: "גוגל", interest: "עסק", status: "proposal", date: "07/12/2025" },
    { id: 5, name: "עמית טננבאום", phone: "050-3216549", email: "amit@example.com", source: "אתר", interest: "חיים", status: "new", date: "06/12/2025" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-primary text-primary-foreground">חדש</Badge>;
      case "contacted":
        return <Badge className="bg-secondary text-secondary-foreground">יצרנו קשר</Badge>;
      case "meeting":
        return <Badge className="bg-warning text-warning-foreground">פגישה</Badge>;
      case "proposal":
        return <Badge className="bg-success text-success-foreground">הצעה נשלחה</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">לידים</h1>
          <p className="text-muted-foreground">ניהול לידים ולקוחות פוטנציאליים</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          ליד חדש
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">לידים חדשים</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">החודש</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">יצרנו קשר</CardTitle>
            <Phone className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">השבוע</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">פגישות קבועות</CardTitle>
            <Mail className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">השבוע</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">שיעור המרה</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34%</div>
            <p className="text-xs text-muted-foreground">+5% מהחודש שעבר</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>שם</TableHead>
                <TableHead>טלפון</TableHead>
                <TableHead>אימייל</TableHead>
                <TableHead>מקור</TableHead>
                <TableHead>עניין</TableHead>
                <TableHead>תאריך</TableHead>
                <TableHead>סטטוס</TableHead>
                <TableHead>פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell className="text-muted-foreground">{lead.email}</TableCell>
                  <TableCell>{lead.source}</TableCell>
                  <TableCell>{lead.interest}</TableCell>
                  <TableCell>{lead.date}</TableCell>
                  <TableCell>{getStatusBadge(lead.status)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      טפל
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

export default Leads;
