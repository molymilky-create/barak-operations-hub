// src/pages/Dashboard.tsx
import React, { useMemo } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";

const Dashboard: React.FC = () => {
  const { tasks, leads } = useData();
  const { user, isAdmin } = useAuth();

  const todayStr = new Date().toISOString().slice(0, 10);

  const { tasksToday, overdueTasks, openLeads, wonLeads, handledLeads, conversionRate } = useMemo(() => {
    const openLeadStatuses = ["NEW", "CONTACTED", "QUOTED"];
    const doneTaskStatuses = ["DONE", "CANCELLED"];

    const tasksToday = tasks.filter((t) => t.dueDate === todayStr && !doneTaskStatuses.includes(t.status)).length;

    const overdueTasks = tasks.filter((t) => t.dueDate < todayStr && !doneTaskStatuses.includes(t.status)).length;

    const openLeads = leads.filter((l) => openLeadStatuses.includes(l.status)).length;

    const wonLeads = leads.filter((l) => l.status === "WON").length;
    const handledLeads = leads.filter((l) => l.status !== "NEW").length;

    const conversionRate = handledLeads === 0 ? 0 : Math.round((wonLeads / handledLeads) * 100);

    return {
      tasksToday,
      overdueTasks,
      openLeads,
      wonLeads,
      handledLeads,
      conversionRate,
    };
  }, [tasks, leads, todayStr]);

  return (
    <div className="space-y-6" dir="rtl">
      {/* כותרת עליונה */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">דשבורד – ברק ביטוחים</h1>
          <p className="text-sm text-slate-500 mt-1">
            תמונת מצב יומית על משימות, לידים והתקדמות. המטרה – לא לפספס חידוש, גבייה או ליד חם.
          </p>
        </div>
        {user && (
          <div className="hidden md:flex flex-col items-end text-xs text-slate-500">
            <span>משתמש מחובר: {user.name}</span>
            <span>{isAdmin ? "מצב מנהל" : "מצב עובד"}</span>
          </div>
        )}
      </div>

      {/* כרטיסי סטטוס – עם צבעי כחול/כתום בסגנון המותג */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow p-4 border border-slate-100">
          <div className="text-xs text-slate-500 mb-1">משימות להיום</div>
          <div className="text-3xl font-bold text-[#0076a8]">{tasksToday}</div>
          <div className="mt-1 text-[11px] text-slate-500">משימות שזמן היעד שלהן הוא היום ({todayStr})</div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 border border-slate-100">
          <div className="text-xs text-slate-500 mb-1">משימות באיחור</div>
          <div className="text-3xl font-bold text-[#f68b1f]">{overdueTasks}</div>
          <div className="mt-1 text-[11px] text-slate-500">כדאי להתחיל במטלות האלו כדי למנוע טעויות ועיכובים.</div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 border border-slate-100">
          <div className="text-xs text-slate-500 mb-1">לידים פתוחים</div>
          <div className="text-3xl font-bold text-emerald-700">{openLeads}</div>
          <div className="mt-1 text-[11px] text-slate-500">לידים שעדיין בתהליך – חשוב שלא יישכחו.</div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 border border-slate-100">
          <div className="text-xs text-slate-500 mb-1">שיעור סגירה משוער</div>
          <div className="flex items-baseline gap-1">
            <div className="text-3xl font-bold text-[#f68b1f]">{conversionRate}%</div>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            מתוך {handledLeads} לידים שטופלו, {wonLeads} נסגרו כעסקה.
          </div>
        </div>
      </div>

      {/* הסבר שימוש לעובדים/מנהל */}
      <div className="bg-white rounded-2xl shadow p-4 text-sm text-slate-600 space-y-2">
        <h2 className="font-semibold text-slate-800 text-base">איך לעבוד עם המערכת ביום-יום</h2>
        <ul className="list-disc pr-5 space-y-1 text-xs md:text-sm">
          <li>
            <span className="font-semibold">עובד:</span> מתחיל מדשבורד, עובר ל{" "}
            <span className="font-semibold text-[#0076a8]">&quot;המשימות שלי&quot;</span> וסוגר משימות לפי תאריך יעד.
          </li>
          <li>
            <span className="font-semibold">מנהל:</span> בודק את{" "}
            <span className="font-semibold text-[#0076a8]">&quot;משימות צוות&quot;</span> כדי לראות מי עמוס, איפה יש
            איחורים ואיפה צריך עזרה.
          </li>
          <li>
            <span className="font-semibold">שיווק ומכירות:</span> נכנס ל{" "}
            <span className="font-semibold text-[#0076a8]">&quot;לידים&quot;</span> ומוודא שלכל ליד חם יש מי שמטפל בו
            ומשימה מסודרת.
          </li>
        </ul>
      </div>

      {/* כרטיס מותג – תחומי פעילות כמו בפרסומים שלך */}
      <div className="bg-gradient-to-l from-[#0076a8] to-[#0b90c9] rounded-2xl shadow p-4 text-white text-sm flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-1">
          <h2 className="font-semibold text-base mb-1">ברק ביטוחים – כל הענפים במקום אחד</h2>
          <p className="text-xs md:text-sm text-slate-100 mb-2">
            מעל 30 שנה של ניסיון בביטוח רכבים, דירות, סוסים, עסקים ועוד – עכשיו גם במערכת ניהול פנימית שמונעת טעויות
            ופספוסים.
          </p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs md:text-sm">
            <li>🚗 ביטוח רכבים</li>
            <li>🏠 ביטוח דירות</li>
            <li>🐴 ביטוח סוסים</li>
            <li>💼 ביטוח עסקים</li>
            <li>❤️ ביטוח חיים</li>
            <li>🔍 ביטוח אחריות מקצועית</li>
            <li>➕ ביטוח תאונות אישיות</li>
            <li>👷 ביטוח קבלנים ומנהלים</li>
          </ul>
        </div>
        <div className="text-xs md:text-sm bg-white/10 rounded-xl px-4 py-3 border border-white/20">
          <div className="font-semibold mb-1">תזכורת לעצמנו ולצוות 👇</div>
          <ul className="list-disc pr-4 space-y-1">
            <li>לא משחררים חידוש בלי לוודא גבייה ותנאים.</li>
            <li>כל פנייה נכנסת כליד + משימה – שלא הולך לאיבוד.</li>
            <li>כל בקשה לחברת ביטוח נכנסת למעקב עד קבלת תשובה.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
