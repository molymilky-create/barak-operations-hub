// src/pages/Leads.tsx
import React, { useMemo, useState } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import type { LeadStatus, LeadChannel } from "../types";

const statusLabels: Record<LeadStatus, string> = {
  NEW: "חדש",
  CONTACTED: "נוצר קשר",
  QUOTED: "נשלחה הצעה",
  WON: "נסגר (הצלחה)",
  LOST: "אבד",
};

const statusClasses: Record<LeadStatus, string> = {
  NEW: "bg-slate-100 text-slate-700",
  CONTACTED: "bg-blue-100 text-blue-700",
  QUOTED: "bg-purple-100 text-purple-800",
  WON: "bg-emerald-100 text-emerald-800",
  LOST: "bg-rose-100 text-rose-700",
};

const channelLabels: Record<LeadChannel, string> = {
  PHONE: "טלפון",
  WHATSAPP: "וואטסאפ",
  EMAIL: "מייל",
  SMS: "SMS",
  MEETING: "פגישה",
  OTHER: "אחר",
};

const Leads: React.FC = () => {
  const { user } = useAuth();
  const { leads, addLead, updateLeadStatus, employees } = useData();

  const [statusFilter, setStatusFilter] = useState<LeadStatus | "ALL">("ALL");
  const [assignedFilter, setAssignedFilter] = useState<string | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // טופס ליד חדש
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("");
  const [notes, setNotes] = useState("");
  const [estimatedPremium, setEstimatedPremium] = useState<string>("");
  const [nextActionDate, setNextActionDate] = useState("");
  const [nextActionNotes, setNextActionNotes] = useState("");
  const [lastChannel, setLastChannel] = useState<LeadChannel>("PHONE");
  const [assignedToUserId, setAssignedToUserId] = useState<string>(user?.id || "");

  const todayStr = new Date().toISOString().slice(0, 10);

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("חובה להזין שם ליד");
      return;
    }

    addLead({
      name: name.trim(),
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      source: source.trim() || undefined,
      notes: notes.trim() || undefined,
      estimatedAnnualPremium: estimatedPremium ? Number(estimatedPremium) : undefined,
      nextActionDate: nextActionDate || undefined,
      nextActionNotes: nextActionNotes.trim() || undefined,
      lastChannel,
      assignedToUserId: assignedToUserId || undefined,
      createdAt: todayStr, // ייכתב שוב ב-DataContext, אבל זה לא מזיק
    });

    // איפוס
    setName("");
    setPhone("");
    setEmail("");
    setSource("");
    setNotes("");
    setEstimatedPremium("");
    setNextActionDate("");
    setNextActionNotes("");
    setLastChannel("PHONE");
  };

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      if (statusFilter !== "ALL" && lead.status !== statusFilter) return false;
      if (assignedFilter !== "ALL" && lead.assignedToUserId !== assignedFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const haystack = [lead.name, lead.phone || "", lead.email || "", lead.source || "", lead.notes || ""]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [leads, statusFilter, assignedFilter, searchQuery]);

  const stats = useMemo(() => {
    const total = leads.length;
    const byStatus: Record<LeadStatus, number> = {
      NEW: 0,
      CONTACTED: 0,
      QUOTED: 0,
      WON: 0,
      LOST: 0,
    };
    let estimatedSum = 0;

    for (const l of leads) {
      byStatus[l.status]++;
      if (l.estimatedAnnualPremium) {
        estimatedSum += l.estimatedAnnualPremium;
      }
    }

    return { total, byStatus, estimatedSum };
  }, [leads]);

  const getNextActionLabel = (lead: (typeof leads)[number]) => {
    if (!lead.nextActionDate) return "-";
    const isToday = lead.nextActionDate === todayStr;
    const isPast = lead.nextActionDate < todayStr;
    const base = lead.nextActionDate;

    if (isToday) return `${base} (היום)`;
    if (isPast) return `${base} (באיחור)`;
    return base;
  };

  return (
    <div dir="rtl" className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">לידים</h1>
      <p className="text-sm text-slate-600">
        ניהול לידים בצורה ברורה: מי הליד, מאיפה הגיע, מה השלב שלו, ומה הפעולה הבאה. ככה אף ליד לא נופל בין הכיסאות.
      </p>

      {/* סטטיסטיקה מהירה */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-slate-500">סה״כ לידים</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-slate-500">חדשים</div>
          <div className="text-2xl font-bold text-slate-800">{stats.byStatus.NEW}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-slate-500">נשלחה הצעה</div>
          <div className="text-2xl font-bold text-purple-700">{stats.byStatus.QUOTED}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-slate-500">פרמיה שנתית משוערת (סה״כ)</div>
          <div className="text-2xl font-bold text-emerald-700">{stats.estimatedSum.toLocaleString("he-IL")} ₪</div>
        </div>
      </div>

      {/* טופס ליד חדש */}
      <section className="bg-white rounded-2xl shadow p-4 space-y-4 text-xs">
        <h2 className="text-sm font-semibold">הוספת ליד חדש</h2>
        <form onSubmit={handleAddLead} className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col">
            <label className="mb-1 text-slate-600">שם *</label>
            <input
              className="border rounded-lg px-2 py-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="שם הליד / מבוטח פוטנציאלי"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-slate-600">טלפון</label>
            <input
              className="border rounded-lg px-2 py-1"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="050-1234567"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-slate-600">מייל</label>
            <input
              type="email"
              className="border rounded-lg px-2 py-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-slate-600">מקור</label>
            <input
              className="border rounded-lg px-2 py-1"
              placeholder="פייסבוק, הפניה, אתר..."
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-slate-600">פרמיה משוערת (₪)</label>
            <input
              type="number"
              className="border rounded-lg px-2 py-1 w-32"
              value={estimatedPremium}
              onChange={(e) => setEstimatedPremium(e.target.value)}
              placeholder="10000"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-slate-600">אמצעי תקשורת אחרון</label>
            <select
              className="border rounded-lg px-2 py-1"
              value={lastChannel}
              onChange={(e) => setLastChannel(e.target.value as LeadChannel)}
            >
              <option value="PHONE">טלפון</option>
              <option value="WHATSAPP">וואטסאפ</option>
              <option value="EMAIL">מייל</option>
              <option value="SMS">SMS</option>
              <option value="MEETING">פגישה</option>
              <option value="OTHER">אחר</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-slate-600">עובד מטפל</label>
            <select
              className="border rounded-lg px-2 py-1"
              value={assignedToUserId}
              onChange={(e) => setAssignedToUserId(e.target.value)}
            >
              <option value="">ללא</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full flex flex-wrap gap-3 items-end">
            <div className="flex flex-col">
              <label className="mb-1 text-slate-600">תאריך פעולה הבאה</label>
              <input
                type="date"
                className="border rounded-lg px-2 py-1"
                value={nextActionDate}
                onChange={(e) => setNextActionDate(e.target.value)}
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label className="mb-1 text-slate-600">מה עושים בפעולה הבאה</label>
              <input
                className="border rounded-lg px-2 py-1"
                value={nextActionNotes}
                onChange={(e) => setNextActionNotes(e.target.value)}
                placeholder="למשל: להתקשר לוודא שקיבל הצעה ולהציע חלוקה לתשלומים."
              />
            </div>
            <div>
              <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm">
                שמור ליד
              </button>
            </div>
          </div>

          <div className="w-full">
            <label className="mb-1 text-slate-600">הערות כלליות</label>
            <textarea
              className="border rounded-lg px-2 py-1 w-full min-h-[50px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="מידע חשוב שלא תרצה לשכוח על הליד..."
            />
          </div>
        </form>
      </section>

      {/* פילטרים וחיפוש */}
      <section className="bg-white rounded-2xl shadow p-4 space-y-3 text-xs">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col">
            <label className="mb-1 text-slate-500">סטטוס</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value === "ALL" ? "ALL" : (e.target.value as LeadStatus))}
              className="border rounded-lg px-2 py-1"
            >
              <option value="ALL">הכל</option>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-slate-500">עובד מטפל</label>
            <select
              value={assignedFilter}
              onChange={(e) => setAssignedFilter(e.target.value === "ALL" ? "ALL" : e.target.value)}
              className="border rounded-lg px-2 py-1"
            >
              <option value="ALL">כולם</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 flex flex-col">
            <label className="mb-1 text-slate-500">חיפוש חופשי</label>
            <input
              className="border rounded-lg px-3 py-1"
              placeholder="חפש לפי שם, טלפון, מייל, מקור..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="mt-4 px-3 py-1 rounded-full border border-slate-300 text-slate-700"
            onClick={() => {
              setStatusFilter("ALL");
              setAssignedFilter("ALL");
              setSearchQuery("");
            }}
          >
            איפוס פילטרים
          </button>
        </div>
      </section>

      {/* טבלת לידים */}
      <section className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-sm font-semibold mb-3">רשימת לידים</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="py-2 px-2">שם</th>
                <th className="py-2 px-2">טלפון</th>
                <th className="py-2 px-2">מייל</th>
                <th className="py-2 px-2">מקור</th>
                <th className="py-2 px-2">סטטוס</th>
                <th className="py-2 px-2">עובד</th>
                <th className="py-2 px-2">פרמיה משוערת</th>
                <th className="py-2 px-2">פעולה הבאה</th>
                <th className="py-2 px-2">הערות</th>
                <th className="py-2 px-2">עדכון מהיר</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => {
                const emp = employees.find((e) => e.id === lead.assignedToUserId);
                return (
                  <tr key={lead.id} className="border-b last:border-0">
                    <td className="py-2 px-2 font-semibold">{lead.name}</td>
                    <td className="py-2 px-2">{lead.phone || "-"}</td>
                    <td className="py-2 px-2">{lead.email || "-"}</td>
                    <td className="py-2 px-2 text-slate-600">{lead.source || "-"}</td>
                    <td className="py-2 px-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          statusClasses[lead.status]
                        }`}
                      >
                        {statusLabels[lead.status]}
                      </span>
                    </td>
                    <td className="py-2 px-2">{emp?.name || "-"}</td>
                    <td className="py-2 px-2">
                      {lead.estimatedAnnualPremium ? `${lead.estimatedAnnualPremium.toLocaleString("he-IL")} ₪` : "-"}
                    </td>
                    <td className="py-2 px-2 text-xs">
                      {getNextActionLabel(lead)}
                      {lead.nextActionNotes && (
                        <div className="text-[11px] text-slate-500 line-clamp-2">{lead.nextActionNotes}</div>
                      )}
                    </td>
                    <td className="py-2 px-2 text-[11px] text-slate-500 max-w-[200px] line-clamp-2">
                      {lead.notes || "-"}
                    </td>
                    <td className="py-2 px-2">
                      <select
                        className="border rounded-lg px-2 py-1"
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                      >
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-6 text-center text-slate-400 text-xs">
                    לא נמצאו לידים מתאימים לפילטרים שנבחרו.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {leads.length === 0 && (
          <p className="text-xs text-slate-500 mt-2">
            עדיין אין לידים. אפשר להכניס ידנית או לחבר בהמשך לטפסי אתר / פוקוס / באפי / מערכת SMS.
          </p>
        )}
      </section>

      <p className="text-[11px] text-slate-400">
        השלב הבא יהיה לחבר בין לידים למשימות (כפתור &quot;צור משימה&quot; מתוך ליד), ולהוסיף אוטומציות – למשל: פתיחת
        משימה אוטומטית אם ליד במצב &quot;נשלחה הצעה&quot; יותר מ-3 ימים בלי שינוי.
      </p>
    </div>
  );
};

export default Leads;
