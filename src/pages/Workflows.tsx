import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Play, Pause, Edit, Trash2, Zap, Clock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

type WorkflowStatus = "ACTIVE" | "INACTIVE" | "DRAFT";
type TriggerType = "LEAD_CREATED" | "LEAD_STATUS_CHANGED" | "TASK_CREATED" | "TASK_OVERDUE" | "TASK_STATUS_CHANGED" | "RENEWAL_DUE" | "COLLECTION_DUE" | "CLAIM_CREATED" | "CLAIM_STATUS_CHANGED" | "SCHEDULE";

interface Workflow {
  id: string;
  name: string;
  description: string | null;
  trigger_type: TriggerType;
  status: WorkflowStatus;
  created_at: string;
  updated_at: string;
}

const triggerLabels: Record<TriggerType, string> = {
  LEAD_CREATED: "ליד חדש נוצר",
  LEAD_STATUS_CHANGED: "סטטוס ליד השתנה",
  TASK_CREATED: "משימה חדשה נוצרה",
  TASK_OVERDUE: "משימה באיחור",
  TASK_STATUS_CHANGED: "סטטוס משימה השתנה",
  RENEWAL_DUE: "חידוש מתקרב",
  COLLECTION_DUE: "גבייה מתקרבת",
  CLAIM_CREATED: "תביעה חדשה נוצרה",
  CLAIM_STATUS_CHANGED: "סטטוס תביעה השתנה",
  SCHEDULE: "תזמון קבוע",
};

const statusLabels: Record<WorkflowStatus, string> = {
  ACTIVE: "פעיל",
  INACTIVE: "מושבת",
  DRAFT: "טיוטה",
};

const Workflows: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("workflows")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("שגיאה בטעינת תהליכים");
      console.error(error);
    } else {
      setWorkflows(data || []);
    }
    setLoading(false);
  };

  const toggleWorkflowStatus = async (workflow: Workflow) => {
    const newStatus: WorkflowStatus = workflow.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const { error } = await supabase
      .from("workflows")
      .update({ status: newStatus })
      .eq("id", workflow.id);

    if (error) {
      toast.error("שגיאה בעדכון סטטוס");
    } else {
      toast.success(newStatus === "ACTIVE" ? "התהליך הופעל" : "התהליך הושבת");
      fetchWorkflows();
    }
  };

  const deleteWorkflow = async (id: string) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק תהליך זה?")) return;
    
    const { error } = await supabase.from("workflows").delete().eq("id", id);
    if (error) {
      toast.error("שגיאה במחיקת תהליך");
    } else {
      toast.success("התהליך נמחק בהצלחה");
      fetchWorkflows();
    }
  };

  const getStatusBadge = (status: WorkflowStatus) => {
    const variants: Record<WorkflowStatus, "default" | "secondary" | "outline"> = {
      ACTIVE: "default",
      INACTIVE: "secondary",
      DRAFT: "outline",
    };
    return <Badge variant={variants[status]}>{statusLabels[status]}</Badge>;
  };

  const filteredWorkflows = statusFilter === "ALL" 
    ? workflows 
    : workflows.filter(w => w.status === statusFilter);

  const stats = {
    total: workflows.length,
    active: workflows.filter(w => w.status === "ACTIVE").length,
    inactive: workflows.filter(w => w.status === "INACTIVE").length,
    draft: workflows.filter(w => w.status === "DRAFT").length,
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">מנוע אוטומציות</h1>
          <p className="text-muted-foreground mt-1">ניהול תהליכים אוטומטיים ו-Workflows</p>
        </div>
        {isAdmin && (
          <Button onClick={() => navigate("/workflow-builder")} className="gap-2">
            <Plus className="h-4 w-4" />
            תהליך חדש
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">סה"כ תהליכים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{stats.total}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">פעילים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Play className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold text-green-600">{stats.active}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">מושבתים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Pause className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-bold">{stats.inactive}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">טיוטות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <span className="text-2xl font-bold text-yellow-600">{stats.draft}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="סנן לפי סטטוס" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">כל התהליכים</SelectItem>
            <SelectItem value="ACTIVE">פעילים</SelectItem>
            <SelectItem value="INACTIVE">מושבתים</SelectItem>
            <SelectItem value="DRAFT">טיוטות</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Workflows Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">שם התהליך</TableHead>
                <TableHead className="text-right">טריגר</TableHead>
                <TableHead className="text-right">סטטוס</TableHead>
                <TableHead className="text-right">עודכן</TableHead>
                <TableHead className="text-right">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    טוען...
                  </TableCell>
                </TableRow>
              ) : filteredWorkflows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {workflows.length === 0 ? (
                      <div className="flex flex-col items-center gap-2">
                        <AlertTriangle className="h-8 w-8" />
                        <p>אין תהליכים עדיין</p>
                        {isAdmin && (
                          <Button variant="outline" onClick={() => navigate("/workflow-builder")}>
                            צור תהליך ראשון
                          </Button>
                        )}
                      </div>
                    ) : (
                      "אין תהליכים התואמים את הסינון"
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredWorkflows.map((workflow) => (
                  <TableRow key={workflow.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{workflow.name}</p>
                        {workflow.description && (
                          <p className="text-sm text-muted-foreground">{workflow.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{triggerLabels[workflow.trigger_type]}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(workflow.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(workflow.updated_at).toLocaleDateString("he-IL")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {isAdmin && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleWorkflowStatus(workflow)}
                              title={workflow.status === "ACTIVE" ? "השבת" : "הפעל"}
                            >
                              {workflow.status === "ACTIVE" ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/workflow-builder/${workflow.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteWorkflow(workflow.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Workflows;
