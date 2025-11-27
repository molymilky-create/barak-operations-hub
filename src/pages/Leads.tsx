// src/pages/Leads.tsx
import { useState } from "react";
import { useData } from "../context/DataContext";
import type { LeadStatus } from "../types";

const statusLabels: Record<LeadStatus, string> = {
  NEW: "חדש",
  CONTACTED: "נוצר קשר",
  QUOTED: "נשלחה הצעה",
  WON: "נסגר (הצלחה)",
  LOST: "אבד",
};

const Leads: React.FC = () => {
  const { leads, addLead, updateLeadStatus } = useData();

  const [statusFilter, setStatusFilter] = useState<LeadStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // שדות לטופס הוספת ליד
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("");
  const [notes, setNotes] = useState("");
  const [estimatedPremium, setEstimatedPremium] = useState("");
  const [nextActionDate, setNextActionDate] = useState("");
  const [nextActionNotes, setNextActionNotes] = useState("");

  const filtered = leads.filter((lead) => {
    if (statusFilter !== "ALL" && lead.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        lead.name.toLowerCase().includes(q) ||
        (lead.phone || "").toLowerCase().includes(q) ||
        (lead.email || "").toLowerCase().includes(q) ||
        (lead.source || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const shortStatus = (status: LeadStatus) => statusLabels[status] || status;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("חובה להזין שם ליד.");
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
      nextActionNotes: nextActionNotes || undefined,
      lastChannel: undefined,
      assignedToUserId: undefined,
    });

    setName("");
    setPhone("");
    setEmail("");
    setSource("");
    setNotes("");
    setEstimatedPremium("");
    setNextActionDate("");
    setNextActionNotes("");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">לידים</h1>

      {/* פילטרים */}
      <section className="bg-white rounded-2xl shadow p-4 space-y-3 text-sm">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col">
            <label className="text-xs text-slate-500 mb-1">חיפוש</label>
            <input
              className="border rounded-lg px-2 py-1 text-sm"
              placeholder="חפש לפי שם, טלפון, מייל, מקור..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-slate-500 mb-1">סטטוס</label>
            <select
              className="border rounded-lg px-2 py-1 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value === "ALL" ? "ALL" : (e.target.value as LeadStatus))}
            >
              <option value="ALL">הכל</option>
              <option value="NEW">חדש</option>
              <option value="CONTACTED">נוצר קשר</option>
              <option value="QUOTED">נשלחה הצעה</option>
              <option value="WON">נסגר (הצלחה)</option>
              <option value="LOST">אבד</option>
            </select>
          </div>
        </div>
      </section>

      {/* טופס הוספת ליד */}
      <section className="bg-white rounded-2xl shadow p-4 text-sm">
        <h2 className="text-sm font-semibold mb-3">הוספת ליד חדש</h2>
        <form onSubmit={handleAdd} className="flex flex-wrap gap-3 items-end text-xs">
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
              placeholder="פייסבוק, באפי, אתר..."
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label>פרמיה משוערת (₪)</label>
            <input
              type="number"
              className="border rounded-lg px-2 py-1"
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
          <div className="flex-1 flex flex-col">
            <label>הערות / פעולה הבאה</label>
            <input
              className="border rounded-lg px-2 py-1"
              value={nextActionNotes}
              onChange={(e) => setNextActionNotes(e.target.value)}
            />
          </div>
          <div>
            <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white">
              שמור ליד
            </button>
          </div>
        </form>
      </section>

      {/* טבלת לידים */}
      <section className="bg-white rounded-2xl shadow p-4 text-xs">
        <h2 className="text-sm font-semibold mb-3">רשימת לידים</h2>
        <table className="w-full text-right">
          <thead>
            <tr className="border-b">
              <th className="py-2">שם</th>
              <th className="py-2">טלפון</th>
              <th className="py-2">מייל</th>
              <th className="py-2">מקור</th>
              <th className="py-2">סטטוס</th>
              <th className="py-2">פרמיה משוערת</th>
              <th className="py-2">פעולה הבאה</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr key={lead.id} className="border-b last:border-0">
                <td className="py-2">{lead.name}</td>
                <td className="py-2">{lead.phone || "-"}</td>
                <td className="py-2">{lead.email || "-"}</td>
                <td className="py-2">{lead.source || "-"}</td>
                <td className="py-2">
                  <select
                    className="border rounded-lg px-2 py-1"
                    value={lead.status}
                    onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                  >
                    <option value="NEW">חדש</option>
                    <option value="CONTACTED">נוצר קשר</option>
                    <option value="QUOTED">נשלחה הצעה</option>
                    <option value="WON">נסגר (הצלחה)</option>
                    <option value="LOST">אבד</option>
                  </select>
                </td>
                <td className="py-2">
                  {lead.estimatedAnnualPremium ? `${lead.estimatedAnnualPremium.toLocaleString("he-IL")} ₪` : "-"}
                </td>
                <td className="py-2">
                  {lead.nextActionDate || "-"}
                  {lead.nextActionNotes ? ` – ${lead.nextActionNotes}` : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-slate-400 mt-4">לא נמצאו לידים.</p>}
      </section>
    </div>
  );
};

export default Leads;
