import { FileText, Upload, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Documents = () => {
  const documents = [
    { id: 1, name: "פוליסת רכב - דוד כהן.pdf", type: "policy", client: "דוד כהן", date: "10/12/2025", size: "245 KB" },
    { id: 2, name: "הצעת מחיר - שרה לוי.pdf", type: "quote", client: "שרה לוי", date: "09/12/2025", size: "178 KB" },
    { id: 3, name: "טופס תביעה - יוסי אברהם.pdf", type: "claim", client: "יוסי אברהם", date: "08/12/2025", size: "412 KB" },
    { id: 4, name: "אישור ביטוח - רחל מזרחי.pdf", type: "certificate", client: "רחל מזרחי", date: "07/12/2025", size: "156 KB" },
    { id: 5, name: "חוזה - משה גולן.pdf", type: "contract", client: "משה גולן", date: "06/12/2025", size: "523 KB" },
  ];

  const getTypeBadge = (type: string) => {
    const types: { [key: string]: { label: string; className: string } } = {
      policy: { label: "פוליסה", className: "bg-primary text-primary-foreground" },
      quote: { label: "הצעה", className: "bg-secondary text-secondary-foreground" },
      claim: { label: "תביעה", className: "bg-warning text-warning-foreground" },
      certificate: { label: "אישור", className: "bg-success text-success-foreground" },
      contract: { label: "חוזה", className: "bg-accent text-accent-foreground" },
    };
    const typeInfo = types[type] || { label: type, className: "" };
    return <Badge className={typeInfo.className}>{typeInfo.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">מסמכים</h1>
          <p className="text-muted-foreground">ניהול מסמכי הסוכנות</p>
        </div>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          העלה מסמך
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">487</p>
                <p className="text-sm text-muted-foreground">סה"כ מסמכים</p>
              </div>
              <FileText className="h-6 w-6 text-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">142</p>
                <p className="text-sm text-muted-foreground">פוליסות</p>
              </div>
              <FileText className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">89</p>
                <p className="text-sm text-muted-foreground">הצעות מחיר</p>
              </div>
              <FileText className="h-6 w-6 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">34</p>
                <p className="text-sm text-muted-foreground">תביעות</p>
              </div>
              <FileText className="h-6 w-6 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">222</p>
                <p className="text-sm text-muted-foreground">אישורים</p>
              </div>
              <FileText className="h-6 w-6 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="חיפוש מסמכים..." className="pr-10" />
            </div>
          </div>

          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{doc.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getTypeBadge(doc.type)}
                      <span className="text-sm text-muted-foreground">{doc.client}</span>
                    </div>
                  </div>
                </div>
                <div className="text-left flex items-center gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{doc.date}</p>
                    <p className="text-sm text-muted-foreground">{doc.size}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    הורד
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Documents;
