"use client";
import DashboardHeader from '@/app/components/Admin/dashboard/DashboardHeader';
import AdminSidebar from '@/app/components/Admin/sidebar/AdminSidebar';
import AdminProtected from '@/app/hooks/adminProtected';
import Heading from '@/app/utils/Heading';
import { useEditCourseMutation, useGetAllCoursesQuery } from '@/redux/features/api/apiSlice';
import { CourseFormData } from '@/types/course';
import { Button } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const EditCoursePage = () => {
   const { id } = useParams<{ id: string }>();
   const router = useRouter();
   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
   const handleSidebarToggle = (collapsed: boolean) => setIsSidebarCollapsed(collapsed);
   const { data, isLoading: isCoursesLoading, refetch } = useGetAllCoursesQuery();
   const [editCourse, { isLoading, isSuccess, isError, error }] = useEditCourseMutation();
   const [initialCourse, setInitialCourse] = useState<CourseFormData | null>(null);
   const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
   const [newThumbnail, setNewThumbnail] = useState<string | null>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);

   const { register, handleSubmit, reset, formState: { errors } } = useForm<CourseFormData>({
      defaultValues: initialCourse || undefined,
   });

   useEffect(() => {
      if (data?.courses && id) {
         const found = data.courses.find((c: CourseFormData) => c._id === id);
         if (found) {
            setInitialCourse(found);
            reset(found);
         }
      }
   }, [data, id, reset]);

   useEffect(() => {
      if (initialCourse) {
         setThumbnailPreview(
            typeof initialCourse.thumbnail === 'string'
               ? initialCourse.thumbnail
               : (initialCourse.thumbnail as any)?.url || null
         );
      }
   }, [initialCourse]);

   useEffect(() => {
      if (isSuccess) {
         toast.success('Course updated successfully!');
         refetch();
         router.push('/admin/courses/live');
      }
   }, [isSuccess, refetch, router]);

   const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         const reader = new FileReader();
         reader.onloadend = () => {
            setNewThumbnail(reader.result as string);
            setThumbnailPreview(reader.result as string);
         };
         reader.readAsDataURL(file);
      }
   };

   const onSubmit = async (formData: CourseFormData) => {
      if (!id) return;
      const payload: any = { ...formData };
      // Always send the current thumbnail object
      payload.thumbnail = initialCourse?.thumbnail;
      // Only send newThumbnail if a new file is selected and it's a valid base64 string
      if (newThumbnail && typeof newThumbnail === 'string' && newThumbnail.startsWith('data:image')) {
         payload.newThumbnail = newThumbnail;
      } else {
         delete payload.newThumbnail;
      }
      await editCourse({ id, data: payload });
   };

   return (
      <AdminProtected>
         <div className="admin-layout overflow-hidden">
            <Heading
               title="Edit Course"
               description="Edit the details of your course."
               keywords="edit course, admin, elearning, course management"
            />
            <AdminSidebar onToggle={handleSidebarToggle} />
            <div className={`transition-all duration-300 ease-in-out min-h-screen overflow-x-hidden text-black dark:text-white ${isSidebarCollapsed ? 'ml-16' : 'ml-72'}`}>
               <DashboardHeader />
               <div className="flex-1 p-8 mt-16">
                  <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Edit Course</h1>
                  {isCoursesLoading || !initialCourse ? (
                     <div className="p-8 text-center text-lg">Loading course data...</div>
                  ) : (
                     <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-slate-900 rounded-lg shadow p-6 max-w-2xl mx-auto space-y-4">
                        <div>
                           <label className="block font-semibold mb-1">Course Name</label>
                           <input
                              className="w-full border rounded px-3 py-2 dark:bg-slate-800 dark:text-white"
                              {...register('name', { required: 'Course name is required' })}
                           />
                           {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
                        </div>
                        <div>
                           <label className="block font-semibold mb-1">Description</label>
                           <textarea
                              className="w-full border rounded px-3 py-2 dark:bg-slate-800 dark:text-white"
                              rows={3}
                              {...register('description', { required: 'Description is required' })}
                           />
                           {errors.description && <span className="text-red-500 text-xs">{errors.description.message}</span>}
                        </div>
                        <div className="flex gap-4">
                           <div className="flex-1">
                              <label className="block font-semibold mb-1">Price</label>
                              <input
                                 type="number"
                                 className="w-full border rounded px-3 py-2 dark:bg-slate-800 dark:text-white"
                                 {...register('price', { required: 'Price is required', valueAsNumber: true })}
                              />
                              {errors.price && <span className="text-red-500 text-xs">{errors.price.message}</span>}
                           </div>
                           <div className="flex-1">
                              <label className="block font-semibold mb-1">Estimated Price</label>
                              <input
                                 type="number"
                                 className="w-full border rounded px-3 py-2 dark:bg-slate-800 dark:text-white"
                                 {...register('estimatedPrice', { valueAsNumber: true })}
                              />
                           </div>
                        </div>
                        <div>
                           <label className="block font-semibold mb-1">Tags</label>
                           <input
                              className="w-full border rounded px-3 py-2 dark:bg-slate-800 dark:text-white"
                              {...register('tags')}
                           />
                        </div>
                        <div>
                           <label className="block font-semibold mb-1">Level</label>
                           <input
                              className="w-full border rounded px-3 py-2 dark:bg-slate-800 dark:text-white"
                              {...register('level')}
                           />
                        </div>
                        <div>
                           <label className="block font-semibold mb-1">Demo URL</label>
                           <input
                              className="w-full border rounded px-3 py-2 dark:bg-slate-800 dark:text-white"
                              {...register('demoUrl')}
                           />
                        </div>
                        {/* Thumbnail Upload */}
                        <div>
                           <label className="block font-semibold mb-1">Course Thumbnail</label>
                           <input
                              type="file"
                              accept="image/*"
                              ref={fileInputRef}
                              className="hidden"
                              onChange={handleThumbnailChange}
                           />
                           <div
                              className="w-full h-48 flex items-center justify-center border-2 border-dashed rounded-xl cursor-pointer relative transition-all duration-300 group bg-gray-50 dark:bg-slate-700 cursor-pointer"
                              onClick={() => fileInputRef.current?.click()}
                           >
                              {thumbnailPreview ? (
                                 <img src={thumbnailPreview} alt="Course Thumbnail" className="h-full object-contain rounded-xl" />
                              ) : (
                                 <span className="text-gray-400">Click to upload thumbnail</span>
                              )}
                           </div>
                        </div>
                        {/* Add more fields as needed for benefits, prerequisites, etc. */}
                        <div className="flex gap-4">
                           <button
                              type="submit"
                              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
                              disabled={isLoading}
                           >
                              {isLoading ? 'Saving...' : 'Save Changes'}
                           </button>
                           <button
                              type="button"
                              className="px-6 py-2 bg-gray-300 dark:bg-slate-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-slate-600 transition cursor-pointer"
                              onClick={() => router.back()}
                           >
                              Cancel
                           </button>
                        </div>
                        {isError && <div className="text-red-500 mt-2">Failed to update course.</div>}
                     </form>
                  )}
               </div>
            </div>
         </div>
      </AdminProtected>
   );
};

export default EditCoursePage; 