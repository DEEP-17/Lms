import { useEditTestimonialsMutation, useGetTestimonialsDataQuery } from '@/redux/features/Layout/layoutApi';
import { Image as ImageIcon, Plus, Save, Star, Trash2 } from 'lucide-react';
import React, { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Testimonial {
   name: string;
   text: string;
   rating: number;
   avatar: string;
   date: string;
}


const EditTestimonials: FC = () => {
   const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

   const { data, isLoading: isLoadingData } = useGetTestimonialsDataQuery(undefined, {
      refetchOnMountOrArgChange: true
   });
   const [editTestimonials, { isLoading: isUpdating }] = useEditTestimonialsMutation();

   useEffect(() => {
      if (data?.layout?.testimonials) {
         setTestimonials(data.layout.testimonials);
      }
   }, [data]);

   const addTestimonial = () => {
      setTestimonials([...testimonials, {
         name: '',
         text: '',
         rating: 5,
         avatar: '',
         date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      }]);
   };

   const removeTestimonial = (index: number) => {
      setTestimonials(testimonials.filter((_, i) => i !== index));
   };

   const updateTestimonial = (index: number, field: keyof Testimonial, value: string | number) => {
      const updatedTestimonials = [...testimonials];
      updatedTestimonials[index] = { ...updatedTestimonials[index], [field]: value };
      setTestimonials(updatedTestimonials);
   };

   const handleAvatarChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         const reader = new FileReader();
         reader.onloadend = () => {
            updateTestimonial(index, 'avatar', reader.result as string);
         };
         reader.readAsDataURL(file);
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (testimonials.length === 0) {
         toast.error('Please add at least one testimonial');
         return;
      }

      if (testimonials.some(testimonial => !testimonial.name.trim() || !testimonial.text.trim())) {
         toast.error('Please fill in all required fields');
         return;
      }

      try {
         await editTestimonials({
            type: "Testimonials",
            testimonials: testimonials
         }).unwrap();
         toast.success('Testimonials updated successfully!');
      } catch {
         toast.error('Failed to update testimonials');
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Edit Testimonials</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage customer testimonials displayed on the landing page</p>
         </div>

         <form onSubmit={handleSubmit} className="space-y-8">
            {/* Testimonials List */}
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Testimonials</h2>
                  <button
                     type="button"
                     onClick={addTestimonial}
                     className="flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-cyan-50 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-300 font-semibold transition cursor-pointer"
                  >
                     <Plus className="h-4 w-4" />
                     <span>Add Testimonial</span>
                  </button>
               </div>

               {testimonials.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                     No testimonials added yet. Click &quot;Add Testimonial&quot; to get started.
                  </div>
               )}

               {testimonials.map((testimonial, index) => (
                  <div key={index} className="p-6 border-2 border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700">
                     <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Testimonial {index + 1}</h3>
                        <button
                           type="button"
                           onClick={() => removeTestimonial(index)}
                           className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 cursor-pointer"
                        >
                           <Trash2 className="h-5 w-5" />
                        </button>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                           {/* Name */}
                           <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                                 Name <RequiredStar />
                              </label>
                              <input
                                 type="text"
                                 value={testimonial.name}
                                 onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                                 placeholder="Customer name"
                                 className="w-full px-3 py-2 border-2 border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300"
                              />
                           </div>

                           {/* Rating */}
                           <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                                 Rating <RequiredStar />
                              </label>
                              <div className="flex items-center space-x-2">
                                 {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                       key={star}
                                       type="button"
                                       onClick={() => updateTestimonial(index, 'rating', star)}
                                       className={`text-2xl transition-colors duration-200 cursor-pointer ${star <= testimonial.rating
                                          ? 'text-yellow-400'
                                          : 'text-gray-300 dark:text-gray-600'
                                          }`}
                                    >
                                       <Star className="h-6 w-6 fill-current" />
                                    </button>
                                 ))}
                                 <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                    {testimonial.rating}/5
                                 </span>
                              </div>
                           </div>

                           {/* Date */}
                           <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                                 Date
                              </label>
                              <input
                                 type="text"
                                 value={testimonial.date}
                                 onChange={(e) => updateTestimonial(index, 'date', e.target.value)}
                                 placeholder="e.g., Feb 2024"
                                 className="w-full px-3 py-2 border-2 border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300"
                              />
                           </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                           {/* Avatar */}
                           <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                                 Avatar
                              </label>
                              <input
                                 type="file"
                                 accept="image/*"
                                 id={`avatar-${index}`}
                                 className="hidden"
                                 onChange={(e) => handleAvatarChange(index, e)}
                              />
                              <label
                                 htmlFor={`avatar-${index}`}
                                 className="block w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-400 transition-colors duration-300"
                              >
                                 {testimonial.avatar ? (
                                    <div className="w-full h-full flex items-center justify-center">
                                       <img
                                          src={testimonial.avatar}
                                          alt="Avatar preview"
                                          className="w-20 h-20 rounded-full object-cover"
                                       />
                                    </div>
                                 ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                       <ImageIcon className="h-8 w-8 mb-2" />
                                       <span className="text-sm">Click to upload avatar</span>
                                    </div>
                                 )}
                              </label>
                           </div>
                        </div>
                     </div>

                     {/* Testimonial Text */}
                     <div className="mt-4 space-y-2">
                        <label className="block text-sm font-medium text-gray-900 dark:text-white">
                           Testimonial Text <RequiredStar />
                        </label>
                        <textarea
                           value={testimonial.text}
                           onChange={(e) => updateTestimonial(index, 'text', e.target.value)}
                           placeholder="Customer testimonial..."
                           rows={3}
                           className="w-full px-3 py-2 border-2 border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300 resize-none"
                        />
                     </div>

                     {/* Preview */}
                     <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
                        <div className="flex items-start space-x-3">
                           <img
                              src={testimonial.avatar || '/avatar.jpg'}
                              alt={testimonial.name}
                              className="w-10 h-10 rounded-full object-cover"
                           />
                           <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                 <div className="font-semibold text-gray-900 dark:text-white">
                                    {testimonial.name || 'Customer Name'}
                                 </div>
                                 <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {testimonial.date}
                                 </div>
                              </div>
                              <div className="flex gap-1 mb-2">
                                 {[...Array(5)].map((_, i) => (
                                    <Star
                                       key={i}
                                       className={`h-3 w-3 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                                    />
                                 ))}
                              </div>
                              <div className="text-sm text-gray-700 dark:text-gray-300">
                                 {testimonial.text || 'Testimonial text will appear here...'}
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

export default EditTestimonials; 