'use client'
import EditCategories from '@/app/components/Admin/Customization/EditCategories';
import DashboardHeader from '@/app/components/Admin/dashboard/DashboardHeader';
import AdminSidebar from '@/app/components/Admin/sidebar/AdminSidebar';
import AdminProtected from '@/app/hooks/adminProtected';
import Heading from '@/app/utils/Heading';
import React, { useState } from 'react';

const CategoriesCustomizationPage = () => {
   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
   const handleSidebarToggle = (collapsed: boolean) => {
      setIsSidebarCollapsed(collapsed);
   };
   return (
      <AdminProtected>
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
               className={`transition-all duration-300 ease-in-out min-h-screen overflow-x-hidden text-black ${isSidebarCollapsed ? 'ml-16' : 'ml-72'
                  }`}
            >
               <DashboardHeader />
               <EditCategories />
            </div></div>
      </AdminProtected>
   );
};

export default CategoriesCustomizationPage; 