'use client'
import DashboardHeader from '@/app/components/Admin/dashboard/DashboardHeader';
import AdminSidebar from '@/app/components/Admin/sidebar/AdminSidebar';
import Loader from '@/app/components/Loader/Loader';
import AdminProtected from '@/app/hooks/adminProtected';
import Heading from '@/app/utils/Heading';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import { useGetAllUsersQuery } from '@/redux/features/user/userApi';
import { User } from '@/types/user';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const ManageTeamPage = () => {
   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
   const { status: sessionStatus } = useSession();
   const { data: userData, isLoading: isUserLoading } = useLoadUserQuery(undefined);
   const router = useRouter();
   const handleSidebarToggle = (collapsed: boolean) => {
      setIsSidebarCollapsed(collapsed);
   };
   const { data, isLoading, isError } = useGetAllUsersQuery();
   const users = (data && 'users' in data ? data.users : []) as User[];
   const admins = users.filter((u: User) => u.role === 'admin');

   useEffect(() => {
      if (sessionStatus === 'unauthenticated' && !userData) {
         toast.error('You must be an admin to access this page.');
         router.replace('/');
      }
   }, [sessionStatus, router, userData]);

   if (sessionStatus === 'loading' || isUserLoading) {
      return (
         <Loader/>
      );
   }

   if (sessionStatus === 'unauthenticated' && !userData) return null;

   return (
      <AdminProtected>
         <div className="admin-layout overflow-hidden">
            <Heading
               title="Manage Team"
               description="View and manage admin team members."
               keywords="admin team, manage team, elearning, admin management"
            />
            <AdminSidebar onToggle={handleSidebarToggle} />
            <div
               className={`transition-all duration-300 ease-in-out min-h-screen overflow-x-hidden text-black ${isSidebarCollapsed ? 'ml-16' : 'ml-72'}`}
            >
               <DashboardHeader />
               <div className="p-8 text-black dark:text-white">
                  <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Manage Team</h1>
                  <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-lg shadow">
                     {isLoading ? (
                        <div className="p-8 text-center text-lg">Loading admins...</div>
                     ) : isError ? (
                        <div className="p-8 text-center text-red-600 dark:text-red-400">Failed to load admins.</div>
                     ) : (
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                           <thead className="bg-gray-50 dark:bg-slate-700">
                              <tr>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Avatar</th>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Email</th>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Verified</th>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Joined</th>
                              </tr>
                           </thead>
                           <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
                              {admins.map((user: User) => (
                                 <tr key={user._id}>
                                    <td className="px-4 py-2">
                                       <img
                                          src={(user?.avatar?.public_id !== 'default_avatar') ? user?.avatar?.url : '/avatar.jpg'}
                                          alt={user.name}
                                          className="w-10 h-10 rounded-full border-2 border-blue-400 shadow"
                                          onError={(e) => { e.currentTarget.src = '/avatar.jpg'; }}
                                       />
                                    </td>
                                    <td className="px-4 py-2 font-medium">{user.name}</td>
                                    <td className="px-4 py-2">{user.email}</td>
                                    <td className="px-4 py-2">
                                       {user.isVerified ? (
                                          <span className="px-2 py-1 rounded text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200">Yes</span>
                                       ) : (
                                          <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">No</span>
                                       )}
                                    </td>
                                    <td className="px-4 py-2">{new Date(user.createdAt).toLocaleDateString()}</td>
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

export default ManageTeamPage; 