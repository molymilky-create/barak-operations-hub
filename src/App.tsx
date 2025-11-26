// src/App.tsx
import React, { useState } from "react";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import MyTasks from "./pages/MyTasks";
import TeamTasks from "./pages/TeamTasks";
import Leads from "./pages/Leads";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";

export type PageKey = "dashboard" | "myTasks" | "teamTasks" | "leads";

const App: React.FC = () => {
  const [page, setPage] = useState<PageKey>("dashboard");

  const renderPage = () => {
    switch (page) {
      case "myTasks":
        return <MyTasks />;
      case "teamTasks":
        return <TeamTasks />;
      case "leads":
        return <Leads />;
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
