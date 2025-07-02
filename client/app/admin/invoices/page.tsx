'use client'
import DashboardHeader from '@/app/components/Admin/dashboard/DashboardHeader';
import AdminSidebar from '@/app/components/Admin/sidebar/AdminSidebar';
import Loader from '@/app/components/Loader/Loader';
import AdminProtected from '@/app/hooks/adminProtected';
import Heading from '@/app/utils/Heading';
import { useGetAllCoursesQuery, useGetAllOrdersQuery, useLoadUserQuery } from '@/redux/features/api/apiSlice';
import { useGetAllUsersQuery } from '@/redux/features/user/userApi';
import { CourseFormData } from '@/types/course';
import { Order } from '@/types/order';
import { User } from '@/types/user';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const InvoicesPage = () => {
   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
   const { status: sessionStatus } = useSession();
   const { data: userData, isLoading: isUserLoading } = useLoadUserQuery(undefined);
   const router = useRouter();
   const handleSidebarToggle = (collapsed: boolean) => {
      setIsSidebarCollapsed(collapsed);
   };
   const { data, isLoading, isError } = useGetAllOrdersQuery();
   const orders = data?.orders || [];
   const { data: usersData } = useGetAllUsersQuery();
   const { data: coursesData } = useGetAllCoursesQuery();
   const users = (usersData && 'users' in usersData ? usersData.users : []) as User[];
   const courses: CourseFormData[] = Array.isArray(coursesData?.courses)
      ? coursesData.courses
      : Array.isArray(coursesData)
         ? coursesData
         : [];
   const getUserName = (userId: string) => {
      const user = users.find((u: User) => String(u._id) === String(userId));
      return user ? user.name : userId;
   };
   const getCourseName = (courseId: string) => {
      const course = courses.find((c: CourseFormData) => String(c._id) === String(courseId));
      return course ? course.name : courseId;
   };

   useEffect(() => {
      if (sessionStatus === 'unauthenticated' && !userData) {
         toast.error('You must be an admin to access this page.');
         router.replace('/');
      }
   }, [sessionStatus, router, userData]);

   if (sessionStatus === 'loading' || isLoading || isUserLoading) {
      return (
         <Loader />
      );
   }

   if (sessionStatus === 'unauthenticated' && !userData) return null;

   return (
      <AdminProtected>
         <div className="admin-layout overflow-hidden text-black dark:text:white">
            <Heading
               title="Invoices"
               description="View all invoices/orders."
               keywords="invoices, orders, admin, elearning"
            />
            <AdminSidebar onToggle={handleSidebarToggle} />
            <div className={`transition-all duration-300 ease-in-out min-h-screen overflow-x-hidden ${isSidebarCollapsed ? 'ml-16' : 'ml-72'}`}>
               <DashboardHeader />
               <div className="p-8 text-black dark:text-white">
                  <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Invoices</h1>
                  <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-6 overflow-x-auto">
                     {isLoading ? (
                        <div className="p-8 text-center text-lg">Loading invoices...</div>
                     ) : isError ? (
                        <div className="p-8 text-center text-red-600 dark:text-red-400">Failed to load invoices.</div>
                     ) : orders.length === 0 ? (
                        <div className="p-8 text-center text-gray-600 dark:text-gray-300">No invoices found.</div>
                     ) : (
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                           <thead className="bg-gray-50 dark:bg-slate-700">
                              <tr>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Invoice ID</th>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">User</th>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Course</th>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Payment Status</th>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date</th>
                              </tr>
                           </thead>
                           <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
                              {orders.map((order: Order) => (
                                 <tr key={order._id}>
                                    <td className="px-4 py-2 font-mono">{order._id}</td>
                                    <td className="px-4 py-2 font-mono">{getUserName(order.userId)}</td>
                                    <td className="px-4 py-2 font-mono">{getCourseName(order.courseId)}</td>
                                    {
                                       order.payment_info?.status === 'succeeded' ? (
                                          <td className="px-4 py-2 text-xs text-green-500">Success</td>
                                       ) : (
                                          <td className="px-4 py-2 text-xs text-red-500">Failed</td>
                                       )
                                    }
                                    <td className="px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </AdminProtected>
   );
};

export default InvoicesPage; 