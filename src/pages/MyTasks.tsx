// src/pages/MyTasks.tsx
import React, { useMemo, useState } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import type { TaskStatus, TaskPriority } from "../types";

const statusLabels: Record<TaskStatus, string> = {
  OPEN: "פתוחה",
  IN_PROGRESS: "בטיפול",
  WAITING_CLIENT: "ממתינה ללקוח",
  WAITING_COMPANY: "ממתינה לחברת ביטוח",
  WAITING_MANAGER_REVIEW: "ממתינה לאישור מנהל",
  DONE: "הושלמה",
  CANCELLED: "בוטלה",
};

const statusClasses: Record<TaskStatus, string> = {
  OPEN: "bg-slate-100 text-slate-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  WAITING_CLIENT: "bg-amber-100 text-amber-800",
  WAITING_COMPANY: "bg-purple-100 text-purple-800",
  WAITING_MANAGER_REVIEW: "bg-orange-100 text-orange-800",
  DONE: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-rose-100 text-rose-700",
};

const priorityLabels: Record<TaskPriority, string> = {
  LOW: "נמוכה",
  NORMAL: "רגילה",
  HIGH: "גבוהה",
  CRITICAL: "דחופה מאוד",
};

const priorityClasses: Record<TaskPriority, string> = {
  LOW: "border-slate-300 text-slate-500",
  NORMAL: "border-sky-400 text-sky-600",
  HIGH: "border-orange-500 text-orange-600",
  CRITICAL: "border-red-600 text-red-700",
};

// בכוונה Record<string,string> כדי שלא יישבר אם נוסיף TYPE חדש
const kindLabels: Record<string, string> = {
  LEAD: "ליד / לקוח חדש",
  RENEWAL: "חידוש",
  COLLECTION: "גבייה",
  CARRIER_REQUEST: "פנייה לחברת ביטוח",
  CERTIFICATE: "אישור קיום",
  SERVICE: "שירות / שינוי פוליסה",
  OTHER: "אחר",
};

const kindClasses: Record<string, string> = {
  LEAD: "bg-teal-50 text-teal-700",
  RENEWAL: "bg-indigo-50 text-indigo-700",
  COLLECTION: "bg-amber-50 text-amber-700",
  CARRIER_REQUEST: "bg-purple-50 text-purple-700",
  CERTIFICATE: "bg-emerald-50 text-emerald-700",
  SERVICE: "bg-sky-50 text-sky-700",
  OTHER: "bg-slate-50 text-slate-600",
};

const isDoneStatus = (s: TaskStatus) => s === "DONE" || s === "CANCELLED";

const MyTasks: React.FC = () => {
  const { user } = useAuth();
  const { tasks, updateTaskStatus } = useData();

  if (!user) {
    return (
      <div dir="rtl" className="p-4">
        יש להתחבר למערכת.
      </div>
    );
  }

  const todayStr = new Date().toISOString().slice(0, 10);

  const myTasks = useMemo(() => tasks.filter((t) => t.assignedToUserId === user.id), [tasks, user.id]);

  const [statusFilter, setStatusFilter] = useState<TaskStatus | "ALL">("OPEN");
  const [kindFilter, setKindFilter] = useState<string | "ALL">("ALL");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const isOverdue = (dueDate?: string, status?: TaskStatus) => {
    if (!dueDate) return false;
    if (!status || isDoneStatus(status)) return false;
    return dueDate < todayStr;
  };

  const filteredTasks = useMemo(() => {
    return myTasks.filter((t) => {
      if (statusFilter !== "ALL" && t.status !== statusFilter) return false;
      if (kindFilter !== "ALL" && t.kind !== kindFilter) return false;
      if (priorityFilter !== "ALL" && t.priority !== priorityFilter) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const haystack = [t.title, t.description || "", t.relatedClientName || ""].join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [myTasks, statusFilter, kindFilter, priorityFilter, search]);

  const stats = useMemo(() => {
    const open = myTasks.filter((t) => !isDoneStatus(t.status)).length;
    const overdue = myTasks.filter((t) => isOverdue(t.dueDate, t.status)).length;
    const today = myTasks.filter((t) => t.dueDate === todayStr && !isDoneStatus(t.status)).length;
    const waiting = myTasks.filter((t) =>
      ["WAITING_CLIENT", "WAITING_COMPANY", "WAITING_MANAGER_REVIEW"].includes(t.status),
    ).length;

    return { open, overdue, today, waiting, total: myTasks.length };
  }, [myTasks, todayStr]);

  const handleQuickAction = (id: string, action: "start" | "done" | "cancel") => {
    switch (action) {
      case "start":
        updateTaskStatus(id, "IN_PROGRESS");
        break;
      case "done":
        updateTaskStatus(id, "DONE");
        break;
      case "cancel":
        updateTaskStatus(id, "CANCELLED");
        break;
    }
  };

  return (
    <div dir="rtl" className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">המשימות שלי</h1>
      <p className="text-sm text-slate-600">
        כאן אתה רואה את כל המשימות שהוקצו אליך – חידושים, לידים, גבייה, בקשות לחברות ביטוח ועוד. המטרה: שלא תלך לאיבוד
        שום דבר.
      </p>

      {/* כרטיסי סטטיסטיקה מהירה */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-slate-500">סה״כ משימות שלי</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-slate-500">פתוחות / בתהליך</div>
          <div className="text-2xl font-bold text-blue-700">{stats.open}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-slate-500">באיחור</div>
          <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-slate-500">ממתינות ללקוח / חברה</div>
          <div className="text-2xl font-bold text-amber-600">{stats.waiting}</div>
        </div>
      </div>

      {/* פילטרים בסגנון CRM */}
      <section className="bg-white rounded-2xl shadow p-4 space-y-3 text-xs">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col">
            <label className="mb-1 text-slate-500">סטטוס</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value === "ALL" ? "ALL" : (e.target.value as TaskStatus))}
              className="border rounded-lg px-2 py-1 text-xs"
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
            <label className="mb-1 text-slate-500">סוג משימה</label>
            <select
              value={kindFilter}
              onChange={(e) => setKindFilter(e.target.value === "ALL" ? "ALL" : e.target.value)}
              className="border rounded-lg px-2 py-1 text-xs"
            >
              <option value="ALL">הכל</option>
              {Object.entries(kindLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-slate-500">עדיפות</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value === "ALL" ? "ALL" : (e.target.value as TaskPriority))}
              className="border rounded-lg px-2 py-1 text-xs"
            >
              <option value="ALL">הכל</option>
              {Object.entries(priorityLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 flex flex-col">
            <label className="mb-1 text-slate-500">חיפוש חופשי</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="חפש לפי לקוח, כותרת משימה, הערות..."
              className="border rounded-lg px-3 py-1 text-xs"
            />
          </div>

          <button
            type="button"
            className="mt-4 px-3 py-1 rounded-full border border-slate-300 text-slate-700 text-xs"
            onClick={() => {
              setStatusFilter("OPEN");
              setKindFilter("ALL");
              setPriorityFilter("ALL");
              setSearch("");
            }}
          >
            איפוס פילטרים
          </button>
        </div>
      </section>

      {/* רשימת משימות */}
      <section className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-sm font-semibold mb-3">רשימת משימות</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="py-2 px-2">משימה</th>
                <th className="py-2 px-2">לקוח</th>
                <th className="py-2 px-2">סוג</th>
                <th className="py-2 px-2">סטטוס</th>
                <th className="py-2 px-2">עדיפות</th>
                <th className="py-2 px-2">נוצרה</th>
                <th className="py-2 px-2">תאריך יעד</th>
                <th className="py-2 px-2">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((t) => {
                const overdue = isOverdue(t.dueDate, t.status);
                return (
                  <tr key={t.id} className={`border-b last:border-0 ${overdue ? "bg-red-50/60" : ""}`}>
                    <td className="py-2 px-2 max-w-xs">
                      <div className="font-semibold text-slate-800">{t.title}</div>
                      {t.description && <div className="text-[11px] text-slate-500 line-clamp-2">{t.description}</div>}
                    </td>
                    <td className="py-2 px-2 text-slate-700">{t.relatedClientName || "-"}</td>
                    <td className="py-2 px-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          kindClasses[t.kind] || "bg-slate-50 text-slate-600"
                        }`}
                      >
                        {kindLabels[t.kind] || t.kind}
                      </span>
                    </td>
                    <td className="py-2 px-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          statusClasses[t.status]
                        }`}
                      >
                        {statusLabels[t.status]}
                      </span>
                    </td>
                    <td className="py-2 px-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium border ${
                          priorityClasses[t.priority]
                        }`}
                      >
                        {priorityLabels[t.priority]}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-slate-500">{t.createdAt || "-"}</td>
                    <td className="py-2 px-2">
                      <div className={`text-xs ${overdue ? "text-red-700 font-semibold" : ""}`}>
                        {t.dueDate || "-"}
                        {overdue && <span className="mr-1 text-[11px]">(באיחור)</span>}
                      </div>
                    </td>
                    <td className="py-2 px-2">
                      <div className="flex gap-1 justify-end">
                        {!isDoneStatus(t.status) && t.status === "OPEN" && (
                          <button
                            type="button"
                            className="px-2 py-1 rounded-full bg-blue-600 text-white"
                            onClick={() => handleQuickAction(t.id, "start")}
                          >
                            התחל טיפול
                          </button>
                        )}
                        {!isDoneStatus(t.status) && (
                          <button
                            type="button"
                            className="px-2 py-1 rounded-full bg-emerald-600 text-white"
                            onClick={() => handleQuickAction(t.id, "done")}
                          >
                            סיום
                          </button>
                        )}
                        {t.status !== "CANCELLED" && (
                          <button
                            type="button"
                            className="px-2 py-1 rounded-full border border-slate-300 text-slate-600"
                            onClick={() => handleQuickAction(t.id, "cancel")}
                          >
                            ביטול
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-slate-400 text-xs">
                    אין משימות מתאימות לפילטרים שנבחרו.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <p className="text-[11px] text-slate-400">
        בהמשך נוכל להוסיף מכאן כפתורי וואטסאפ/טלפון/אימייל ישירות ללקוח, ותזכורות אוטומטיות ב-SMS – בדיוק כמו Focus /
        באפי.
      </p>
    </div>
  );
};

export default MyTasks;
