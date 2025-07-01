"use client"
import { useGetFaqDataQuery } from '@/redux/features/Layout/layoutApi';
import { Button } from '@mui/material';
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';

interface FAQItem {
   question: string;
   answer: string;
}

const FAQ: React.FC = () => {
   const { data, isLoading } = useGetFaqDataQuery(undefined, {
      refetchOnMountOrArgChange: true
   });

   const [openIndex, setOpenIndex] = useState<number | null>(null);

   const faqData = data?.layout?.faq || [];

   const toggleItem = (index: number) => {
      setOpenIndex(prev => (prev === index ? null : index));
   };

   const router = useRouter();

   if (isLoading) {
      return (
         <section id="faq" className="bg-gray-100 dark:bg-slate-900 py-16">
            <div className="max-w-6xl mx-auto px-4">
               <div className="animate-pulse">
                  <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded mb-8 w-1/3 mx-auto"></div>
                  <div className="space-y-4">
                     {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white dark:bg-slate-700 rounded-lg p-6">
                           <div className="h-6 bg-gray-200 dark:bg-slate-600 rounded mb-4"></div>
                           <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-3/4"></div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </section>
      );
   }

   return (
      <section id="faq" className="bg-gradient-to-br from-cyan-50 via-white to-cyan-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 py-20 min-h-[60vh] flex items-center">
         <div className="max-w-6xl mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-12">
               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-cyan-200 mb-4">
                  Frequently Asked Questions
               </h2>
               <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Find answers to common questions about our cyber security training platform
               </p>
            </div>

            {/* FAQ Items */}
            {faqData.length === 0 ? (
               <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                     No FAQs Available
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                     FAQ content will be available soon.
                  </p>
               </div>
            ) : (
               <div className="grid grid-cols-1 gap-6">
                  {faqData.map((faq: FAQItem, index: number) => {
                     const isOpen = openIndex === index;
                     const answerId = `faq-answer-${index}`;
                     return (
                        <div
                           key={index}
                           className={`bg-white dark:bg-slate-700 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 overflow-hidden transition-all duration-300 hover:shadow-md ${isOpen ? 'ring-2 ring-cyan-300 dark:ring-cyan-600' : ''}`}
                        >
                           <button
                              onClick={() => toggleItem(index)}
                              onKeyDown={e => {
                                 if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    toggleItem(index);
                                 }
                              }}
                              aria-expanded={isOpen}
                              aria-controls={answerId}
                              className={`w-full px-6 py-4 text-left flex items-center justify-between rounded-lg transition-colors duration-200 cursor-pointer font-semibold shadow-sm `}
                           >
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                                 {faq.question}
                              </h3>
                              <div className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                                 <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                              </div>
                           </button>

                           <div
                              id={answerId}
                              className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'} px-6`}
                              style={{ overflow: 'hidden' }}
                              aria-hidden={!isOpen}
                           >
                              <div className={`min-h-0 ${isOpen ? 'py-4' : ''} border-l-2 border-cyan-200 dark:border-cyan-700 pl-4 ml-2`}>
                                 <div className="pt-2">
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                       {faq.answer}
                                    </p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     );
                  })}
               </div>
            )}

            {/* Contact Section */}
            <div className="mt-12 bg-blue-50 dark:bg-slate-900 rounded-lg p-6 border border-blue-200 dark:border-slate-700">
               <div className="flex flex-col items-center justify-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                     Still have questions?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                     Can&apos;t find the answer you&apos;re looking for? Contact our support team.
                  </p>
                  <button
                     className="flex items-center justify-center text-center gap-2 px-5 py-4 bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-cyan-50 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-300 font-semibold transition cursor-pointer"
                     onClick={() => router.push('/contact-us')}
                  >
                     <FaEnvelope className="w-4 h-4" />
                     Contact Support
                  </button>
               </div>
            </div>
         </div>
      </section>
   );
};

export default FAQ; 