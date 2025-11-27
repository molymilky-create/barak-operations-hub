// src/pages/Tasks.tsx
import React from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import type { TaskStatus } from "../types";

const statusLabels: Record<TaskStatus, string> = {
  OPEN: "פתוחה",
  IN_PROGRESS: "בטיפול",
  WAITING_CLIENT: "ממתינה ללקוח",
  WAITING_COMPANY: "ממתינה לחברת ביטוח",
  WAITING_MANAGER_REVIEW: "ממתינה לאישור מנהל",
  DONE: "סגורה",
  CANCELLED: "בוטלה",
};

const Tasks: React.FC = () => {
  const { tasks, employees, updateTaskStatus } = useData();
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <div>מסך זה מיועד למנהל בלבד.</div>;
  }

  const getEmployeeName = (id: string) => employees.find((e) => e.id === id)?.name || "-";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">כל המשימות</h1>

      <section className="bg-white rounded-2xl shadow p-4 text-xs">
        <h2 className="text-sm font-semibold mb-3">רשימת משימות</h2>
        <table className="w-full text-right">
          <thead>
            <tr className="border-b">
              <th className="py-2">כותרת</th>
              <th className="py-2">לקוח</th>
              <th className="py-2">סוג (טכני)</th>
              <th className="py-2">אחראי</th>
              <th className="py-2">תאריך יצירה</th>
              <th className="py-2">תאריך יעד</th>
              <th className="py-2">סטטוס</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id} className="border-b last:border-0">
                <td className="py-2">{t.title}</td>
                <td className="py-2">{t.relatedClientName || "-"}</td>
                <td className="py-2">{t.kind}</td>
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
        {tasks.length === 0 && <p className="text-center text-slate-400 mt-4">אין משימות כרגע.</p>}
      </section>
    </div>
  );
};

export default Tasks;
