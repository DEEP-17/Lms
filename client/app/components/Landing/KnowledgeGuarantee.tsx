import React from 'react';

export default function KnowledgeGuarantee() {
   return (
      <section className="bg-card dark:bg-slate-900 py-16">
         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4 sm:px-6 lg:px-8">
            {/* Left */}
            <div>
               <h2 className="text-3xl md:text-4xl font-bold text-heading dark:text-white mb-6">
                  Guarantee of Knowledge
               </h2>
               <p className="text-subtext dark:text-gray-400 mb-8 max-w-xl leading-relaxed text-lg">
                  We&apos;ve trained thousands in IT, management, and business skills. Our courses are crafted by experts,
                  regularly updated, and guarantee practical knowledge and real-world skills. Join top IT professionals and
                  boost your career.
               </p>
               <button className="px-8 py-3 bg-primary text-white rounded-lg font-semibold shadow hover:bg-primary/90 transition duration-300">
                  Explore Courses
               </button>
            </div>

            {/* Right */}
            <div className="flex justify-center">
               <img
                  src="/knowledge.png"
                  alt="Guarantee of Knowledge"
                  className="rounded-2xl shadow-xl w-full max-w-md object-cover transition-transform duration-300 hover:scale-105"
               />
            </div>
         </div>
      </section>
   );
}
