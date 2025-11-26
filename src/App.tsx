// src/App.tsx
import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import MyTasks from "./pages/MyTasks";
import TeamTasks from "./pages/TeamTasks";

export type PageKey = "dashboard" | "myTasks" | "teamTasks";

const App = () => {
  const [page, setPage] = useState<PageKey>("dashboard");

  const renderPage = () => {
    switch (page) {
      case "myTasks":
        return <MyTasks />;
      case "teamTasks":
        return <TeamTasks />;
      case "dashboard":
      default:
        return <Dashboard />;
    }
  };

  return (
    <AuthProvider>
      <DataProvider>
        <Layout currentPage={page} onChangePage={setPage}>
          {renderPage()}
        </Layout>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
