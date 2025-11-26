// src/pages/MyTasks.tsx
import React, { useMemo } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import type { TaskStatus } from "../types";

const statusLabels: Record<TaskStatus, string> = {
  OPEN: "פתוח",
  IN_PROGRESS: "בתהליך",
  WAITING_CLIENT: "ממתין ללקוח",
  WAITING_COMPANY: "ממתין לחברת ביטוח",
  WAITING_MANAGER_REVIEW: "ממתין לאישור מנהל",
  DONE: "סגור",
  CANCELLED: "בוטל",
};

const MyTasks: React.FC = () => {
  const { user } = useAuth();
  const { tasks, updateTaskStatus } = useData();

  if (!user) {
    return <div>אין משתמש מחובר.</div>;
  }

  const todayStr = new Date().toISOString().slice(0, 10);

  const myTasks = useMemo(() => tasks.filter((t) => t.assignedToUserId === user.id), [tasks, user.id]);

  const overdue = myTasks.filter((t) => t.dueDate < todayStr && t.status !== "DONE" && t.status !== "CANCELLED");
  const dueToday = myTasks.filter((t) => t.dueDate === todayStr && t.status !== "DONE" && t.status !== "CANCELLED");
  const waiting = myTasks.filter((t) => ["WAITING_CLIENT", "WAITING_COMPANY"].includes(t.status));

  const changeStatus = (id: string, status: TaskStatus) => {
    updateTaskStatus(id, status);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold text-slate-800">המשימות שלי</h1>
      <p className="text-sm text-slate-600">כאן תראה את כל המשימות שמוקצות אליך – לפי דחיפות וסטטוס.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="bg-white rounded-2xl shadow p-3">
          <div className="text-slate-500">באיחור</div>
          <div className="text-2xl font-bold text-red-600">{overdue.length}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-3">
          <div className="text-slate-500">להיום</div>
          <div className="text-2xl font-bold text-orange-500">{dueToday.length}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-3">
          <div className="text-slate-500">ממתין (לקוח/חברה)</div>
          <div className="text-2xl font-bold text-slate-700">{waiting.length}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-3">
          <div className="text-slate-500">סה&quot;כ משימות</div>
          <div className="text-2xl font-bold text-slate-800">{myTasks.length}</div>
        </div>
      </div>

      <section className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-sm font-semibold mb-3">רשימת משימות</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b">
                <th className="py-2">משימה</th>
                <th className="py-2">סוג</th>
                <th className="py-2">מבוטח / לקוח</th>
                <th className="py-2">תאריך יעד</th>
                <th className="py-2">סטטוס</th>
                <th className="py-2">עדיפות</th>
              </tr>
            </thead>
            <tbody>
              {myTasks.map((task) => {
                const isOverdue = task.dueDate < todayStr && task.status !== "DONE" && task.status !== "CANCELLED";
                return (
                  <tr key={task.id} className="border-b last:border-0">
                    <td className="py-2">
                      <div className="font-semibold text-slate-800">{task.title}</div>
                      {task.description && <div className="text-xs text-slate-500">{task.description}</div>}
                    </td>
                    <td className="py-2 text-xs">{task.kind}</td>
                    <td className="py-2 text-xs">{task.relatedClientName || "-"}</td>
                    <td className="py-2 text-xs">
                      {task.dueDate} {isOverdue && <span className="text-red-600 font-semibold">(באיחור)</span>}
                    </td>
                    <td className="py-2 text-xs">
                      <select
                        className="border rounded-lg px-2 py-1 text-xs"
                        value={task.status}
                        onChange={(e) => changeStatus(task.id, e.target.value as TaskStatus)}
                      >
                        {(Object.keys(statusLabels) as TaskStatus[]).map((st) => (
                          <option key={st} value={st}>
                            {statusLabels[st]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 text-xs">
                      {task.priority === "CRITICAL" && (
                        <span className="px-2 py-1 rounded-full bg-red-100 text-red-700">קריטי</span>
                      )}
                      {task.priority === "HIGH" && (
                        <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-700">גבוה</span>
                      )}
                      {task.priority === "NORMAL" && (
                        <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700">רגיל</span>
                      )}
                      {task.priority === "LOW" && (
                        <span className="px-2 py-1 rounded-full bg-slate-50 text-slate-400">נמוך</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {myTasks.length === 0 && <p className="text-xs text-slate-500 mt-3">כרגע אין משימות שהוקצו אליך.</p>}
        </div>
      </section>
    </div>
  );
};

export default MyTasks;
