import { useEditWhyTrustUsMutation, useGetWhyTrustUsDataQuery } from '@/redux/features/Layout/layoutApi';
import { Button } from '@mui/material';
import { Image as ImageIcon, Plus, Save, Trash2, Upload } from 'lucide-react';
import React, { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Feature {
   title: string;
   icon: string;
}

interface WhyTrustUsData {
   title: string;
   description: string;
   image: string;
   features: Feature[];
}

type Props = {}

const EditWhyTrustUs: FC<Props> = () => {
   const [whyTrustUs, setWhyTrustUs] = useState<WhyTrustUsData>({
      title: '',
      description: '',
      image: '',
      features: []
   });
   const [imageFile, setImageFile] = useState<File | null>(null);
   const [dragging, setDragging] = useState(false);

   const { data, isLoading: isLoadingData } = useGetWhyTrustUsDataQuery(undefined, {
      refetchOnMountOrArgChange: true
   });
   const [editWhyTrustUs, { isLoading: isUpdating }] = useEditWhyTrustUsMutation();

   useEffect(() => {
      if (data?.layout?.whyTrustUs) {
         setWhyTrustUs(data.layout.whyTrustUs);
      }
   }, [data]);

   const addFeature = () => {
      setWhyTrustUs({
         ...whyTrustUs,
         features: [...whyTrustUs.features, { title: '', icon: '✔' }]
      });
   };

   const removeFeature = (index: number) => {
      setWhyTrustUs({
         ...whyTrustUs,
         features: whyTrustUs.features.filter((_, i) => i !== index)
      });
   };

   const updateFeature = (index: number, field: keyof Feature, value: string) => {
      const updatedFeatures = [...whyTrustUs.features];
      updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
      setWhyTrustUs({
         ...whyTrustUs,
         features: updatedFeatures
      });
   };

   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         setImageFile(file);
         const reader = new FileReader();
         reader.onloadend = () => {
            setWhyTrustUs({
               ...whyTrustUs,
               image: reader.result as string
            });
         };
         reader.readAsDataURL(file);
      }
   };

   const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(true);
   };

   const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
   };

   const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith('image/')) {
         setImageFile(file);
         const reader = new FileReader();
         reader.onloadend = () => {
            setWhyTrustUs({
               ...whyTrustUs,
               image: reader.result as string
            });
         };
         reader.readAsDataURL(file);
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!whyTrustUs.title.trim() || !whyTrustUs.description.trim()) {
         toast.error('Please fill in all required fields');
         return;
      }

      if (whyTrustUs.features.length === 0) {
         toast.error('Please add at least one feature');
         return;
      }

      if (whyTrustUs.features.some(feature => !feature.title.trim())) {
         toast.error('Please fill in all feature titles');
         return;
      }

      try {
         await editWhyTrustUs({
            type: "WhyTrustUs",
            title: whyTrustUs.title,
            description: whyTrustUs.description,
            image: whyTrustUs.image,
            features: whyTrustUs.features
         }).unwrap();
         toast.success('Why Trust Us section updated successfully!');
      } catch (error: any) {
         toast.error(error?.data?.message || 'Failed to update Why Trust Us section');
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
                  <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded"></div>
                  <div className="h-32 bg-gray-200 dark:bg-slate-700 rounded"></div>
                  <div className="h-48 bg-gray-200 dark:bg-slate-700 rounded"></div>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="w-full max-w-4xl mx-auto mt-8 p-8 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-xl border border-gray-200/50 dark:border-slate-700/50 transition-all duration-300">
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Edit Why Trust Us</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage the trust-building section of your landing page</p>
         </div>

         <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Left Column - Text Content */}
               <div className="space-y-6">
                  {/* Title */}
                  <div className="space-y-3">
                     <label className="block text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                        Section Title <RequiredStar />
                     </label>
                     <input
                        type="text"
                        required
                        value={whyTrustUs.title}
                        onChange={(e) => setWhyTrustUs({ ...whyTrustUs, title: e.target.value })}
                        placeholder="Why is it worth it to trust us?"
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
                        value={whyTrustUs.description}
                        onChange={(e) => setWhyTrustUs({ ...whyTrustUs, description: e.target.value })}
                        placeholder="Describe why customers should trust your platform..."
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300 resize-none"
                     />
                  </div>
               </div>

               {/* Right Column - Image */}
               <div className="space-y-3">
                  <label className="block text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                     Section Image
                  </label>
                  <input
                     type="file"
                     accept="image/*"
                     id="why-trust-us-image"
                     className="hidden"
                     onChange={handleImageChange}
                  />
                  <label
                     htmlFor="why-trust-us-image"
                     className={`w-full h-[300px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer relative transition-all duration-300 group ${dragging
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-slate-700/50'
                        }`}
                     onDragOver={handleDragOver}
                     onDragLeave={handleDragLeave}
                     onDrop={handleDrop}
                  >
                     {whyTrustUs.image ? (
                        <div className="relative w-full h-full">
                           <img
                              src={whyTrustUs.image}
                              alt="Why Trust Us Preview"
                              className="w-full h-full object-cover rounded-lg"
                           />
                           <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                                 <Upload className="h-8 w-8 mx-auto mb-2" />
                                 <p className="text-sm font-medium">Click or drag to change image</p>
                              </div>
                           </div>
                        </div>
                     ) : (
                        <div className="text-center">
                           <ImageIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                           <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                              Click to upload or drag and drop
                           </p>
                           <p className="text-gray-500 dark:text-gray-500 text-sm">
                              PNG, JPG, GIF up to 10MB
                           </p>
                        </div>
                     )}
                  </label>
               </div>
            </div>

            {/* Features */}
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Features</h2>
                  <button
                     type="button"
                     onClick={addFeature}
                     className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300 focus:ring-4 focus:ring-green-500/20 outline-none cursor-pointer"
                  >
                     <Plus className="h-4 w-4" />
                     <span>Add Feature</span>
                  </button>
               </div>

               {whyTrustUs.features.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                     No features added yet. Click "Add Feature" to get started.
                  </div>
               )}

               {whyTrustUs.features.map((feature, index) => (
                  <div key={index} className="p-4 border-2 border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700">
                     <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Feature {index + 1}</h3>
                        <button
                           type="button"
                           onClick={() => removeFeature(index)}
                           className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 cursor-pointer"
                        >
                           <Trash2 className="h-4 w-4" />
                        </button>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Icon */}
                        <div className="space-y-2">
                           <label className="block text-sm font-medium text-gray-900 dark:text-white">
                              Icon <RequiredStar />
                           </label>
                           <input
                              type="text"
                              value={feature.icon}
                              onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                              placeholder="✔"
                              className="w-full px-3 py-2 border-2 border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300 text-center text-xl"
                           />
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                           <label className="block text-sm font-medium text-gray-900 dark:text-white">
                              Feature Title <RequiredStar />
                           </label>
                           <input
                              type="text"
                              value={feature.title}
                              onChange={(e) => updateFeature(index, 'title', e.target.value)}
                              placeholder="Feature description"
                              className="w-full px-3 py-2 border-2 border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300"
                           />
                        </div>
                     </div>

                     {/* Preview */}
                     <div className="mt-3 p-3 bg-gray-50 dark:bg-slate-900 rounded-lg">
                        <div className="flex items-center space-x-3">
                           <span className="text-xl text-green-600">{feature.icon}</span>
                           <span className="text-gray-900 dark:text-white font-medium">
                              {feature.title || 'Feature title'}
                           </span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            {/* Preview */}
            <div className="p-6 bg-gray-50 dark:bg-slate-900 rounded-xl border-2 border-gray-200 dark:border-slate-600">
               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview</h3>
               <div className="bg-gray-200 dark:bg-slate-900 py-16 rounded-2xl">
                  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4">

                     {/* Left - Image */}
                     <div className="flex justify-center relative">
                        <img
                           src={whyTrustUs.image || "/trust-us.jpg"}
                           alt="Why trust us"
                           className="rounded-full shadow-xl w-72 h-72 object-cover border-4 border-white dark:border-slate-900"
                        />

                        {/* Floating icons */}
                        <div className="absolute -top-6 -left-6 bg-slate-900/10 text-primary rounded-full p-3 shadow-lg animate-pulse">🌐</div>
                        <div className="absolute -top-6 -right-6 bg-secondary/10 text-secondary rounded-full p-3 shadow-lg animate-pulse">💡</div>
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-accent/10 text-accent rounded-full p-3 shadow-lg animate-pulse">📈</div>
                     </div>

                     {/* Right - Content */}
                     <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                           {whyTrustUs.title || 'Why is it worth it to trust us?'}
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-lg leading-relaxed">
                           {whyTrustUs.description || 'Our programs aim to elevate people, empowering individuals seeking career advancement, deepening skills, and enhanced productivity. We offer a range of IT, business, and personal development courses trusted and recommended worldwide.'}
                        </p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                           {whyTrustUs.features.length > 0 ? (
                              whyTrustUs.features.map((feature, i) => (
                                 <li key={i} className="flex items-center gap-3 text-primary font-medium">
                                    <span className="text-xl">{feature.icon || '✔'}</span>
                                    <span className="text-gray-900 dark:text-gray-200">{feature.title || 'Feature title'}</span>
                                 </li>
                              ))
                           ) : (
                              // Show placeholder features if none are added
                              ['Talented Learning Professionals', 'Expert-Led Instruction', 'Support for Success', 'Industry Relevant Curriculum'].map((feature, i) => (
                                 <li key={i} className="flex items-center gap-3 text-primary font-medium">
                                    <span className="text-xl">✔</span>
                                    <span className="text-gray-900 dark:text-gray-200">{feature}</span>
                                 </li>
                              ))
                           )}
                        </ul>
                        <button>
                           Explore courses
                        </button>
                     </div>
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

export default EditWhyTrustUs; 