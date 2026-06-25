import React from "react";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => (
  <div className="min-h-screen bg-surface">
    <Sidebar />
    <div className="pl-sidebar">
      <main className="min-h-screen">{children}</main>
    </div>
  </div>
);
