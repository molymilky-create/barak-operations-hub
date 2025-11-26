// src/components/Layout.tsx
import React from "react";
import type { PageKey } from "../App";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface Props {
  currentPage: PageKey;
  onChangePage: (page: PageKey) => void;
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ currentPage, onChangePage, children }) => {
  return (
    <div className="min-h-screen flex bg-slate-100" dir="rtl">
      <Sidebar currentPage={currentPage} onChangePage={onChangePage} />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
