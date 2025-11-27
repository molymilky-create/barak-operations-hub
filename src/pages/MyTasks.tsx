// src/pages/MyTasks.tsx
import React, { useMemo, useState } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import type { Task, TaskStatus, TaskKind, TaskPriority } from "../types";

const kindLabels: Record<TaskKind, string> = {
  LEAD: "ליד",
  RENEWAL: "חידוש",
  COLLECTION: "גבייה",
  CARRIER_REQUEST: "בקשה לחברת ביטוח",
  CERTIFICATE: "אישור קיום",
  SERVICE: "שירות / טיפול שוטף",
  OTHER: "אחר",
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

const priorityClasses: Record<TaskPriority, string> = {
  LOW: "bg-slate-100 text-slate-600",
  NORMAL: "bg-blue-50 text-blue-700",
  HIGH: "bg-orange-50 text-orange-700",
  CRITICAL: "bg-red-50 text-red-700",
};

const MyTasks: React.FC = () => {
  const { tasks, updateTaskStatus } = useData();
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "ALL">("ALL");

  if (!user) {
    return <div>אין משתמש מחובר.</div>;
  }

  const todayStr = new Date().toISOString().slice(0, 10);

  const myTasks = useMemo(() => tasks.filter((t) => t.assignedToUserId === user.id), [tasks, user.id]);

  const filtered = useMemo(() => {
    if (statusFilter === "ALL") return myTasks;
    return myTasks.filter((t) => t.status === statusFilter);
  }, [myTasks, statusFilter]);

  const stats = useMemo(() => {
    const total = myTasks.length;
    const open = myTasks.filter((t) =>
      ["OPEN", "IN_PROGRESS", "WAITING_CLIENT", "WAITING_COMPANY"].includes(t.status),
    ).length;
    const overdue = myTasks.filter((t) => t.dueDate < todayStr && !["DONE", "CANCELLED"].includes(t.status)).length;
    const waitingManager = myTasks.filter((t) => t.status === "WAITING_MANAGER_REVIEW").length;

    return { total, open, overdue, waitingManager };
  }, [myTasks, todayStr]);

  const changeStatus = (task: Task, status: TaskStatus) => {
    updateTaskStatus(task.id, status);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-2">
        <h1 className="text-2xl font-bold text-slate-800">המשימות שלי</h1>
        <div className="text-xs text-slate-500">
          כאן אתה רואה את כל מה שממתין לטיפול שלך – חידושים, לידים, גבייה, בקשות לחברת ביטוח ועוד.
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
          <div className="text-xs text-slate-500 mb-1">סה״כ משימות שלי</div>
          <div className="text-2xl font-bold">{stats.total.toLocaleString("he-IL")}</div>
        </div>
      </div>

      {/* סינון לפי סטטוס */}
      <section className="bg-white rounded-2xl shadow p-4 space-y-3 text-xs">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-slate-500">סינון לפי סטטוס:</span>
          <button
            type="button"
            className={`px-3 py-1 rounded-full border ${
              statusFilter === "ALL" ? "bg-blue-600 text-white border-blue-600" : "border-slate-300 text-slate-700"
            }`}
            onClick={() => setStatusFilter("ALL")}
          >
            הכל
          </button>
          {(Object.keys(statusLabels) as TaskStatus[]).map((status) => (
            <button
              key={status}
              type="button"
              className={`px-3 py-1 rounded-full border ${
                statusFilter === status ? "bg-blue-600 text-white border-blue-600" : "border-slate-300 text-slate-700"
              }`}
              onClick={() => setStatusFilter(status)}
            >
              {statusLabels[status]}
            </button>
          ))}
        </div>
      </section>

      {/* טבלת משימות */}
      <section className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-sm font-semibold mb-3">רשימת משימות</h2>
        <div className="overflow-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="py-2 px-2">כותרת</th>
                <th className="py-2 px-2">לקוח</th>
                <th className="py-2 px-2">סוג</th>
                <th className="py-2 px-2">עדיפות</th>
                <th className="py-2 px-2">תאריך יעד</th>
                <th className="py-2 px-2">סטטוס</th>
                <th className="py-2 px-2">אישור מנהל</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((task) => {
                const overdue = task.dueDate < todayStr && !["DONE", "CANCELLED"].includes(task.status);
                return (
                  <tr key={task.id} className={`border-b last:border-0 ${overdue ? "bg-red-50/40" : ""}`}>
                    <td className="py-2 px-2">
                      <div className="font-medium">{task.title}</div>
                      {task.description && <div className="text-slate-500 truncate max-w-xs">{task.description}</div>}
                    </td>
                    <td className="py-2 px-2">{task.relatedClientName || "-"}</td>
                    <td className="py-2 px-2">{kindLabels[task.kind] || task.kind}</td>
                    <td className="py-2 px-2">
                      <span
                        className={
                          "inline-block px-2 py-0.5 rounded-full text-[11px] " + priorityClasses[task.priority]
                        }
                      >
                        {priorityLabels[task.priority]}
                      </span>
                    </td>
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

          {filtered.length === 0 && <div className="text-center py-6 text-slate-400">אין משימות תואמות לסינון.</div>}
        </div>
      </section>
    </div>
  );
};

export default MyTasks;
