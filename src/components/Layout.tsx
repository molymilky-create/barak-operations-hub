// src/components/Layout.tsx
import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

type LayoutProps = {
  // מגיעים מ-App.tsx – לא חובה להשתמש בהם כרגע
  currentPage?: any;
  onChangePage?: (page: any) => void;
  children?: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-slate-100" dir="rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
