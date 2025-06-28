"use client";
import CreateCourse from '@/app/components/Admin/Course/CreateCourse';
import DashboardHeader from '@/app/components/Admin/dashboard/DashboardHeader';
import AdminSidebar from '@/app/components/Admin/sidebar/AdminSidebar';
import AdminProtected from '@/app/hooks/adminProtected';
import Heading from '@/app/utils/Heading';
import { useGetAllCoursesForAdminQuery } from '@/redux/features/api/apiSlice';
import { CourseFormData } from '@/types/course';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const EditCoursePage = () => {
   const params = useParams<{ id: string }>();
   const id = params?.id;
   const router = useRouter();
   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
   const { data, isLoading: isCoursesLoading, refetch } = useGetAllCoursesForAdminQuery();
   const [courseData, setCourseData] = useState<CourseFormData | null>(null);

   const handleSidebarToggle = (collapsed: boolean) => setIsSidebarCollapsed(collapsed);

   useEffect(() => {
      if (data?.courses && id) {
         const found = data.courses.find((c: CourseFormData) => c._id === id);
         if (found) {
            setCourseData(found);
         }
      }
   }, [data, id]);

   const handleSuccess = async () => {
      // Add a small delay to ensure the cache is updated
      setTimeout(() => {
         router.push('/admin/courses/live');
      }, 100);
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
                  {isCoursesLoading || !courseData ? (
                     <div className="p-8 text-center text-lg">Loading course data...</div>
                  ) : (
                     <CreateCourse
                        isEditMode={true}
                        courseId={id}
                        initialCourseData={courseData}
                        onSuccess={handleSuccess}
                        onRefetch={refetch}
                     />
                  )}
               </div>
            </div>
         </div>
      </AdminProtected>
   );
};

export default EditCoursePage; 