'use client'
import { useUpdatePasswordMutation } from '@/redux/features/user/userApi';
import { Button } from '@mui/material';
import { Eye, EyeOff } from 'lucide-react';
import React, { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaLock } from 'react-icons/fa';
type Props = {}
const ChangePassword: FC<Props> = (props) => {
   const [oldPassword, setOldPassword] = useState('');
   const [newPassword, setNewPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [updatePassword, { isSuccess, error }] = useUpdatePasswordMutation();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!oldPassword || !newPassword || !confirmPassword) {
         toast.error('All fields are required!');
         return;
      }
      if (newPassword !== confirmPassword) {
         toast.error('New password and confirm password do not match!');
         return;
      }

      await updatePassword({ oldPassword, newPassword });
   };

   useEffect(() => {
      if (isSuccess) {
         toast.success('Password changed successfully!');
         setOldPassword('');
         setNewPassword('');
         setConfirmPassword('');
      }
      if (error) {
         if ("data" in error) {
            interface ErrorResponse {
               data: { message: string };
            }
            const errorData = error as ErrorResponse;
            toast.error(errorData.data.message);
         }
      }
   }, [isSuccess, error]);
   return (
      <div className="w-[600px] mx-auto bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-md border border-primary/10 dark:border-primary/20 mt-8">
         <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Change Password</h2>
         <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Old Password */}
            <div className="relative">
               <label className="block mb-1 text-slate-600 dark:text-slate-300 font-semibold text-sm">
                  Old Password
               </label>
               <input
                  type={showPassword ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
               />
               <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-9 right-3 text-slate-400 hover:text-blue-500 cursor-pointer"
               >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
               </button>
            </div>

            {/* New Password */}
            <div className="relative">
               <label className="block mb-1 text-slate-600 dark:text-slate-300 font-semibold text-sm">
                  New Password
               </label>
               <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
               />
            </div>

            {/* Confirm Password */}
            <div className="relative">
               <label className="block mb-1 text-slate-600 dark:text-slate-300 font-semibold text-sm">
                  Confirm New Password
               </label>
               <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
               />
            </div>

            <button
               type="submit"
               className="flex items-center justify-center gap-2 px-5 py-4 bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-cyan-50 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-300 font-semibold transition cursor-pointer"
            >
               <FaLock className="w-4 h-4" />
               Change Password
            </button>
         </form>
      </div>
   )
}

export default ChangePassword
