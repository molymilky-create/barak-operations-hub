// src/pages/Tasks.tsx
import { useState, useMemo } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import type { TaskStatus, TaskKind, TaskPriority } from "../types";

const statusLabels: Record<TaskStatus, string> = {
  OPEN: "פתוחה",
  IN_PROGRESS: "בטיפול",
  WAITING_CLIENT: "ממתין ללקוח",
  WAITING_COMPANY: "ממתין לחברת ביטוח",
  WAITING_MANAGER_REVIEW: "ממתין לאישור מנהל",
  DONE: "נסגרה",
  CANCELLED: "בוטלה",
};

const kindLabels: Record<TaskKind, string> = {
  LEAD: "ליד",
  RENEWAL: "חידוש",
  COLLECTION: "גבייה",
  CERTIFICATE: "אישור קיום",
  CARRIER_REQUEST: "בקשה לחברת ביטוח",
  SERVICE: "שירות לקוח",
  OTHER: "אחר",
};

const priorityLabels: Record<TaskPriority, string> = {
  LOW: "נמוכה",
  NORMAL: "רגילה",
  HIGH: "גבוהה",
  CRITICAL: "דחופה מאוד",
};

const Tasks = () => {
  const { user, isAdmin } = useAuth();
  const { tasks, employees, addTask, updateTaskStatus } = useData();

  const [statusFilter, setStatusFilter] = useState<TaskStatus | "OPEN_ONLY">("OPEN_ONLY");
  const [kindFilter, setKindFilter] = useState<TaskKind | "ALL">("ALL");

  // טופס משימה חדשה
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<TaskKind>("OTHER");
  const [priority, setPriority] = useState<TaskPriority>("NORMAL");
  const [assignedToUserId, setAssignedToUserId] = useState<string>(user?.id || "");
  const [dueDate, setDueDate] = useState<string>("");
  const [relatedClientName, setRelatedClientName] = useState<string>("");

  const todayStr = new Date().toISOString().slice(0, 10);

  const myTasks = useMemo(() => tasks.filter((t) => t.assignedToUserId === user?.id), [tasks, user?.id]);

  const filteredMyTasks = myTasks.filter((t) => {
    if (statusFilter === "OPEN_ONLY") {
      return !["DONE", "CANCELLED"].includes(t.status);
    }
    if (statusFilter && t.status !== statusFilter) return false;
    if (kindFilter !== "ALL" && t.kind !== kindFilter) return false;
    return true;
  });

  const teamTasks = tasks; // למנהל – כל המשימות

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("חובה לכתוב כותרת למשימה.");
      return;
    }
    if (!dueDate) {
      alert("חובה לבחור תאריך יעד.");
      return;
    }
    if (!assignedToUserId) {
      alert("חובה לבחור עובד מטפל.");
      return;
    }

    addTask({
      title: title.trim(),
      description: "",
      kind,
      priority,
      assignedToUserId,
      createdByUserId: user?.id || assignedToUserId,
      dueDate,
      relatedClientName: relatedClientName || undefined,
      requiresManagerReview: kind !== "OTHER" && priority !== "LOW",
    });

    setTitle("");
    setDueDate("");
    setRelatedClientName("");
    setKind("OTHER");
    setPriority("NORMAL");
  };

  const rowClass = (status: TaskStatus, dueDate: string) => {
    const isDone = status === "DONE" || status === "CANCELLED";
    if (isDone) return "";
    if (dueDate < todayStr) return "bg-rose-50";
    if (dueDate === todayStr) return "bg-amber-50";
    return "";
  };

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold text-slate-800">משימות</h1>
      <p className="text-sm text-slate-600">
        כאן אתה מנהל את כל המשימות של הסוכנות: חידושים, גבייה, לידים, בקשות לחברות ביטוח ועוד. המטרה – שלא יפול כלום בין
        הכיסאות.
      </p>

      {/* טופס משימה חדשה */}
      <section className="bg-white rounded-2xl shadow p-4 space-y-3 text-xs">
        <h2 className="text-sm font-semibold text-slate-800">הוספת משימה חדשה</h2>
        <form onSubmit={handleAddTask} className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col min-w-[200px]">
            <label className="mb-1">כותרת *</label>
            <input
              className="border rounded-lg px-2 py-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="לדוגמה: לחזור לרמי לגבי הצעת חווה"
            />
          </div>
          <div className="flex flex-col min-w-[160px]">
            <label className="mb-1">סוג משימה</label>
            <select
              className="border rounded-lg px-2 py-1"
              value={kind}
              onChange={(e) => setKind(e.target.value as TaskKind)}
            >
              <option value="LEAD">ליד</option>
              <option value="RENEWAL">חידוש</option>
              <option value="COLLECTION">גבייה</option>
              <option value="CERTIFICATE">אישור קיום</option>
              <option value="CARRIER_REQUEST">בקשה לחברת ביטוח</option>
              <option value="SERVICE">שירות לקוח</option>
              <option value="OTHER">אחר</option>
            </select>
          </div>
          <div className="flex flex-col min-w-[160px]">
            <label className="mb-1">עדיפות</label>
            <select
              className="border rounded-lg px-2 py-1"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            >
              <option value="LOW">נמוכה</option>
              <option value="NORMAL">רגילה</option>
              <option value="HIGH">גבוהה</option>
              <option value="CRITICAL">דחופה מאוד</option>
            </select>
          </div>
          <div className="flex flex-col min-w-[160px]">
            <label className="mb-1">עובד מטפל *</label>
            <select
              className="border rounded-lg px-2 py-1"
              value={assignedToUserId}
              onChange={(e) => setAssignedToUserId(e.target.value)}
            >
              <option value="">בחר...</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col min-w-[150px]">
            <label className="mb-1">תאריך יעד *</label>
            <input
              type="date"
              className="border rounded-lg px-2 py-1"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col flex-1 min-w-[200px]">
            <label className="mb-1">שם לקוח / חווה (לא חובה)</label>
            <input
              className="border rounded-lg px-2 py-1"
              value={relatedClientName}
              onChange={(e) => setRelatedClientName(e.target.value)}
              placeholder='לדוגמה: "חוות סנדורה בע"מ"'
            />
          </div>
          <div>
            <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm">
              שמור משימה
            </button>
          </div>
        </form>
      </section>

      {/* המשימות שלי */}
      <section className="bg-white rounded-2xl shadow p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold text-slate-800">המשימות שלי</h2>
          <div className="flex gap-2 text-xs">
            <select
              className="border rounded-lg px-2 py-1"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value === "OPEN_ONLY" ? "OPEN_ONLY" : (e.target.value as TaskStatus))
              }
            >
              <option value="OPEN_ONLY">רק משימות פתוחות</option>
              <option value="OPEN">פתוחה</option>
              <option value="IN_PROGRESS">בטיפול</option>
              <option value="WAITING_CLIENT">ממתין ללקוח</option>
              <option value="WAITING_COMPANY">ממתין לחברת ביטוח</option>
              <option value="WAITING_MANAGER_REVIEW">ממתין לאישור מנהל</option>
              <option value="DONE">נסגרה</option>
              <option value="CANCELLED">בוטלה</option>
            </select>
            <select
              className="border rounded-lg px-2 py-1"
              value={kindFilter}
              onChange={(e) => setKindFilter(e.target.value === "ALL" ? "ALL" : (e.target.value as TaskKind))}
            >
              <option value="ALL">כל הסוגים</option>
              <option value="LEAD">ליד</option>
              <option value="RENEWAL">חידוש</option>
              <option value="COLLECTION">גבייה</option>
              <option value="CERTIFICATE">אישור קיום</option>
              <option value="CARRIER_REQUEST">בקשה לחברת ביטוח</option>
              <option value="SERVICE">שירות לקוח</option>
              <option value="OTHER">אחר</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="py-2 px-2">כותרת</th>
                <th className="py-2 px-2">סוג</th>
                <th className="py-2 px-2">עדיפות</th>
                <th className="py-2 px-2">לקוח</th>
                <th className="py-2 px-2">תאריך יעד</th>
                <th className="py-2 px-2">סטטוס</th>
              </tr>
            </thead>
            <tbody>
              {filteredMyTasks.map((t) => (
                <tr key={t.id} className={`border-b last:border-0 ${rowClass(t.status, t.dueDate)}`}>
                  <td className="py-2 px-2">{t.title}</td>
                  <td className="py-2 px-2">{kindLabels[t.kind]}</td>
                  <td className="py-2 px-2">{priorityLabels[t.priority]}</td>
                  <td className="py-2 px-2">{t.relatedClientName || "-"}</td>
                  <td className="py-2 px-2">{t.dueDate}</td>
                  <td className="py-2 px-2">
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
              {filteredMyTasks.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-slate-400">
                    אין משימות מתאימות לפילטר.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* משימות צוות – למנהל בלבד */}
      {isAdmin && (
        <section className="bg-white rounded-2xl shadow p-4 space-y-3 text-xs">
          <h2 className="text-sm font-semibold text-slate-800">כל המשימות בסוכנות (רק מנהל רואה)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="py-2 px-2">כותרת</th>
                  <th className="py-2 px-2">סוג</th>
                  <th className="py-2 px-2">עדיפות</th>
                  <th className="py-2 px-2">עובד</th>
                  <th className="py-2 px-2">לקוח</th>
                  <th className="py-2 px-2">יעד</th>
                  <th className="py-2 px-2">סטטוס</th>
                  <th className="py-2 px-2">דורש אישור?</th>
                  <th className="py-2 px-2">מאושר בתאריך</th>
                </tr>
              </thead>
              <tbody>
                {teamTasks.map((t) => {
                  const emp = employees.find((e) => e.id === t.assignedToUserId);
                  return (
                    <tr key={t.id} className={`border-b last:border-0 ${rowClass(t.status, t.dueDate)}`}>
                      <td className="py-2 px-2">{t.title}</td>
                      <td className="py-2 px-2">{kindLabels[t.kind]}</td>
                      <td className="py-2 px-2">{priorityLabels[t.priority]}</td>
                      <td className="py-2 px-2">{emp?.name || "-"}</td>
                      <td className="py-2 px-2">{t.relatedClientName || "-"}</td>
                      <td className="py-2 px-2">{t.dueDate}</td>
                      <td className="py-2 px-2">
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
                      <td className="py-2 px-2">{t.requiresManagerReview ? "כן" : "לא"}</td>
                      <td className="py-2 px-2">{t.managerApprovedAt || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default Tasks;
