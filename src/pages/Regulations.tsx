import { BookOpen, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Regulations = () => {
  const regulations = [
    {
      id: 1,
      title: "תקנות ביטוח רכב",
      content: "תקנות הביטוח מחייבות כל בעל רכב בישראל לרכוש ביטוח צד ג' כחובה. ביטוח זה מכסה נזקי גוף ורכוש שנגרמו לצד שלישי. בנוסף, ניתן לרכוש ביטוח מקיף המכסה גם נזקים לרכב המבוטח עצמו."
    },
    {
      id: 2,
      title: "תקנות ביטוח דירה",
      content: "ביטוח דירה מכסה נזקים למבנה ולתכולה הנגרמים כתוצאה מאירועים שונים כמו שריפה, פריצה, נזקי מים ואסונות טבע. חשוב לעדכן את שווי הדירה והתכולה מעת לעת."
    },
    {
      id: 3,
      title: "תקנות ביטוח בריאות",
      content: "ביטוח בריאות משלים מעניק כיסוי רפואי מעבר לסל הבריאות הבסיסי. הכיסוי כולל טיפולים רפואיים, אשפוזים, ניתוחים ובדיקות שאינם נכללים בסל הבריאות הציבורי."
    },
    {
      id: 4,
      title: "תקנות ביטוח חיים",
      content: "ביטוח חיים מעניק הגנה כספית למשפחה במקרה של פטירת המבוטח. הפוליסה יכולה לכלול גם כיסוי למקרה של אובדן כושר עבודה או מחלות קשות."
    },
    {
      id: 5,
      title: "תקנות ביטוח עסקי",
      content: "ביטוח עסקי מיועד להגן על בעלי עסקים מפני סיכונים שונים הקשורים בניהול העסק, כולל נזקים לרכוש, אחריות כלפי צד שלישי, ביטוח עובדים ועוד."
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">תקנון</h1>
        <p className="text-muted-foreground">מידע על תקנות וכללי ביטוח</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            תקנות ביטוח
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="חיפוש בתקנון..." className="pr-10" />
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {regulations.map((regulation) => (
              <AccordionItem key={regulation.id} value={`item-${regulation.id}`}>
                <AccordionTrigger className="text-right hover:no-underline">
                  <span className="font-medium">{regulation.title}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground leading-relaxed">{regulation.content}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>קישורים חשובים</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a href="#" className="block p-3 hover:bg-accent rounded-lg transition-colors">
              <p className="font-medium text-primary">רשות שוק ההון, ביטוח וחיסכון</p>
              <p className="text-sm text-muted-foreground">אתר הרגולטור</p>
            </a>
            <a href="#" className="block p-3 hover:bg-accent rounded-lg transition-colors">
              <p className="font-medium text-primary">לשכת סוכני הביטוח בישראל</p>
              <p className="text-sm text-muted-foreground">מידע מקצועי לסוכנים</p>
            </a>
            <a href="#" className="block p-3 hover:bg-accent rounded-lg transition-colors">
              <p className="font-medium text-primary">חוק חוזה הביטוח</p>
              <p className="text-sm text-muted-foreground">תשמ"א-1981</p>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>עדכונים אחרונים</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 border border-border rounded-lg">
              <p className="font-medium text-foreground">עדכון תקנות ביטוח רכב</p>
              <p className="text-sm text-muted-foreground mt-1">01/12/2025 - שינויים בכיסויי הפוליסה הסטנדרטית</p>
            </div>
            <div className="p-3 border border-border rounded-lg">
              <p className="font-medium text-foreground">תיקון חוק חוזה הביטוח</p>
              <p className="text-sm text-muted-foreground mt-1">15/11/2025 - הרחבת זכויות המבוטחים</p>
            </div>
            <div className="p-3 border border-border rounded-lg">
              <p className="font-medium text-foreground">הנחיות חדשות לביטוח בריאות</p>
              <p className="text-sm text-muted-foreground mt-1">10/11/2025 - תוספות לכיסוי הבסיסי</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Regulations;
