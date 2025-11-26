// src/pages/TeamTasks.tsx
import React, { useMemo } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";

const TeamTasks: React.FC = () => {
  const { isAdmin, user } = useAuth();
  const { tasks, employees } = useData();

  if (!user || !isAdmin) {
    return <div>גישה מותרת למנהל בלבד.</div>;
  }

  const todayStr = new Date().toISOString().slice(0, 10);

  const tasksByEmployee = useMemo(() => {
    const map: Record<string, typeof tasks> = {};
    for (const emp of employees) {
      map[emp.id] = [];
    }
    for (const t of tasks) {
      if (!map[t.assignedToUserId]) {
        map[t.assignedToUserId] = [];
      }
      map[t.assignedToUserId].push(t);
    }
    return map;
  }, [tasks, employees]);

  const countOverdue = (list: typeof tasks) =>
    list.filter((t) => t.dueDate < todayStr && t.status !== "DONE" && t.status !== "CANCELLED").length;

  const countOpen = (list: typeof tasks) => list.filter((t) => t.status !== "DONE" && t.status !== "CANCELLED").length;

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold text-slate-800">משימות צוות – ניהול</h1>
      <p className="text-sm text-slate-600">
        כאן המנהל רואה את המשימות של כל העובדים – כדי למנוע טעויות, לראות עומסים ולטפל בעיכובים.
      </p>

      <div className="space-y-4">
        {employees.map((emp) => {
          const empTasks = tasksByEmployee[emp.id] || [];
          if (empTasks.length === 0) {
            return null;
          }

          return (
            <section key={emp.id} className="bg-white rounded-2xl shadow p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-slate-800">
                    {emp.name} ({emp.position || "עובד"})
                  </div>
                  <div className="text-xs text-slate-500">{emp.email}</div>
                </div>
                <div className="flex gap-3 text-xs">
                  <div>
                    <div className="text-slate-500">משימות פתוחות</div>
                    <div className="text-lg font-bold text-slate-800">{countOpen(empTasks)}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">באיחור</div>
                    <div className="text-lg font-bold text-red-600">{countOverdue(empTasks)}</div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2">משימה</th>
                      <th className="py-2">סוג</th>
                      <th className="py-2">מבוטח / לקוח</th>
                      <th className="py-2">יעד</th>
                      <th className="py-2">סטטוס</th>
                      <th className="py-2">עדיפות</th>
                      <th className="py-2">צריך אישור מנהל?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {empTasks.map((t) => (
                      <tr key={t.id} className="border-b last:border-0">
                        <td className="py-2">
                          <div className="font-semibold text-slate-800">{t.title}</div>
                          {t.description && <div className="text-xs text-slate-500">{t.description}</div>}
                        </td>
                        <td className="py-2 text-xs">{t.kind}</td>
                        <td className="py-2 text-xs">{t.relatedClientName || "-"}</td>
                        <td className="py-2 text-xs">{t.dueDate}</td>
                        <td className="py-2 text-xs">{t.status}</td>
                        <td className="py-2 text-xs">{t.priority}</td>
                        <td className="py-2 text-xs">{t.requiresManagerReview ? "כן" : "לא"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default TeamTasks;
