import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Scale, Search, ExternalLink, Mic } from "lucide-react";

const Regulations = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">חוקים וחוזרים</h1>
        <p className="text-muted-foreground text-lg">תקנות וחוקים רלוונטיים</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="חיפוש..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pr-10" />
            </div>
            <Button variant="outline" className="gap-2">
              <Mic className="h-4 w-4" />
              קולי
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            תקנות לפי תחום
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="horses">
              <AccordionTrigger>ביטוח סוסים</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground mb-3">תקנות וחוזרים בנושא ביטוח סוסים</p>
                <Button variant="link" className="p-0">
                  <ExternalLink className="h-4 w-4 ml-2" />
                  חוזר 2024
                </Button>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="farm">
              <AccordionTrigger>חוות רכיבה</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">תקנות בטיחות לחוות</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default Regulations;
