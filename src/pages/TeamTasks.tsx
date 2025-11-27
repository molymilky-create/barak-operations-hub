// src/pages/TeamTasks.tsx
import { useState } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import type { TaskStatus, TaskKind, TaskPriority } from "../types";

const statusLabels: Record<TaskStatus, string> = {
  OPEN: "פתוחה",
  IN_PROGRESS: "בטיפול",
  WAITING_CLIENT: "ממתינה ללקוח",
  WAITING_COMPANY: "ממתינה לחברת ביטוח",
  WAITING_MANAGER_REVIEW: "ממתינה לאישור מנהל",
  DONE: "סגורה",
  CANCELLED: "בוטלה",
};

const kindLabels: Record<TaskKind, string> = {
  LEAD: "ליד",
  RENEWAL: "חידוש",
  COLLECTION: "גבייה",
  CARRIER_REQUEST: "בקשה לחברת ביטוח",
  CERTIFICATE: "אישור קיום",
  SERVICE: "שירות / לקוח",
  OTHER: "אחר",
};

const priorityLabels: Record<TaskPriority, string> = {
  LOW: "נמוכה",
  NORMAL: "רגילה",
  HIGH: "גבוהה",
  CRITICAL: "דחופה",
};

const TeamTasks: React.FC = () => {
  const { tasks, employees, updateTaskStatus } = useData();
  const { user, isAdmin } = useAuth();

  if (!user || !isAdmin) {
    return <div className="text-sm text-slate-600">מסך זה מיועד למנהל בלבד. אם אתה המנהל – התחבר עם משתמש מנהל.</div>;
  }

  const [statusFilter, setStatusFilter] = useState<TaskStatus | "ALL">("ALL");
  const [assigneeFilter, setAssigneeFilter] = useState<string | "ALL">("ALL");

  const withAssignee = tasks.map((t) => {
    const emp = employees.find((e) => e.id === t.assignedToUserId);
    return {
      ...t,
      assigneeName: emp?.name || "לא משויך",
    };
  });

  const filtered = withAssignee.filter((t) => {
    if (statusFilter !== "ALL" && t.status !== statusFilter) return false;
    if (assigneeFilter !== "ALL" && t.assigneeName !== assigneeFilter) return false;
    return true;
  });

  const today = new Date().toISOString().slice(0, 10);

  const isOverdue = (dueDate: string, status: TaskStatus) => {
    return status !== "DONE" && status !== "CANCELLED" && dueDate < today;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">משימות הצוות</h1>
      <p className="text-sm text-slate-600">
        כאן המנהל רואה את כל המשימות של כולם, בקלות – מי באיחור, מי מחכה ללקוח, מי מחכה לחברת ביטוח, ומה דורש אישור
        מנהל.
      </p>

      {/* פילטרים */}
      <section className="bg-white rounded-2xl shadow p-4 text-sm space-y-3">
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col">
            <label className="text-xs text-slate-500 mb-1">סטטוס</label>
            <select
              className="border rounded-lg px-2 py-1 text-xs"
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
            <label className="text-xs text-slate-500 mb-1">עובד מטפל</label>
            <select
              className="border rounded-lg px-2 py-1 text-xs"
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value === "ALL" ? "ALL" : e.target.value)}
            >
              <option value="ALL">כולם</option>
              {Array.from(new Set(withAssignee.map((t) => t.assigneeName))).map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* טבלת משימות */}
      <section className="bg-white rounded-2xl shadow p-4 text-xs">
        <h2 className="text-sm font-semibold mb-3">כל המשימות</h2>
        <table className="w-full text-right">
          <thead>
            <tr className="border-b">
              <th className="py-2">כותרת</th>
              <th className="py-2">לקוח</th>
              <th className="py-2">סוג</th>
              <th className="py-2">עובד מטפל</th>
              <th className="py-2">עדיפות</th>
              <th className="py-2">תאריך יעד</th>
              <th className="py-2">סטטוס</th>
              <th className="py-2">אישור מנהל</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr
                key={t.id}
                className={`border-b last:border-0 ${
                  isOverdue(t.dueDate, t.status) ? "bg-red-50" : "hover:bg-slate-50"
                }`}
              >
                <td className="py-2">{t.title}</td>
                <td className="py-2">{t.relatedClientName || "-"}</td>
                <td className="py-2">{kindLabels[t.kind]}</td>
                <td className="py-2">{t.assigneeName}</td>
                <td className="py-2">{priorityLabels[t.priority]}</td>
                <td className="py-2">{t.dueDate}</td>
                <td className="py-2">
                  <select
                    className="border rounded-lg px-2 py-1"
                    value={t.status}
                    onChange={(e) => updateTaskStatus(t.id, e.target.value as TaskStatus)}
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2">
                  {t.requiresManagerReview ? (
                    t.managerApprovedAt ? (
                      <span className="text-emerald-700 font-semibold">אושר {t.managerApprovedAt}</span>
                    ) : (
                      <span className="text-orange-600 font-semibold">ממתין לאישור</span>
                    )
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && <p className="text-center text-slate-400 mt-4">אין משימות לפי הסינון הנוכחי.</p>}
      </section>
    </div>
  );
};

export default TeamTasks;
