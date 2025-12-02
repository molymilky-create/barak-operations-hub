import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Search, FileText, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type ClaimStatus = "OPENED" | "IN_PROGRESS" | "SENT_TO_COMPANY" | "PAID" | "CLOSED";

const statusLabels: Record<ClaimStatus, string> = {
  OPENED: "נפתחה",
  IN_PROGRESS: "בטיפול",
  SENT_TO_COMPANY: "הועברה לחברה",
  PAID: "שולמו תגמולים",
  CLOSED: "נסגרה",
};

const statusColors: Record<ClaimStatus, "default" | "secondary" | "destructive" | "outline"> = {
  OPENED: "destructive",
  IN_PROGRESS: "default",
  SENT_TO_COMPANY: "secondary",
  PAID: "outline",
  CLOSED: "outline",
};

interface Claim {
  id: string;
  client_id: string;
  policy_id: string | null;
  claim_type: string;
  status: ClaimStatus;
  event_date: string;
  report_date: string;
  last_update_date: string | null;
  estimated_amount: number | null;
  paid_amount: number | null;
  notes: string | null;
  created_at: string;
}

interface Client {
  id: string;
  name: string;
}

export default function Claims() {
  const { user, isAdmin } = useAuth();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    client_id: "",
    policy_id: "",
    claim_type: "",
    event_date: "",
    report_date: new Date().toISOString().split("T")[0],
    estimated_amount: "",
    notes: "",
  });

  useEffect(() => {
    fetchClaims();
    fetchClients();
  }, []);

  const fetchClaims = async () => {
    try {
      const { data, error } = await supabase
        .from("claims")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setClaims(data || []);
    } catch (error) {
      console.error("Error fetching claims:", error);
      toast.error("שגיאה בטעינת תביעות");
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("id, name")
        .order("name");

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.client_id || !formData.claim_type || !formData.event_date) {
      toast.error("יש למלא את כל השדות החובה");
      return;
    }

    try {
      const { error } = await supabase.from("claims").insert({
        client_id: formData.client_id,
        policy_id: formData.policy_id || null,
        claim_type: formData.claim_type,
        event_date: formData.event_date,
        report_date: formData.report_date,
        estimated_amount: formData.estimated_amount ? parseFloat(formData.estimated_amount) : null,
        notes: formData.notes || null,
        status: "OPENED",
      });

      if (error) throw error;

      toast.success("תביעה נוספה בהצלחה");
      setDialogOpen(false);
      setFormData({
        client_id: "",
        policy_id: "",
        claim_type: "",
        event_date: "",
        report_date: new Date().toISOString().split("T")[0],
        estimated_amount: "",
        notes: "",
      });
      fetchClaims();
    } catch (error) {
      console.error("Error creating claim:", error);
      toast.error("שגיאה ביצירת תביעה");
    }
  };

  const updateClaimStatus = async (claimId: string, newStatus: ClaimStatus) => {
    try {
      const { error } = await supabase
        .from("claims")
        .update({ 
          status: newStatus,
          last_update_date: new Date().toISOString().split("T")[0]
        })
        .eq("id", claimId);

      if (error) throw error;

      toast.success("סטטוס התביעה עודכן");
      fetchClaims();
    } catch (error) {
      console.error("Error updating claim:", error);
      toast.error("שגיאה בעדכון סטטוס");
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client?.name || "לא ידוע";
  };

  const filtered = claims.filter((claim) => {
    const matchesSearch = getClientName(claim.client_id).includes(searchQuery);
    const matchesStatus = statusFilter === "all" || claim.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              נדרשת התחברות
            </CardTitle>
            <CardDescription>עליך להתחבר כדי לצפות בתביעות</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ניהול תביעות</h1>
          <p className="text-muted-foreground mt-1">מעקב וניהול תביעות ביטוח</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 ml-2" />
              תביעה חדשה
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>פתיחת תביעה חדשה</DialogTitle>
              <DialogDescription>הזן את פרטי התביעה</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>לקוח *</Label>
                  <Select value={formData.client_id} onValueChange={(v) => setFormData({ ...formData, client_id: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="בחר לקוח" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>סוג תביעה *</Label>
                  <Select value={formData.claim_type} onValueChange={(v) => setFormData({ ...formData, claim_type: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="בחר סוג" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="צד ג'">צד ג'</SelectItem>
                      <SelectItem value="רכוש">רכוש</SelectItem>
                      <SelectItem value="חוות סוסים">חוות סוסים</SelectItem>
                      <SelectItem value="חיים">חיים</SelectItem>
                      <SelectItem value="אחר">אחר</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>תאריך אירוע *</Label>
                  <Input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>תאריך דיווח</Label>
                  <Input
                    type="date"
                    value={formData.report_date}
                    onChange={(e) => setFormData({ ...formData, report_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>סכום משוער (₪)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.estimated_amount}
                  onChange={(e) => setFormData({ ...formData, estimated_amount: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>הערות</Label>
                <Textarea
                  placeholder="תיאור התביעה, נסיבות, מסמכים נדרשים..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  ביטול
                </Button>
                <Button type="submit">פתח תביעה</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            חיפוש ופילטור
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>חיפוש לפי לקוח</Label>
              <Input
                placeholder="הקלד שם לקוח..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>סטטוס</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">הכל</SelectItem>
                  <SelectItem value="OPENED">נפתחה</SelectItem>
                  <SelectItem value="IN_PROGRESS">בטיפול</SelectItem>
                  <SelectItem value="SENT_TO_COMPANY">הועברה לחברה</SelectItem>
                  <SelectItem value="PAID">שולמו תגמולים</SelectItem>
                  <SelectItem value="CLOSED">נסגרה</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            רשימת תביעות ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">טוען...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">אין תביעות להצגה</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>לקוח</TableHead>
                  <TableHead>סוג</TableHead>
                  <TableHead>תאריך אירוע</TableHead>
                  <TableHead>סכום משוער</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead>עדכון אחרון</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell className="font-medium">{getClientName(claim.client_id)}</TableCell>
                    <TableCell>{claim.claim_type}</TableCell>
                    <TableCell>{new Date(claim.event_date).toLocaleDateString("he-IL")}</TableCell>
                    <TableCell>
                      {claim.estimated_amount ? `₪${claim.estimated_amount.toLocaleString()}` : "-"}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={claim.status}
                        onValueChange={(v) => updateClaimStatus(claim.id, v as ClaimStatus)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <Badge variant={statusColors[claim.status]}>{statusLabels[claim.status]}</Badge>
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(statusLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {claim.last_update_date
                        ? new Date(claim.last_update_date).toLocaleDateString("he-IL")
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
