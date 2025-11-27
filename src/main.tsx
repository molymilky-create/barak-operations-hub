// src/pages/MyTasks.tsx
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
  SERVICE: "שירות / שירות לקוח",
  OTHER: "אחר",
};

const priorityLabels: Record<TaskPriority, string> = {
  LOW: "נמוכה",
  NORMAL: "רגילה",
  HIGH: "גבוהה",
  CRITICAL: "דחופה",
};

const MyTasks: React.FC = () => {
  const { tasks, updateTaskStatus } = useData();
  const { user } = useAuth();

  if (!user) {
    return <div>יש להתחבר כדי לראות משימות.</div>;
  }

  const [statusFilter, setStatusFilter] = useState<TaskStatus | "ALL">("ALL");
  const [kindFilter, setKindFilter] = useState<TaskKind | "ALL">("ALL");

  const myTasks = tasks.filter((t) => t.assignedToUserId === user.id);

  const filtered = myTasks.filter((t) => {
    if (statusFilter !== "ALL" && t.status !== statusFilter) return false;
    if (kindFilter !== "ALL" && t.kind !== kindFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">המשימות שלי</h1>

      {/* פילטרים */}
      <section className="bg-white rounded-2xl shadow p-4 text-sm space-y-3">
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col">
            <label className="text-xs text-slate-500 mb-1">סטטוס</label>
            <select
              className="border rounded-lg px-2 py-1 text-xs"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value === "ALL"
                    ? "ALL"
                    : (e.target.value as TaskStatus)
                )
              }
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
            <label className="text-xs text-slate-500 mb-1">סוג</label>
            <select
              className="border rounded-lg px-2 py-1 text-xs"
              value={kindFilter}
              onChange={(e) =>
                setKindFilter(
                  e.target.value === "ALL"
                    ? "ALL"
                    : (e.target.value as TaskKind)
                )
              }
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

      {/* טבלת משימות */}
      <section className="bg-white rounded-2xl shadow p-4 text-xs">
        <h2 className="text-sm font-semibold mb-3">משימות</h2>
        <table className="w-full text-right">
          <thead>
            <tr className="border-b">
              <th className="py-2">כותרת</th>
              <th className="py-2">לקוח</th>
              <th className="py-2">סוג</th>
              <th className="py-2">עדיפות</th>
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
                <td className="py-2">{t.dueDate}</td>
