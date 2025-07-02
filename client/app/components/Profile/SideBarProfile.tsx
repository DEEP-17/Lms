import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { SiCoursera } from 'react-icons/si';
import { User } from '@/types/user';
type Props =
   {
      user: User;
      active: number;
      avatar: string | null;
      setActive: (active: number) => void;
      logOutHandler: ()=> Promise<void>;
   }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SideBarProfile: FC<Props> = ({ user, active, avatar, setActive, logOutHandler }) => {
   return (
      <div className='w-full flex flex-col gap-2 sm:gap-3'>
         <div className={`w-full flex items-center justify-center px-2 sm:px-3 py-2 sm:py-4 cursor-pointer transition-colors duration-200 rounded-lg ${active === 1 ? "bg-slate-900/10 dark:bg-slate-900/20 border border-primary" : "bg-transparent border border-transparent"} hover:bg-slate-900/20 dark:hover:bg-slate-900/30 cursor-pointer`}
            onClick={() => setActive(1)}>
            <Image
               src={user && user.avatar && user.avatar.public_id !== "default_avatar"
                  ? user.avatar.url
                  : "/avatar.jpg"}
               alt="Profile Avatar"
               height={50}
               width={50}
               className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover cursor-pointer border-2 border-primary/60 shadow-md"
            />
            <h5 className='ml-2 sm:ml-3 text-sm sm:text-base font-medium font-Popins text-text dark:text-text-light'>My Account</h5>
         </div>
         <div className={`w-full flex items-center justify-center px-2 sm:px-3 py-2 sm:py-4 cursor-pointer transition-colors duration-200 rounded-lg ${active === 2 ? "bg-slate-900/10 dark:bg-slate-900/20 border border-primary" : "bg-transparent border border-transparent"} hover:bg-slate-900/20 dark:hover:bg-slate-900/30 cursor-pointer`}
            onClick={() => setActive(2)}>
            <RiLockPasswordLine size={20} className="text-secondary" />
            <h5 className='ml-2 sm:ml-3 text-sm sm:text-base font-medium font-Popins text-text dark:text-text-light'>Change Password</h5>
         </div>
         <div className={`w-full flex items-center justify-center px-2 sm:px-3 py-2 sm:py-4 cursor-pointer transition-colors duration-200 rounded-lg ${active === 3 ? "bg-slate-900/10 dark:bg-slate-900/20 border border-primary" : "bg-transparent border border-transparent"} hover:bg-slate-900/20 dark:hover:bg-slate-900/30 cursor-pointer`}
            onClick={() => setActive(3)}>
            <SiCoursera size={20} className="text-accent" />
            <h5 className='ml-2 sm:ml-3 text-sm sm:text-base font-medium font-Popins text-text dark:text-text-light'>Enrolled Courses</h5>
         </div>
         {user && user.role === 'admin' && (
            <Link className={`w-full flex items-center justify-center px-2 sm:px-3 py-2 sm:py-4 cursor-pointer transition-colors duration-200 rounded-lg ${active === 4 ? "bg-slate-900/10 dark:bg-slate-900/20 border border-primary" : "bg-transparent border border-transparent"} hover:bg-slate-900/20 dark:hover:bg-slate-900/30 cursor-pointer`}
               onClick={() => setActive(4)}
               href="/admin">
               <MdOutlineAdminPanelSettings size={20} className="text-accent" />
               <h5 className='ml-2 sm:ml-3 text-sm sm:text-base font-medium font-Popins text-text dark:text-text-light'>Admin Dashboard</h5>
            </Link>
         )
         }
         <div className={`w-full flex items-center justify-center px-2 sm:px-3 py-2 sm:py-4 cursor-pointer transition-colors duration-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 border border-transparent`}
            onClick={() => logOutHandler()}>
            <AiOutlineLogout size={20} className="text-red-500" />
            <h5 className='ml-2 sm:ml-3 text-sm sm:text-base font-medium font-Popins text-text dark:text-text-light'>Log Out</h5>
         </div>
      </div>
   )
}

export default SideBarProfile
