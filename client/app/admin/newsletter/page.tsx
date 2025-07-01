'use client';

import DashboardHeader from '@/app/components/Admin/dashboard/DashboardHeader';
import AdminSidebar from '@/app/components/Admin/sidebar/AdminSidebar';
import AdminProtected from '@/app/hooks/adminProtected';
import Heading from '@/app/utils/Heading';
import { useGetNewsletterSubscribersQuery, useSendNewsletterEmailMutation } from '@/redux/features/api/apiSlice';
import { Button } from '@mui/material';
import { Mail, Send, Users } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineMail } from 'react-icons/ai';

const NewsletterPage: React.FC = () => {
   const { data: subscribersData, isLoading: loadingSubs } = useGetNewsletterSubscribersQuery();
   const [sendNewsletterEmail, { isLoading }] = useSendNewsletterEmailMutation();

   const [subject, setSubject] = useState('');
   const [message, setMessage] = useState('');
   const [selected, setSelected] = useState<string[]>([]);

   const subscribers = subscribersData?.subscribers || [];

   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
   const handleSidebarToggle = (collapsed: boolean) => {
      setIsSidebarCollapsed(collapsed);
   };

   const handleSend = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         const result = await sendNewsletterEmail({
            subject,
            message,
            emails: selected.length ? selected : subscribers.map(s => s.email),
         }).unwrap();
         if (result.success) {
            setSubject('');
            setMessage('');
            setSelected([]);
            toast.success('Email(s) sent successfully!');
         } else {
            toast.error(result.message || 'Failed to send email.');
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
            toast.error('Failed to send email.');
         }
      }
   };

   const toggleSelect = (email: string) => {
      setSelected(sel => sel.includes(email) ? sel.filter(e => e !== email) : [...sel, email]);
   };

   const selectAll = () => {
      setSelected(subscribers.map(s => s.email));
   };

   const deselectAll = () => {
      setSelected([]);
   };

   return (

      <AdminProtected>
         <div className="admin-layout overflow-hidden">
            <Heading
               title="Newsletter Management"
               description="View and manage newsletter subscribers."
               keywords="newsletter, subscribers, elearning, admin management"
            />
            <AdminSidebar onToggle={handleSidebarToggle} />
            <div
               className={`transition-all duration-300 ease-in-out min-h-screen overflow-x-hidden text-black ${isSidebarCollapsed ? 'ml-16' : 'ml-72'}`}
            >
               <DashboardHeader />

               <div className="p-8">
                  <div className="max-w-4xl mx-auto">
                     <div className="mb-8">
                        <h1 className="text-3xl font-bold text-cyan-700 dark:text-cyan-300 flex items-center gap-3">
                           <AiOutlineMail className="w-8 h-8" />
                           Newsletter Management
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                           Send emails to newsletter subscribers
                        </p>
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Subscribers List */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6">
                           <div className="flex items-center justify-between mb-4">
                              <h2 className="text-xl font-semibold text-cyan-700 dark:text-cyan-300 flex items-center gap-2">
                                 <Users className="w-5 h-5" />
                                 Subscribers ({subscribers.length})
                              </h2>
                              <div className="flex gap-2">
                                 <button
                                    onClick={selectAll}
                                    className="px-3 py-1 text-xs bg-white dark:bg-[#102E50] text-cyan-700 dark:text-cyan-300 rounded hover:bg-gray-100 dark:hover:bg-[#102E50] cursor-pointer"
                                 >
                                    Select All
                                 </button>
                                 <button
                                    onClick={deselectAll}
                                    className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                                 >
                                    Deselect All
                                 </button>
                              </div>
                           </div>

                           <div className="max-h-96 overflow-y-auto border rounded-lg bg-gray-50 dark:bg-slate-800">
                              {loadingSubs ? (
                                 <div className="p-4 text-center text-gray-500">Loading subscribers...</div>
                              ) : subscribers.length === 0 ? (
                                 <div className="p-4 text-center text-gray-500">No subscribers yet.</div>
                              ) : (
                                 <div className="p-2">
                                    {subscribers.map(sub => (
                                       <div key={sub.email} className="flex items-center gap-3 p-2 hover:bg-white dark:hover:bg-slate-900 rounded">
                                          <input
                                             type="checkbox"
                                             checked={selected.includes(sub.email)}
                                             onChange={() => toggleSelect(sub.email)}
                                             className="rounded border-cyan-400 text-cyan-600 focus:ring-cyan-500"
                                          />
                                          <div className="flex-1">
                                             <div className="text-sm font-medium text-black dark:text-white">{sub.email}</div>
                                             <div className="text-xs text-gray-500">
                                                Subscribed: {new Date(sub.createdAt).toLocaleDateString()}
                                             </div>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              )}
                           </div>
                        </div>

                        {/* Email Composition */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6">
                           <h2 className="text-xl font-semibold text-cyan-700 dark:text-cyan-300 flex items-center gap-2 mb-4">
                              <Mail className="w-5 h-5" />  
                              Compose Email
                           </h2>

                           <form onSubmit={handleSend} className="space-y-4">
                              <div>
                                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Subject *
                                 </label>
                                 <input
                                    type="text"
                                    value={subject}
                                    onChange={e => setSubject(e.target.value)}
                                    placeholder="Enter email subject"
                                    className="w-full px-4 py-2 rounded-lg border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white dark:bg-slate-700 text-black dark:text-white"
                                    required
                                 />
                              </div>

                              <div>
                                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Message *
                                 </label>
                                 <textarea
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    placeholder="Enter your message (HTML supported)"
                                    className="w-full px-4 py-2 rounded-lg border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white dark:bg-slate-700 text-black dark:text-white min-h-[200px] resize-y"
                                    required
                                 />
                              </div>

                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                 {selected.length > 0 ? (
                                    <span>Will send to {selected.length} selected subscriber(s)</span>
                                 ) : (
                                    <span>Will send to all {subscribers.length} subscribers</span>
                                 )}
                              </div>

                              <button
                                 type="submit"
                                 disabled={isLoading || subscribers.length === 0}
                                 className="flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-cyan-50 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-300 font-semibold transition cursor-pointer w-full"
                              >
                                 {isLoading ? (
                                    <>
                                       <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                       Sending...
                                    </>
                                 ) : (
                                    <>
                                       <Send className="w-4 h-4" />
                                       Send Email
                                    </>
                                 )}
                              </button>
                           </form>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </AdminProtected>
   );
};

export default NewsletterPage; 