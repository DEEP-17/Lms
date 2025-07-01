'use client'
import DashboardHeader from '@/app/components/Admin/dashboard/DashboardHeader';
import AdminSidebar from '@/app/components/Admin/sidebar/AdminSidebar';
import AdminProtected from '@/app/hooks/adminProtected';
import Heading from '@/app/utils/Heading';
import { useDeleteUserMutation, useGetAllUsersQuery, useUpdateUserRoleMutation } from '@/redux/features/user/userApi';
import { User } from '@/types/user';
import { Button } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const roleOptions = [
   { value: 'user', label: 'User' },
   { value: 'admin', label: 'Admin' },
];

const UsersPage = () => {

   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
   const { status: sessionStatus } = useSession();
   const router = useRouter();

   const handleSidebarToggle = (collapsed: boolean) => {
      setIsSidebarCollapsed(collapsed);
   };
   const { data, isLoading, isError, refetch } = useGetAllUsersQuery();
   const users = (data && 'users' in data ? data.users : []) as User[];
   const [updateUserRole, { isLoading: isUpdating }] = useUpdateUserRoleMutation();
   const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
   const [roleEdit, setRoleEdit] = useState<{ id: string; role: string } | null>(null);
   const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
   const [message, setMessage] = useState<string | null>(null);

   // Stats
   const totalUsers = users.length;
   const totalAdmins = users.filter((u: User) => u.role === 'admin').length;
   const totalVerified = users.filter((u: User) => u.isVerified).length;

   // Handlers
   const handleRoleChange = (id: string, role: string) => {
      setRoleEdit({ id, role });
   };

   const handleRoleSave = async () => {
      if (roleEdit) {
         await updateUserRole(roleEdit).unwrap()
            .then(() => {
               setMessage('Role updated successfully.');
               setRoleEdit(null);
               refetch();
            })
            .catch(() => setMessage('Failed to update role.'));
      }
   };

   const handleDelete = async () => {
      if (deleteConfirmId) {
         await deleteUser(deleteConfirmId).unwrap()
            .then(() => {
               setMessage('User deleted successfully.');
               setDeleteConfirmId(null);
               refetch();
            })
            .catch(() => setMessage('Failed to delete user.'));
      }
   };

   useEffect(() => {
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
         <div className="admin-layout overflow-hidden text-black dark:text-white">
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
               <div className="p-8">
                  <h1 className="text-2xl font-bold mb-4">Users</h1>
                  {/* Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                     <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-4 flex flex-col items-center">
                        <span className="text-lg font-semibold">Total Users</span>
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalUsers}</span>
                     </div>
                     <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-4 flex flex-col items-center">
                        <span className="text-lg font-semibold">Admins</span>
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">{totalAdmins}</span>
                     </div>
                     <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-4 flex flex-col items-center">
                        <span className="text-lg font-semibold">Verified</span>
                        <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalVerified}</span>
                     </div>
                  </div>
                  {/* Message */}
                  {message && (
                     <div className="mb-4 p-3 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {message}
                        <button onClick={() => setMessage(null)}>Dismiss</button>
                     </div>
                  )}
                  {/* Table */}
                  <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-lg shadow">
                     {isLoading ? (
                        <div className="p-8 text-center text-lg">Loading users...</div>
                     ) : isError ? (
                        <div className="p-8 text-center text-red-600 dark:text-red-400">Failed to load users.</div>
                     ) : (
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                           <thead className="bg-gray-50 dark:bg-slate-700 text-black">
                              <tr>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Avatar</th>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Email</th>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Role</th>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Verified</th>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Joined</th>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Courses Purchased</th>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                              </tr>
                           </thead>
                           <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
                              {users.map((user: User) => (
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
                                       {roleEdit && roleEdit.id === user._id ? (
                                          <div className="flex items-center space-x-2">
                                             <select
                                                className="border rounded px-2 py-1 dark:bg-slate-700 dark:text-white"
                                                value={roleEdit.role}
                                                onChange={e => setRoleEdit({ id: user._id, role: e.target.value })}
                                             >
                                                {roleOptions.map(opt => (
                                                   <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                             </select>
                                             <button
                                                className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs cursor-pointer"
                                                onClick={handleRoleSave}
                                                disabled={isUpdating}
                                             >
                                                {isUpdating ? 'Saving...' : 'Save'}
                                             </button>
                                             <button
                                                className="px-2 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-xs cursor-pointer"
                                                onClick={() => setRoleEdit(null)}
                                             >Cancel</button>
                                          </div>
                                       ) : (
                                          <div className="flex items-center space-x-2">
                                             <span className={`px-2 py-1 rounded text-xs font-semibold ${user.role === 'admin' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}>{user.role}</span>
                                             <button
                                                className="text-blue-600 hover:underline text-xs cursor-pointer"
                                                onClick={() => handleRoleChange(user._id, user.role)}
                                             >Edit</button>
                                          </div>
                                       )}
                                    </td>
                                    <td className="px-4 py-2">
                                       {user.isVerified ? (
                                          <span className="px-2 py-1 rounded text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200">Yes</span>
                                       ) : (
                                          <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">No</span>
                                       )}
                                    </td>
                                    <td className="px-4 py-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-2">{user.courses?.length || 0}</td>
                                    <td className="px-4 py-2">
                                       <button
                                          className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs cursor-pointer"
                                          onClick={() => setDeleteConfirmId(user._id)}
                                          disabled={isDeleting}
                                       >
                                          Delete
                                       </button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     )}
                  </div>
                  {/* Delete Confirmation Modal */}
                  {deleteConfirmId && (
                     <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
                        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 w-full max-w-sm">
                           <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
                           <p>Are you sure you want to delete this user?</p>
                           <div className="mt-6 flex justify-end space-x-2">
                              <button
                                 className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 cursor-pointer"
                                 onClick={() => setDeleteConfirmId(null)}
                              >Cancel</button>
                              <button
                                 className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                                 onClick={handleDelete}
                                 disabled={isDeleting}
                              >{isDeleting ? 'Deleting...' : 'Delete'}</button>
                           </div>
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </AdminProtected>
   );
};

export default UsersPage; 