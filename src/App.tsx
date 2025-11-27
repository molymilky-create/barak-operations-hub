// src/App.tsx
import React from "react";
import MyTasks from "./pages/MyTasks";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-100" dir="rtl">
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <h1 className="text-lg font-bold text-slate-800">ברק ביטוחים – המשימות שלי</h1>
        <p className="text-xs text-slate-500 mt-1">מעקב משימות לעובדי הסוכנות (טיוטות, חידושים, לידים, גבייה ועוד).</p>
      </header>
      <main className="p-4">
        <MyTasks />
      </main>
    </div>
  );
};

export default App;
