import { useEditCategoriesMutation, useGetCategoriesDataQuery } from '@/redux/features/Layout/layoutApi';
import { Button } from '@mui/material';
import { Plus, Save, Trash2 } from 'lucide-react';
import React, { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Category {
   title: string;
   icon: string;
   count: number;
}

type Props = {}

const EditCategories: FC<Props> = () => {
   const [categories, setCategories] = useState<Category[]>([]);
   const [dragging, setDragging] = useState(false);

   const { data, isLoading: isLoadingData } = useGetCategoriesDataQuery(undefined, {
      refetchOnMountOrArgChange: true
   });
   const [editCategories, { isLoading: isUpdating }] = useEditCategoriesMutation();

   useEffect(() => {
      if (data?.layout?.categories) {
         setCategories(data.layout.categories);
      }
   }, [data]);

   const addCategory = () => {
      setCategories([...categories, { title: '', icon: '📚', count: 0 }]);
   };

   const removeCategory = (index: number) => {
      setCategories(categories.filter((_, i) => i !== index));
   };

   const updateCategory = (index: number, field: keyof Category, value: string | number) => {
      const updatedCategories = [...categories];
      updatedCategories[index] = { ...updatedCategories[index], [field]: value };
      setCategories(updatedCategories);
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (categories.length === 0) {
         toast.error('Please add at least one category');
         return;
      }

      if (categories.some(cat => !cat.title.trim())) {
         toast.error('Please fill in all category titles');
         return;
      }

      try {
         await editCategories({
            type: "Categories",
            categories: categories
         }).unwrap();
         toast.success('Categories updated successfully!');
      } catch (error: any) {
         toast.error(error?.data?.message || 'Failed to update categories');
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
                     <div key={i} className="h-32 bg-gray-200 dark:bg-slate-700 rounded"></div>
                  ))}
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="w-full max-w-4xl mx-auto mt-8 p-8 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-xl border border-gray-200/50 dark:border-slate-700/50 transition-all duration-300">
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Edit Categories</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage the course categories displayed on the landing page</p>
         </div>

         <form onSubmit={handleSubmit} className="space-y-8">
            {/* Categories List */}
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Categories</h2>
                  <button
                     type="button"
                     onClick={addCategory}
                     className="flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-cyan-50 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-300 font-semibold transition cursor-pointer"
                  >
                     <Plus className="h-4 w-4" />
                     <span>Add Category</span>
                  </button>
               </div>

               {categories.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                     No categories added yet. Click "Add Category" to get started.
                  </div>
               )}

               {categories.map((category, index) => (
                  <div key={index} className="p-6 border-2 border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700">
                     <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Category {index + 1}</h3>
                        <button
                           type="button"
                           onClick={() => removeCategory(index)}
                           className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 cursor-pointer"
                        >
                           <Trash2 className="h-5 w-5" />
                        </button>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Icon */}
                        <div className="space-y-2">
                           <label className="block text-sm font-medium text-gray-900 dark:text-white">
                              Icon <RequiredStar />
                           </label>
                           <input
                              type="text"
                              value={category.icon}
                              onChange={(e) => updateCategory(index, 'icon', e.target.value)}
                              placeholder="📚"
                              className="w-full px-3 py-2 border-2 border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300 text-center text-2xl"
                           />
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                           <label className="block text-sm font-medium text-gray-900 dark:text-white">
                              Title <RequiredStar />
                           </label>
                           <input
                              type="text"
                              value={category.title}
                              onChange={(e) => updateCategory(index, 'title', e.target.value)}
                              placeholder="Category name"
                              className="w-full px-3 py-2 border-2 border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300"
                           />
                        </div>

                        {/* Count */}
                        <div className="space-y-2">
                           <label className="block text-sm font-medium text-gray-900 dark:text-white">
                              Course Count
                           </label>
                           <input
                              type="number"
                              value={category.count}
                              onChange={(e) => updateCategory(index, 'count', parseInt(e.target.value) || 0)}
                              placeholder="0"
                              min="0"
                              className="w-full px-3 py-2 border-2 border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300"
                           />
                        </div>
                     </div>

                     {/* Preview */}
                     <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
                        <div className="flex items-center space-x-3">
                           <span className="text-3xl">{category.icon}</span>
                           <div>
                              <div className="font-semibold text-gray-900 dark:text-white">
                                 {category.title || 'Category Title'}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                 {category.count} courses
                              </div>
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

export default EditCategories; 