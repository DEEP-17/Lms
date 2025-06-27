'use client'
import { useLogOutQuery } from '@/redux/features/auth/authApi';
import { signOut } from 'next-auth/react';
import React, { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ChangePassword from './ChangePassword';
import ProfileInfo from './ProfileInfo';
import SideBarProfile from './SideBarProfile';

type Props = {
   user: any;
}

const Profile: FC<Props> = ({ user }) => {
   const [scroll, setScroll] = useState(false);
   const [avatar, setAvatar] = useState((user.avatar.public_id === 'default_avatar') ? null : user.avatar.url);
   const [active, setActive] = useState(1);
   const [logout, setLogout] = useState(false);
   useLogOutQuery(undefined, { skip: !logout ? true : false });

   const logOutHandler = async () => {
      setLogout(true);
      await signOut({ callbackUrl: '/' });
      toast.success('Logged out successfully');
   };

   useEffect(() => {
      const handleScroll = () => {
         if (window.scrollY > 85) {
            setScroll(true);
         } else {
            setScroll(false);
         }
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
         window.removeEventListener('scroll', handleScroll);
      };
   }, []);

   return (
      <div className='px-auto h-screen py-30 flex flex-col md:flex-row gap-6 justify-center items-center dark:bg-slate-900 dark:text-white'>
         <div
            className={`flex flex-col justify-center items-center w-[100px] md:w-[310px] h-[500px] 
            bg-white dark:bg-slate-800 
            text-black dark:text-white
            border border-slate-200 dark:border-[#ffffff1d] 
            rounded-lg shadow-lg p-4 
            transition-all duration-300 
            sticky ${scroll ? 'top-[120px]' : 'top-[30px]'}`}
         >
            <SideBarProfile
               user={user}
               active={active}
               avatar={avatar}
               setActive={setActive}
               logOutHandler={logOutHandler}
            />
         </div>
         <div className={`flex flex-col justify-center items-center w-[600px] md:w-[1100px] h-[500px] 
                  bg-white dark:bg-slate-800 
                  border border-slate-200 dark:border-[#ffffff1d] 
                  rounded-lg shadow-lg p-4 
                  transition-all duration-300 
                  sticky ${scroll ? 'top-[120px]' : 'top-[30px]'}`}>
            {
               active === 1 && (
                  <ProfileInfo user={user} avatar={avatar} />
               )
            }
            {
               active === 2 && (
                  <ChangePassword />
               )
            }
         </div>

      </div>
   )
}

export default Profile
