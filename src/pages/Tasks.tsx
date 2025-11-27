// src/pages/Tasks.tsx
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
  OTHER: "אחר",
};

const priorityLabels: Record<TaskPriority, string> = {
  LOW: "נמוכה",
  NORMAL: "רגילה",
  HIGH: "גבוהה",
  CRITICAL: "דחופה",
};

const Tasks: React.FC = () => {
  const { tasks, employees, updateTaskStatus } = useData();
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <div>מסך זה מיועד למנהל בלבד.</div>;
  }

  const [statusFilter, setStatusFilter] = useState<TaskStatus | "ALL">("ALL");
  const [kindFilter, setKindFilter] = useState<TaskKind | "ALL">("ALL");
  const [employeeFilter, setEmployeeFilter] = useState<string | "ALL">("ALL");

  const filtered = tasks.filter((t) => {
    if (statusFilter !== "ALL" && t.status !== statusFilter) return false;
    if (kindFilter !== "ALL" && t.kind !== kindFilter) return false;
    if (employeeFilter !== "ALL" && t.assignedToUserId !== employeeFilter) return false;
    return true;
  });

  const getEmployeeName = (id: string) => employees.find((e) => e.id === id)?.name || "-";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">כל המשימות</h1>

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
            <label className="text-xs text-slate-500 mb-1">סוג משימה</label>
            <select
              className="border rounded-lg px-2 py-1 text-xs"
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
            <label className="text-xs text-slate-500 mb-1">עובד</label>
            <select
              className="border rounded-lg px-2 py-1 text-xs"
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value === "ALL" ? "ALL" : e.target.value)}
            >
              <option value="ALL">הכל</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* טבלת משימות */}
      <section className="bg-white rounded-2xl shadow p-4 text-xs">
        <h2 className="text-sm font-semibold mb-3">רשימת משימות</h2>
        <table className="w-full text-right">
          <thead>
            <tr className="border-b">
              <th className="py-2">כותרת</th>
              <th className="py-2">לקוח</th>
              <th className="py-2">סוג</th>
              <th className="py-2">עדיפות</th>
              <th className="py-2">אחראי</th>
              <th className="py-2">תאריך יצירה</th>
              <th className="py-2">תאריך יעד</th>
              <th className="py-2">סטטוס</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-b last:border-0">
                <td className="py-2">{t.title}</td>
                <td className="py-2">{t.relatedClientName || "-"}</td>
                <td className="py-2">{kindLabels[t.kind]}</td>
                <td className="py-2">{priorityLabels[t.priority]}</td>
                <td className="py-2">{getEmployeeName(t.assignedToUserId)}</td>
                <td className="py-2">{t.createdAt}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-slate-400 mt-4">אין משימות לפי הסינון הנוכחי.</p>}
      </section>
    </div>
  );
};

export default Tasks;
