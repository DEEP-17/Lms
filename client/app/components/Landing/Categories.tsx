import React from 'react';

const categories = [
   { icon: '💼', title: 'Office', count: 8 },
   { icon: '🌐', title: 'Web and marketing', count: 6 },
   { icon: '🧠', title: 'Personality development', count: 7 },
   { icon: '🎨', title: 'Creative', count: 5 },
   { icon: '💻', title: 'Programming', count: 9 },
];

export default function Categories() {
   return (
      <section className="bg-gray-100 dark:bg-gray-900 py-16">
         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-12 text-center">
               Explore by categories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
               {categories.map((cat, i) => (
                  <div
                     key={i}
                     className="group bg-card dark:bg-slate-900 rounded-2xl shadow-md p-6 flex flex-col items-center justify-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                     <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">
                        {cat.icon}
                     </div>
                     <div className="font-semibold text-lg text-black dark:text-white mb-2 text-center">
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
