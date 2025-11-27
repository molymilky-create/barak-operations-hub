import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, CheckCircle, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Certificates = () => {
  const { toast } = useToast();
  const [mode, setMode] = useState<"NORMAL" | "REQUESTOR">("NORMAL");
  const [requestorName, setRequestorName] = useState("");
  const [freeText, setFreeText] = useState("");
  const [codes, setCodes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "אישור קיום נשמר בהצלחה",
      description: "האישור נשמר כטיוטה. בהמשך ניתן יהיה להפיק PDF.",
    });

    // נקה טופס
    setRequestorName("");
    setFreeText("");
    setCodes("");
  };

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">אישורי קיום ביטוח</h1>
          <p className="text-muted-foreground text-lg">
            הפקת אישורי קיום ביטוח למבוטחים ומבקשים
          </p>
        </div>
      </div>

      {/* הסבר */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <FileText className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-2">מה זה אישור קיום?</h3>
              <p className="text-muted-foreground">
                אישור קיום ביטוח הוא מסמך המאשר שקיים ביטוח בתוקף עבור מבוטח מסוים.
                האישור כולל פרטי הכיסוי, קודי תנאי מיוחדים, ופרטי המבקש (אם רלוונטי).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* טופס אישור קיום */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            הפקת אישור קיום חדש
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* מצב אישור */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mode">מצב אישור</Label>
                <Select value={mode} onValueChange={(v: any) => setMode(v)}>
                  <SelectTrigger id="mode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NORMAL">רגיל</SelectItem>
                    <SelectItem value="REQUESTOR">עם מבקש</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {mode === "REQUESTOR" && (
                <div>
                  <Label htmlFor="requestor">שם המבקש *</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="requestor"
                      value={requestorName}
                      onChange={(e) => setRequestorName(e.target.value)}
                      placeholder="שם המבקש"
                      className="pr-10"
                      required={mode === "REQUESTOR"}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* בחירת מבוטח */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client">מבוטח</Label>
                <Select>
                  <SelectTrigger id="client">
                    <SelectValue placeholder="בחר מבוטח" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">דוד כהן</SelectItem>
                    <SelectItem value="2">שרה לוי</SelectItem>
                    <SelectItem value="3">יוסי אברהם</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="policy">פוליסה (אופציונלי)</Label>
                <Select>
                  <SelectTrigger id="policy">
                    <SelectValue placeholder="בחר פוליסה" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="p1">פוליסה 12345 - ביטוח סוסים</SelectItem>
                    <SelectItem value="p2">פוליסה 12346 - ביטוח חווה</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* קודים */}
            <div>
              <Label htmlFor="codes">קודי כיסוי (מופרדים בפסיק)</Label>
              <Input
                id="codes"
                value={codes}
                onChange={(e) => setCodes(e.target.value)}
                placeholder="לדוגמה: 301, 302, 303"
              />
              <p className="text-xs text-muted-foreground mt-2">
                הזן קודי תנאי מיוחדים מופרדים בפסיק
              </p>
            </div>

            {/* טקסט חופשי */}
            <div>
              <Label htmlFor="freetext">הערות / טקסט חופשי</Label>
              <Textarea
                id="freetext"
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder="הזן הערות נוספות או טקסט חופשי לאישור"
                rows={5}
              />
            </div>

            <Button type="submit" className="w-full md:w-auto" size="lg">
              <FileText className="h-4 w-4 mr-2" />
              שמור אישור קיום
            </Button>
          </form>
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
              <span>הפקת PDF אוטומטית של האישור</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>שליחת אישור ישירות למייל</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>היסטוריית אישורים שהופקו</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>תבניות אישורים מותאמות אישית</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Certificates;
