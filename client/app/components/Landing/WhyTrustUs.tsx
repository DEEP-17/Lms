import React from 'react';

const features = [
   'Talented Learning Professionals',
   'Expert-Led Instruction',
   'Support for Success',
   'Industry Relevant Curriculum',
   'Continuous Improvement',
   'Practical Learning',
];

export default function WhyTrustUs() {
   return (
      <section className="bg-gray-200 dark:bg-slate-800 py-16">
         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4">

            {/* Left */}
            <div className="flex justify-center relative">
               <img
                  src="/trust-us.jpg"
                  alt="Why trust us"
                  className="rounded-full shadow-xl w-72 h-72 object-cover border-4 border-white dark:border-slate-900"
               />

               {/* Floating icons */}
               <div className="absolute -top-6 -left-6 bg-primary/10 text-primary rounded-full p-3 shadow-lg animate-pulse">🌐</div>
               <div className="absolute -top-6 -right-6 bg-secondary/10 text-secondary rounded-full p-3 shadow-lg animate-pulse">💡</div>
               <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-accent/10 text-accent rounded-full p-3 shadow-lg animate-pulse">📈</div>
            </div>

            {/* Right */}
            <div>
               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Why is it worth it to trust us?
               </h2>
               <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-lg leading-relaxed">
                  Our programs aim to elevate people, empowering individuals seeking career advancement, deepening skills, and enhanced productivity. We offer a range of IT, business, and personal development courses trusted and recommended worldwide.
               </p>
               <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {features.map((f, i) => (
                     <li key={i} className="flex items-center gap-3 text-primary font-medium">
                        <span className="text-xl">✔</span>
                        <span className="text-gray-900 dark:text-gray-200">{f}</span>
                     </li>
                  ))}
               </ul>
               <button className="bg-gray-100 dark:bg-gray-900 text-black dark:text-white px-3 py-3 rounded-lg font-semibold transition hover:bg-primary/90 cursor-pointer">
                  Explore courses
               </button>
            </div>
         </div>
      </section>
   );
}
