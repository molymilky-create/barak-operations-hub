import { Users, TrendingUp, DollarSign, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const recentActivities = [
    { id: 1, client: "דוד כהן", action: "פוליסה חדשה", type: "רכב מקיף", time: "לפני 5 דקות", status: "completed" },
    { id: 2, client: "שרה לוי", action: "חידוש פוליסה", type: "בריאות", time: "לפני 15 דקות", status: "pending" },
    { id: 3, client: "יוסי אברהם", action: "תביעה", type: "דירה", time: "לפני שעה", status: "in-progress" },
    { id: 4, client: "רחל מזרחי", action: "ייעוץ", type: "חיים", time: "לפני שעתיים", status: "completed" },
  ];

  const upcomingRenewals = [
    { id: 1, client: "משה גולן", policy: "רכב מקיף", renewalDate: "15/12/2025", premium: "₪3,500" },
    { id: 2, client: "עדי ישראלי", policy: "דירה", renewalDate: "18/12/2025", premium: "₪1,200" },
    { id: 3, client: "טל אשר", policy: "בריאות", renewalDate: "22/12/2025", premium: "₪2,800" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success text-success-foreground">הושלם</Badge>;
      case "pending":
        return <Badge className="bg-warning text-warning-foreground">ממתין</Badge>;
      case "in-progress":
        return <Badge className="bg-primary text-primary-foreground">בטיפול</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">לוח בקרה</h1>
        <p className="text-muted-foreground">סקירה כללית של פעילות הסוכנות</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="לקוחות פעילים"
          value="2,847"
          icon={Users}
          trend={{ value: "+12% מהחודש שעבר", positive: true }}
        />
        <MetricCard
          title="פוליסות פעילות"
          value="4,231"
          icon={CheckCircle}
          trend={{ value: "+8% מהחודש שעבר", positive: true }}
        />
        <MetricCard
          title="הכנסות חודשיות"
          value="₪187K"
          icon={DollarSign}
          trend={{ value: "+15% מהחודש שעבר", positive: true }}
        />
        <MetricCard
          title="לידים חדשים"
          value="156"
          icon={TrendingUp}
          trend={{ value: "-3% מהחודש שעבר", positive: false }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              פעילות אחרונה
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>לקוח</TableHead>
                  <TableHead>פעולה</TableHead>
                  <TableHead>סוג</TableHead>
                  <TableHead>זמן</TableHead>
                  <TableHead>סטטוס</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.client}</TableCell>
                    <TableCell>{activity.action}</TableCell>
                    <TableCell>{activity.type}</TableCell>
                    <TableCell className="text-muted-foreground">{activity.time}</TableCell>
                    <TableCell>{getStatusBadge(activity.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              חידושים קרובים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingRenewals.map((renewal) => (
                <div key={renewal.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{renewal.client}</p>
                    <p className="text-sm text-muted-foreground">{renewal.policy}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">{renewal.renewalDate}</p>
                    <p className="text-sm text-primary font-bold">{renewal.premium}</p>
                  </div>
                  <Button variant="outline" size="sm" className="mr-4">
                    פעולה
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
