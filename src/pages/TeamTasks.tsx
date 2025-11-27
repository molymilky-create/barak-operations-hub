// src/pages/TeamTasks.tsx
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

const TeamTasks: React.FC = () => {
  const { isAdmin, user } = useAuth();
  const { employees, tasks, updateTaskStatus } = useData();

  const [ownerFilter, setOwnerFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "ALL">("OPEN");
  const [kindFilter, setKindFilter] = useState<TaskKind | "ALL">("ALL");

  const todayStr = new Date().toISOString().slice(0, 10);

  if (!user || !isAdmin) {
    return <div className="p-6 text-sm text-slate-600">גישה למסך זה מותרת למנהל בלבד.</div>;
  }

  const tasksWithEmployee = useMemo(() => {
    return tasks.map((t) => ({
      task: t,
      employee: employees.find((e) => e.id === t.assignedToUserId) || null,
    }));
  }, [tasks, employees]);

  const filtered = useMemo(() => {
    return tasksWithEmployee.filter(({ task, employee }) => {
      if (ownerFilter !== "ALL" && task.assignedToUserId !== ownerFilter) return false;
      if (statusFilter !== "ALL" && task.status !== statusFilter) return false;
      if (kindFilter !== "ALL" && task.kind !== kindFilter) return false;
      return true;
    });
  }, [tasksWithEmployee, ownerFilter, statusFilter, kindFilter]);

  const totalOpen = tasks.filter((t) => t.status !== "DONE" && t.status !== "CANCELLED").length;

  const totalOverdue = tasks.filter(
    (t) => t.dueDate < todayStr && t.status !== "DONE" && t.status !== "CANCELLED",
  ).length;

  const waitingManager = tasks.filter((t) => t.status === "WAITING_MANAGER_REVIEW").length;

  const groupedByEmployee: Record<string, { employeeName: string; tasks: Task[] }> = {};
  for (const { task, employee } of tasksWithEmployee) {
    const key = employee?.id || "unknown";
    if (!groupedByEmployee[key]) {
      groupedByEmployee[key] = {
        employeeName: employee?.name || "לא משויך",
        tasks: [],
      };
    }
    groupedByEmployee[key].tasks.push(task);
  }

  const isOverdue = (task: Task) => task.dueDate < todayStr && task.status !== "DONE" && task.status !== "CANCELLED";

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">משימות צוות</h1>
          <p className="text-sm text-slate-500">תמונת מצב של עומס, איחורים, וטיפול של כל אחד מהעובדים.</p>
        </div>
      </div>

      {/* סיכום עליון למנהל */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl shadow p-3">
          <div className="text-xs text-slate-500 mb-1">משימות פתוחות</div>
          <div className="text-2xl font-bold text-slate-800">{totalOpen}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-3">
          <div className="text-xs text-slate-500 mb-1">משימות באיחור</div>
          <div className="text-2xl font-bold text-red-600">{totalOverdue}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-3">
          <div className="text-xs text-slate-500 mb-1">ממתין לאישור מנהל</div>
          <div className="text-2xl font-bold text-orange-600">{waitingManager}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-3">
          <div className="text-xs text-slate-500 mb-1">מספר עובדים</div>
          <div className="text-2xl font-bold text-slate-800">{employees.length}</div>
        </div>
      </div>

      {/* פילטרים */}
      <section className="bg-white rounded-2xl shadow p-4 space-y-3 text-xs">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col">
            <span className="mb-1 text-slate-500">עובד</span>
            <select
              className="border rounded-lg px-2 py-1"
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
            >
              <option value="ALL">כל העובדים</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
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
        </div>
      </section>

      {/* טבלה לפי משימות (פלט כולל) */}
      <section className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-sm font-semibold mb-3">כל המשימות</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="py-2 px-2">עובד</th>
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
              {filtered.map(({ task, employee }) => (
                <tr key={task.id} className={"border-b last:border-0 " + (isOverdue(task) ? "bg-red-50" : "")}>
                  <td className="py-2 px-2 whitespace-nowrap">{employee?.name || "לא משויך"}</td>
                  <td className="py-2 px-2 whitespace-nowrap">{task.dueDate}</td>
                  <td className="py-2 px-2">
                    <div className="font-semibold text-slate-800">{task.title}</div>
                    {task.description && (
                      <div className="text-[11px] text-slate-500 line-clamp-2">{task.description}</div>
                    )}
                  </td>
                  <td className="py-2 px-2">{task.relatedClientName || <span className="text-slate-400">-</span>}</td>
                  <td className="py-2 px-2">{kindLabels[task.kind]}</td>
                  <td className="py-2 px-2">{priorityLabels[task.priority]}</td>
                  <td className="py-2 px-2">{statusLabels[task.status]}</td>
                  <td className="py-2 px-2">
                    <div className="flex flex-wrap gap-1 justify-end">
                      <button
                        type="button"
                        className="px-2 py-0.5 rounded-full border border-slate-300 text-[11px] hover:bg-slate-100"
                        onClick={() => updateTaskStatus(task.id, "WAITING_MANAGER_REVIEW")}
                      >
                        ממתין למנהל
                      </button>
                      <button
                        type="button"
                        className="px-2 py-0.5 rounded-full border border-emerald-500 text-[11px] text-emerald-700 hover:bg-emerald-50"
                        onClick={() => updateTaskStatus(task.id, "DONE")}
                      >
                        סמן כהסתיים
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-slate-400 text-xs">
                    אין משימות בהתאם לפילטרים.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* סיכום לפי עובד – למעקב מהיר */}
      <section className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-sm font-semibold mb-3">סיכום לפי עובד</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {Object.values(groupedByEmployee).map((group) => {
            const openCount = group.tasks.filter((t) => t.status !== "DONE" && t.status !== "CANCELLED").length;
            const overdue = group.tasks.filter((t) => isOverdue(t)).length;
            return (
              <div key={group.employeeName} className="border rounded-xl p-3 bg-slate-50">
                <div className="font-semibold text-slate-800 mb-1">{group.employeeName}</div>
                <div className="text-[11px] text-slate-600">
                  <div>משימות פתוחות: {openCount}</div>
                  <div>באיחור: {overdue}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default TeamTasks;
