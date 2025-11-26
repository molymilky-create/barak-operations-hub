// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import MyTasks from "./pages/MyTasks";
import TeamTasks from "./pages/TeamTasks";
import Leads from "./pages/Leads";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* דשבורד ברירת מחדל */}
        <Route index element={<Dashboard />} />

        {/* המשימות שלי */}
        <Route path="my-tasks" element={<MyTasks />} />

        {/* משימות צוות – למנהל */}
        <Route path="team-tasks" element={<TeamTasks />} />

        {/* לידים */}
        <Route path="leads" element={<Leads />} />
      </Route>
    </Routes>
  );
};

export default App;
