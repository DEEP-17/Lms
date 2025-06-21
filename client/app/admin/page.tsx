'use client';

import { redirect } from "next/navigation";
import React, { useState } from "react";
import DashboardHero from "../components/Admin/dashboard/DashboardHero";
import AdminSidebar from "../components/Admin/sidebar/AdminSidebar";
import AdminProtected from "../hooks/adminProtected";
import Heading from "../utils/Heading";

type props = {}

const page = (props: props) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <div className="admin-layout overflow-hidden">
      <AdminProtected>
        <Heading title="Elearning-Admin"
          description="Admin Dashboard for Elearning Platform"
          keywords="programming,MERN,REDUX" />

        {/* Sidebar */}
        <AdminSidebar onNavigate={redirect} onToggle={handleSidebarToggle} />

        {/* Main Content Area */}
        <div
          className={`transition-all duration-300 ease-in-out min-h-screen overflow-x-hidden ${isSidebarCollapsed ? 'ml-16' : 'ml-72'
            }`}
        >
          <DashboardHero />
        </div>
      </AdminProtected>
    </div>
  );
}

export default page;