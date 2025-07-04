'use client';

import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import { useEditProfileMutation, useGenerateEmailVerificationTokenMutation, useUpdateAvatarMutation } from '@/redux/features/user/userApi';
import { Pencil } from 'lucide-react';
import Image from 'next/image';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { RiCloseCircleFill } from 'react-icons/ri';
import {User} from '@/types/user';
type Props = {
   user: User;
   avatar: string | null;
};

const ProfileInfo: FC<Props> = ({ user, avatar }) => {
   const [name, setName] = useState(user?.name || '');
   const [editingName, setEditingName] = useState(false);
   const [avatarPreview, setAvatarPreview] = useState<string | null>(avatar);
   const [editingAvatar, setEditingAvatar] = useState(false);
   const [isUploading, setIsUploading] = useState(false);

   const { data: userData, refetch } = useLoadUserQuery(undefined);
   const [updateAvatar, { isSuccess: avatarSuccess, isLoading: avatarLoading, error: avatarError }] = useUpdateAvatarMutation();
   const [editProfile, { isSuccess: profileSuccess, error: profileError }] = useEditProfileMutation();
   const [generateEmailVerificationToken, { isSuccess: emailVerificationSuccess, isLoading: emailVerificationLoading, error: emailVerificationError }] = useGenerateEmailVerificationTokenMutation();

   const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         const reader = new FileReader();
         reader.onload = () => {
            setAvatarPreview(reader.result as string);
            setEditingAvatar(true);
         };
         reader.readAsDataURL(file);
      }
   };

   const handleAvatarSave = async () => {
      if (!avatarPreview) return;

      setIsUploading(true);
      await updateAvatar(avatarPreview);
   };

   const handleNameSave = async () => {
      if (name.trim() === '') {
         toast.error('Name cannot be empty');
         setEditingName(false);
         return;
      }

      await editProfile({ name });
   };

   useEffect(() => {
      if (avatarSuccess) {
         setEditingAvatar(false);
         setIsUploading(false);
         refetch(); // Reload user data
         toast.success('Profile picture updated successfully!');
      }

      if (avatarError) {
         setIsUploading(false);
         toast.error('Error updating avatar');
      }
   }, [avatarSuccess, avatarError, refetch]);

   useEffect(() => {
      if (profileSuccess) {
         setEditingName(false);
         refetch();
         toast.success('Profile updated successfully!');
      }

      if (profileError) {
         toast.error('Error updating profile');
      }
   }, [profileSuccess, profileError, refetch]);

   useEffect(() => {
      if (emailVerificationSuccess) {
         toast.dismiss();
         toast.success('Email verification link sent successfully');
      }
      if (emailVerificationError) {
         toast.dismiss();
         toast.error('Error sending email verification link');
      }
   }, [emailVerificationSuccess, emailVerificationError, user?.isVerified]);

   // Use fresh user data if available
   const displayUser = userData?.user || user;
   const displayAvatar = avatarPreview
      ? avatarPreview
      : displayUser?.avatar?.public_id !== 'default_avatar'
         ? displayUser?.avatar?.url
         : '/avatar.jpg';

   const handleEmailVerification = async () => {
      await generateEmailVerificationToken(user?._id);
      if (emailVerificationLoading) {
         toast.loading('Sending email verification link...');
      }
   }

   return (
      <div className="flex flex-col items-center justify-center content-center gap-4 sm:gap-5 w-full max-w-md mx-auto p-2 sm:p-4 bg-surface-light dark:bg-surface-dark rounded-2xl shadow-lg border border-primary/10 dark:border-primary/20">

         {/* Avatar */}
         <div className="relative group w-24 h-24 sm:w-32 sm:h-32">
            {isUploading ? (
               <div className="flex items-center justify-center w-full h-full bg-slate-200 dark:bg-slate-700 rounded-full">
                  <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
               </div>
            ) : (
               <Image
                  src={displayAvatar}
                  alt="Profile Avatar"
                  width={128}
                  height={128}
                  priority
                  className="rounded-full border-2 border-black dark:border-black shadow-xl object-cover w-full h-full"
               />
            )}

            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 cursor-pointer rounded-full transition-all">
               <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
               />
               <Pencil size={20} />
            </label>
         </div>

         {editingAvatar && (
            <button
               className="flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-cyan-50 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-300 font-semibold transition cursor-pointer"
               onClick={handleAvatarSave}
               disabled={avatarLoading}
            >
               {avatarLoading ? 'Updating...' : 'Update Profile Picture'}
            </button>
         )}

         {/* Name */}
         <div className="w-full flex flex-col gap-2 relative">
            <label className="text-slate-600 dark:text-slate-300 font-semibold text-sm sm:text-base">Name:</label>
            <input
               type="text"
               value={name}
               disabled={!editingName}
               onChange={(e) => setName(e.target.value)}
               className={`w-full px-3 sm:px-4 py-2 border ${editingName
                  ? 'border-blue-500 dark:border-blue-400'
                  : 'border-slate-300 dark:border-slate-600'
                  } rounded-md bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none ${editingName ? 'focus:ring-2 focus:ring-blue-500' : ''
                  } text-sm sm:text-base`}
            />
            {/* Pencil Icon */}
            {!editingName && (
               <button
                  className="absolute right-2 top-11 text-slate-400 hover:text-blue-500 transition-all cursor-pointer"
                  onClick={() => setEditingName(true)}
               >
                  <Pencil size={18} className="flex items-center" />
               </button>
            )}
            {editingName && (
               <button
                  className="absolute right-2 top-11 text-blue-500 hover:text-blue-700 transition-all cursor-pointer"
                  onClick={() => setEditingName(false)}
               >
                  <RiCloseCircleFill size={18} className="flex items-center" />
               </button>
            )}
         </div>

         {/* Email (non-editable) */}
         <div className="w-full flex flex-col gap-2">
            <label className="text-slate-600 dark:text-slate-300 font-semibold text-sm sm:text-base">Email:</label>
            <div className='flex items-center justify-between'>
               <p className="px-3 sm:px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-md text-slate-900 dark:text-slate-100 text-sm sm:text-base break-words">
                  {displayUser?.email}
               </p>
               {/* Email Verification add button to verify email */}
               {
                  !user.isVerified ? (
                     <button
                        className="flex items-center justify-center gap-2 px-2 py-1 bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-cyan-50 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-300 font-semibold transition cursor-pointer"
                        onClick={handleEmailVerification}
                     >
                        {(emailVerificationLoading) ? "Sending..." : "Verify Email"}
                     </button>
                  )
                  :(
                        <p className="flex items-center justify-center gap-2 px-2 py-1 bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-cyan-50 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-300 font-semibold transition">
                        Verified
                     </p>
                  )
               }
            </div>
         </div>




         {editingName && (
            <button
               className="flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-cyan-50 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-300 font-semibold transition cursor-pointer"
               onClick={handleNameSave}
            >
               Update
            </button>
         )}
      </div>
   );
};

export default ProfileInfo;
