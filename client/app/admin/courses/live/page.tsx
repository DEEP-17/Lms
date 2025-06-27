'use client';
import DashboardHeader from '@/app/components/Admin/dashboard/DashboardHeader';
import AdminSidebar from '@/app/components/Admin/sidebar/AdminSidebar';
import AdminProtected from '@/app/hooks/adminProtected';
import Heading from '@/app/utils/Heading';
import { useDeleteCourseMutation, useGetAllCoursesQuery } from '@/redux/features/api/apiSlice';
import { CourseFormData } from '@/types/course';
import { Button } from '@mui/material';
import Lottie from 'lottie-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const LiveCoursesPage = () => {
   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
   const handleSidebarToggle = (collapsed: boolean) => {
      setIsSidebarCollapsed(collapsed);
   };
   const { data, isLoading, isError, refetch } = useGetAllCoursesQuery();
   const courses: CourseFormData[] = Array.isArray(data?.courses)
      ? data.courses
      : Array.isArray(data)
         ? data
         : [];
   const [animationData, setAnimationData] = useState<object | null>(null);
   const [deleteCourse, { isLoading: isDeleting, error: deleteError }] = useDeleteCourseMutation();
   const router = useRouter();
   const [deletingId, setDeletingId] = useState<string | null>(null);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

   useEffect(() => {
      fetch('/animation.json')
         .then((res) => res.json())
         .then(setAnimationData);
   }, []);

   const handleDelete = async (id: string) => {
      setPendingDeleteId(id);
      setShowDeleteModal(true);
   };

   const confirmDelete = async () => {
      if (!pendingDeleteId) return;
      setDeletingId(pendingDeleteId);
      setShowDeleteModal(false);
      try {
         await deleteCourse(pendingDeleteId).unwrap();
         toast.success('Course deleted successfully!');
         refetch();
      } catch {
         // Error handled by deleteError
      } finally {
         setDeletingId(null);
         setPendingDeleteId(null);
      }
   };

   const cancelDelete = () => {
      setShowDeleteModal(false);
      setPendingDeleteId(null);
   };

   const handleEdit = (id: string) => {
      router.push(`/admin/courses/edit/${id}`);
   };

   return (
      <AdminProtected>
         <div className="admin-layout overflow-hidden">
            <Heading
               title="Live Courses"
               description="View and manage all live courses."
               keywords="live courses, admin, elearning"
            />
            <AdminSidebar onToggle={handleSidebarToggle} />
            <div className={`transition-all duration-300 ease-in-out min-h-screen overflow-x-hidden ${isSidebarCollapsed ? 'ml-16' : 'ml-72'}`}>
               <DashboardHeader />
               <div className="p-8">
                  <h1 className="text-2xl font-bold mb-4 text-black">Live Courses</h1>
                  <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-6">
                     {isLoading ? (
                        <div className="p-8 text-center text-lg">Loading courses...</div>
                     ) : isError ? (
                        <div className="p-8 text-center text-red-600 dark:text-red-400">Failed to load courses.</div>
                     ) : courses.length === 0 ? (
                        <div className="p-8 text-center text-gray-600 dark:text-gray-300">No courses found.</div>
                     ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                           {courses.map((course: CourseFormData, idx: number) => (
                              <div key={course._id || idx} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden flex flex-col">
                                 {(course.thumbnail && typeof course.thumbnail === 'object' && 'url' in course.thumbnail && course.thumbnail.url) ? (
                                    <img
                                       src={course.thumbnail.url}
                                       alt={course.name}
                                       className="w-full h-60 object-cover object-center"
                                    />
                                 ) : (course.thumbnail && typeof course.thumbnail === 'string') ? (
                                    <img
                                       src={course.thumbnail}
                                       alt={course.name}
                                       className="w-full h-60 object-cover object-center"
                                    />
                                 ) : (
                                    <div className="w-full h-60 flex items-center justify-center bg-gray-100 dark:bg-slate-900">
                                       {animationData ? (
                                          <Lottie
                                             animationData={animationData}
                                             loop
                                             autoplay
                                          />
                                       ) : (
                                          <span className="text-gray-400">No Image</span>
                                       )}
                                    </div>
                                 )}
                                 <div className="p-6 flex-1 flex flex-col">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{course.name}</h2>
                                    <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">{course.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                       <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">Level: {course.level}</span>
                                       <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold">Price: ₹{course.price}</span>
                                       {course.estimatedPrice && (
                                          <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-semibold">Est. Price: ₹{course.estimatedPrice}</span>
                                       )}
                                       {course.tags && (
                                          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold">Tags: {course.tags}</span>
                                       )}
                                    </div>
                                    {course.demoUrl && (
                                       <a href={course.demoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline text-sm mb-2">Demo Link</a>
                                    )}
                                    <div className="mb-2">
                                       <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Benefits:</span>
                                       <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-xs ml-2">
                                          {course.benefits.map((b, i) => b.title && <li key={i}>{b.title}</li>)}
                                       </ul>
                                    </div>
                                    <div className="mb-2">
                                       <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Prerequisites:</span>
                                       <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-xs ml-2">
                                          {course.prerequisites.map((p, i) => p.title && <li key={i}>{p.title}</li>)}
                                       </ul>
                                    </div>
                                    <div className="mt-auto pt-4 flex items-center justify-between">
                                       <span className="text-xs text-gray-500 dark:text-gray-400">Created: {course._id ? new Date(parseInt(course._id.substring(0, 8), 16) * 1000).toLocaleDateString() : '-'}</span>
                                       <span className="text-xs text-gray-500 dark:text-gray-400">ID: {course._id || '-'}</span>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                       <button
                                          className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
                                          onClick={() => handleEdit(course._id!)}
                                          disabled={isDeleting && deletingId === course._id}
                                       >
                                          Edit
                                       </button>
                                       <button
                                          className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer"
                                          onClick={() => handleDelete(course._id!)}
                                          disabled={isDeleting && deletingId === course._id}
                                       >
                                          {isDeleting && deletingId === course._id ? 'Deleting...' : 'Delete'}
                                       </button>
                                    </div>
                                    {deleteError && deletingId === course._id && (
                                       <div className="text-red-500 text-xs mt-2">Failed to delete course.</div>
                                    )}
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
         {/* Delete Confirmation Modal */}
         {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
               <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8 max-w-sm w-full">
                  <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Confirm Deletion</h2>
                  <p className="mb-6 text-gray-700 dark:text-gray-300">Are you sure you want to delete this course? This action cannot be undone.</p>
                  <div className="flex justify-end gap-4">
                     <button
                        className="px-4 py-2 rounded bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-slate-600 transition cursor-pointer"
                        onClick={cancelDelete}
                     >
                        Cancel
                     </button>
                     <button
                        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
                        onClick={confirmDelete}
                     >
                        Delete
                     </button>
                  </div>
               </div>
            </div>
         )}
      </AdminProtected>
   );
};

export default LiveCoursesPage; 