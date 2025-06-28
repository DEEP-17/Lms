'use client';

import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import { useGetCourseContentQuery, useGetSingleCourseQuery } from '@/redux/features/api/apiSlice';
import { BookOpen, ChevronRight, Clock, Download, MessageCircle, Play } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { FC, useEffect } from 'react';
import toast from 'react-hot-toast';

const CourseComponentsPage: FC = () => {
   const params = useParams();
   const router = useRouter();
   const courseId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : undefined;

   const { data: session } = useSession();
   const { data: courseData, isLoading: courseLoading, isError } = useGetSingleCourseQuery(courseId ?? '', { skip: !courseId });
   const { data: contentData, isLoading: contentLoading } = useGetCourseContentQuery(courseId ?? '', { skip: !courseId });

   const course = courseData?.course;
   const content = contentData?.content || [];

   // Handle authentication redirect in useEffect
   useEffect(() => {
      const handleAuthRedirect = async () => {
         if (!session?.user) {
            toast.error('Please purchase course to view.');
            router.push('/');
         }
      };
      handleAuthRedirect();
   }, [session, router]);

   // Show loading while checking authentication
   if (!session?.user) {
      return (
         <>
            <Header activeItem={1} route="/courses" />
            <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 py-24">
               <div className="max-w-6xl mx-auto px-4">
                  <div className="flex items-center justify-center h-64">
                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
                  </div>
               </div>
            </div>
            <Footer />
         </>
      );
   }

   if (courseLoading || contentLoading) {
      return (
         <>
            <Header activeItem={1} route="/courses" />
            <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 py-24">
               <div className="max-w-6xl mx-auto px-4">
                  <div className="flex items-center justify-center h-64">
                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
                  </div>
               </div>
            </div>
            <Footer />
         </>
      );
   }

   if (!course) {
      return (
         <>
            <Header activeItem={1} route="/courses" />
            <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 py-24">
               <div className="max-w-6xl mx-auto px-4">
                  <div className="text-center">
                     <h1 className="text-2xl font-bold text-red-500 mb-4">Course not found</h1>
                     <Link href="/courses" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                        Back to Courses
                     </Link>
                  </div>
               </div>
            </div>
            <Footer />
         </>
      );
   }

   if (isError) {
      return (
         <div className="text-center p-8">
            <div className="text-red-500 mb-4">Failed to load course content</div>
            <button
               onClick={() => window.location.reload()}
               className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition"
            >
               Try Again
            </button>
         </div>
      );
   }

   const formatDuration = (seconds: number): string => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);

      if (hours > 0) {
         return `${hours}h ${minutes}m`;
      }
      return `${minutes}m`;
   };

   const getThumbnailUrl = (thumbnail: any): string => {
      if (typeof thumbnail === 'string') {
         return thumbnail;
      }
      if (thumbnail && typeof thumbnail === 'object' && 'url' in thumbnail) {
         return thumbnail.url || '';
      }
      return '';
   };

   return (
      <>
         <Header activeItem={1} route="/courses" />
         <section className="min-h-screen py-20 bg-gradient-to-br from-cyan-50 via-white to-cyan-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 py-12">
            <div className="max-w-6xl mx-auto px-4">
               {/* Breadcrumb */}
               <nav className="text-lg text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2">
                  <Link href="/courses" className="hover:underline">All courses</Link>
                  <ChevronRight className="w-4 h-4" />
                  <Link href={`/courses/${courseId}`} className="hover:underline">{course.name}</Link>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-black dark:text-white font-semibold">Course Content</span>
               </nav>

               {/* Course Header */}
               <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 mb-8">
                  <div className="flex items-start gap-6">
                     <img
                        src={getThumbnailUrl(course.thumbnail)}
                        alt={course.name}
                        className="w-32 h-32 object-cover rounded-lg shadow-md"
                     />
                     <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                           {course.name}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                           {course.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                           <div className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              <span>{content.length} sections</span>
                           </div>
                           <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>Self-paced</span>
                           </div>
                           {course.level && (
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded text-xs">
                                 {course.level}
                              </span>
                           )}
                        </div>
                     </div>
                  </div>
               </div>

               {/* Course Content Sections */}
               <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                     Course Content
                  </h2>

                  {content.length === 0 ? (
                     <div className="text-center py-12">
                        <div className="text-4xl mb-4">📚</div>
                        <p className="text-gray-500 dark:text-gray-400">No content available for this course</p>
                     </div>
                  ) : (
                     content.map((section, sectionIndex) => (
                        <div
                           key={section._id || sectionIndex}
                           className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden"
                        >
                           <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                 Section {sectionIndex + 1}: {section.title || `Content ${sectionIndex + 1}`}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-300 text-sm">
                                 {section.description || 'No description available'}
                              </p>
                           </div>

                           <div className="p-6">
                              <div className="space-y-3">
                                 <div
                                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-all duration-200 cursor-pointer"
                                    onClick={() => router.push(`/courses/${courseId}/components/${section._id || sectionIndex}`)}
                                 >
                                    <div className="flex items-center gap-4">
                                       <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                          <Play className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                       </div>
                                       <div>
                                          <h4 className="font-medium text-gray-900 dark:text-white">
                                             {section.title || `Video ${sectionIndex + 1}`}
                                          </h4>
                                          <p className="text-sm text-gray-500 dark:text-gray-400">
                                             {section.description}
                                          </p>
                                       </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                       {section.videoLength && (
                                          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                             <Clock className="w-3 h-3" />
                                             {formatDuration(section.videoLength)}
                                          </span>
                                       )}

                                       {section.links && section.links.length > 0 && (
                                          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                             <Download className="w-3 h-3" />
                                             {section.links.length} resources
                                          </span>
                                       )}

                                       {section.questions && section.questions.length > 0 && (
                                          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                             <MessageCircle className="w-3 h-3" />
                                             {section.questions.length} questions
                                          </span>
                                       )}

                                       <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))
                  )}
               </div>

               {/* Back Button */}
               <div className="mt-8">
                  <Link
                     href={`/courses/${courseId}`}
                     className="px-6 py-3 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition flex items-center gap-2"
                  >
                     <ChevronRight className="w-4 h-4 rotate-180" />
                     Back to Course
                  </Link>
               </div>
            </div>
         </section>
         <Footer />
      </>
   );
};

export default CourseComponentsPage; 