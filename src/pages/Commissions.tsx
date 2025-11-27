import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, BarChart3, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Commissions = () => {
  // נתוני דמו לעמלות
  const commissions = [
    { id: 1, client: "דוד כהן", policy: "12345", company: "מנורה", product: "סוסים", grossPremium: 8500, netPremium: 7200, commission: 720, rate: 10 },
    { id: 2, client: "שרה לוי", policy: "12346", company: "הכשרה", product: "חווה", grossPremium: 12000, netPremium: 10500, commission: 1050, rate: 10 },
    { id: 3, client: "יוסי אברהם", policy: "12347", company: "מנורה", product: "מדריכים", grossPremium: 5200, netPremium: 4800, commission: 480, rate: 10 },
  ];

  const totalCommission = commissions.reduce((sum, c) => sum + c.commission, 0);
  const totalPremium = commissions.reduce((sum, c) => sum + c.grossPremium, 0);

  return (
    <div className="space-y-8" dir="rtl">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">עמלות ודוחות</h1>
        <p className="text-muted-foreground text-lg">
          מעקב אחר עמלות, רווחיות ודוחות כספיים
        </p>
        <Badge variant="outline" className="mt-2">נגיש למנהלים בלבד</Badge>
      </div>

      {/* סטטיסטיקות */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              סך עמלות
            </CardTitle>
            <DollarSign className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              ₪{totalCommission.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">בחודש הנוכחי</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              סך פרמיות
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              ₪{totalPremium.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">בחודש הנוכחי</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-secondary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              שיעור עמלה ממוצע
            </CardTitle>
            <BarChart3 className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">10%</div>
            <p className="text-xs text-muted-foreground mt-1">ממוצע משוקלל</p>
          </CardContent>
        </Card>
      </div>

      {/* טבלת עמלות */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            פירוט עמלות
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
                <TableHead>פרמיה ברוטו</TableHead>
                <TableHead>פרמיה נטו</TableHead>
                <TableHead>שיעור עמלה</TableHead>
                <TableHead>עמלה</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commissions.map((comm) => (
                <TableRow key={comm.id}>
                  <TableCell className="font-medium">{comm.client}</TableCell>
                  <TableCell>{comm.policy}</TableCell>
                  <TableCell>{comm.company}</TableCell>
                  <TableCell>{comm.product}</TableCell>
                  <TableCell>₪{comm.grossPremium.toLocaleString()}</TableCell>
                  <TableCell>₪{comm.netPremium.toLocaleString()}</TableCell>
                  <TableCell>{comm.rate}%</TableCell>
                  <TableCell className="font-bold text-success">
                    ₪{comm.commission.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* תכונות עתידיות */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-dashed">
        <CardHeader>
          <CardTitle>תכונות בהמשך</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>פילטר לפי שנה, חודש, חברת ביטוח ועובד</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>גרפים של עמלות לאורך זמן</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>ייצוא לאקסל</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>חישוב אוטומטי של עמלות לפי הסכמים</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Commissions;
