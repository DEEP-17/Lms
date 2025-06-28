'use client'

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function AuthError() {
   const searchParams = useSearchParams();
   const error = searchParams.get('error');

   const getErrorMessage = (error: string | null) => {
      switch (error) {
         case 'Configuration':
            return 'There is a problem with the server configuration.';
         case 'AccessDenied':
            return 'You do not have permission to sign in.';
         case 'Verification':
            return 'The verification token has expired or has already been used.';
         default:
            return 'An error occurred during authentication.';
      }
   };

   return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
         <div className="max-w-md w-full space-y-8">
            <div className="text-center">
               <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                  Authentication Error
               </h2>
               <p className="mt-2 text-sm text-gray-600">
                  {getErrorMessage(error)}
               </p>
            </div>
            <div className="mt-8 space-y-6">
               <div className="text-center">
                  <Link
                     href="/"
                     className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                     Return to home page
                  </Link>
               </div>
            </div>
         </div>
      </div>
   );
} 