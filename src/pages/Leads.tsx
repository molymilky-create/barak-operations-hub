// src/pages/Leads.tsx
import { useState } from "react";
import { useData } from "../context/DataContext";
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
  const { leads, addLead, updateLeadStatus } = useData();

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
      estimatedAnnualPremium: estimated ? Number(estimated) : undefined,
      nextActionDate: nextActionDate || undefined,
      nextActionNotes: nextActionNotes || undefined,
      lastChannel,
      createdAt: "", // ידרס בקונטקסט
      status: "NEW", // ידרס בקונטקסט
    });

    // איפוס
    setName("");
    setPhone("");
    setEmail("");
    setSource("");
    setEstimated("");
    setNextActionDate("");
    setNextActionNotes("");
    setLastChannel("PHONE");
  };

  const filteredLeads = leads.filter((l) => {
    if (statusFilter !== "ALL" && l.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        (l.phone || "").toLowerCase().includes(q) ||
        (l.email || "").toLowerCase().includes(q) ||
        (l.source || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const statusCount = (status: LeadStatus) => leads.filter((l) => l.status === status).length;

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold text-slate-800">לידים</h1>

      {/* סטטיסטיקה קצרה */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {(["NEW", "CONTACTED", "QUOTED", "WON", "LOST"] as LeadStatus[]).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(statusFilter === status ? "ALL" : status)}
            className={`p-3 rounded-xl border text-right transition ${
              statusFilter === status ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            <div className="text-xs text-slate-500">{statusLabels[status]}</div>
            <div className="text-2xl font-bold">{statusCount(status)}</div>
          </button>
        ))}
      </div>

      {/* פילטר חיפוש */}
      <div className="bg-white rounded-2xl shadow p-4 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-1 text-sm flex-1 min-w-[200px]"
          placeholder="חפש לפי שם, טלפון, מייל או מקור..."
        />
        <button
          type="button"
          onClick={() => {
            setSearch("");
            setStatusFilter("ALL");
          }}
          className="px-3 py-1 rounded-full border border-slate-300 text-xs hover:bg-slate-100"
        >
          איפוס סינון
        </button>
        <div className="text-xs text-slate-500">סה״כ: {leads.length} לידים</div>
      </div>

      {/* טופס הוספת ליד חדש */}
      <section className="bg-white rounded-2xl shadow p-4 space-y-3 text-xs">
        <h2 className="text-sm font-semibold text-slate-800">הוספת ליד חדש</h2>
        <form onSubmit={handleAddLead} className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col min-w-[160px]">
            <label className="mb-1">שם *</label>
            <input className="border rounded-lg px-2 py-1" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex flex-col min-w-[140px]">
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
          <div className="flex flex-col min-w-[140px]">
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
              placeholder="לשלוח הצעת מחיר / לקבוע שיחה / לתאם ביקור..."
            />
          </div>
          <div className="flex flex-col min-w-[140px]">
            <label className="mb-1">אמצעי תקשורת אחרון</label>
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
          <div>
            <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm">
              שמור ליד
            </button>
          </div>
        </form>
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
                <th className="py-2 px-2">פרמיה משוערת</th>
                <th className="py-2 px-2">פעולה הבאה</th>
                <th className="py-2 px-2">ערוץ אחרון</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b last:border-0 hover:bg-slate-50">
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
                      <option value="NEW">חדש</option>
                      <option value="CONTACTED">נוצר קשר</option>
                      <option value="QUOTED">נשלחה הצעה</option>
                      <option value="WON">נסגר (הצלחה)</option>
                      <option value="LOST">אבד</option>
                    </select>
                  </td>
                  <td className="py-2 px-2">
                    {lead.estimatedAnnualPremium ? `${lead.estimatedAnnualPremium.toLocaleString("he-IL")} ₪` : "-"}
                  </td>
                  <td className="py-2 px-2">
                    {lead.nextActionDate ? (
                      <div>
                        <div className="font-semibold">{lead.nextActionDate}</div>
                        {lead.nextActionNotes && (
                          <div className="text-slate-500 truncate max-w-[220px]">{lead.nextActionNotes}</div>
                        )}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="py-2 px-2">{lead.lastChannel ? channelLabels[lead.lastChannel] : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLeads.length === 0 && (
          <p className="text-center text-slate-400 text-xs mt-4">לא נמצאו לידים לפי הסינון.</p>
        )}
      </section>
    </div>
  );
};

export default Leads;
