import React, { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "../pages/Shared/Sidebar";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* Content */}
      <div className="flex-1 bg-base-200 p-4">
        {/* Mobile sidebar toggle btn */}
        <button
          className="btn btn-ghost lg:hidden mb-3"
          onClick={() => setOpen(true)}
        >
          Menu
        </button>

        <Outlet />
      </div>
    </div>
  );
}
