'use client'

import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from "react-hot-toast";

export default function SignIn() {
   const router = useRouter();

   useEffect(() => {
      // Check if user is already signed in
      const checkSession = async () => {
         const session = await getSession();
         if (session) {
            await router.push('/');
         }
      };
      checkSession();
   }, [router]);

   const handleGoogleSignIn = async () => {
      try {
         await signIn('google', { callbackUrl: '/' });
      } catch (error: unknown) {
         const err = error as { message?: string };
         if (err?.message?.includes('client_fetch_error')) {
            toast.error("Authentication service is currently unavailable. Please try again later.");
         } else {
            toast.error("An unexpected error occurred during sign in.");
         }
      }
   };

   const handleGitHubSignIn = async () => {
      try {
         await signIn('github', { callbackUrl: '/' });
      } catch (error: unknown) {
         const err = error as { message?: string };
         if (err?.message?.includes('client_fetch_error')) {
            toast.error("Authentication service is currently unavailable. Please try again later.");
         } else {
            toast.error("An unexpected error occurred during sign in.");
         }
      }
   };

   return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
         <div className="max-w-md w-full space-y-8">
            <div className="text-center">
               <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                  Sign in to your account
               </h2>
            </div>
            <div className="mt-8 space-y-6">
               <div className="space-y-4">
                  <button
                     onClick={handleGoogleSignIn}
                     className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                     Sign in with Google
                  </button>
                  <button
                     onClick={handleGitHubSignIn}
                     className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                     Sign in with GitHub
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
} 