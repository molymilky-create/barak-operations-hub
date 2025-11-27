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
import { RotateCw, Calendar, AlertTriangle, TrendingUp, Plus, Filter } from "lucide-react";

const Renewals = () => {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const renewals = [
    { id: 1, client: "דוד כהן", policy: "12345", company: "מנורה", product: "ביטוח סוסים", renewalDate: "2025-01-15", premium: 8500, status: "pending", daysLeft: 19 },
    { id: 2, client: "שרה לוי", policy: "12346", company: "הכשרה", product: "ביטוח חווה", renewalDate: "2025-01-20", premium: 12000, status: "contacted", daysLeft: 24 },
    { id: 3, client: "יוסי אברהם", policy: "12347", company: "מנורה", product: "מדריכים", renewalDate: "2024-12-28", premium: 5200, status: "pending", daysLeft: 1 },
    { id: 4, client: "רחל מזרחי", policy: "12348", company: "הכשרה", product: "מאמנים", renewalDate: "2025-02-10", premium: 3100, status: "renewed", daysLeft: 45 },
    { id: 5, client: "משה גולן", policy: "12349", company: "מנורה", product: "ביטוח סוסים", renewalDate: "2025-01-05", premium: 15700, status: "contacted", daysLeft: 9 },
  ];

  const filtered = renewals.filter((r) => {
    if (statusFilter === "ALL") return true;
    return r.status === statusFilter;
  });

  const thisWeek = renewals.filter((r) => r.daysLeft <= 7).length;
  const thisMonth = renewals.filter((r) => r.daysLeft <= 30).length;
  const renewed = renewals.filter((r) => r.status === "renewed").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">ממתין</Badge>;
      case "contacted":
        return <Badge variant="default">נוצר קשר</Badge>;
      case "renewed":
        return <Badge className="bg-success text-success-foreground">חודש</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUrgencyColor = (daysLeft: number) => {
    if (daysLeft <= 7) return "text-destructive font-bold";
    if (daysLeft <= 14) return "text-warning font-semibold";
    return "text-foreground";
  };

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">חידושי פוליסות</h1>
          <p className="text-muted-foreground text-lg">
            מעקב אחר פוליסות הממתינות לחידוש וטיפול בהן
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          משימת חידוש חדשה
        </Button>
      </div>

      {/* סטטיסטיקות */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              חידושים השבוע
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{thisWeek}</div>
            <p className="text-xs text-muted-foreground mt-1">דורשים טיפול מיידי</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              חידושים החודש
            </CardTitle>
            <Calendar className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{thisMonth}</div>
            <p className="text-xs text-muted-foreground mt-1">ב-30 הימים הקרובים</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              חודשו החודש
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{renewed}</div>
            <p className="text-xs text-muted-foreground mt-1">פוליסות מחודשות</p>
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
                <SelectItem value="contacted">נוצר קשר</SelectItem>
                <SelectItem value="renewed">חודש</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* טבלת חידושים */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCw className="h-5 w-5" />
            פוליסות לחידוש ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>לקוח</TableHead>
                <TableHead>מספר פוליסה</TableHead>
                <TableHead>חברה</TableHead>
                <TableHead>מוצר</TableHead>
                <TableHead>תאריך חידוש</TableHead>
                <TableHead>ימים שנותרו</TableHead>
                <TableHead>פרמיה</TableHead>
                <TableHead>סטטוס</TableHead>
                <TableHead>פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((renewal) => (
                <TableRow
                  key={renewal.id}
                  className={`transition-colors ${renewal.daysLeft <= 7 ? "bg-destructive/5 hover:bg-destructive/10" : "hover:bg-muted/50"}`}
                >
                  <TableCell className="font-medium">{renewal.client}</TableCell>
                  <TableCell>{renewal.policy}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{renewal.company}</Badge>
                  </TableCell>
                  <TableCell>{renewal.product}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {renewal.renewalDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`flex items-center gap-2 ${getUrgencyColor(renewal.daysLeft)}`}>
                      {renewal.daysLeft <= 7 && (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                      {renewal.daysLeft} ימים
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-primary">
                    ₪{renewal.premium.toLocaleString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(renewal.status)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform">
                      טפל
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              אין חידושים לפי הסינון הנוכחי
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Renewals;
