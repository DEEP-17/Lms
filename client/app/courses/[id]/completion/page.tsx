'use client'
import Link from "next/link";
import React from "react";

const CompletionPage: React.FC = () => {
   const link = window.location.href.split('/').slice(0, -1).join('/');
   console.log(link);
   return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-slate-900 dark:to-slate-800">
         <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-10 max-w-lg w-full flex flex-col items-center">
            <svg className="h-16 w-16 text-cyan-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M8 12l2 2 4-4" />
            </svg>
            <h1 className="text-3xl font-bold text-cyan-700 dark:text-cyan-300 mb-2 text-center">Payment Successful!</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 text-center">
               Thank you for your purchase. Your payment has been processed successfully.
            </p>
            <Link href={`${link}`}>
               <span className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 cursor-pointer">
                  Go to My Courses
               </span>
            </Link>
         </div>
      </div>
   );
};

export default CompletionPage; 