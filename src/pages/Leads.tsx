import { useState } from "react";
import { useData } from "../context/DataContext";
import type { LeadStatus } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Sparkles, TrendingUp, Phone, Mail, Calendar } from "lucide-react";

const statusLabels: Record<LeadStatus, string> = {
  NEW: "חדש",
  CONTACTED: "נוצר קשר",
  QUOTED: "נשלחה הצעה",
  WON: "נסגר (הצלחה)",
  LOST: "אבד",
};

const Leads: React.FC = () => {
  const { leads, addLead, updateLeadStatus } = useData();

  const [statusFilter, setStatusFilter] = useState<LeadStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // שדות לטופס הוספת ליד
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("");
  const [notes, setNotes] = useState("");
  const [estimatedPremium, setEstimatedPremium] = useState("");
  const [nextActionDate, setNextActionDate] = useState("");
  const [nextActionNotes, setNextActionNotes] = useState("");

  const filtered = leads.filter((lead) => {
    if (statusFilter !== "ALL" && lead.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        lead.name.toLowerCase().includes(q) ||
        (lead.phone || "").toLowerCase().includes(q) ||
        (lead.email || "").toLowerCase().includes(q) ||
        (lead.source || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("חובה להזין שם ליד.");
      return;
    }

    addLead({
      name: name.trim(),
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      source: source.trim() || undefined,
      notes: notes.trim() || undefined,
      estimatedAnnualPremium: estimatedPremium ? Number(estimatedPremium) : undefined,
      nextActionDate: nextActionDate || undefined,
      nextActionNotes: nextActionNotes || undefined,
      lastChannel: undefined,
      assignedToUserId: undefined,
    });

    setName("");
    setPhone("");
    setEmail("");
    setSource("");
    setNotes("");
    setEstimatedPremium("");
    setNextActionDate("");
    setNextActionNotes("");
  };

  // סטטיסטיקות
  const stats = {
    NEW: leads.filter((l) => l.status === "NEW").length,
    CONTACTED: leads.filter((l) => l.status === "CONTACTED").length,
    QUOTED: leads.filter((l) => l.status === "QUOTED").length,
    WON: leads.filter((l) => l.status === "WON").length,
    LOST: leads.filter((l) => l.status === "LOST").length,
  };

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">לידים - CRM</h1>
          <p className="text-muted-foreground text-lg">
            ניהול לידים והזדמנויות עסקיות חדשות
          </p>
        </div>
      </div>

      {/* סטטיסטיקות */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setStatusFilter("NEW")}>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-primary">{stats.NEW}</div>
            <div className="text-sm text-muted-foreground mt-1">חדשים</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setStatusFilter("CONTACTED")}>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-secondary">{stats.CONTACTED}</div>
            <div className="text-sm text-muted-foreground mt-1">נוצר קשר</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setStatusFilter("QUOTED")}>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-warning">{stats.QUOTED}</div>
            <div className="text-sm text-muted-foreground mt-1">נשלחה הצעה</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setStatusFilter("WON")}>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-success">{stats.WON}</div>
            <div className="text-sm text-muted-foreground mt-1">נסגרו</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setStatusFilter("LOST")}>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-destructive">{stats.LOST}</div>
            <div className="text-sm text-muted-foreground mt-1">אבדו</div>
          </CardContent>
        </Card>
      </div>

      {/* הוספת ליד */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            הוספת ליד חדש
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name">שם מלא *</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="שם הליד" required />
              </div>
              <div>
                <Label htmlFor="phone">טלפון</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="050-1234567" />
              </div>
              <div>
                <Label htmlFor="email">מייל</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="source">מקור</Label>
                <Input id="source" value={source} onChange={(e) => setSource(e.target.value)} placeholder="פייסבוק, באפי, אתר..." />
              </div>
              <div>
                <Label htmlFor="premium">פרמיה משוערת (₪)</Label>
                <Input id="premium" type="number" value={estimatedPremium} onChange={(e) => setEstimatedPremium(e.target.value)} placeholder="5000" />
              </div>
              <div>
                <Label htmlFor="next-date">תאריך פעולה הבאה</Label>
                <Input id="next-date" type="date" value={nextActionDate} onChange={(e) => setNextActionDate(e.target.value)} />
              </div>
            </div>
            <div>
              <Label htmlFor="next-notes">הערות / פעולה הבאה</Label>
              <Input id="next-notes" value={nextActionNotes} onChange={(e) => setNextActionNotes(e.target.value)} placeholder="התקשר ביום חמישי בבוקר" />
            </div>
            <Button type="submit" className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              שמור ליד חדש
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* חיפוש וסינון */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="חיפוש לפי שם, טלפון, מייל או מקור..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="כל הסטטוסים" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">כל הסטטוסים</SelectItem>
                <SelectItem value="NEW">חדש</SelectItem>
                <SelectItem value="CONTACTED">נוצר קשר</SelectItem>
                <SelectItem value="QUOTED">נשלחה הצעה</SelectItem>
                <SelectItem value="WON">נסגר (הצלחה)</SelectItem>
                <SelectItem value="LOST">אבד</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* טבלת לידים */}
      <Card>
        <CardHeader>
          <CardTitle>רשימת לידים ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>שם</TableHead>
                <TableHead>טלפון</TableHead>
                <TableHead>מייל</TableHead>
                <TableHead>מקור</TableHead>
                <TableHead>פרמיה משוערת</TableHead>
                <TableHead>פעולה הבאה</TableHead>
                <TableHead>סטטוס</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>
                    {lead.phone ? (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        {lead.phone}
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {lead.email ? (
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        {lead.email}
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>{lead.source || "-"}</TableCell>
                  <TableCell className="font-bold">
                    {lead.estimatedAnnualPremium ? `₪${lead.estimatedAnnualPremium.toLocaleString()}` : "-"}
                  </TableCell>
                  <TableCell>
                    {lead.nextActionDate && (
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {lead.nextActionDate}
                        </div>
                        {lead.nextActionNotes && (
                          <div className="text-xs mt-1">{lead.nextActionNotes}</div>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Select value={lead.status} onValueChange={(v: LeadStatus) => updateLeadStatus(lead.id, v)}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NEW">חדש</SelectItem>
                        <SelectItem value="CONTACTED">נוצר קשר</SelectItem>
                        <SelectItem value="QUOTED">נשלחה הצעה</SelectItem>
                        <SelectItem value="WON">נסגר</SelectItem>
                        <SelectItem value="LOST">אבד</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8">לא נמצאו לידים לפי הסינון הנוכחי</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Leads;
