'use client'
import EditTestimonials from '@/app/components/Admin/Customization/EditTestimonials';
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
               title="Edit Testimonials"
               description="Manage customer testimonials displayed on the landing page."
               keywords="testimonials, admin, customer reviews, landing page"
            />

            {/* Sidebar */}
            <AdminSidebar onToggle={handleSidebarToggle} />

            {/* Main Content Area */}
            <div
               className={`transition-all duration-300 ease-in-out min-h-screen overflow-x-hidden ${isSidebarCollapsed ? 'ml-16' : 'ml-72'
                  }`}
            >
               <DashboardHeader />
               <EditTestimonials />
            </div></div>
      </AdminProtected>
   );
};

export default page; 