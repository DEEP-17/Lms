import { useGetNewsletterSubscribersQuery, useSendNewsletterEmailMutation } from '@/redux/features/api/apiSlice';
import { useEditNewsletterMutation, useGetNewsletterDataQuery } from '@/redux/features/Layout/layoutApi';
import { Button } from '@mui/material';
import { Save } from 'lucide-react';
import React, { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface NewsletterData {
   title: string;
   description: string;
   buttonText: string;
   visitorCount: string;
}

type Props = {}

const EditNewsletter: FC<Props> = () => {
   const [newsletter, setNewsletter] = useState<NewsletterData>({
      title: '',
      description: '',
      buttonText: '',
      visitorCount: ''
   });

   const { data, isLoading: isLoadingData } = useGetNewsletterDataQuery(undefined, {
      refetchOnMountOrArgChange: true
   });
   const [editNewsletter, { isLoading: isUpdating }] = useEditNewsletterMutation();

   const { data: subscribersData, isLoading: loadingSubs } = useGetNewsletterSubscribersQuery();
   const [sendNewsletterEmail, { isLoading }] = useSendNewsletterEmailMutation();

   const [subject, setSubject] = useState('');
   const [message, setMessage] = useState('');
   const [selected, setSelected] = useState<string[]>([]);
   const [success, setSuccess] = useState<string | null>(null);
   const [errorMsg, setErrorMsg] = useState<string | null>(null);

   const subscribers = subscribersData?.subscribers || [];

   useEffect(() => {
      if (data?.layout?.newsletter) {
         setNewsletter(data.layout.newsletter);
      }
   }, [data]);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!newsletter.title.trim() || !newsletter.description.trim() || !newsletter.buttonText.trim()) {
         toast.error('Please fill in all required fields');
         return;
      }

      try {
         await editNewsletter({
            type: "Newsletter",
            title: newsletter.title,
            description: newsletter.description,
            buttonText: newsletter.buttonText,
            visitorCount: newsletter.visitorCount
         }).unwrap();
         toast.success('Newsletter section updated successfully!');
      } catch (error: any) {
         toast.error(error?.data?.message || 'Failed to update newsletter section');
      }
   };

   const handleSend = async (e: React.FormEvent) => {
      e.preventDefault();
      setSuccess(null);
      setErrorMsg(null);
      try {
         const result = await sendNewsletterEmail({
            subject,
            message,
            emails: selected.length ? selected : subscribers.map(s => s.email),
         }).unwrap();
         if (result.success) {
            setSuccess('Email(s) sent successfully!');
            setSubject('');
            setMessage('');
            setSelected([]);
            toast.success('Email(s) sent successfully!');
         } else {
            setErrorMsg(result.message || 'Failed to send email.');
            toast.error(result.message || 'Failed to send email.');
         }
      } catch (err: unknown) {
         if (
            typeof err === 'object' &&
            err !== null &&
            'data' in err &&
            typeof (err as { data?: { message?: string } }).data?.message === 'string'
         ) {
            setErrorMsg((err as { data: { message: string } }).data.message);
            toast.error((err as { data: { message: string } }).data.message);
         } else {
            setErrorMsg('Failed to send email.');
            toast.error('Failed to send email.');
         }
      }
   };

   const toggleSelect = (email: string) => {
      setSelected(sel => sel.includes(email) ? sel.filter(e => e !== email) : [...sel, email]);
   };

   const RequiredStar = () => <span className="text-red-500 ml-1">*</span>;

   if (isLoadingData) {
      return (
         <div className="w-full max-w-4xl mx-auto mt-8 p-8 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-xl border border-gray-200/50 dark:border-slate-700/50">
            <div className="animate-pulse">
               <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded mb-4"></div>
               <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded mb-8"></div>
               <div className="space-y-6">
                  <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded"></div>
                  <div className="h-32 bg-gray-200 dark:bg-slate-700 rounded"></div>
                  <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded"></div>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="w-full max-w-4xl mx-auto mt-8 p-8 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-xl border border-gray-200/50 dark:border-slate-700/50 transition-all duration-300">
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Edit Newsletter</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage the newsletter subscription section of your landing page</p>
         </div>

         <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div className="space-y-3">
               <label className="block text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                  Section Title <RequiredStar />
               </label>
               <input
                  type="text"
                  required
                  value={newsletter.title}
                  onChange={(e) => setNewsletter({ ...newsletter, title: e.target.value })}
                  placeholder="Subscribe for Course Updates & Discounts"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300"
               />
            </div>

            {/* Description */}
            <div className="space-y-3">
               <label className="block text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                  Description <RequiredStar />
               </label>
               <textarea
                  required
                  value={newsletter.description}
                  onChange={(e) => setNewsletter({ ...newsletter, description: e.target.value })}
                  placeholder="Be part of our community, get early access to new courses, enjoy special promotions, and receive exclusive discounts!"
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300 resize-none"
               />
            </div>

            {/* Button Text */}
            <div className="space-y-3">
               <label className="block text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                  Button Text <RequiredStar />
               </label>
               <input
                  type="text"
                  required
                  value={newsletter.buttonText}
                  onChange={(e) => setNewsletter({ ...newsletter, buttonText: e.target.value })}
                  placeholder="Get Notified"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300"
               />
            </div>

            {/* Visitor Count */}
            <div className="space-y-3">
               <label className="block text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                  Visitor Count
               </label>
               <input
                  type="text"
                  value={newsletter.visitorCount}
                  onChange={(e) => setNewsletter({ ...newsletter, visitorCount: e.target.value })}
                  placeholder="+2000 visitors worldwide"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300"
               />
            </div>

            {/* Preview */}
            <div className="p-6 bg-gray-50 dark:bg-slate-900 rounded-xl border-2 border-gray-200 dark:border-slate-600">
               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview</h3>
               <div className="bg-gray-200 dark:bg-slate-800 rounded-3xl p-8 flex flex-col items-center gap-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white text-center">
                     {newsletter.title || 'Newsletter Title'}
                  </h2>
                  <p className="text-black dark:text-gray-300 max-w-xl text-center text-lg leading-relaxed">
                     {newsletter.description || 'Newsletter description will appear here...'}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
                     <input
                        type="email"
                        placeholder="Enter your email address"
                        className="w-full px-5 py-3 rounded-lg border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm transition-all"
                        disabled
                     />
                     <button
                        type="button"
                        className="w-[300px] px-8 py-3 bg-slate-900 text-white dark:text-white rounded-lg font-semibold shadow hover:bg-blue-600 transition duration-300 cursor-pointer"
                        disabled
                     >
                        {newsletter.buttonText || 'Button Text'}
                     </button>
                  </div>
                  <div className="flex gap-3 items-center mt-4">
                     <img
                        src="/newsletter.png"
                        alt="Customer"
                        className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 shadow"
                     />
                     <span className="text-black dark:text-gray-300 text-sm">
                        {newsletter.visitorCount || '+2000 visitors worldwide'}
                     </span>
                  </div>
               </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
               <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-cyan-50 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-300 font-semibold transition cursor-pointer"
               >
                  <Save className="h-5 w-5" />
                  <span>{isUpdating ? 'Saving...' : 'Save Changes'}</span>
               </button>
            </div>
         </form>


      </div>
   );
}

export default EditNewsletter; 