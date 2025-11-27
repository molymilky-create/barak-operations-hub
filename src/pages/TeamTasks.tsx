// src/pages/TeamTasks.tsx
import React, { useMemo } from "react";
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

const kindLabels: Record<string, string> = {
  LEAD: "ליד / לקוח חדש",
  RENEWAL: "חידוש",
  COLLECTION: "גבייה",
  CARRIER_REQUEST: "פנייה לחברת ביטוח",
  CERTIFICATE: "אישור קיום",
  SERVICE: "שירות / שינוי פוליסה",
  OTHER: "אחר",
};

const isDoneStatus = (s: TaskStatus) => s === "DONE" || s === "CANCELLED";

const TeamTasks: React.FC = () => {
  const { isAdmin, user } = useAuth();
  const { employees, tasks, updateTaskStatus } = useData();

  if (!user || !isAdmin) {
    return (
      <div dir="rtl" className="p-4">
        גישה למסך זה מותרת למנהל בלבד.
      </div>
    );
  }

  const todayStr = new Date().toISOString().slice(0, 10);

  const tasksByEmployee = useMemo(() => {
    const map: Record<
      string,
      {
        name: string;
        tasks: typeof tasks;
      }
    > = {};

    for (const emp of employees) {
      map[emp.id] = { name: emp.name, tasks: [] as any };
    }

    for (const t of tasks) {
      if (!map[t.assignedToUserId]) continue;
      map[t.assignedToUserId].tasks.push(t);
    }

    return map;
  }, [employees, tasks]);

  const globalStats = useMemo(() => {
    const open = tasks.filter((t) => !isDoneStatus(t.status)).length;
    const overdue = tasks.filter((t) => t.dueDate && t.dueDate < todayStr && !isDoneStatus(t.status)).length;
    const waiting = tasks.filter((t) =>
      ["WAITING_CLIENT", "WAITING_COMPANY", "WAITING_MANAGER_REVIEW"].includes(t.status),
    ).length;

    return { open, overdue, waiting, total: tasks.length };
  }, [tasks, todayStr]);

  return (
    <div dir="rtl" className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">משימות צוות</h1>
      <p className="text-sm text-slate-600">
        כאן המנהל רואה תמונת מצב על כל הצוות: כמה משימות פתוחות לכל עובד, איפה יש עומס, ואיפה יש סיכון לפספס חידושים /
        לידים / גבייה.
      </p>

      {/* סטטיסטיקה כללית לסוכנות */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-slate-500">סה״כ משימות בסוכנות</div>
          <div className="text-2xl font-bold">{globalStats.total}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-slate-500">פתוחות / בתהליך</div>
          <div className="text-2xl font-bold text-blue-700">{globalStats.open}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-slate-500">באיחור</div>
          <div className="text-2xl font-bold text-red-600">{globalStats.overdue}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-slate-500">ממתינות ללקוח / חברת ביטוח / מנהל</div>
          <div className="text-2xl font-bold text-amber-600">{globalStats.waiting}</div>
        </div>
      </div>

      {/* טבלה לפי עובדים */}
      <section className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-sm font-semibold mb-3">חלוקת משימות לפי עובדים</h2>
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="py-2 px-2">עובד</th>
              <th className="py-2 px-2">סה״כ</th>
              <th className="py-2 px-2">פתוחות</th>
              <th className="py-2 px-2">באיחור</th>
              <th className="py-2 px-2">ממתינות</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(tasksByEmployee).map(([empId, data]) => {
              const list = data.tasks;
              const total = list.length;
              const open = list.filter((t) => !isDoneStatus(t.status)).length;
              const overdue = list.filter((t) => t.dueDate && t.dueDate < todayStr && !isDoneStatus(t.status)).length;
              const waiting = list.filter((t) =>
                ["WAITING_CLIENT", "WAITING_COMPANY", "WAITING_MANAGER_REVIEW"].includes(t.status),
              ).length;

              if (total === 0) return null;

              return (
                <tr key={empId} className="border-b last:border-0">
                  <td className="py-2 px-2">{data.name}</td>
                  <td className="py-2 px-2 font-semibold">{total}</td>
                  <td className="py-2 px-2">{open}</td>
                  <td className="py-2 px-2 text-red-600">{overdue}</td>
                  <td className="py-2 px-2 text-amber-700">{waiting}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* פירוט משימות לכל הסוכנות – כמו "תיבת בקרת איכות" */}
      <section className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-sm font-semibold mb-3">רשימת משימות מפורטת</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="py-2 px-2">משימה</th>
                <th className="py-2 px-2">עובד</th>
                <th className="py-2 px-2">לקוח</th>
                <th className="py-2 px-2">סוג</th>
                <th className="py-2 px-2">סטטוס</th>
                <th className="py-2 px-2">עדיפות</th>
                <th className="py-2 px-2">יעד</th>
                <th className="py-2 px-2">עדכון מהיר</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => {
                const emp = employees.find((e) => e.id === t.assignedToUserId);
                const overdue = t.dueDate && t.dueDate < todayStr && !isDoneStatus(t.status);

                return (
                  <tr key={t.id} className={`border-b last:border-0 ${overdue ? "bg-red-50/60" : ""}`}>
                    <td className="py-2 px-2 max-w-xs">
                      <div className="font-semibold text-slate-800">{t.title}</div>
                      {t.description && <div className="text-[11px] text-slate-500 line-clamp-2">{t.description}</div>}
                    </td>
                    <td className="py-2 px-2">{emp?.name || "-"}</td>
                    <td className="py-2 px-2">{t.relatedClientName || "-"}</td>
                    <td className="py-2 px-2">{kindLabels[t.kind] || t.kind}</td>
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
                    <td className="py-2 px-2">
                      <span className={`text-xs ${overdue ? "text-red-700 font-semibold" : ""}`}>
                        {t.dueDate || "-"}
                      </span>
                    </td>
                    <td className="py-2 px-2">
                      <div className="flex gap-1 justify-end">
                        {!isDoneStatus(t.status) && (
                          <button
                            type="button"
                            className="px-2 py-1 rounded-full bg-emerald-600 text-white"
                            onClick={() => updateTaskStatus(t.id, "DONE")}
                          >
                            סמן הושלם
                          </button>
                        )}
                        {t.status !== "CANCELLED" && (
                          <button
                            type="button"
                            className="px-2 py-1 rounded-full border border-slate-300 text-slate-600"
                            onClick={() => updateTaskStatus(t.id, "CANCELLED")}
                          >
                            ביטול
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-slate-400 text-xs">
                    עדיין אין משימות במערכת.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[11px] text-slate-400">
          בהמשך אפשר להוסיף מכאן פילוחים לפי חברה, ענף (סוסים, רכב, עסקים), ולדווח אוטומטית ללובי של המנהל על משימות
          בסיכון.
        </p>
      </section>
    </div>
  );
};

export default TeamTasks;
