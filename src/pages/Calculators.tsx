import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calculator, User, Dumbbell, Calendar, Home } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const Calculators = () => {
  // מחשבון סוסים
  const [thirdParty, setThirdParty] = useState(true);
  const [usageType, setUsageType] = useState<"pleasure" | "competition">("pleasure");
  const [lifeInsurance, setLifeInsurance] = useState(false);
  const [horseType, setHorseType] = useState<"5" | "6" | "6.5">("5");
  const [horseValue, setHorseValue] = useState("");
  const [includeTheft, setIncludeTheft] = useState(true);
  const [healthInsurance, setHealthInsurance] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const calculateHorseInsurance = () => {
    let total = 0;

    // צד ג'
    if (thirdParty) {
      total += usageType === "pleasure" ? 700 : 800;
    }

    // ביטוח חיים
    if (lifeInsurance && horseValue) {
      const value = parseFloat(horseValue);
      let rate = parseFloat(horseType) / 100;
      let lifeAmount = value * rate;
      
      // הנחה אם ללא גניבה
      if (!includeTheft) {
        lifeAmount *= 0.9;
      }
      
      total += lifeAmount;
    }

    // בריאות
    if (healthInsurance) {
      total += lifeInsurance ? 700 : 1200;
    }

    // חישוב לתקופה
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const periodPremium = (total / 365) * days;
      return { annual: total, period: periodPremium, days };
    }

    return { annual: total, period: 0, days: 0 };
  };

  const horseResult = calculateHorseInsurance();

  // Auto-fill תאריך סיום
  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    if (value) {
      const start = new Date(value);
      const day = start.getDate();
      
      // יצירת תאריך סיום - שנה קדימה
      const end = new Date(start);
      end.setFullYear(end.getFullYear() + 1);
      
      // אם היום הוא 1-14, תאריך הסיום הוא היום האחרון של החודש הקודם
      // אם היום הוא 15+, תאריך הסיום הוא היום האחרון של אותו החודש
      if (day < 15) {
        // חודש קודם - יום אחרון
        end.setDate(1); // תחילה הולכים ליום הראשון
        end.setDate(0); // ואז יום 0 = יום אחרון של החודש הקודם
      } else {
        // אותו חודש - יום אחרון
        end.setMonth(end.getMonth() + 1);
        end.setDate(0); // יום 0 של החודש הבא = יום אחרון של החודש הנוכחי
      }
      
      setEndDate(end.toISOString().slice(0, 10));
    }
  };

  return (
    <div className="space-y-8" dir="rtl">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">מחשבוני ביטוח</h1>
        <p className="text-muted-foreground text-lg">
          כלים מתקדמים לחישוב פרמיות ביטוח מדויקות
        </p>
      </div>

      {/* מחשבון סוסים */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Calculator className="h-7 w-7 text-primary" />
            מחשבון ביטוח סוסים
          </CardTitle>
          <CardDescription className="text-base">
            חישוב מדויק של פרמיית ביטוח לסוסים כולל צד ג', חיים, ובריאות
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* צד ג' */}
            <div className="space-y-4 p-5 bg-muted/30 rounded-lg">
              <h3 className="font-bold text-lg flex items-center gap-2">
                ביטוח צד ג'
                <Badge variant={thirdParty ? "default" : "secondary"}>
                  {thirdParty ? "כלול" : "לא כלול"}
                </Badge>
              </h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="third-party" className="text-base">כולל ביטוח צד ג'</Label>
                <Switch
                  id="third-party"
                  checked={thirdParty}
                  onCheckedChange={setThirdParty}
                />
              </div>
              {thirdParty && (
                <div className="space-y-3">
                  <Label className="text-base">סוג שימוש:</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={usageType === "pleasure" ? "default" : "outline"}
                      onClick={() => setUsageType("pleasure")}
                      className="h-auto py-3"
                    >
                      <div className="text-center">
                        <div className="font-bold">הנאה</div>
                        <div className="text-xs mt-1">₪700</div>
                      </div>
                    </Button>
                    <Button
                      type="button"
                      variant={usageType === "competition" ? "default" : "outline"}
                      onClick={() => setUsageType("competition")}
                      className="h-auto py-3"
                    >
                      <div className="text-center">
                        <div className="font-bold">תחרות</div>
                        <div className="text-xs mt-1">₪800</div>
                      </div>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* ביטוח חיים */}
            <div className="space-y-4 p-5 bg-muted/30 rounded-lg">
              <h3 className="font-bold text-lg flex items-center gap-2">
                ביטוח חיים
                <Badge variant={lifeInsurance ? "default" : "secondary"}>
                  {lifeInsurance ? "כלול" : "לא כלול"}
                </Badge>
              </h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="life-insurance" className="text-base">כולל ביטוח חיים</Label>
                <Switch
                  id="life-insurance"
                  checked={lifeInsurance}
                  onCheckedChange={setLifeInsurance}
                />
              </div>
              {lifeInsurance && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="horse-type" className="text-base">סוג סוס:</Label>
                    <Select value={horseType} onValueChange={(v: any) => setHorseType(v)}>
                      <SelectTrigger id="horse-type" className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">רגיל (5%)</SelectItem>
                        <SelectItem value="6">ספורט/תחרויות (6%)</SelectItem>
                        <SelectItem value="6.5">סוס מרוץ (6.5%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="horse-value" className="text-base">ערך הסוס (₪):</Label>
                    <Input
                      id="horse-value"
                      type="number"
                      placeholder="לדוגמה: 50000"
                      value={horseValue}
                      onChange={(e) => setHorseValue(e.target.value)}
                      className="mt-2 text-lg"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="theft" className="text-base">כולל גניבה</Label>
                    <Switch
                      id="theft"
                      checked={includeTheft}
                      onCheckedChange={setIncludeTheft}
                    />
                  </div>
                  {!includeTheft && (
                    <p className="text-sm text-success">הנחה של 10% ללא כיסוי גניבה</p>
                  )}
                </div>
              )}
            </div>

            {/* בריאות */}
            <div className="space-y-4 p-5 bg-muted/30 rounded-lg">
              <h3 className="font-bold text-lg flex items-center gap-2">
                ביטוח בריאות
                <Badge variant={healthInsurance ? "default" : "secondary"}>
                  {healthInsurance ? "כלול" : "לא כלול"}
                </Badge>
              </h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="health" className="text-base">כולל ביטוח בריאות</Label>
                <Switch
                  id="health"
                  checked={healthInsurance}
                  onCheckedChange={setHealthInsurance}
                />
              </div>
              {healthInsurance && (
                <div className="p-3 bg-background rounded border border-border">
                  <p className="text-sm text-muted-foreground">
                    {lifeInsurance ? (
                      <span>עלות: <span className="font-bold text-foreground text-lg">₪700</span> (עם חיים)</span>
                    ) : (
                      <span>עלות: <span className="font-bold text-foreground text-lg">₪1,200</span> (ללא חיים)</span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* תקופת ביטוח */}
            <div className="space-y-4 p-5 bg-muted/30 rounded-lg">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                תקופת ביטוח
              </h3>
              <div>
                <Label htmlFor="start-date" className="text-base">תאריך תחילה:</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="end-date" className="text-base">תאריך סיום:</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-2"
                />
              </div>
              {horseResult.days > 0 && (
                <p className="text-sm text-muted-foreground">
                  תקופה: {horseResult.days} ימים
                </p>
              )}
            </div>
          </div>

          {/* תוצאות */}
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-lg border-2 border-primary/30">
            <h3 className="text-xl font-bold mb-4 text-center">תוצאות החישוב</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center p-4 bg-background rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">פרמיה שנתית</p>
                <p className="text-4xl font-bold text-primary">
                  ₪{horseResult.annual.toLocaleString()}
                </p>
              </div>
              {horseResult.period > 0 && (
                <div className="text-center p-4 bg-background rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    פרמיה לתקופה ({horseResult.days} ימים)
                  </p>
                  <p className="text-4xl font-bold text-secondary">
                    ₪{Math.round(horseResult.period).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* מחשבונים נוספים - מקומות שמורים */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-6 w-6 text-primary" />
              ביטוח חווה
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              חישוב פרמיה לחוות סוסים לפי מספר סוסים, מדריכים, טיולים ועוד
            </p>
            <Badge variant="secondary">בפיתוח</Badge>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6 text-primary" />
              ביטוח מדריכי רכיבה
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              חישוב לפי מספר מדריכים, היקף פעילות ותוכניות מיוחדות
            </p>
            <Badge variant="secondary">בפיתוח</Badge>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-6 w-6 text-primary" />
              ביטוח מאמנים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              ביטוח למאמני כושר ואומנויות לחימה
            </p>
            <Badge variant="secondary">בפיתוח</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calculators;
