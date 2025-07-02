import { useGetWhyTrustUsDataQuery } from '@/redux/features/Layout/layoutApi';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaBoxOpen } from 'react-icons/fa';
interface Features {
   title: string;
   icon?: string;
}


export default function WhyTrustUs() {
   const { data, isLoading, error } = useGetWhyTrustUsDataQuery(undefined, {
      refetchOnMountOrArgChange: true
   });
   const router = useRouter();

   // Default features if no data is available
   const defaultFeatures = [
      'Talented Learning Professionals',
      'Expert-Led Instruction',
      'Support for Success',
      'Industry Relevant Curriculum',
      'Continuous Improvement',
      'Practical Learning',
   ];

   const whyTrustUsData = data?.layout?.whyTrustUs;
   const features = whyTrustUsData?.features?.map((f:Features) => f.title) || defaultFeatures;

   if (isLoading) {
      return (
         <section className="bg-gray-200 dark:bg-slate-900 py-16">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4">
               <div className="animate-pulse">
                  <div className="h-12 bg-gray-300 dark:bg-slate-700 rounded mb-6 w-3/4"></div>
                  <div className="h-24 bg-gray-300 dark:bg-slate-700 rounded mb-8"></div>
                  <div className="space-y-4">
                     {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-6 bg-gray-300 dark:bg-slate-700 rounded w-3/4"></div>
                     ))}
                  </div>
               </div>
               <div className="flex justify-center">
                  <div className="w-72 h-72 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
               </div>
            </div>
         </section>
      );
   }

   if (error) {
      return (
         <section className="bg-gray-200 dark:bg-slate-900 py-16">
            <div className="max-w-6xl mx-auto px-4">
               <div className="text-center text-gray-600 dark:text-gray-400">
                  <p>Unable to load content. Please try again later.</p>
               </div>
            </div>
         </section>
      );
   }

   return (
      <section id="why-trust-us" className="bg-gradient-to-br from-cyan-50 via-white to-cyan-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 py-20 min-h-[60vh] flex items-center">
         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4">

            {/* Left */}
            <div className="flex justify-center relative">
               <img
                  src={whyTrustUsData?.image || "/trust-us.jpg"}
                  alt="Why trust us"
                  className="rounded-full shadow-xl w-72 h-72 object-cover border-4 border-white dark:border-slate-900"
               />

               {/* Floating icons */}
               <div className="absolute -top-6 -left-6 bg-slate-900/10 text-primary rounded-full p-3 shadow-lg animate-pulse">🌐</div>
               <div className="absolute -top-6 -right-6 bg-secondary/10 text-secondary rounded-full p-3 shadow-lg animate-pulse">💡</div>
               <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-accent/10 text-accent rounded-full p-3 shadow-lg animate-pulse">📈</div>
            </div>

            {/* Right */}
            <div>
               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-cyan-200 mb-6">
                  {whyTrustUsData?.title || 'Why is it worth it to trust us?'}
               </h2>
               <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-lg leading-relaxed">
                  {whyTrustUsData?.description || 'Our programs aim to elevate people, empowering individuals seeking career advancement, deepening skills, and enhanced productivity. We offer a range of IT, business, and personal development courses trusted and recommended worldwide.'}
               </p>
               <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {features.map((f:string, i:number) => (
                     <li key={i} className="flex items-center gap-3 text-primary font-medium">
                        <span className="text-xl">✔</span>
                        <span className="text-gray-900 dark:text-gray-200">{f}</span>
                     </li>
                  ))}
               </ul>
               <button
                  className="flex items-center gap-2 px-5 py-4 bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-cyan-50 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-300 font-semibold transition cursor-pointer"
                  onClick={() => router.push('/courses')}
               >
                  {/* Suggest Explore icon  other than FaArrowRight*/}
                  <FaBoxOpen className="w-4 h-4" />
                  Explore courses
               </button>
            </div>
         </div>
      </section>
   );
}
