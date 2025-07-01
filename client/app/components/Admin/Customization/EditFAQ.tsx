import { useEditFaqMutation, useGetFaqDataQuery } from '@/redux/features/Layout/layoutApi';
import { Button } from '@mui/material';
import { Plus, Save, Trash2 } from 'lucide-react';
import React, { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface FaqItem {
   question: string;
   answer: string;
}

type Props = {}

const EditFAQ: FC<Props> = () => {
   const [faqItems, setFaqItems] = useState<FaqItem[]>([]);

   const { data, isLoading: isLoadingData } = useGetFaqDataQuery(undefined, {
      refetchOnMountOrArgChange: true
   });
   const [editFaq, { isLoading: isUpdating }] = useEditFaqMutation();

   useEffect(() => {
      if (data?.layout?.faq) {
         setFaqItems(data.layout.faq);
      }
   }, [data]);

   const addFaqItem = () => {
      setFaqItems([...faqItems, { question: '', answer: '' }]);
   };

   const removeFaqItem = (index: number) => {
      setFaqItems(faqItems.filter((_, i) => i !== index));
   };

   const updateFaqItem = (index: number, field: keyof FaqItem, value: string) => {
      const updatedFaqItems = [...faqItems];
      updatedFaqItems[index] = { ...updatedFaqItems[index], [field]: value };
      setFaqItems(updatedFaqItems);
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (faqItems.length === 0) {
         toast.error('Please add at least one FAQ item');
         return;
      }

      if (faqItems.some(item => !item.question.trim() || !item.answer.trim())) {
         toast.error('Please fill in all required fields');
         return;
      }

      try {
         await editFaq({
            type: "FAQ",
            faq: faqItems
         }).unwrap();
         toast.success('FAQ section updated successfully!');
      } catch (error: any) {
         toast.error(error?.data?.message || 'Failed to update FAQ section');
      }
   };

   const RequiredStar = () => <span className="text-red-500 ml-1">*</span>;

   if (isLoadingData) {
      return (
         <div className="w-full max-w-4xl mx-auto mt-8 p-8 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-xl border border-gray-200/50 dark:border-slate-700/50">
            <div className="animate-pulse">
               <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded mb-4"></div>
               <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded mb-8"></div>
               <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                     <div key={i} className="h-48 bg-gray-200 dark:bg-slate-700 rounded"></div>
                  ))}
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="w-full max-w-4xl mx-auto mt-8 p-8 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-xl border border-gray-200/50 dark:border-slate-700/50 transition-all duration-300">
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Edit FAQ</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage frequently asked questions displayed on the landing page</p>
         </div>

         <form onSubmit={handleSubmit} className="space-y-8">
            {/* FAQ Items List */}
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">FAQ Items</h2>
                  <button
                     type="button"
                     onClick={addFaqItem}
                     className="flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-cyan-50 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-300 font-semibold transition cursor-pointer"
                  >
                     <Plus className="h-4 w-4" />
                     <span>Add FAQ Item</span>
                  </button>
               </div>

               {faqItems.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                     No FAQ items added yet. Click "Add FAQ Item" to get started.
                  </div>
               )}

               {faqItems.map((item, index) => (
                  <div key={index} className="p-6 border-2 border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700">
                     <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">FAQ Item {index + 1}</h3>
                        <button
                           type="button"
                           onClick={() => removeFaqItem(index)}
                           className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 cursor-pointer"
                        >
                           <Trash2 className="h-5 w-5" />
                        </button>
                     </div>

                     {/* Question */}
                     <div className="space-y-2 mb-4">
                        <label className="block text-sm font-medium text-gray-900 dark:text-white">
                           Question <RequiredStar />
                        </label>
                        <input
                           type="text"
                           value={item.question}
                           onChange={(e) => updateFaqItem(index, 'question', e.target.value)}
                           placeholder="Enter the question"
                           className="w-full px-3 py-2 border-2 border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300"
                        />
                     </div>

                     {/* Answer */}
                     <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-900 dark:text-white">
                           Answer <RequiredStar />
                        </label>
                        <textarea
                           value={item.answer}
                           onChange={(e) => updateFaqItem(index, 'answer', e.target.value)}
                           placeholder="Enter the answer"
                           rows={3}
                           className="w-full px-3 py-2 border-2 border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300 resize-none"
                        />
                     </div>

                     {/* Preview */}
                     <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
                        <div className="space-y-2">
                           <div className="font-semibold text-gray-900 dark:text-white">
                              Q: {item.question || 'Question will appear here...'}
                           </div>
                           <div className="text-gray-700 dark:text-gray-300 text-sm">
                              A: {item.answer || 'Answer will appear here...'}
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
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

export default EditFAQ; 