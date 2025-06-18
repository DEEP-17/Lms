import React from 'react';

export default function Newsletter() {
   return (
      <section className="bg-accent dark:bg-slate-800 py-16">
         <div className="max-w-3xl mx-auto px-6 rounded-3xl bg-white dark:bg-slate-900 shadow-xl flex flex-col items-center gap-6 py-12 transition-all duration-300">
            <h2 className="text-3xl md:text-4xl font-bold text-heading dark:text-white text-center">
               Subscribe for Course Updates & Discounts
            </h2>
            <p className="text-subtext dark:text-gray-300 max-w-xl text-center text-lg leading-relaxed">
               Be part of our community, get early access to new courses, enjoy special promotions, and receive exclusive discounts!
            </p>
            <form className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
               <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-5 py-3 rounded-lg border border-primary focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-slate-800 text-heading dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm transition-all"
               />
               <button
                  type="submit"
                  className="px-8 py-3 bg-primary text-white rounded-lg font-semibold shadow hover:bg-primary/90 transition duration-300"
               >
                  Get Notified
               </button>
            </form>
            <div className="flex gap-3 items-center mt-4">
               <img
                  src="/avatar1.jpg"
                  alt="Customer"
                  className="w-10 h-10 rounded-full object-cover border-2 border-primary shadow"
               />
               <span className="text-subtext dark:text-gray-300 text-sm">+2000 visitors worldwide</span>
            </div>
         </div>
      </section>
   );
}
