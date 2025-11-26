import { Search, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
  const clients = [
    { id: 1, name: "דוד כהן", idNumber: "123456789", phone: "050-1234567", policies: 3, totalPremium: "₪8,500", status: "active" },
    { id: 2, name: "שרה לוי", idNumber: "987654321", phone: "052-7654321", policies: 2, totalPremium: "₪5,200", status: "active" },
    { id: 3, name: "יוסי אברהם", idNumber: "456789123", phone: "054-9876543", policies: 4, totalPremium: "₪12,300", status: "active" },
    { id: 4, name: "רחל מזרחי", idNumber: "321654987", phone: "053-4567890", policies: 1, totalPremium: "₪3,100", status: "pending" },
    { id: 5, name: "משה גולן", idNumber: "789123456", phone: "050-3216549", policies: 5, totalPremium: "₪15,700", status: "active" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">לקוחות ופוליסות</h1>
          <p className="text-muted-foreground">ניהול מידע לקוחות ופוליסות הביטוח שלהם</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          לקוח חדש
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="חיפוש לפי שם, ת.ז או טלפון..."
                className="pr-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              סינון
            </Button>
          </div>

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
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.idNumber}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.policies}</TableCell>
                  <TableCell className="font-bold text-primary">{client.totalPremium}</TableCell>
                  <TableCell>
                    <Badge className={client.status === "active" ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"}>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Clients;
