'use client';
import DashboardHeader from '@/app/components/Admin/dashboard/DashboardHeader';
import AdminSidebar from '@/app/components/Admin/sidebar/AdminSidebar';
import AdminProtected from '@/app/hooks/adminProtected';
import Heading from '@/app/utils/Heading';
import { useGetUserAnalyticsQuery } from '@/redux/features/api/apiSlice';
import React, { useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const UserAnalyticsPage = () => {
   const { data, isLoading, isError } = useGetUserAnalyticsQuery();
   const chartData = data?.users?.last12Months || [];
   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
   const handleSidebarToggle = (collapsed: boolean) => setIsSidebarCollapsed(collapsed);

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
               className={`transition-all duration-300 ease-in-out min-h-screen overflow-x-hidden ${isSidebarCollapsed ? 'ml-16' : 'ml-72'
                  }`}
            >
               <DashboardHeader />
               <main className="flex-1 p-8 mt-16 dark:text-white text-black">
                  <h1 className="text-2xl font-bold mb-4 dark:text-white text-black">User Analytics</h1>
                  <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-6">
                     {isLoading ? (
                        <p>Loading...</p>
                     ) : isError ? (
                        <p className="text-red-500">Failed to load analytics data.</p>
                     ) : (
                        <ResponsiveContainer width="100%" height={350}>
                           <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                              <YAxis allowDecimals={false} />
                              <Tooltip />
                              <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} />
                           </LineChart>
                        </ResponsiveContainer>
                     )}
                  </div>
               </main>
            </div>
         </div>
      </AdminProtected>
   );
};

export default UserAnalyticsPage; 