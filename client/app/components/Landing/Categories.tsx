import { useGetCategoriesDataQuery } from '@/redux/features/Layout/layoutApi';
import React from 'react';

export default function Categories() {
   const { data, isLoading, error } = useGetCategoriesDataQuery(undefined, {
      refetchOnMountOrArgChange: true
   });

   // Default categories if no data is available
   const defaultCategories = [
      { icon: '💼', title: 'Office', count: 8 },
      { icon: '🌐', title: 'Web and marketing', count: 6 },
      { icon: '🧠', title: 'Personality development', count: 7 },
      { icon: '🎨', title: 'Creative', count: 5 },
      { icon: '💻', title: 'Programming', count: 9 },
   ];

   const categories = data?.layout?.categories || defaultCategories;

   if (isLoading) {
      return (
         <section className="bg-gray-100 dark:bg-slate-900 py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="animate-pulse">
                  <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded mb-12 mx-auto w-64"></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                     {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-32 bg-gray-200 dark:bg-slate-700 rounded-2xl"></div>
                     ))}
                  </div>
               </div>
            </div>
         </section>
      );
   }

   if (error) {
      return (
         <section className="bg-gray-100 dark:bg-slate-900 py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center text-gray-600 dark:text-gray-400">
                  <p>Unable to load categories. Please try again later.</p>
               </div>
            </div>
         </section>
      );
   }

   return (
      <section id="categories" className="bg-gray-100 dark:bg-slate-900 py-20 min-h-[60vh] flex items-center">
         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2563eb] dark:text-cyan-200 mb-12 text-center">
               Explore by categories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
               {categories.map((cat, i) => (
                  <div
                     key={i}
                     className="group bg-card dark:bg-slate-800 rounded-2xl shadow-md p-6 flex flex-col items-center justify-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 min-h-[160px]"
                  >
                     <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">
                        {cat.icon}
                     </div>
                     <div className="font-semibold text-lg text-[#2563eb] dark:text-white mb-2 text-center">
                        {cat.title}
                     </div>
                     <div className="text-subtext dark:text-gray-400 text-sm text-center">
                        {cat.count} courses
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}
