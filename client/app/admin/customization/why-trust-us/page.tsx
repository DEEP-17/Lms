'use client'
import EditWhyTrustUs from '@/app/components/Admin/Customization/EditWhyTrustUs';
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
               title="Edit Why Trust Us"
               description="Manage the trust-building section of your landing page."
               keywords="why trust us, admin, trust building, landing page"
            />

            {/* Sidebar */}
            <AdminSidebar onToggle={handleSidebarToggle} />

            {/* Main Content Area */}
            <div
               className={`transition-all duration-300 ease-in-out min-h-screen overflow-x-hidden ${isSidebarCollapsed ? 'ml-16' : 'ml-72'
                  }`}
            >
               <DashboardHeader />
               <EditWhyTrustUs />
            </div></div>
      </AdminProtected>
   );
};

export default page; 