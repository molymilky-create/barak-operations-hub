import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Plus, Trash2, Save, Zap, Filter, Play, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

type TriggerType = "LEAD_CREATED" | "LEAD_STATUS_CHANGED" | "TASK_CREATED" | "TASK_OVERDUE" | "TASK_STATUS_CHANGED" | "RENEWAL_DUE" | "COLLECTION_DUE" | "CLAIM_CREATED" | "CLAIM_STATUS_CHANGED" | "SCHEDULE";
type ActionType = "CREATE_TASK" | "UPDATE_STATUS" | "SEND_EMAIL" | "SEND_SMS" | "ADD_NOTE" | "ASSIGN_USER" | "CREATE_REMINDER";

interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
  logic_operator: string;
}

interface Action {
  id: string;
  action_type: ActionType;
  action_config: Record<string, string>;
}

const triggerOptions: { value: TriggerType; label: string; description: string }[] = [
  { value: "LEAD_CREATED", label: "ליד חדש נוצר", description: "מופעל כשנוצר ליד חדש במערכת" },
  { value: "LEAD_STATUS_CHANGED", label: "סטטוס ליד השתנה", description: "מופעל כשסטטוס של ליד משתנה" },
  { value: "TASK_CREATED", label: "משימה חדשה נוצרה", description: "מופעל כשנוצרת משימה חדשה" },
  { value: "TASK_OVERDUE", label: "משימה באיחור", description: "מופעל כשמשימה עוברת את תאריך היעד" },
  { value: "TASK_STATUS_CHANGED", label: "סטטוס משימה השתנה", description: "מופעל כשסטטוס משימה משתנה" },
  { value: "RENEWAL_DUE", label: "חידוש מתקרב", description: "מופעל כשחידוש פוליסה מתקרב" },
  { value: "COLLECTION_DUE", label: "גבייה מתקרבת", description: "מופעל כשתאריך גבייה מתקרב" },
  { value: "CLAIM_CREATED", label: "תביעה חדשה נוצרה", description: "מופעל כשנפתחת תביעה חדשה" },
  { value: "CLAIM_STATUS_CHANGED", label: "סטטוס תביעה השתנה", description: "מופעל כשסטטוס תביעה משתנה" },
  { value: "SCHEDULE", label: "תזמון קבוע", description: "מופעל בזמנים קבועים (יומי/שבועי)" },
];

const actionOptions: { value: ActionType; label: string; description: string }[] = [
  { value: "CREATE_TASK", label: "צור משימה", description: "יצירת משימה חדשה במערכת" },
  { value: "UPDATE_STATUS", label: "עדכן סטטוס", description: "עדכון סטטוס של הפריט" },
  { value: "SEND_EMAIL", label: "שלח מייל", description: "שליחת התראה במייל" },
  { value: "SEND_SMS", label: "שלח SMS", description: "שליחת הודעת SMS" },
  { value: "ADD_NOTE", label: "הוסף הערה", description: "הוספת הערה לפריט" },
  { value: "ASSIGN_USER", label: "הקצה לעובד", description: "הקצאת הפריט לעובד" },
  { value: "CREATE_REMINDER", label: "צור תזכורת", description: "יצירת תזכורת עתידית" },
];

const operatorOptions = [
  { value: "=", label: "שווה ל" },
  { value: "!=", label: "שונה מ" },
  { value: ">", label: "גדול מ" },
  { value: "<", label: "קטן מ" },
  { value: "contains", label: "מכיל" },
];

const fieldOptions: Record<string, { value: string; label: string }[]> = {
  LEAD_CREATED: [
    { value: "source", label: "מקור" },
    { value: "field", label: "תחום" },
    { value: "estimated_annual_premium", label: "פרמיה משוערת" },
  ],
  LEAD_STATUS_CHANGED: [
    { value: "status", label: "סטטוס" },
    { value: "source", label: "מקור" },
  ],
  TASK_CREATED: [
    { value: "kind", label: "סוג משימה" },
    { value: "priority", label: "עדיפות" },
  ],
  TASK_OVERDUE: [
    { value: "priority", label: "עדיפות" },
    { value: "kind", label: "סוג משימה" },
  ],
  TASK_STATUS_CHANGED: [
    { value: "status", label: "סטטוס" },
    { value: "kind", label: "סוג משימה" },
  ],
  RENEWAL_DUE: [
    { value: "days_until", label: "ימים עד חידוש" },
    { value: "previous_premium", label: "פרמיה קודמת" },
  ],
  COLLECTION_DUE: [
    { value: "amount", label: "סכום" },
    { value: "days_overdue", label: "ימים באיחור" },
  ],
  CLAIM_CREATED: [
    { value: "claim_type", label: "סוג תביעה" },
    { value: "estimated_amount", label: "סכום משוער" },
  ],
  CLAIM_STATUS_CHANGED: [
    { value: "status", label: "סטטוס" },
    { value: "claim_type", label: "סוג תביעה" },
  ],
  SCHEDULE: [
    { value: "day_of_week", label: "יום בשבוע" },
    { value: "time", label: "שעה" },
  ],
};

const WorkflowBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEditing = Boolean(id);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [triggerType, setTriggerType] = useState<TriggerType | "">("");
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [actions, setActions] = useState<Action[]>([]);

  useEffect(() => {
    if (isEditing && id) {
      loadWorkflow(id);
    }
  }, [id]);

  const loadWorkflow = async (workflowId: string) => {
    setLoading(true);
    try {
      const { data: workflow, error: wError } = await supabase
        .from("workflows")
        .select("*")
        .eq("id", workflowId)
        .single();

      if (wError) throw wError;

      setName(workflow.name);
      setDescription(workflow.description || "");
      setTriggerType(workflow.trigger_type as TriggerType);

      const { data: conditionsData } = await supabase
        .from("workflow_conditions")
        .select("*")
        .eq("workflow_id", workflowId)
        .order("sort_order");

      if (conditionsData) {
        setConditions(conditionsData.map(c => ({
          id: c.id,
          field: c.field,
          operator: c.operator,
          value: c.value,
          logic_operator: c.logic_operator || "AND",
        })));
      }

      const { data: actionsData } = await supabase
        .from("workflow_actions")
        .select("*")
        .eq("workflow_id", workflowId)
        .order("sort_order");

      if (actionsData) {
        setActions(actionsData.map(a => ({
          id: a.id,
          action_type: a.action_type as ActionType,
          action_config: a.action_config as Record<string, string>,
        })));
      }
    } catch (error) {
      console.error(error);
      toast.error("שגיאה בטעינת התהליך");
    }
    setLoading(false);
  };

  const addCondition = () => {
    setConditions([...conditions, {
      id: crypto.randomUUID(),
      field: "",
      operator: "=",
      value: "",
      logic_operator: "AND",
    }]);
  };

  const updateCondition = (id: string, updates: Partial<Condition>) => {
    setConditions(conditions.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  const addAction = () => {
    setActions([...actions, {
      id: crypto.randomUUID(),
      action_type: "CREATE_TASK",
      action_config: {},
    }]);
  };

  const updateAction = (id: string, updates: Partial<Action>) => {
    setActions(actions.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const removeAction = (id: string) => {
    setActions(actions.filter(a => a.id !== id));
  };

  const saveWorkflow = async (status: "DRAFT" | "ACTIVE" = "DRAFT") => {
    if (!name || !triggerType) {
      toast.error("נא למלא שם וטריגר");
      return;
    }

    if (actions.length === 0) {
      toast.error("נא להוסיף לפחות פעולה אחת");
      return;
    }

    setSaving(true);
    try {
      let workflowId = id;

      if (isEditing && id) {
        const { error } = await supabase
          .from("workflows")
          .update({
            name,
            description,
            trigger_type: triggerType,
            status,
          })
          .eq("id", id);
        if (error) throw error;

        // Delete existing conditions and actions
        await supabase.from("workflow_conditions").delete().eq("workflow_id", id);
        await supabase.from("workflow_actions").delete().eq("workflow_id", id);
      } else {
        const { data, error } = await supabase
          .from("workflows")
          .insert({
            name,
            description,
            trigger_type: triggerType,
            status,
            created_by_user_id: user?.id,
          })
          .select()
          .single();
        if (error) throw error;
        workflowId = data.id;
      }

      // Insert conditions
      if (conditions.length > 0 && workflowId) {
        const { error: condError } = await supabase.from("workflow_conditions").insert(
          conditions.map((c, idx) => ({
            workflow_id: workflowId,
            field: c.field,
            operator: c.operator,
            value: c.value,
            logic_operator: c.logic_operator,
            sort_order: idx,
          }))
        );
        if (condError) throw condError;
      }

      // Insert actions
      if (workflowId) {
        const { error: actError } = await supabase.from("workflow_actions").insert(
          actions.map((a, idx) => ({
            workflow_id: workflowId,
            action_type: a.action_type,
            action_config: a.action_config,
            sort_order: idx,
          }))
        );
        if (actError) throw actError;
      }

      toast.success(status === "ACTIVE" ? "התהליך נשמר והופעל!" : "התהליך נשמר כטיוטה");
      navigate("/workflows");
    } catch (error) {
      console.error(error);
      toast.error("שגיאה בשמירת התהליך");
    }
    setSaving(false);
  };

  const steps = [
    { num: 1, title: "טריגר", icon: Zap },
    { num: 2, title: "תנאים", icon: Filter },
    { num: 3, title: "פעולות", icon: Play },
    { num: 4, title: "סיכום", icon: CheckCircle },
  ];

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p>טוען...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/workflows")}>
          <ArrowRight className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{isEditing ? "עריכת תהליך" : "יצירת תהליך חדש"}</h1>
          <p className="text-muted-foreground">בנה תהליך אוטומטי עם טריגרים, תנאים ופעולות</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2">
        {steps.map((s, idx) => (
          <React.Fragment key={s.num}>
            <button
              onClick={() => setStep(s.num)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                step === s.num 
                  ? "bg-primary text-primary-foreground" 
                  : step > s.num 
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              <s.icon className="h-4 w-4" />
              <span className="font-medium">{s.title}</span>
            </button>
            {idx < steps.length - 1 && <div className="w-8 h-0.5 bg-muted" />}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="pt-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">שם התהליך *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="לדוגמה: מעקב אחרי לידים חדשים"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">תיאור</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="תיאור קצר של התהליך..."
                />
              </div>
              <Separator />
              <div className="space-y-4">
                <Label>בחר טריגר - מתי התהליך יופעל? *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {triggerOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setTriggerType(opt.value)}
                      className={`p-4 rounded-lg border text-right transition-colors ${
                        triggerType === opt.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <p className="font-medium">{opt.label}</p>
                      <p className="text-sm text-muted-foreground">{opt.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">תנאים (אופציונלי)</h3>
                  <p className="text-sm text-muted-foreground">הגדר תנאים שבהם התהליך יופעל</p>
                </div>
                <Button variant="outline" onClick={addCondition} className="gap-2">
                  <Plus className="h-4 w-4" />
                  הוסף תנאי
                </Button>
              </div>

              {conditions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>אין תנאים - התהליך יופעל תמיד כשהטריגר קורה</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {conditions.map((cond, idx) => (
                    <div key={cond.id} className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                      {idx > 0 && (
                        <Select
                          value={cond.logic_operator}
                          onValueChange={(v) => updateCondition(cond.id, { logic_operator: v })}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AND">וגם</SelectItem>
                            <SelectItem value="OR">או</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      <Select
                        value={cond.field}
                        onValueChange={(v) => updateCondition(cond.id, { field: v })}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="בחר שדה" />
                        </SelectTrigger>
                        <SelectContent>
                          {(fieldOptions[triggerType as TriggerType] || []).map((f) => (
                            <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={cond.operator}
                        onValueChange={(v) => updateCondition(cond.id, { operator: v })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {operatorOptions.map((op) => (
                            <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        value={cond.value}
                        onChange={(e) => updateCondition(cond.id, { value: e.target.value })}
                        placeholder="ערך"
                        className="flex-1"
                      />
                      <Button variant="ghost" size="sm" onClick={() => removeCondition(cond.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">פעולות *</h3>
                  <p className="text-sm text-muted-foreground">הגדר מה יקרה כשהתהליך מופעל</p>
                </div>
                <Button variant="outline" onClick={addAction} className="gap-2">
                  <Plus className="h-4 w-4" />
                  הוסף פעולה
                </Button>
              </div>

              {actions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>נא להוסיף לפחות פעולה אחת</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {actions.map((action, idx) => (
                    <Card key={action.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">פעולה {idx + 1}</CardTitle>
                          <Button variant="ghost" size="sm" onClick={() => removeAction(action.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Select
                          value={action.action_type}
                          onValueChange={(v) => updateAction(action.id, { action_type: v as ActionType })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="בחר סוג פעולה" />
                          </SelectTrigger>
                          <SelectContent>
                            {actionOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label} - {opt.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {action.action_type === "CREATE_TASK" && (
                          <div className="space-y-3">
                            <Input
                              placeholder="כותרת המשימה"
                              value={action.action_config.title || ""}
                              onChange={(e) => updateAction(action.id, { 
                                action_config: { ...action.action_config, title: e.target.value }
                              })}
                            />
                            <Select
                              value={action.action_config.priority || "NORMAL"}
                              onValueChange={(v) => updateAction(action.id, {
                                action_config: { ...action.action_config, priority: v }
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="עדיפות" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="LOW">נמוכה</SelectItem>
                                <SelectItem value="NORMAL">רגילה</SelectItem>
                                <SelectItem value="HIGH">גבוהה</SelectItem>
                                <SelectItem value="CRITICAL">קריטית</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {action.action_type === "SEND_EMAIL" && (
                          <div className="space-y-3">
                            <Input
                              placeholder="נושא המייל"
                              value={action.action_config.subject || ""}
                              onChange={(e) => updateAction(action.id, {
                                action_config: { ...action.action_config, subject: e.target.value }
                              })}
                            />
                            <Textarea
                              placeholder="תוכן המייל"
                              value={action.action_config.body || ""}
                              onChange={(e) => updateAction(action.id, {
                                action_config: { ...action.action_config, body: e.target.value }
                              })}
                            />
                          </div>
                        )}

                        {action.action_type === "ADD_NOTE" && (
                          <Textarea
                            placeholder="תוכן ההערה"
                            value={action.action_config.note || ""}
                            onChange={(e) => updateAction(action.id, {
                              action_config: { ...action.action_config, note: e.target.value }
                            })}
                          />
                        )}

                        {action.action_type === "UPDATE_STATUS" && (
                          <Input
                            placeholder="סטטוס חדש"
                            value={action.action_config.new_status || ""}
                            onChange={(e) => updateAction(action.id, {
                              action_config: { ...action.action_config, new_status: e.target.value }
                            })}
                          />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">סיכום התהליך</h3>
              
              <div className="grid gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">שם התהליך</p>
                  <p className="font-medium">{name || "לא הוזן"}</p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">טריגר</p>
                  <Badge variant="outline" className="mt-1">
                    {triggerOptions.find(t => t.value === triggerType)?.label || "לא נבחר"}
                  </Badge>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">תנאים</p>
                  {conditions.length === 0 ? (
                    <p className="text-sm">ללא תנאים - יופעל תמיד</p>
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {conditions.map((c, idx) => (
                        <Badge key={c.id} variant="secondary">
                          {idx > 0 && `${c.logic_operator} `}
                          {c.field} {c.operator} {c.value}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">פעולות ({actions.length})</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {actions.map((a) => (
                      <Badge key={a.id}>
                        {actionOptions.find(o => o.value === a.action_type)?.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
        >
          הקודם
        </Button>
        
        <div className="flex items-center gap-2">
          {step === 4 ? (
            <>
              <Button variant="outline" onClick={() => saveWorkflow("DRAFT")} disabled={saving}>
                <Save className="h-4 w-4 ml-2" />
                שמור כטיוטה
              </Button>
              <Button onClick={() => saveWorkflow("ACTIVE")} disabled={saving}>
                <Play className="h-4 w-4 ml-2" />
                שמור והפעל
              </Button>
            </>
          ) : (
            <Button onClick={() => setStep(Math.min(4, step + 1))}>
              הבא
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilder;
