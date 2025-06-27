'use client'
import EditNewsletter from '@/app/components/Admin/Customization/EditNewsletter';
import DashboardHeader from '@/app/components/Admin/dashboard/DashboardHeader';
import AdminSidebar from '@/app/components/Admin/sidebar/AdminSidebar';
import AdminProtected from '@/app/hooks/adminProtected';
import Heading from '@/app/utils/Heading';
import React, { useState } from 'react';

const page = () => {
   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
   const handleSidebarToggle = (collapsed: boolean) => {
      setIsSidebarCollapsed(collapsed);
   };
   return (
      <AdminProtected>
         <div className="admin-layout overflow-hidden">
            <Heading
               title="Edit Newsletter"
               description="Manage the newsletter subscription section of your landing page."
               keywords="newsletter, admin, subscription, landing page"
            />

            {/* Sidebar */}
            <AdminSidebar onToggle={handleSidebarToggle} />

            {/* Main Content Area */}
            <div
               className={`transition-all duration-300 ease-in-out min-h-screen overflow-x-hidden ${isSidebarCollapsed ? 'ml-16' : 'ml-72'
                  }`}
            >
               <DashboardHeader />
               <EditNewsletter />
            </div></div>
      </AdminProtected>
   );
};

export default page; 