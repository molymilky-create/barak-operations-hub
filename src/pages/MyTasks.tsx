// src/pages/MyTasks.tsx
import React, { useMemo, useState } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import type { TaskStatus, TaskKind, TaskPriority, Task } from "../types";

const statusLabels: Record<TaskStatus, string> = {
  OPEN: "פתוחה",
  IN_PROGRESS: "בטיפול",
  WAITING_CLIENT: "ממתין ללקוח",
  WAITING_COMPANY: "ממתין לחברת ביטוח",
  WAITING_MANAGER_REVIEW: "ממתין לאישור מנהל",
  DONE: "הסתיים",
  CANCELLED: "בוטל",
};

const statusColors: Record<TaskStatus, string> = {
  OPEN: "bg-sky-100 text-sky-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  WAITING_CLIENT: "bg-amber-100 text-amber-800",
  WAITING_COMPANY: "bg-purple-100 text-purple-800",
  WAITING_MANAGER_REVIEW: "bg-orange-100 text-orange-800",
  DONE: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-slate-100 text-slate-500",
};

const kindLabels: Record<TaskKind, string> = {
  LEAD: "ליד",
  RENEWAL: "חידוש",
  COLLECTION: "גבייה",
  CARRIER_REQUEST: "בקשה לחברת ביטוח",
  CERTIFICATE: "אישור קיום",
  SERVICE: "שירות / טיפול שוטף",
  OTHER: "אחר",
};

const priorityLabels: Record<TaskPriority, string> = {
  LOW: "נמוכה",
  NORMAL: "רגילה",
  HIGH: "גבוהה",
  CRITICAL: "דחופה מאוד",
};

const priorityColors: Record<TaskPriority, string> = {
  LOW: "bg-slate-100 text-slate-700",
  NORMAL: "bg-sky-100 text-sky-800",
  HIGH: "bg-orange-100 text-orange-800",
  CRITICAL: "bg-red-100 text-red-800",
};

const MyTasks: React.FC = () => {
  const { user } = useAuth();
  const { tasks, updateTaskStatus } = useData();

  const [statusFilter, setStatusFilter] = useState<TaskStatus | "ALL">("OPEN");
  const [kindFilter, setKindFilter] = useState<TaskKind | "ALL">("ALL");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const todayStr = new Date().toISOString().slice(0, 10);

  const myTasks = useMemo(() => tasks.filter((t) => t.assignedToUserId === user?.id), [tasks, user]);

  const filteredTasks = useMemo(() => {
    return myTasks.filter((t) => {
      if (statusFilter !== "ALL" && t.status !== statusFilter) return false;
      if (kindFilter !== "ALL" && t.kind !== kindFilter) return false;
      if (priorityFilter !== "ALL" && t.priority !== priorityFilter) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const haystack = (t.title || "") + " " + (t.description || "") + " " + (t.relatedClientName || "");
        if (!haystack.toLowerCase().includes(q)) return false;
      }

      return true;
    });
  }, [myTasks, statusFilter, kindFilter, priorityFilter, search]);

  const countByStatus = (status: TaskStatus) => myTasks.filter((t) => t.status === status).length;

  const overdueCount = myTasks.filter(
    (t) => t.dueDate < todayStr && t.status !== "DONE" && t.status !== "CANCELLED",
  ).length;

  const todayCount = myTasks.filter(
    (t) => t.dueDate === todayStr && t.status !== "DONE" && t.status !== "CANCELLED",
  ).length;

  const waitingManagerCount = myTasks.filter((t) => t.status === "WAITING_MANAGER_REVIEW").length;

  const isOverdue = (task: Task) => task.dueDate < todayStr && task.status !== "DONE" && task.status !== "CANCELLED";

  const canMarkDone = (task: Task) => task.status !== "DONE" && task.status !== "CANCELLED";

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">המשימות שלי</h1>
          <p className="text-sm text-slate-500">כל מה שאתה צריך לטפל בו היום – חידושים, לידים, גבייה ועוד.</p>
        </div>
      </div>

      {/* כרטיסי סטטוס עליונים */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl shadow p-3">
          <div className="text-xs text-slate-500 mb-1">משימות פתוחות</div>
          <div className="text-2xl font-bold text-slate-800">
            {countByStatus("OPEN") + countByStatus("IN_PROGRESS")}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-3">
          <div className="text-xs text-slate-500 mb-1">משימות להיום</div>
          <div className="text-2xl font-bold text-blue-700">{todayCount}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-3">
          <div className="text-xs text-slate-500 mb-1">באיחור</div>
          <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-3">
          <div className="text-xs text-slate-500 mb-1">ממתין לאישור מנהל</div>
          <div className="text-2xl font-bold text-orange-600">{waitingManagerCount}</div>
        </div>
      </div>

      {/* פילטרים */}
      <section className="bg-white rounded-2xl shadow p-4 space-y-3 text-xs">
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col">
            <span className="mb-1 text-slate-500">חיפוש חופשי</span>
            <input
              type="text"
              className="border rounded-lg px-3 py-1 min-w-[200px]"
              placeholder="חפש לפי מבוטח / כותרת / תיאור..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <span className="mb-1 text-slate-500">סטטוס</span>
            <select
              className="border rounded-lg px-2 py-1"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value === "ALL" ? "ALL" : (e.target.value as TaskStatus))}
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
            <span className="mb-1 text-slate-500">סוג משימה</span>
            <select
              className="border rounded-lg px-2 py-1"
              value={kindFilter}
              onChange={(e) => setKindFilter(e.target.value === "ALL" ? "ALL" : (e.target.value as TaskKind))}
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
            <span className="mb-1 text-slate-500">עדיפות</span>
            <select
              className="border rounded-lg px-2 py-1"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value === "ALL" ? "ALL" : (e.target.value as TaskPriority))}
            >
              <option value="ALL">הכל</option>
              {Object.entries(priorityLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* טבלת משימות */}
      <section className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-sm font-semibold mb-3">רשימת משימות</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="py-2 px-2">תאריך יעד</th>
                <th className="py-2 px-2">כותרת</th>
                <th className="py-2 px-2">מבוטח</th>
                <th className="py-2 px-2">סוג</th>
                <th className="py-2 px-2">עדיפות</th>
                <th className="py-2 px-2">סטטוס</th>
                <th className="py-2 px-2">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((t) => (
                <tr key={t.id} className={"border-b last:border-0 " + (isOverdue(t) ? "bg-red-50" : "")}>
                  <td className="py-2 px-2 whitespace-nowrap">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{t.dueDate}</span>
                      {isOverdue(t) && <span className="text-[10px] text-red-700">באיחור</span>}
                      {t.dueDate === todayStr && !isOverdue(t) && (
                        <span className="text-[10px] text-blue-600">היום</span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-2">
                    <div className="font-semibold text-slate-800">{t.title}</div>
                    {t.description && <div className="text-[11px] text-slate-500 line-clamp-2">{t.description}</div>}
                  </td>
                  <td className="py-2 px-2">{t.relatedClientName || <span className="text-slate-400">-</span>}</td>
                  <td className="py-2 px-2">
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] bg-slate-100 text-slate-700">
                      {kindLabels[t.kind]}
                    </span>
                  </td>
                  <td className="py-2 px-2">
                    <span
                      className={
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] " + priorityColors[t.priority]
                      }
                    >
                      {priorityLabels[t.priority]}
                    </span>
                  </td>
                  <td className="py-2 px-2">
                    <span
                      className={
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] " + statusColors[t.status]
                      }
                    >
                      {statusLabels[t.status]}
                    </span>
                  </td>
                  <td className="py-2 px-2">
                    <div className="flex flex-wrap gap-1 justify-end">
                      {t.status !== "CANCELLED" && t.status !== "DONE" && (
                        <button
                          type="button"
                          className="px-2 py-0.5 rounded-full border border-slate-300 text-[11px] hover:bg-slate-100"
                          onClick={() => updateTaskStatus(t.id, "IN_PROGRESS")}
                        >
                          לטיפול
                        </button>
                      )}
                      {canMarkDone(t) && (
                        <button
                          type="button"
                          className="px-2 py-0.5 rounded-full border border-emerald-500 text-[11px] text-emerald-700 hover:bg-emerald-50"
                          onClick={() => updateTaskStatus(t.id, "DONE")}
                        >
                          סמן כהסתיים
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-slate-400 text-xs">
                    אין משימות בהתאם לפילטרים.
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

export default MyTasks;
