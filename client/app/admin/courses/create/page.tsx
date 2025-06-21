'use client';
import DashboardHeader from '@/app/components/Admin/dashboard/DashboardHeader';
import AdminSidebar from '@/app/components/Admin/sidebar/AdminSidebar';
import Heading from '@/app/utils/Heading';
import React, { useState } from 'react';
import CreateCourse from "../../../components/Admin/Course/CreateCourse";

type Props = {}

const page = (props: Props) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <div className="admin-layout overflow-hidden">
      <Heading
        title="Create Course"
        description="Fill in the details below to create a new course."
        keywords="create course, admin, elearning, course management"
      />

      {/* Sidebar */}
      <AdminSidebar onToggle={handleSidebarToggle} />

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ease-in-out min-h-screen overflow-x-hidden ${isSidebarCollapsed ? 'ml-16' : 'ml-72'
          }`}
      >
        <DashboardHeader />
        <CreateCourse />
      </div>
    </div>
  )
}

export default page;