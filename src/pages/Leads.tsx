// src/pages/Leads.tsx
import React, { useMemo, useState } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import type { Lead, LeadStatus } from "../types";

const statusLabels: Record<LeadStatus, string> = {
  NEW: "חדש",
  CONTACTED: "נוצר קשר",
  QUOTED: "נשלחה הצעה",
  WON: "נסגר (הצלחה)",
  LOST: "אבד",
};

const Leads: React.FC = () => {
  const { leads, addLead, updateLeadStatus, addTask } = useData();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("");
  const [notes, setNotes] = useState("");
  const [estimatedPremium, setEstimatedPremium] = useState("");
  const [nextActionDate, setNextActionDate] = useState("");
  const [search, setSearch] = useState("");

  // סיכומים לראש הדף
  const stats = useMemo(() => {
    const total = leads.length;
    const won = leads.filter((l) => l.status === "WON").length;
    const open = leads.filter((l) => ["NEW", "CONTACTED", "QUOTED"].includes(l.status)).length;

    const conversion = total ? Math.round((won / total) * 100) : 0;

    return { total, won, open, conversion };
  }, [leads]);

  const filtered = useMemo(() => {
    if (!search.trim()) return leads;
    const q = search.toLowerCase();
    return leads.filter((l) => {
      return (
        l.name.toLowerCase().includes(q) ||
        (l.phone || "").toLowerCase().includes(q) ||
        (l.email || "").toLowerCase().includes(q) ||
        (l.source || "").toLowerCase().includes(q)
      );
    });
  }, [leads, search]);

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("חובה שם ליד.");
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
      nextActionNotes: undefined,
      lastChannel: "PHONE",
    });

    setName("");
    setPhone("");
    setEmail("");
    setSource("");
    setNotes("");
    setEstimatedPremium("");
    setNextActionDate("");
  };

  const createTaskFromLead = (lead: Lead) => {
    const today = new Date();
    const due = new Date();
    due.setDate(today.getDate() + 3);

    const assignedId = user?.id || "u2";
    const creatorId = user?.id || "u1";

    const descParts = [
      lead.phone ? `טלפון: ${lead.phone}` : "",
      lead.email ? `מייל: ${lead.email}` : "",
      lead.source ? `מקור: ${lead.source}` : "",
      lead.notes ? `הערות: ${lead.notes}` : "",
    ].filter(Boolean);

    const priority = lead.estimatedAnnualPremium && lead.estimatedAnnualPremium >= 10000 ? "HIGH" : "NORMAL";

    addTask({
      title: `ליד – ${lead.name}`,
      description: descParts.join(" | ") || undefined,
      kind: "LEAD",
      priority,
      assignedToUserId: assignedId,
      createdByUserId: creatorId,
      dueDate: due.toISOString().slice(0, 10),
      relatedClientName: lead.name,
      requiresManagerReview: false,
    });

    alert("נוצרה משימה חדשה מהליד הזה ‘המשימות שלי’.");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-2">
        <h1 className="text-2xl font-bold text-slate-800">לידים</h1>
        <div className="text-xs text-slate-500">
          ניהול לידים ולקוחות פוטנציאליים – בלחיצה אחת אפשר לפתוח משימה מעקב.
        </div>
      </div>

      {/* כרטיסי סטטוס */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-slate-500 mb-1">לידים פתוחים</div>
          <div className="text-2xl font-bold text-blue-700">{stats.open.toLocaleString("he-IL")}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-slate-500 mb-1">לידים סגורים בהצלחה</div>
          <div className="text-2xl font-bold text-emerald-700">{stats.won.toLocaleString("he-IL")}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-slate-500 mb-1">סה״כ לידים</div>
          <div className="text-2xl font-bold">{stats.total.toLocaleString("he-IL")}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-slate-500 mb-1">שיעור המרה</div>
          <div className="text-2xl font-bold text-orange-600">{stats.conversion}%</div>
        </div>
      </div>

      {/* הוספת ליד חדש */}
      <section className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-sm font-semibold mb-3">הוספת ליד חדש</h2>
        <form onSubmit={handleAddLead} className="flex flex-wrap gap-3 text-xs items-end">
          <div className="flex flex-col">
            <label>שם *</label>
            <input className="border rounded-lg px-2 py-1" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <label>טלפון</label>
            <input className="border rounded-lg px-2 py-1" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <label>מייל</label>
            <input className="border rounded-lg px-2 py-1" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <label>מקור</label>
            <input
              className="border rounded-lg px-2 py-1"
              placeholder="פייסבוק, הפניה, אתר..."
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label>פרמיה משוערת (₪)</label>
            <input
              type="number"
              className="border rounded-lg px-2 py-1 w-32"
              value={estimatedPremium}
              onChange={(e) => setEstimatedPremium(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label>תאריך פעולה הבאה</label>
            <input
              type="date"
              className="border rounded-lg px-2 py-1"
              value={nextActionDate}
              onChange={(e) => setNextActionDate(e.target.value)}
            />
          </div>
          <div className="flex-1 flex flex-col min-w-[160px]">
            <label>הערות</label>
            <input className="border rounded-lg px-2 py-1" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div>
            <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white">
              שמור ליד
            </button>
          </div>
        </form>
      </section>

      {/* חיפוש + טבלה */}
      <section className="bg-white rounded-2xl shadow p-4 space-y-4">
        <div className="flex justify-between items-center gap-3 text-xs">
          <input
            className="border rounded-lg px-3 py-1 flex-1"
            placeholder="חיפוש לפי שם, טלפון, מייל או מקור..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="text-slate-500">
            מציג {filtered.length} מתוך {leads.length}
          </div>
        </div>

        <div className="overflow-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="py-2 px-2">שם</th>
                <th className="py-2 px-2">טלפון</th>
                <th className="py-2 px-2">מייל</th>
                <th className="py-2 px-2">מקור</th>
                <th className="py-2 px-2">סטטוס</th>
                <th className="py-2 px-2">פרמיה משוערת</th>
                <th className="py-2 px-2">תאריך פעולה הבאה</th>
                <th className="py-2 px-2">הערות</th>
                <th className="py-2 px-2">משימה</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} className="border-b last:border-0">
                  <td className="py-2 px-2 font-medium">{lead.name}</td>
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
                  <td className="py-2 px-2">
                    {lead.estimatedAnnualPremium ? `${lead.estimatedAnnualPremium.toLocaleString("he-IL")} ₪` : "-"}
                  </td>
                  <td className="py-2 px-2">{lead.nextActionDate || "-"}</td>
                  <td className="py-2 px-2 max-w-[200px] truncate">{lead.notes || "-"}</td>
                  <td className="py-2 px-2">
                    <button
                      className="px-3 py-1 rounded-full border border-blue-500 text-blue-600 text-[11px] hover:bg-blue-50"
                      type="button"
                      onClick={() => createTaskFromLead(lead)}
                    >
                      צור משימה →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && <div className="text-center py-6 text-slate-400">אין לידים תואמים לחיפוש.</div>}
        </div>
      </section>
    </div>
  );
};

export default Leads;
