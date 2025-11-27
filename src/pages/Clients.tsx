import { useState } from "react";
import { Search, Plus, Filter, Users, FileText, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Clients = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const clients = [
    { id: 1, name: "דוד כהן", idNumber: "123456789", phone: "050-1234567", policies: 3, totalPremium: 8500, status: "active" },
    { id: 2, name: "שרה לוי", idNumber: "987654321", phone: "052-7654321", policies: 2, totalPremium: 5200, status: "active" },
    { id: 3, name: "יוסי אברהם", idNumber: "456789123", phone: "054-9876543", policies: 4, totalPremium: 12300, status: "active" },
    { id: 4, name: "רחל מזרחי", idNumber: "321654987", phone: "053-4567890", policies: 1, totalPremium: 3100, status: "pending" },
    { id: 5, name: "משה גולן", idNumber: "789123456", phone: "050-3216549", policies: 5, totalPremium: 15700, status: "active" },
  ];

  const filtered = clients.filter((client) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(q) ||
      client.idNumber.includes(q) ||
      client.phone.includes(q)
    );
  });

  const totalClients = clients.length;
  const totalPolicies = clients.reduce((sum, c) => sum + c.policies, 0);
  const totalPremium = clients.reduce((sum, c) => sum + c.totalPremium, 0);

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">לקוחות ופוליסות</h1>
          <p className="text-muted-foreground text-lg">
            ניהול מידע לקוחות ופוליסות הביטוח שלהם
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          לקוח חדש
        </Button>
      </div>

      {/* סטטיסטיקות */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              סך לקוחות
            </CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{totalClients}</div>
            <p className="text-xs text-muted-foreground mt-1">לקוחות פעילים</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-secondary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              סך פוליסות
            </CardTitle>
            <FileText className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{totalPolicies}</div>
            <p className="text-xs text-muted-foreground mt-1">פוליסות פעילות</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              סך פרמיות
            </CardTitle>
            <DollarSign className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              ₪{totalPremium.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">פרמיה שנתית כוללת</p>
          </CardContent>
        </Card>
      </div>

      {/* חיפוש וסינון */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="חיפוש לפי שם, ת.ז או טלפון..."
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              סינון
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* טבלת לקוחות */}
      <Card>
        <CardHeader>
          <CardTitle>רשימת לקוחות ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>שם הלקוח</TableHead>
                <TableHead>ת.ז</TableHead>
                <TableHead>טלפון</TableHead>
                <TableHead>מספר פוליסות</TableHead>
                <TableHead>סכום פרמיה כולל</TableHead>
                <TableHead>סטטוס</TableHead>
                <TableHead>פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.idNumber}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.policies}</TableCell>
                  <TableCell className="font-bold text-primary">
                    ₪{client.totalPremium.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={client.status === "active" ? "default" : "secondary"}
                    >
                      {client.status === "active" ? "פעיל" : "ממתין"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      צפייה
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              לא נמצאו לקוחות לפי החיפוש
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Clients;
