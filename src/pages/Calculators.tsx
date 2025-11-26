import { Calculator as CalcIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const Calculators = () => {
  const [carValue, setCarValue] = useState("");
  const [carAge, setCarAge] = useState("");
  const [homeValue, setHomeValue] = useState("");
  const [homeSize, setHomeSize] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">מחשבונים</h1>
        <p className="text-muted-foreground">כלים לחישוב עלויות ופרמיות ביטוח</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalcIcon className="h-5 w-5 text-primary" />
              מחשבון ביטוח רכב
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="car-value">שווי הרכב (₪)</Label>
              <Input
                id="car-value"
                type="number"
                placeholder="הזן שווי רכב..."
                value={carValue}
                onChange={(e) => setCarValue(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="car-age">גיל הרכב (שנים)</Label>
              <Input
                id="car-age"
                type="number"
                placeholder="הזן גיל רכב..."
                value={carAge}
                onChange={(e) => setCarAge(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driver-age">גיל הנהג</Label>
              <Input id="driver-age" type="number" placeholder="הזן גיל נהג..." />
            </div>
            <Button className="w-full">חשב פרמיה</Button>
            {carValue && carAge && (
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground">פרמיה משוערת</p>
                <p className="text-2xl font-bold text-primary">₪3,500</p>
                <p className="text-xs text-muted-foreground mt-1">לשנה</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalcIcon className="h-5 w-5 text-secondary" />
              מחשבון ביטוח דירה
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="home-value">שווי הדירה (₪)</Label>
              <Input
                id="home-value"
                type="number"
                placeholder="הזן שווי דירה..."
                value={homeValue}
                onChange={(e) => setHomeValue(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="home-size">גודל הדירה (מ"ר)</Label>
              <Input
                id="home-size"
                type="number"
                placeholder="הזן גודל..."
                value={homeSize}
                onChange={(e) => setHomeSize(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="home-floor">קומה</Label>
              <Input id="home-floor" type="number" placeholder="הזן קומה..." />
            </div>
            <Button className="w-full">חשב פרמיה</Button>
            {homeValue && homeSize && (
              <div className="p-4 bg-secondary/10 rounded-lg">
                <p className="text-sm text-muted-foreground">פרמיה משוערת</p>
                <p className="text-2xl font-bold text-secondary">₪1,200</p>
                <p className="text-xs text-muted-foreground mt-1">לשנה</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalcIcon className="h-5 w-5 text-success" />
              מחשבון ביטוח חיים
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="age">גיל</Label>
              <Input id="age" type="number" placeholder="הזן גיל..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coverage">סכום כיסוי (₪)</Label>
              <Input id="coverage" type="number" placeholder="הזן סכום כיסוי..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="period">תקופת ביטוח (שנים)</Label>
              <Input id="period" type="number" placeholder="הזן תקופה..." />
            </div>
            <Button className="w-full">חשב פרמיה</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalcIcon className="h-5 w-5 text-warning" />
              מחשבון ביטוח בריאות
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="health-age">גיל</Label>
              <Input id="health-age" type="number" placeholder="הזן גיל..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="health-coverage">רמת כיסוי</Label>
              <select className="w-full p-2 border border-input rounded-md bg-background">
                <option>בסיסי</option>
                <option>משופר</option>
                <option>מקיף</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="family">מספר בני משפחה</Label>
              <Input id="family" type="number" placeholder="הזן מספר..." />
            </div>
            <Button className="w-full">חשב פרמיה</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calculators;
