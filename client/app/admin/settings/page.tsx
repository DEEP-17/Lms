'use client'
import DashboardHeader from '@/app/components/Admin/dashboard/DashboardHeader';
import AdminSidebar from '@/app/components/Admin/sidebar/AdminSidebar';
import AdminProtected from '@/app/hooks/adminProtected';
import Heading from '@/app/utils/Heading';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const SettingsPage = () => {

   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
   const { status: sessionStatus } = useSession();
   const router = useRouter();
   const handleSidebarToggle = (collapsed: boolean) => {
      setIsSidebarCollapsed(collapsed);
   };
   React.useEffect(() => {
      if (sessionStatus === 'unauthenticated') {
         toast.error('You must be an admin to access this page.');
         router.replace('/');
      }
   }, [sessionStatus, router]);

   if (sessionStatus === 'loading') {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
         </div>
      );
   }
   if (sessionStatus === 'unauthenticated') return null;

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
               <div className="p-8 text-black">
                  <h1 className="text-2xl font-bold mb-4 text-black">Settings</h1>
                  <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-6">
                     <p className="text-gray-700 dark:text-gray-200">This is the Settings admin page. Settings options will be displayed here.</p>
                  </div>
               </div>
            </div>
         </div>
      </AdminProtected>
   );
};

export default SettingsPage; 