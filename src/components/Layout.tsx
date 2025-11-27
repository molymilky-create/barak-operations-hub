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
    <div className="min-h-screen flex bg-background" dir="rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-6 md:p-8 overflow-auto bg-muted/30">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
