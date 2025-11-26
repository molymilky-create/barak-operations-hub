// src/pages/Dashboard.tsx
import React from "react";
import { useData } from "../context/DataContext";

const Dashboard: React.FC = () => {
  const { tasks, employees } = useData();

  const totalTasks = tasks.length;
  const openTasks = tasks.filter((t) => t.status !== "DONE" && t.status !== "CANCELLED").length;
  const overdueTasks = tasks.filter(
    (t) => t.dueDate < new Date().toISOString().slice(0, 10) && t.status !== "DONE" && t.status !== "CANCELLED",
  ).length;

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold text-slate-800">דשבורד הסוכנות</h1>
      <p className="text-sm text-slate-600">
        זהו מסך ראשי שנותן תמונת מצב כללית על העבודה בסוכנות. בהמשך נוסיף כאן חידושים, גבייה, לידים ועוד.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-slate-500">מספר עובדים</div>
          <div className="text-2xl font-bold text-slate-800">{employees.length}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-slate-500">משימות פתוחות</div>
          <div className="text-2xl font-bold text-blue-700">{openTasks}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-slate-500">משימות באיחור</div>
          <div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-4 text-sm text-slate-600">
        בהמשך נוסיף כאן:
        <ul className="list-disc mr-5 mt-2 space-y-1">
          <li>חידושים בחודש הקרוב</li>
          <li>גבייה פתוחה</li>
          <li>לידים חדשים</li>
          <li>בקשות/טיוטות ממתינות לתשובת חברת הביטוח</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
