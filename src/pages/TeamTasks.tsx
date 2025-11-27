// src/pages/TeamTasks.tsx
import React, { useMemo } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import type { Task, TaskStatus, TaskKind, TaskPriority } from "../types";

const statusLabels: Record<TaskStatus, string> = {
  OPEN: "פתוח",
  IN_PROGRESS: "בטיפול",
  WAITING_CLIENT: "ממתין ללקוח",
  WAITING_COMPANY: "ממתין לחברת ביטוח",
  WAITING_MANAGER_REVIEW: "ממתין לאישור מנהל",
  DONE: "הושלם",
  CANCELLED: "בוטל",
};

const kindLabels: Record<TaskKind, string> = {
  LEAD: "ליד",
  RENEWAL: "חידוש",
  COLLECTION: "גבייה",
  CARRIER_REQUEST: "בקשה לחברת ביטוח",
  CERTIFICATE: "אישור קיום",
  OTHER: "אחר",
};

const priorityLabels: Record<TaskPriority, string> = {
  LOW: "נמוכה",
  NORMAL: "רגילה",
  HIGH: "גבוהה",
  CRITICAL: "דחופה",
};

const TeamTasks: React.FC = () => {
  const { employees, tasks, updateTaskStatus } = useData();
  const { user, isAdmin } = useAuth();

  if (!user || !isAdmin) {
    return <div>גישה מותרת למנהל בלבד.</div>;
  }

  const todayStr = new Date().toISOString().slice(0, 10);

  const stats = useMemo(() => {
    const total = tasks.length;
    const open = tasks.filter((t) =>
      ["OPEN", "IN_PROGRESS", "WAITING_CLIENT", "WAITING_COMPANY"].includes(t.status),
    ).length;
    const overdue = tasks.filter((t) => t.dueDate < todayStr && !["DONE", "CANCELLED"].includes(t.status)).length;
    const waitingManager = tasks.filter((t) => t.status === "WAITING_MANAGER_REVIEW").length;

    return { total, open, overdue, waitingManager };
  }, [tasks, todayStr]);

  const tasksWithEmployee = tasks.map((t) => ({
    task: t,
    employee: employees.find((e) => e.id === t.assignedToUserId),
  }));

  const changeStatus = (task: Task, status: TaskStatus) => {
    updateTaskStatus(task.id, status);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-2">
        <h1 className="text-2xl font-bold text-slate-800">משימות צוות</h1>
        <div className="text-xs text-slate-500">
          מסך למנהל: מעקב אחרי כל המשימות בסוכנות, כולל חידושים, לידים, גבייה ובקשות לחברות הביטוח.
        </div>
      </div>

      {/* כרטיסי סטטוס */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-slate-500 mb-1">משימות פתוחות</div>
          <div className="text-2xl font-bold text-blue-700">{stats.open.toLocaleString("he-IL")}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-slate-500 mb-1">משימות באיחור</div>
          <div className="text-2xl font-bold text-red-600">{stats.overdue.toLocaleString("he-IL")}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-slate-500 mb-1">ממתינות לאישור מנהל</div>
          <div className="text-2xl font-bold text-orange-600">{stats.waitingManager.toLocaleString("he-IL")}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-slate-500 mb-1">סה״כ משימות</div>
          <div className="text-2xl font-bold">{stats.total.toLocaleString("he-IL")}</div>
        </div>
      </div>

      {/* טבלת משימות לכל העובדים */}
      <section className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-sm font-semibold mb-3">משימות לפי עובדים</h2>
        <div className="overflow-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="py-2 px-2">עובד</th>
                <th className="py-2 px-2">כותרת משימה</th>
                <th className="py-2 px-2">לקוח</th>
                <th className="py-2 px-2">סוג</th>
                <th className="py-2 px-2">עדיפות</th>
                <th className="py-2 px-2">תאריך יעד</th>
                <th className="py-2 px-2">סטטוס</th>
                <th className="py-2 px-2">אישור מנהל</th>
              </tr>
            </thead>
            <tbody>
              {tasksWithEmployee.map(({ task, employee }) => {
                const overdue = task.dueDate < todayStr && !["DONE", "CANCELLED"].includes(task.status);
                return (
                  <tr key={task.id} className={`border-b last:border-0 ${overdue ? "bg-red-50/40" : ""}`}>
                    <td className="py-2 px-2">{employee?.name || "לא משויך"}</td>
                    <td className="py-2 px-2">
                      <div className="font-medium">{task.title}</div>
                      {task.description && <div className="text-slate-500 truncate max-w-xs">{task.description}</div>}
                    </td>
                    <td className="py-2 px-2">{task.relatedClientName || "-"}</td>
                    <td className="py-2 px-2">{kindLabels[task.kind] || task.kind}</td>
                    <td className="py-2 px-2">{priorityLabels[task.priority]}</td>
                    <td className="py-2 px-2">
                      <div>{task.dueDate}</div>
                      {overdue && <div className="text-[11px] text-red-600">באיחור</div>}
                    </td>
                    <td className="py-2 px-2">
                      <select
                        className="border rounded-lg px-2 py-1"
                        value={task.status}
                        onChange={(e) => changeStatus(task, e.target.value as TaskStatus)}
                      >
                        {(Object.keys(statusLabels) as TaskStatus[]).map((status) => (
                          <option key={status} value={status}>
                            {statusLabels[status]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-2">
                      {task.requiresManagerReview ? (
                        task.managerApprovedAt ? (
                          <span className="text-[11px] text-emerald-700">אושר בתאריך {task.managerApprovedAt}</span>
                        ) : (
                          <span className="text-[11px] text-orange-600">ממתין לאישור מנהל</span>
                        )
                      ) : (
                        <span className="text-[11px] text-slate-400">לא נדרש</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {tasksWithEmployee.length === 0 && <div className="text-center py-6 text-slate-400">אין משימות במערכת.</div>}
        </div>

        <p className="mt-3 text-[11px] text-slate-500">
          בהמשך אפשר להוסיף כאן פילטרים לפי עובד, סוג משימה (לידים, חידושים, בקשות לחברות), וחודש – כדי להוציא דוחות
          עבודה.
        </p>
      </section>
    </div>
  );
};

export default TeamTasks;
