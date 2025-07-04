'use client'
import { useGetAllCoursesQuery, useGetEnrolledCoursesQuery, useLoadUserQuery } from '@/redux/features/api/apiSlice';
import { CourseFormData } from '@/types/course';
import Lottie from 'lottie-react';
import { CheckCircle, Play } from 'lucide-react';
import Loader from '../components/Loader/Loader';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { FaSearch } from 'react-icons/fa';

const CoursesPage: React.FC = () => {
   const { data: session, status: sessionStatus } = useSession();
   const { data: userData, isLoading: isUserLoading } = useLoadUserQuery(undefined);
   const { data: allCoursesData, isLoading: isAllCoursesLoading } = useGetAllCoursesQuery();
   const courses = allCoursesData?.courses || [];
   const searchParams = useSearchParams();
   const router = useRouter();
   const initialSearch = searchParams?.get('search') || '';
   const initialPage = parseInt(searchParams?.get('page') || '1');
   const [search, setSearch] = React.useState(initialSearch);
   const [currentPage, setCurrentPage] = React.useState(initialPage);
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const [redirecting, setRedirecting] = useState(false);
   const coursesPerPage = 9; // 3x3 grid

   // Get enrolled courses for badges
   const { data: enrolledCoursesData } = useGetEnrolledCoursesQuery(undefined, {
      skip: !session?.user && !userData
   });
   const enrolledCourses = enrolledCoursesData?.courses || [];
   const enrolledCourseIds = enrolledCourses
      .filter((course: CourseFormData) => course._id)
      .map((course: CourseFormData) => course._id!);

   const [animationData, setAnimationData] = useState<object|null>(null);

   useEffect(() => {
      fetch('/animation.json')
         .then((res) => res.json())
         .then(setAnimationData);
   }, []);

   useEffect(() => {
      if(sessionStatus === 'loading' || isUserLoading) return;
      if (!session?.user && !userData) {
         setRedirecting(true);
         router.replace('/');
      }
   }, [session?.user, router, userData, sessionStatus, isUserLoading]);

   // Filter courses by search
   const filteredCourses = useMemo(() => {
      return courses.filter(course => {
         const q = search.trim().toLowerCase();
         return (
            !q ||
            course.name.toLowerCase().includes(q) ||
            course.description.toLowerCase().includes(q) ||
            (course.level && course.level.toLowerCase().includes(q))
         );
      });
   }, [courses, search]);

   // Pagination logic
   const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
   const startIndex = (currentPage - 1) * coursesPerPage;
   const endIndex = startIndex + coursesPerPage;
   const currentCourses = filteredCourses.slice(startIndex, endIndex);

   // Reset to page 1 when search changes
   useEffect(() => {
      setCurrentPage(1);
   }, [search]);

   // Update URL when page or search changes
   useEffect(() => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (currentPage > 1) params.set('page', currentPage.toString());

      const newUrl = `/courses${params.toString() ? `?${params.toString()}` : ''}`;
      router.replace(newUrl, { scroll: false });
   }, [search, currentPage, router]);

   const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      setCurrentPage(1); // Reset to first page on new search
   };

   const handlePageChange = (page: number) => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
   };

   const PaginationComponent = () => {
      if (totalPages <= 1) return null;

      const getPageNumbers = () => {
         const pages = [];
         const maxVisiblePages = 5;

         if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
               pages.push(i);
            }
         } else {
            if (currentPage <= 3) {
               for (let i = 1; i <= 4; i++) {
                  pages.push(i);
               }
               pages.push('...');
               pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
               pages.push(1);
               pages.push('...');
               for (let i = totalPages - 3; i <= totalPages; i++) {
                  pages.push(i);
               }
            } else {
               pages.push(1);
               pages.push('...');
               for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                  pages.push(i);
               }
               pages.push('...');
               pages.push(totalPages);
            }
         }

         return pages;
      };

      
      return (
         <div className="flex justify-center items-center gap-2 lg:gap-3 mt-16">
            {/* Previous button */}
            <button
               onClick={() => handlePageChange(currentPage - 1)}
               disabled={currentPage === 1}
               className="px-4 py-3 lg:px-6 lg:py-3 bg-cyan-200 hover:bg-cyan-300 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-xl focus:ring-2 focus:ring-cyan-400/50 disabled:shadow-none disabled:hover:shadow-none"
            >
               Previous
            </button>

            {/* Page numbers */}
            {getPageNumbers().map((page, index) => (
               <button
                  key={index}
                  onClick={() => typeof page === 'number' && handlePageChange(page)}
                  disabled={page === '...'}
                  className={`px-4 py-3 lg:px-6 lg:py-3 font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-xl focus:ring-2 focus:ring-cyan-400/50 ${page === currentPage
                     ? 'bg-cyan-400 text-white shadow-lg'
                     : page === '...'
                        ? 'bg-transparent text-gray-500 cursor-default shadow-none hover:shadow-none'
                        : 'bg-cyan-200 hover:bg-cyan-300 text-black'
                     }`}
               >
                  {page}
               </button>
            ))}

            {/* Next button */}
            <button
               onClick={() => handlePageChange(currentPage + 1)}
               disabled={currentPage === totalPages}
               className="px-4 py-3 lg:px-6 lg:py-3 bg-cyan-200 hover:bg-cyan-300 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-xl focus:ring-2 focus:ring-cyan-400/50 disabled:shadow-none disabled:hover:shadow-none"
            >
               Next
            </button>
         </div>
      );
   };

   const isLoading = sessionStatus === 'loading' || isAllCoursesLoading;

   if (isUserLoading || sessionStatus === 'loading') {
      return (
         <Loader/>
      );
   }

   return (
      <>
         <Header activeItem={1} route="/courses" />
         <section className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="mb-12">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black dark:text-white mb-6">All Courses</h1>
                  <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl">
                     Discover our comprehensive collection of courses designed to enhance your skills and knowledge
                  </p>
               </div>

               {/* Search Bar */}
               <div className="mb-12 flex">
                  <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-2xl w-full">
                     <input
                        type="search"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search courses by name, description, or level..."
                        className="flex-1 h-14 px-6 rounded-l-xl border-2 border-cyan-400/40 bg-white dark:bg-slate-900 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-lg shadow-lg"
                     />
                     <button type="submit" className="flex items-center justify-center text-md w-[130px] gap-2 px-5 py-4 bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-cyan-50 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-300 font-semibold transition cursor-pointer">
                        <FaSearch className="w-4 h-4" />
                        Search
                     </button>
                  </form>
               </div>

               {/* Results info */}
               {!isLoading && filteredCourses.length > 0 && (
                  <div className="mb-8 text-gray-600 dark:text-gray-300">
                     <span className="bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-md">
                        Showing {startIndex + 1}-{Math.min(endIndex, filteredCourses.length)} of {filteredCourses.length} courses
                        {search && ` for "${search}"`}
                     </span>
                  </div>
               )}

               {isLoading ? (
                  <div className="text-center py-16">
                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
                     <div className="text-lg text-gray-600 dark:text-gray-300">Loading courses...</div>
                  </div>
               ) : (
                  <>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
                        {currentCourses.length === 0 ? (
                           <div className="col-span-full text-center py-16">
                              <div className="text-6xl mb-4">📚</div>
                              <div className="text-gray-500 dark:text-gray-400 text-xl mb-2">
                                 {filteredCourses.length === 0 ? 'No courses found.' : 'No courses on this page.'}
                              </div>
                              {search && (
                                 <p className="text-gray-400 dark:text-gray-500">Try adjusting your search terms</p>
                              )}
                           </div>
                        ) : currentCourses.map(course => {

                           const isEnrolled = course._id ? enrolledCourseIds.includes(course._id) : false;

                           return (
                              <div key={course._id} className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
                                 {/* Course Thumbnail with Enrollment Badge */}
                                 <div className="relative flex-shrink-0">
                                    {(() => {
                                       if (course.thumbnail && typeof course.thumbnail === 'object' && 'url' in course.thumbnail && typeof course.thumbnail.url === 'string' && course.thumbnail.url.length > 0) {
                                          return (
                                             <img
                                                src={course.thumbnail.url}
                                                alt={course.name}
                                                className="w-full h-60 object-cover object-center"
                                             />
                                          );
                                       } else if (typeof course.thumbnail === 'string' && course.thumbnail.length > 0) {
                                          return (
                                             <img
                                                src={course.thumbnail}
                                                alt={course.name}
                                                className="w-full h-60 object-cover object-center"
                                             />
                                          );
                                       } else {
                                          return (
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
                                          );
                                       }
                                    })()}

                                    {/* Enrollment Badge */}
                                    {isEnrolled && (
                                       <div className="absolute top-3 right-3">
                                          <div className="flex items-center justify-center gap-2 px-2 py-1 bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-cyan-50 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-300 transition">
                                             <CheckCircle className="w-3 h-3" />
                                             Enrolled
                                          </div>
                                       </div>
                                    )}

                                    {/* Level Badge */}
                                    {course.level && (
                                       <div className="absolute top-3 left-3">
                                          <div className="flex items-center justify-center gap-2 px-2 py-1 bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-cyan-50 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-300 transition">
                                             {course.level}
                                          </div>
                                       </div>
                                    )}
                                 </div>

                                 {/* Card Content - Flex container to fill remaining space */}
                                 <div className="flex flex-col flex-1 p-6">
                                    {/* Header Section */}
                                    <div className="flex-1">
                                       <h2 className="text-xl font-bold text-black dark:text-white mb-3 line-clamp-2 leading-tight">{course.name}</h2>
                                       <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">{course.description}</p>

                                       {/* Tags */}
                                       {course.tags && (
                                          <div className="flex flex-wrap gap-1 mb-4">
                                             {course.tags.split(',').slice(0, 2).map((tag: string, idx: number) => (
                                                <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                                                   {tag.trim()}
                                                </span>
                                             ))}
                                             {course.tags.split(',').length > 2 && (
                                                <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 rounded-full text-xs font-medium">
                                                   +{course.tags.split(',').length - 2} more
                                                </span>
                                             )}
                                          </div>
                                       )}

                                       {/* Ratings */}
                                       <div className="flex items-center gap-2 mb-6">
                                          <span className="text-yellow-400 text-sm">{'★'.repeat(Math.round(course.ratings ?? 0))}{'☆'.repeat(5 - Math.round(course.ratings ?? 0))}</span>
                                          <span className="text-gray-600 dark:text-gray-300 text-xs">{course.ratings?.toFixed(1) || '0.0'}</span>
                                          <span className="text-gray-500 dark:text-gray-400 text-xs">({course.purchased || 0} students)</span>
                                       </div>
                                    </div>

                                    {/* Footer Section - Always at bottom */}
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-slate-700">
                                       <span className="text-cyan-600 dark:text-cyan-400 font-semibold text-lg">₹{course.price}</span>
                                       <Link
                                          href={`/courses/${course._id}`}
                                          className="flex items-center justify-center gap-2 px-5 py-4 bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-cyan-50 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-300 font-semibold transition cursor-pointer"
                                       >
                                          {isEnrolled ? (
                                             <>
                                                <Play className="w-4 h-4" />
                                                Continue Learning
                                             </>
                                          ) : (
                                             'View Course'
                                          )}
                                       </Link>
                                    </div>
                                 </div>
                              </div>
                           );
                        })}
                     </div>

                     {/* Pagination */}
                     <PaginationComponent />
                  </>
               )}
            </div>
         </section>
         <Footer />
      </>
   );
};

export default CoursesPage; 