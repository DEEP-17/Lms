import { useGetNewsletterDataQuery } from '@/redux/features/Layout/layoutApi';
import { useSubscribeNewsletterMutation } from '@/redux/features/api/apiSlice';
import { Button } from '@mui/material';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function Newsletter() {
   const { data, isLoading, error } = useGetNewsletterDataQuery(undefined, {
      refetchOnMountOrArgChange: true
   });

   const [email, setEmail] = useState('');
   const [subscribeNewsletter, { isLoading: loading }] = useSubscribeNewsletterMutation();

   const newsletterData = data?.layout?.newsletter;

   const handleSubscribe = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         const result = await subscribeNewsletter({ email }).unwrap();
         if (result.success) {
            setEmail('');
            toast.success('Subscribed successfully!');
         } else {
            toast.error(result.message || 'Failed to subscribe.');
         }
      } catch (err: unknown) {
         if (
            typeof err === 'object' &&
            err !== null &&
            'data' in err &&
            typeof (err as { data?: { message?: string } }).data?.message === 'string'
         ) {
            toast.error((err as { data: { message: string } }).data.message);
         } else {
            toast.error('Failed to subscribe.');
         }
      }
   };

   if (isLoading) {
      return (
         <section className="bg-accent dark:bg-slate-900 py-16">
            <div className="max-w-3xl mx-auto px-6 rounded-3xl bg-gray-200 dark:bg-slate-800 shadow-xl flex flex-col items-center gap-6 py-12">
               <div className="animate-pulse w-full">
                  <div className="h-12 bg-gray-300 dark:bg-slate-700 rounded mb-6 w-3/4 mx-auto"></div>
                  <div className="h-20 bg-gray-300 dark:bg-slate-700 rounded mb-6"></div>
                  <div className="h-12 bg-gray-300 dark:bg-slate-700 rounded mb-6 w-64 mx-auto"></div>
                  <div className="h-10 bg-gray-300 dark:bg-slate-700 rounded w-48 mx-auto"></div>
               </div>
            </div>
         </section>
      );
   }

   if (error) {
      return (
         <section className="bg-accent dark:bg-slate-900 py-16">
            <div className="max-w-3xl mx-auto px-6 rounded-3xl bg-gray-200 dark:bg-slate-800 shadow-xl flex flex-col items-center gap-6 py-12">
               <div className="text-center text-gray-600 dark:text-gray-400">
                  <p>Unable to load newsletter section. Please try again later.</p>
               </div>
            </div>
         </section>
      );
   }

   return (
      <section id="newsletter" className="bg-accent dark:bg-slate-900 py-20 min-h-[60vh] flex items-center">
         <div className="max-w-3xl mx-auto px-6 rounded-3xl bg-gray-200 dark:bg-slate-800 shadow-xl flex flex-col items-center gap-6 py-12 transition-all duration-300">
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-cyan-200 text-center">
               {newsletterData?.title || 'Subscribe for Course Updates & Discounts'}
            </h2>
            <p className="text-black dark:text-gray-300 max-w-xl text-center text-lg leading-relaxed">
               {newsletterData?.description || 'Be part of our community, get early access to new courses, enjoy special promotions, and receive exclusive discounts!'}
            </p>
            <form className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center" onSubmit={handleSubscribe}>
               <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-5 py-3 rounded-lg border border-primary focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-slate-900 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm transition-all"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled={loading}
               />
               <button
                  type="submit"
                  className="w-[300px] px-8 py-3 bg-cyan-200 hover:bg-cyan-300 focus:bg-cyan-300 text-black rounded-lg font-bold shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:scale-105 focus:scale-95 focus:ring-2 focus:ring-cyan-400"
                  disabled={loading}
               >
                  {loading ? 'Subscribing...' : (newsletterData?.buttonText || 'Get Notified')}
               </button>
            </form>
            <div className="flex gap-3 items-center mt-4 rounded-2xl">
               <img
                  src="/newsletter.png"
                  alt="NewsLetter"
                  className="w-10 h-10 rounded-md bg-slate-300 object-cover shadow"
               />
               <span className="text-black dark:text-gray-300 text-sm">
                  {newsletterData?.visitorCount || '+2000 visitors worldwide'}
               </span>
            </div>
         </div>
      </section>
   );
}
