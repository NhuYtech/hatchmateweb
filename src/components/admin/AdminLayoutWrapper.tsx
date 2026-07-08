"use client";

import React, { useState } from "react";
import DashboardTopbar from "./DashboardTopbar";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed((v) => !v);
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-slate-50 text-slate-900">
      {/* HEADER: Full width, top level */}
      <DashboardTopbar onMenuToggle={toggleSidebar} />

      {/* BOTTOM SECTION: Row of Sidebar and Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: Fixed width, height fills space under header, scrollable */}
        <AdminSidebar collapsed={collapsed} />

        {/* Content: Fills remaining space, scrollable, restored warm gradient bg */}
        <main
          className="flex-1 overflow-y-auto p-6"
          style={{
            background: "linear-gradient(to bottom, #FCF8EC 0%, #FFF5DC 45%, #E7A124 100%)",
          }}
        >
          <div className="mx-auto max-w-[1600px] w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
