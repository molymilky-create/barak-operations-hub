import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FolderOpen, FileText, Download, Search, Upload } from "lucide-react";

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  const documents = [
    { id: 1, name: "ג'קט סוסים - מנורה 2024", type: "jacket", company: "מנורה", client: "דוד כהן", date: "2024-12-01", size: "2.3 MB" },
    { id: 2, name: "הצעת מחיר חווה - הכשרה", type: "quote", company: "הכשרה", client: "שרה לוי", date: "2024-12-15", size: "1.8 MB" },
    { id: 3, name: "תביעה - נזק לסוס", type: "claim", company: "מנורה", client: "יוסי אברהם", date: "2024-11-20", size: "3.1 MB" },
    { id: 4, name: "אישור קיום - מדריכים", type: "certificate", company: "הכשרה", client: "רחל מזרחי", date: "2024-12-10", size: "0.5 MB" },
    { id: 5, name: "פוליסה חווה - שנתית", type: "policy", company: "מנורה", client: "משה גולן", date: "2024-10-05", size: "4.2 MB" },
  ];

  const filtered = documents.filter((doc) => {
    if (typeFilter !== "ALL" && doc.type !== typeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return doc.name.toLowerCase().includes(q) || doc.client.toLowerCase().includes(q);
    }
    return true;
  });

  const getTypeBadge = (type: string) => {
    const badges: Record<string, JSX.Element> = {
      jacket: <Badge variant="default">ג׳קט</Badge>,
      policy: <Badge className="bg-primary text-primary-foreground">פוליסה</Badge>,
      quote: <Badge variant="secondary">הצעה</Badge>,
      claim: <Badge variant="destructive">תביעה</Badge>,
      certificate: <Badge className="bg-success text-success-foreground">אישור</Badge>,
    };
    return badges[type] || <Badge variant="outline">{type}</Badge>;
  };

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">מסמכים</h1>
          <p className="text-muted-foreground text-lg">ניהול מסמכי הסוכנות</p>
        </div>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          העלה מסמך
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="חיפוש..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pr-10" />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">כל הסוגים</SelectItem>
                <SelectItem value="jacket">ג׳קט</SelectItem>
                <SelectItem value="policy">פוליסה</SelectItem>
                <SelectItem value="quote">הצעה</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filtered.map((doc) => (
          <Card key={doc.id} className="hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FileText className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-bold">{doc.name}</h3>
                    <p className="text-sm text-muted-foreground">{doc.client} • {doc.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getTypeBadge(doc.type)}
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    הורד
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Documents;
