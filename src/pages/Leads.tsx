// src/pages/Leads.tsx
import { useState, useMemo } from "react";
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

const channelLabels: Record<LeadChannel, string> = {
  PHONE: "טלפון",
  WHATSAPP: "וואטסאפ",
  EMAIL: "מייל",
  SMS: "SMS",
  MEETING: "פגישה",
};

const Leads = () => {
  const { user } = useAuth();
  const { leads, addLead, updateLeadStatus, employees, addTask } = useData();

  const [statusFilter, setStatusFilter] = useState<LeadStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");

  // טופס ליד חדש
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("");
  const [estimated, setEstimated] = useState<string>("");
  const [nextActionDate, setNextActionDate] = useState("");
  const [nextActionNotes, setNextActionNotes] = useState("");
  const [lastChannel, setLastChannel] = useState<LeadChannel>("PHONE");
  const [assignedToUserId, setAssignedToUserId] = useState<string>(user?.id || "");

  const todayStr = new Date().toISOString().slice(0, 10);

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("חובה למלא שם ליד.");
      return;
    }

    addLead({
      name: name.trim(),
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      source: source.trim() || undefined,
      notes: undefined,
      estimatedAnnualPremium: estimated ? Number(estimated) : undefined,
      nextActionDate: nextActionDate || undefined,
      nextActionNotes: nextActionNotes || undefined,
      lastChannel,
      createdAt: "", // ידרס בקונטקסט
      assignedToUserId: assignedToUserId || undefined,
      status: "NEW",
    });

    setName("");
    setPhone("");
    setEmail("");
    setSource("");
    setEstimated("");
    setNextActionDate("");
    setNextActionNotes("");
    setLastChannel("PHONE");
  };

  const filtered = useMemo(
    () =>
      leads.filter((l) => {
        if (statusFilter !== "ALL" && l.status !== statusFilter) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          const hay = (
            l.name +
            " " +
            (l.phone || "") +
            " " +
            (l.email || "") +
            " " +
            (l.source || "") +
            " " +
            (l.notes || "")
          ).toLowerCase();
          return hay.includes(q);
        }
        return true;
      }),
    [leads, statusFilter, search],
  );

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
    leads.forEach((l) => {
      byStatus[l.status]++;
      if (l.estimatedAnnualPremium) {
        estimatedSum += l.estimatedAnnualPremium;
      }
    });
    return { total, byStatus, estimatedSum };
  }, [leads]);

  const createTaskFromLead = (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;
    const assignee = lead.assignedToUserId || user?.id || "u2";
    const due = lead.nextActionDate || todayStr;

    addTask({
      title: `טיפול בליד – ${lead.name}`,
      description: lead.nextActionNotes || "משימה שנוצרה מתוך ליד.",
      kind: "LEAD",
      priority: "NORMAL",
      assignedToUserId: assignee,
      createdByUserId: user?.id || assignee,
      dueDate: due,
      relatedClientName: lead.name,
      leadId: lead.id,
      requiresManagerReview: false,
    });

    alert("נוצרה משימה מתוך הליד (תוכל לראות במסך המשימות).");
  };

  const statusCount = (status: LeadStatus) => leads.filter((l) => l.status === status).length;

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold text-slate-800">לידים</h1>
      <p className="text-sm text-slate-600">
        ניהול לידים: מאיפה הגיע הליד, באיזה שלב הוא, ומה הפעולה הבאה – כמו CRM אבל מותאם לסוכן ביטוח.
      </p>

      {/* סטטיסטיקות ראשיות */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-slate-500">סה״כ לידים</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-slate-500">לידים חדשים</div>
          <div className="text-2xl font-bold text-slate-800">{stats.byStatus.NEW}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-slate-500">נשלחה הצעה</div>
          <div className="text-2xl font-bold text-purple-700">{stats.byStatus.QUOTED}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-slate-500">פרמיה משוערת (סה״כ)</div>
          <div className="text-2xl font-bold text-emerald-700">{stats.estimatedSum.toLocaleString("he-IL")} ₪</div>
        </div>
      </div>

      {/* פילטר וחיפוש */}
      <section className="bg-white rounded-2xl shadow p-4 space-y-3 text-xs">
        <div className="flex flex-wrap gap-3 items-center">
          <select
            className="border rounded-lg px-2 py-1"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value === "ALL" ? "ALL" : (e.target.value as LeadStatus))}
          >
            <option value="ALL">כל הסטטוסים</option>
            <option value="NEW">חדש</option>
            <option value="CONTACTED">נוצר קשר</option>
            <option value="QUOTED">נשלחה הצעה</option>
            <option value="WON">נסגר (הצלחה)</option>
            <option value="LOST">אבד</option>
          </select>
          <input
            className="border rounded-lg px-3 py-1 flex-1 min-w-[200px]"
            placeholder="חפש לפי שם, טלפון, מייל, מקור..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="button"
            className="px-3 py-1 rounded-full border border-slate-300"
            onClick={() => {
              setStatusFilter("ALL");
              setSearch("");
            }}
          >
            איפוס
          </button>
        </div>
      </section>

      {/* טופס ליד חדש */}
      <section className="bg-white rounded-2xl shadow p-4 space-y-3 text-xs">
        <h2 className="text-sm font-semibold text-slate-800">הוספת ליד חדש</h2>
        <form onSubmit={handleAddLead} className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col min-w-[180px]">
            <label className="mb-1">שם *</label>
            <input
              className="border rounded-lg px-2 py-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="שם הלקוח / החווה"
            />
          </div>
          <div className="flex flex-col min-w-[150px]">
            <label className="mb-1">טלפון</label>
            <input className="border rounded-lg px-2 py-1" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="flex flex-col min-w-[180px]">
            <label className="mb-1">מייל</label>
            <input className="border rounded-lg px-2 py-1" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="flex flex-col min-w-[160px]">
            <label className="mb-1">מקור</label>
            <input
              className="border rounded-lg px-2 py-1"
              placeholder="פייסבוק, הפניה, אתר..."
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </div>
          <div className="flex flex-col min-w-[140px]">
            <label className="mb-1">פרמיה משוערת (₪)</label>
            <input
              type="number"
              className="border rounded-lg px-2 py-1"
              value={estimated}
              onChange={(e) => setEstimated(e.target.value)}
            />
          </div>
          <div className="flex flex-col min-w-[150px]">
            <label className="mb-1">תאריך פעולה הבאה</label>
            <input
              type="date"
              className="border rounded-lg px-2 py-1"
              value={nextActionDate}
              onChange={(e) => setNextActionDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col flex-1 min-w-[200px]">
            <label className="mb-1">מה עושים בפעולה הבאה?</label>
            <input
              className="border rounded-lg px-2 py-1"
              value={nextActionNotes}
              onChange={(e) => setNextActionNotes(e.target.value)}
              placeholder="למשל: לשלוח הצעת מחיר לחווה + מדריכים."
            />
          </div>
          <div className="flex flex-col min-w-[150px]">
            <label className="mb-1">ערוץ אחרון</label>
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
            </select>
          </div>
          <div className="flex flex-col min-w-[160px]">
            <label className="mb-1">עובד מטפל</label>
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
          <div>
            <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm">
              שמור ליד
            </button>
          </div>
        </form>
      </section>

      {/* טבלת לידים */}
      <section className="bg-white rounded-2xl shadow p-4 text-xs">
        <h2 className="text-sm font-semibold mb-3">רשימת לידים</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
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
                <th className="py-2 px-2">ערוץ</th>
                <th className="py-2 px-2">משימה</th>
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
                    <td className="py-2 px-2">{lead.source || "-"}</td>
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
                    <td className="py-2 px-2">{emp?.name || "-"}</td>
                    <td className="py-2 px-2">
                      {lead.estimatedAnnualPremium ? `${lead.estimatedAnnualPremium.toLocaleString("he-IL")} ₪` : "-"}
                    </td>
                    <td className="py-2 px-2">
                      {lead.nextActionDate ? (
                        <div>
                          <div className="font-semibold">{lead.nextActionDate}</div>
                          {lead.nextActionNotes && (
                            <div className="text-slate-500 text-[11px] max-w-[200px] truncate">
                              {lead.nextActionNotes}
                            </div>
                          )}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="py-2 px-2">{lead.lastChannel ? channelLabels[lead.lastChannel] : "-"}</td>
                    <td className="py-2 px-2">
                      <button
                        type="button"
                        className="px-3 py-1 rounded-full border border-blue-600 text-blue-600 text-[11px] hover:bg-blue-50"
                        onClick={() => createTaskFromLead(lead.id)}
                      >
                        צור משימה
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-4 text-center text-slate-400">
                    לא נמצאו לידים מתאימים לפילטר.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Leads;
