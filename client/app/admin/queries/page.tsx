"use client";
import DashboardHeader from "@/app/components/Admin/dashboard/DashboardHeader";
import AdminSidebar from "@/app/components/Admin/sidebar/AdminSidebar";
import AdminProtected from "@/app/hooks/adminProtected";
import { ContactQuery, useAnswerContactMutation, useGetAllContactsQuery } from '@/redux/features/api/apiSlice';
import { Button } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const QueriesPage = () => {
   const [modalOpen, setModalOpen] = useState(false);
   const [selected, setSelected] = useState<ContactQuery | null>(null);
   const [answer, setAnswer] = useState("");
   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
   const [answerContact, { isLoading: isAnswering }] = useAnswerContactMutation();
   const [showMsgModal, setShowMsgModal] = useState(false);
   const [msgModalContent, setMsgModalContent] = useState<string | null>(null);
   const [success, setSuccess] = useState(false);
   const { status: sessionStatus } = useSession();
   const router = useRouter();

   const handleSidebarToggle = (collapsed: boolean) => setIsSidebarCollapsed(collapsed);

   const { data, isLoading, refetch } = useGetAllContactsQuery();
   const queries = data?.contacts || [];
   const [showAnswerModal, setShowAnswerModal] = useState(false);
   const [answerModalContent, setAnswerModalContent] = useState<{ name: string; question: string; answer: string } | null>(null);

   const handleReply = (query: ContactQuery) => {
      setSelected(query);
      setAnswer("");
      setModalOpen(true);
      setSuccess(false);
   };

   const handleSend = async () => {
      if (!answer.trim() || !selected) return toast.error("Answer cannot be empty");
      try {
         const result = await answerContact({ id: selected._id, answerText: answer }).unwrap();
         if (result.success) {
            setSuccess(true);
            setTimeout(() => {
               setModalOpen(false);
               setSuccess(false);
            }, 1200);
            toast.success("Answer sent!");
            refetch();
         } else {
            toast.error(result.message || "Failed to send answer");
         }
      } catch {
         toast.error("Failed to send answer");
      }
   };

   const handleShowMsg = (msg: string) => {
      setMsgModalContent(msg);
      setShowMsgModal(true);
   };

   React.useEffect(() => {
      if (sessionStatus === 'unauthenticated') {
         toast.error('You must be an admin to access this page.');
         router.replace('/');
      }
   }, [sessionStatus, router]);

   if (sessionStatus === 'loading') {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
         </div>
      );
   }

   if (sessionStatus === 'unauthenticated') return null;

   return (
      <AdminProtected>
         <div className="admin-layout overflow-hidden">
            <AdminSidebar onToggle={handleSidebarToggle} />
            <div
               className={`transition-all duration-300 ease-in-out min-h-screen overflow-x-hidden text-black dark:text-white ${isSidebarCollapsed ? "ml-16" : "ml-72"}`}
            >
               <DashboardHeader />
               <div className="p-8">
                  <h1 className="text-2xl font-bold mb-6">User Queries</h1>
                  {isLoading ? (
                     <div>Loading...</div>
                  ) : (
                     <div className="overflow-x-auto">
                        <table className="min-w-full bg-white dark:bg-slate-900 rounded-xl shadow">
                           <thead>
                              <tr className="bg-[#BE3D2A] dark:bg-slate-700 text-cyan-900 dark:text-cyan-200">
                                 <th className="px-4 py-3 text-left font-semibold dark:text-white">Name</th>
                                 <th className="px-4 py-3 text-left font-semibold dark:text-white">Email</th>
                                 <th className="px-4 py-3 text-left font-semibold dark:text-white">Message</th>
                                 <th className="px-4 py-3 text-left font-semibold dark:text-white">Date</th>
                                 <th className="px-4 py-3 text-left font-semibold dark:text-white">Status</th>
                                 <th className="px-4 py-3 text-left font-semibold dark:text-white">Action</th>
                              </tr>
                           </thead>
                           <tbody>
                              {queries.map((q) => (
                                 <tr key={q._id} className="border-b border-gray-200 dark:border-slate-700 hover:bg-cyan-50 dark:hover:bg-slate-800 transition-colors">
                                    <td className="px-4 py-2 dark:text-white">{q.name}</td>
                                    <td className="px-4 py-2 dark:text-white">{q.email}</td>
                                    <td className="px-4 py-2 max-w-xs truncate cursor-pointer text-cyan-700 dark:text-cyan-300 underline" title={q.message} onClick={() => handleShowMsg(q.message)}>
                                       {q.message.length > 40 ? q.message.slice(0, 40) + '...' : q.message}
                                    </td>
                                    <td className="px-4 py-2 dark:text-white">{new Date(q.createdAt).toLocaleString()}</td>
                                    <td className="px-4 py-2">
                                       {q.answered ? (
                                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full text-xs font-semibold">
                                             <FaCheckCircle className="inline-block" /> Answered
                                          </span>
                                       ) : (
                                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 rounded-full text-xs font-semibold">
                                             <FaTimesCircle className="inline-block" /> Unanswered
                                          </span>
                                       )}
                                    </td>
                                    <td className="px-4 py-2 dark:text-white">
                                       {q.answered ? (
                                          // View Answer button functionality
                                          <>
                                             <div className="flex flex-col gap-2">
                                                <button
                                                   className="flex items-center justify-center gap-2 px-1 py-2 bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-cyan-50 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-300 font-semibold transition cursor-pointer text-xs w-24"
                                                   onClick={() => {
                                                      setShowAnswerModal(true);
                                                      setAnswerModalContent({
                                                         name: q.name,
                                                         question: q.message,
                                                         answer: q.answerText || '',
                                                      });
                                                   }}
                                                >
                                                   View Answer
                                                </button>
                                             </div>

                                             {showAnswerModal && answerModalContent && (
                                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40">
                                                   <div className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-xl max-w-lg w-full">
                                                      <h2 className="text-xl font-bold mb-4 dark:text-white">Answer to {answerModalContent.name}</h2>
                                                      <div className="mb-4 text-gray-700 dark:text-white whitespace-pre-line">{answerModalContent.answer}</div>
                                                      <div className="flex justify-end">
                                                         <button
                                                            className="px-4 py-2 bg-[#E78B48] hover:bg-[#BE3D2A] text-black dark:text-white rounded cursor-pointer"
                                                            onClick={() => setShowAnswerModal(false)}
                                                         >
                                                            Close
                                                         </button>
                                                      </div>
                                                   </div>
                                                </div>)}
                                          </>
                                             ) : (
                                             <button
                                                className="px-3 py-1 bg-[#E78B48] hover:bg-[#BE3D2A] text-black dark:text-white rounded shadow cursor-pointer"
                                                onClick={() => handleReply(q)}
                                             >
                                                Reply
                                             </button>
                                       )}
                                          </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  )}
               </div>
            </div>
            {/* Modal for full message */}
            {showMsgModal && (
               <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-xl max-w-lg w-full">
                     <h2 className="text-xl font-bold mb-4 dark:text-white">Full Message</h2>
                     <div className="mb-4 text-gray-700 dark:text-white whitespace-pre-line">{msgModalContent}</div>
                     <div className="flex justify-end">
                        <button
                           className="px-4 py-2 bg-[#E78B48] hover:bg-[#BE3D2A] text-black dark:text-white rounded cursor-pointer"
                           onClick={() => setShowMsgModal(false)}
                        >
                           Close
                        </button>
                     </div>
                  </div>
               </div>
            )}
            {/* Modal for answering */}
            {modalOpen && selected && (
               <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-xl max-w-lg w-full flex flex-col items-center">
                     <h2 className="text-xl font-bold mb-4 dark:text-white">Reply to {selected.name}</h2>
                     <div className="mb-2 text-gray-700 dark:text-white w-full">
                        <strong>Question:</strong> {selected.message}
                     </div>
                     <textarea
                        className="w-full p-3 rounded border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-50 dark:bg-slate-700 text-black dark:text-white min-h-[120px]"
                        value={answer}
                        onChange={e => setAnswer(e.target.value)}
                        placeholder="Type your answer here..."
                     />
                     <div className="flex justify-end gap-2 mt-4 w-full">
                        <button
                           className="px-4 py-2 bg-gray-200 dark:bg-slate-700 rounded dark:text-white cursor-pointer"
                           onClick={() => setModalOpen(false)}
                           disabled={isAnswering}
                        >
                           Cancel
                        </button>
                        <button
                           className="px-4 py-2 bg-[#E78B48] hover:bg-[#BE3D2A] text-black dark:text-white rounded cursor-pointer"
                           onClick={handleSend}
                           disabled={isAnswering}
                        >
                           {isAnswering ? 'Sending...' : 'Send Answer'}
                        </button>
                     </div>
                     {success && (
                        <div className="flex flex-col items-center mt-6">
                           <FaCheckCircle className="text-green-500 text-4xl mb-2 animate-bounce" />
                           <span className="text-green-600 dark:text-green-300 font-semibold">Answer sent!</span>
                        </div>
                     )}
                  </div>
               </div>
            )}
         </div>
      </AdminProtected>
   );
};

export default QueriesPage; 