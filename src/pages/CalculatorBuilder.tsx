import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2, AlertCircle, Save, Play } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

type ProductType = "FARM" | "HORSE" | "INSTRUCTOR" | "TRAINER" | "VEHICLE" | "LIFE" | "OTHER";
type InsuranceCompany = "MENORA" | "HACHSHARA" | "OTHER";

interface Field {
  id: string;
  field_name: string;
  field_label: string;
  field_type: "number" | "text" | "select" | "boolean" | "date";
  is_required: boolean;
  placeholder?: string;
  options?: string[];
  sort_order: number;
}

interface Rule {
  id: string;
  condition_field: string;
  condition_operator: "=" | ">" | "<" | ">=" | "<=" | "contains";
  condition_value: string;
  action_type: "add_amount" | "multiply_percent" | "discount_percent" | "set_minimum" | "set_maximum";
  action_value: number;
  sort_order: number;
}

export default function CalculatorBuilder() {
  const { user, isAdmin } = useAuth();
  const [currentTab, setCurrentTab] = useState("1");

  // Step 1: General definition
  const [calcName, setCalcName] = useState("");
  const [calcDescription, setCalcDescription] = useState("");
  const [calcField, setCalcField] = useState<ProductType>("HORSE");
  const [calcCompany, setCalcCompany] = useState<InsuranceCompany>("MENORA");
  const [resultLabel, setResultLabel] = useState("פרמיה שנתית");
  const [warningText, setWarningText] = useState("החישוב הוא משוער בלבד ותלוי בחיתום הפוליסה");

  // Step 2: Fields
  const [fields, setFields] = useState<Field[]>([]);
  const [newField, setNewField] = useState({
    field_name: "",
    field_label: "",
    field_type: "number" as Field["field_type"],
    is_required: true,
    placeholder: "",
    options: "",
  });

  // Step 3: Rules
  const [rules, setRules] = useState<Rule[]>([]);
  const [newRule, setNewRule] = useState({
    condition_field: "",
    condition_operator: "=" as Rule["condition_operator"],
    condition_value: "",
    action_type: "add_amount" as Rule["action_type"],
    action_value: "",
  });

  // Step 5: Test
  const [testValues, setTestValues] = useState<Record<string, any>>({});
  const [testResult, setTestResult] = useState<number | null>(null);

  if (!user || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              גישה למנהלים בלבד
            </CardTitle>
            <CardDescription>רק מנהלים יכולים ליצור מחשבונים חדשים</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const addField = () => {
    if (!newField.field_name || !newField.field_label) {
      toast.error("יש למלא שם ותווית לשדה");
      return;
    }

    const field: Field = {
      id: crypto.randomUUID(),
      field_name: newField.field_name,
      field_label: newField.field_label,
      field_type: newField.field_type,
      is_required: newField.is_required,
      placeholder: newField.placeholder || undefined,
      options: newField.field_type === "select" ? newField.options.split(",").map((o) => o.trim()) : undefined,
      sort_order: fields.length,
    };

    setFields([...fields, field]);
    setNewField({
      field_name: "",
      field_label: "",
      field_type: "number",
      is_required: true,
      placeholder: "",
      options: "",
    });
    toast.success("שדה נוסף");
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const addRule = () => {
    if (!newRule.condition_field || !newRule.condition_value || !newRule.action_value) {
      toast.error("יש למלא את כל שדות החוק");
      return;
    }

    const rule: Rule = {
      id: crypto.randomUUID(),
      condition_field: newRule.condition_field,
      condition_operator: newRule.condition_operator,
      condition_value: newRule.condition_value,
      action_type: newRule.action_type,
      action_value: parseFloat(newRule.action_value),
      sort_order: rules.length,
    };

    setRules([...rules, rule]);
    setNewRule({
      condition_field: "",
      condition_operator: "=",
      condition_value: "",
      action_type: "add_amount",
      action_value: "",
    });
    toast.success("חוק נוסף");
  };

  const removeRule = (id: string) => {
    setRules(rules.filter((r) => r.id !== id));
  };

  const runTest = () => {
    let result = 0;

    rules.forEach((rule) => {
      const fieldValue = testValues[rule.condition_field];
      let conditionMet = false;

      switch (rule.condition_operator) {
        case "=":
          conditionMet = String(fieldValue) === rule.condition_value;
          break;
        case ">":
          conditionMet = parseFloat(fieldValue) > parseFloat(rule.condition_value);
          break;
        case "<":
          conditionMet = parseFloat(fieldValue) < parseFloat(rule.condition_value);
          break;
        case ">=":
          conditionMet = parseFloat(fieldValue) >= parseFloat(rule.condition_value);
          break;
        case "<=":
          conditionMet = parseFloat(fieldValue) <= parseFloat(rule.condition_value);
          break;
        case "contains":
          conditionMet = String(fieldValue).includes(rule.condition_value);
          break;
      }

      if (conditionMet) {
        switch (rule.action_type) {
          case "add_amount":
            result += rule.action_value;
            break;
          case "multiply_percent":
            const baseValue = parseFloat(testValues[rule.condition_field]) || 0;
            result += (baseValue * rule.action_value) / 100;
            break;
          case "discount_percent":
            result = result * (1 - rule.action_value / 100);
            break;
          case "set_minimum":
            result = Math.max(result, rule.action_value);
            break;
          case "set_maximum":
            result = Math.min(result, rule.action_value);
            break;
        }
      }
    });

    setTestResult(result);
    toast.success(`תוצאת חישוב: ₪${result.toLocaleString()}`);
  };

  const saveCalculator = async () => {
    if (!calcName || fields.length === 0) {
      toast.error("יש למלא שם ולהוסיף לפחות שדה אחד");
      return;
    }

    try {
      // Insert calculator
      const { data: calculator, error: calcError } = await supabase
        .from("calculators")
        .insert({
          name: calcName,
          description: calcDescription,
          field: calcField,
          company: calcCompany,
          product_type: calcField,
          result_label: resultLabel,
          warning_text: warningText,
        })
        .select()
        .single();

      if (calcError) throw calcError;

      // Insert fields
      const fieldsToInsert = fields.map((f) => ({
        calculator_id: calculator.id,
        field_name: f.field_name,
        field_label: f.field_label,
        field_type: f.field_type,
        is_required: f.is_required,
        placeholder: f.placeholder,
        options: f.options,
        sort_order: f.sort_order,
      }));

      const { error: fieldsError } = await supabase.from("calculator_fields").insert(fieldsToInsert);
      if (fieldsError) throw fieldsError;

      // Insert rules
      if (rules.length > 0) {
        const rulesToInsert = rules.map((r) => ({
          calculator_id: calculator.id,
          condition_field: r.condition_field,
          condition_operator: r.condition_operator,
          condition_value: r.condition_value,
          action_type: r.action_type,
          action_value: r.action_value,
          sort_order: r.sort_order,
        }));

        const { error: rulesError } = await supabase.from("calculator_rules").insert(rulesToInsert);
        if (rulesError) throw rulesError;
      }

      toast.success("המחשבון נשמר בהצלחה!");
    } catch (error) {
      console.error("Error saving calculator:", error);
      toast.error("שגיאה בשמירת המחשבון");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">בונה מחשבונים</h1>
        <p className="text-muted-foreground mt-1">צור מחשבוני פרמיה מותאמים אישית ללא קוד</p>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} dir="rtl">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="1">1. הגדרה כללית</TabsTrigger>
          <TabsTrigger value="2">2. שדות קלט</TabsTrigger>
          <TabsTrigger value="3">3. חוקי חישוב</TabsTrigger>
          <TabsTrigger value="4">4. תצוגת תוצאה</TabsTrigger>
          <TabsTrigger value="5">5. בדיקה ושמירה</TabsTrigger>
        </TabsList>

        <TabsContent value="1" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>הגדרה כללית</CardTitle>
              <CardDescription>הגדר את המאפיינים הבסיסיים של המחשבון</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>שם המחשבון *</Label>
                <Input
                  placeholder="לדוגמה: ביטוח סוסים מנורה"
                  value={calcName}
                  onChange={(e) => setCalcName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>תיאור</Label>
                <Textarea
                  placeholder="תיאור קצר של המחשבון..."
                  value={calcDescription}
                  onChange={(e) => setCalcDescription(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ענף ביטוח</Label>
                  <Select value={calcField} onValueChange={(v) => setCalcField(v as ProductType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HORSE">סוסים</SelectItem>
                      <SelectItem value="FARM">חוות</SelectItem>
                      <SelectItem value="INSTRUCTOR">מדריכי רכיבה</SelectItem>
                      <SelectItem value="TRAINER">מאלפים</SelectItem>
                      <SelectItem value="VEHICLE">רכב</SelectItem>
                      <SelectItem value="LIFE">חיים</SelectItem>
                      <SelectItem value="OTHER">אחר</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>חברת ביטוח</Label>
                  <Select value={calcCompany} onValueChange={(v) => setCalcCompany(v as InsuranceCompany)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MENORA">מנורה</SelectItem>
                      <SelectItem value="HACHSHARA">הכשרה</SelectItem>
                      <SelectItem value="OTHER">אחר</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="2" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>שדות קלט</CardTitle>
              <CardDescription>הגדר את השדות שהמשתמש ימלא במחשבון</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>שם שדה (באנגלית) *</Label>
                  <Input
                    placeholder="horse_value"
                    value={newField.field_name}
                    onChange={(e) => setNewField({ ...newField, field_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>תווית (בעברית) *</Label>
                  <Input
                    placeholder="ערך הסוס"
                    value={newField.field_label}
                    onChange={(e) => setNewField({ ...newField, field_label: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>סוג שדה</Label>
                  <Select
                    value={newField.field_type}
                    onValueChange={(v) => setNewField({ ...newField, field_type: v as Field["field_type"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="number">מספר</SelectItem>
                      <SelectItem value="text">טקסט</SelectItem>
                      <SelectItem value="select">בחירה</SelectItem>
                      <SelectItem value="boolean">כן/לא</SelectItem>
                      <SelectItem value="date">תאריך</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Placeholder</Label>
                  <Input
                    placeholder="טקסט עזר"
                    value={newField.placeholder}
                    onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                  />
                </div>
                <div className="space-y-2 flex items-end">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={newField.is_required}
                      onCheckedChange={(checked) => setNewField({ ...newField, is_required: checked })}
                    />
                    <Label>חובה</Label>
                  </div>
                </div>
              </div>
              {newField.field_type === "select" && (
                <div className="space-y-2">
                  <Label>אפשרויות (מופרד בפסיקים)</Label>
                  <Input
                    placeholder="פנאי, תחרות, מקצועי"
                    value={newField.options}
                    onChange={(e) => setNewField({ ...newField, options: e.target.value })}
                  />
                </div>
              )}
              <Button onClick={addField} className="w-full">
                <Plus className="h-4 w-4 ml-2" />
                הוסף שדה
              </Button>

              {fields.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>תווית</TableHead>
                      <TableHead>שם</TableHead>
                      <TableHead>סוג</TableHead>
                      <TableHead>חובה</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field) => (
                      <TableRow key={field.id}>
                        <TableCell>{field.field_label}</TableCell>
                        <TableCell className="font-mono text-sm">{field.field_name}</TableCell>
                        <TableCell>{field.field_type}</TableCell>
                        <TableCell>{field.is_required ? "✓" : ""}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => removeField(field.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="3" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>חוקי חישוב</CardTitle>
              <CardDescription>הגדר את הלוגיקה העסקית של החישוב</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>שדה</Label>
                  <Select
                    value={newRule.condition_field}
                    onValueChange={(v) => setNewRule({ ...newRule, condition_field: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="בחר שדה" />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.map((f) => (
                        <SelectItem key={f.id} value={f.field_name}>
                          {f.field_label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>תנאי</Label>
                  <Select
                    value={newRule.condition_operator}
                    onValueChange={(v) => setNewRule({ ...newRule, condition_operator: v as Rule["condition_operator"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="=">=</SelectItem>
                      <SelectItem value=">">{">"}</SelectItem>
                      <SelectItem value="<">{"<"}</SelectItem>
                      <SelectItem value=">=">{">="}</SelectItem>
                      <SelectItem value="<=">{"<="}</SelectItem>
                      <SelectItem value="contains">מכיל</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>ערך</Label>
                <Input
                  placeholder="ערך להשוואה"
                  value={newRule.condition_value}
                  onChange={(e) => setNewRule({ ...newRule, condition_value: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>פעולה</Label>
                  <Select
                    value={newRule.action_type}
                    onValueChange={(v) => setNewRule({ ...newRule, action_type: v as Rule["action_type"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="add_amount">הוסף סכום קבוע</SelectItem>
                      <SelectItem value="multiply_percent">הכפל באחוזים</SelectItem>
                      <SelectItem value="discount_percent">הנחה באחוזים</SelectItem>
                      <SelectItem value="set_minimum">קבע מינימום</SelectItem>
                      <SelectItem value="set_maximum">קבע מקסימום</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>ערך</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newRule.action_value}
                    onChange={(e) => setNewRule({ ...newRule, action_value: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={addRule} className="w-full">
                <Plus className="h-4 w-4 ml-2" />
                הוסף חוק
              </Button>

              {rules.length > 0 && (
                <div className="space-y-2">
                  {rules.map((rule, index) => (
                    <div key={rule.id} className="flex items-center gap-2 p-3 border rounded-lg">
                      <span className="font-bold">#{index + 1}</span>
                      <span>אם</span>
                      <span className="font-medium">{rule.condition_field}</span>
                      <span>{rule.condition_operator}</span>
                      <span className="font-medium">{rule.condition_value}</span>
                      <span>אז</span>
                      <span className="font-medium">{rule.action_type}</span>
                      <span>{rule.action_value}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeRule(rule.id)} className="mr-auto">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="4" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>תצוגת תוצאה</CardTitle>
              <CardDescription>התאם את האופן שבו התוצאה תוצג למשתמש</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>כותרת תוצאה</Label>
                <Input
                  placeholder="פרמיה שנתית"
                  value={resultLabel}
                  onChange={(e) => setResultLabel(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>טקסט אזהרה</Label>
                <Textarea
                  placeholder="טקסט שיוצג מתחת לתוצאה"
                  value={warningText}
                  onChange={(e) => setWarningText(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="5" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>בדיקה ושמירה</CardTitle>
              <CardDescription>בדוק את המחשבון לפני שמירה</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-medium">הזן ערכי ניסיון:</h3>
                {fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label>{field.field_label}</Label>
                    {field.field_type === "select" ? (
                      <Select
                        value={testValues[field.field_name] || ""}
                        onValueChange={(v) => setTestValues({ ...testValues, [field.field_name]: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="בחר" />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : field.field_type === "boolean" ? (
                      <Switch
                        checked={testValues[field.field_name] || false}
                        onCheckedChange={(checked) => setTestValues({ ...testValues, [field.field_name]: checked })}
                      />
                    ) : (
                      <Input
                        type={field.field_type}
                        value={testValues[field.field_name] || ""}
                        onChange={(e) => setTestValues({ ...testValues, [field.field_name]: e.target.value })}
                      />
                    )}
                  </div>
                ))}
              </div>

              <Button onClick={runTest} className="w-full" variant="outline">
                <Play className="h-4 w-4 ml-2" />
                הרץ בדיקה
              </Button>

              {testResult !== null && (
                <div className="p-4 bg-primary/10 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">{resultLabel}</p>
                  <p className="text-3xl font-bold">₪{testResult.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground mt-2">{warningText}</p>
                </div>
              )}

              <Button onClick={saveCalculator} className="w-full" size="lg">
                <Save className="h-4 w-4 ml-2" />
                שמור מחשבון
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
