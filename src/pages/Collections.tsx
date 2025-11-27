import { useState } from "react";
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
import { CreditCard, DollarSign, AlertCircle, TrendingUp, Filter, Send } from "lucide-react";

const Collections = () => {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const collections = [
    { id: 1, client: "דוד כהן", policy: "12345", company: "מנורה", amount: 2500, dueDate: "2024-12-15", status: "overdue", daysOverdue: 12 },
    { id: 2, client: "שרה לוי", policy: "12346", company: "הכשרה", amount: 1200, dueDate: "2024-12-20", status: "overdue", daysOverdue: 7 },
    { id: 3, client: "יוסי אברהם", policy: "12347", company: "מנורה", amount: 5200, dueDate: "2025-01-05", status: "pending", daysOverdue: 0 },
    { id: 4, client: "רחל מזרחי", policy: "12348", company: "הכשרה", amount: 3100, dueDate: "2024-12-01", status: "reminder", daysOverdue: 26 },
    { id: 5, client: "משה גולן", policy: "12349", company: "מנורה", amount: 7800, dueDate: "2024-12-25", status: "paid", daysOverdue: 0 },
  ];

  const filtered = collections.filter((c) => {
    if (statusFilter === "ALL") return true;
    return c.status === statusFilter;
  });

  const totalRevenue = collections.filter((c) => c.status === "paid").reduce((sum, c) => sum + c.amount, 0);
  const openDebts = collections.filter((c) => c.status !== "paid").reduce((sum, c) => sum + c.amount, 0);
  const overdueCount = collections.filter((c) => c.status === "overdue").length;

  const getStatusBadge = (status: string, daysOverdue: number) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-success text-success-foreground">שולם</Badge>;
      case "pending":
        return <Badge variant="secondary">ממתין</Badge>;
      case "reminder":
        return <Badge variant="default">נשלחה תזכורת</Badge>;
      case "overdue":
        return (
          <Badge variant="destructive">
            באיחור {daysOverdue} ימים
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">גבייה ותשלומים</h1>
        <p className="text-muted-foreground text-lg">
          מעקב אחר תשלומים, חובות פתוחים ותזכורות
        </p>
      </div>

      {/* סטטיסטיקות */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              הכנסות החודש
            </CardTitle>
            <DollarSign className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              ₪{totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">תשלומים שהתקבלו</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              חובות פתוחים
            </CardTitle>
            <CreditCard className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">
              ₪{openDebts.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">ממתינים לתשלום</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              תשלומים באיחור
            </CardTitle>
            <AlertCircle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{overdueCount}</div>
            <p className="text-xs text-muted-foreground mt-1">דורשים טיפול מיידי</p>
          </CardContent>
        </Card>
      </div>

      {/* פילטר */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="כל הסטטוסים" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">כל הסטטוסים</SelectItem>
                <SelectItem value="pending">ממתין</SelectItem>
                <SelectItem value="reminder">נשלחה תזכורת</SelectItem>
                <SelectItem value="overdue">באיחור</SelectItem>
                <SelectItem value="paid">שולם</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* טבלת גבייה */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            רשימת תשלומים ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>לקוח</TableHead>
                <TableHead>מספר פוליסה</TableHead>
                <TableHead>חברה</TableHead>
                <TableHead>סכום</TableHead>
                <TableHead>תאריך יעד</TableHead>
                <TableHead>סטטוס</TableHead>
                <TableHead>פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((collection) => (
                <TableRow
                  key={collection.id}
                  className={`transition-colors ${collection.status === "overdue" ? "bg-destructive/5 hover:bg-destructive/10" : "hover:bg-muted/50"}`}
                >
                  <TableCell className="font-medium">{collection.client}</TableCell>
                  <TableCell>{collection.policy}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{collection.company}</Badge>
                  </TableCell>
                  <TableCell className="font-bold text-primary">
                    ₪{collection.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>{collection.dueDate}</TableCell>
                  <TableCell>
                    {getStatusBadge(collection.status, collection.daysOverdue)}
                  </TableCell>
                  <TableCell>
                    {collection.status !== "paid" && (
                      <Button variant="outline" size="sm" className="gap-2 hover:scale-105 transition-transform">
                        <Send className="h-3 w-3" />
                        שלח תזכורת
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              אין תשלומים לפי הסינון הנוכחי
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Collections;
