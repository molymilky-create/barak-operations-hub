import { Bot, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    { id: 1, type: "assistant", text: "שלום! אני עוזר ה-AI של ברק ביטוח. איך אוכל לעזור לך היום?" },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, type: "user", text: inputValue },
        { id: messages.length + 2, type: "assistant", text: "אני מעבד את השאלה שלך..." },
      ]);
      setInputValue("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">עוזר AI</h1>
        <p className="text-muted-foreground">עזרה חכמה לניהול הסוכנות</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              שיחה עם העוזר
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-4 h-[500px] overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p>{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="הקלד הודעה..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button onClick={handleSend} className="gap-2">
                <Send className="h-4 w-4" />
                שלח
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">שאלות מהירות</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setInputValue("מה הסטטוס של החידושים השבוע?")}
              >
                חידושים השבוע
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setInputValue("הצג לי לידים חדשים")}
              >
                לידים חדשים
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setInputValue("מה הגבייה החודשית?")}
              >
                דוח גבייה
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setInputValue("חשב פרמיה לרכב")}
              >
                חישוב פרמיה
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">יכולות העוזר</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="font-medium text-sm">ניתוח נתונים</p>
                  <p className="text-xs text-muted-foreground">סיכום וניתוח מידע מהמערכת</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="font-medium text-sm">חישובים</p>
                  <p className="text-xs text-muted-foreground">חישוב פרמיות והצעות מחיר</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="font-medium text-sm">המלצות</p>
                  <p className="text-xs text-muted-foreground">הצעות לשיפור ביצועים</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="font-medium text-sm">תזכורות</p>
                  <p className="text-xs text-muted-foreground">ניהול משימות ותזכורות</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
