'use client'
import { useGetAllCoursesQuery } from '@/redux/features/api/apiSlice';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import useAuth from '../hooks/useAuth';

const CoursesPage: React.FC = () => {
   const { data, isLoading, error } = useGetAllCoursesQuery();
   const courses = data?.courses || [];
   const searchParams = useSearchParams();
   const router = useRouter();
   const initialSearch = searchParams?.get('search') || '';
   const initialPage = parseInt(searchParams?.get('page') || '1');
   const [search, setSearch] = React.useState(initialSearch);
   const [currentPage, setCurrentPage] = React.useState(initialPage);
   const isLoggedIn = useAuth();
   const coursesPerPage = 9; // 3x3 grid

   useEffect(() => {
      if (!isLoggedIn) {
         router.replace('/'); // or '/login' if you want to redirect to login
      }
   }, [isLoggedIn, router]);

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
         <div className="flex justify-center items-center gap-2 mt-12">
            {/* Previous button */}
            <button
               onClick={() => handlePageChange(currentPage - 1)}
               disabled={currentPage === 1}
               className="px-4 py-2 bg-cyan-200 hover:bg-cyan-300 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-xl focus:ring-2 focus:ring-cyan-400/50"
            >
               Previous
            </button>

            {/* Page numbers */}
            {getPageNumbers().map((page, index) => (
               <button
                  key={index}
                  onClick={() => typeof page === 'number' && handlePageChange(page)}
                  disabled={page === '...'}
                  className={`px-4 py-2 font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-xl focus:ring-2 focus:ring-cyan-400/50 ${page === currentPage
                     ? 'bg-cyan-400 text-white'
                     : page === '...'
                        ? 'bg-transparent text-gray-500 cursor-default'
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
               className="px-4 py-2 bg-cyan-200 hover:bg-cyan-300 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-xl focus:ring-2 focus:ring-cyan-400/50"
            >
               Next
            </button>
         </div>
      );
   };

   return (
      <>
         <Header activeItem={1} route="/courses" />
         <section className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 py-24">
            <div className="max-w-6xl mx-auto px-4">
               <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-10">All Courses</h1>

               {/* Search Bar */}
               <form onSubmit={handleSearch} className="mb-10 flex items-center gap-2 max-w-xl">
                  <input
                     type="search"
                     value={search}
                     onChange={e => setSearch(e.target.value)}
                     placeholder="Search courses by name, description, or level..."
                     className="flex-1 h-12 px-5 rounded-l-lg border border-cyan-400/40 bg-white dark:bg-slate-900 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-lg"
                  />
                  <button type="submit" className="h-12 px-6 bg-cyan-200 hover:bg-cyan-300 text-black font-bold rounded-r-lg transition-all duration-200 shadow-md hover:shadow-xl focus:ring-2 focus:ring-cyan-400/50 cursor-pointer">
                     Search
                  </button>
               </form>

               {/* Results info */}
               {!isLoading && !error && filteredCourses.length > 0 && (
                  <div className="mb-6 text-gray-600 dark:text-gray-300">
                     Showing {startIndex + 1}-{Math.min(endIndex, filteredCourses.length)} of {filteredCourses.length} courses
                     {search && ` for "${search}"`}
                  </div>
               )}

               {isLoading ? (
                  <div className="text-center text-lg text-gray-600 dark:text-gray-300">Loading...</div>
               ) : error ? (
                  <div className="text-center text-red-500">{'message' in error ? error.message : 'Failed to load courses.'}</div>
               ) : (
                  <>
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {currentCourses.length === 0 ? (
                           <div className="col-span-full text-center text-gray-500 dark:text-gray-400 text-lg">
                              {filteredCourses.length === 0 ? 'No courses found.' : 'No courses on this page.'}
                           </div>
                        ) : currentCourses.map(course => {
                           let thumbnailUrl = '/avatar.jpg';
                           if (course.thumbnail) {
                              if (typeof course.thumbnail === 'string') {
                                 thumbnailUrl = course.thumbnail;
                              } else if (typeof course.thumbnail === 'object' && 'url' in course.thumbnail && typeof course.thumbnail.url === 'string') {
                                 thumbnailUrl = course.thumbnail.url;
                              }
                           }
                           return (
                              <div key={course._id} className="bg-white dark:bg-slate-900 rounded-xl shadow p-6 flex flex-col">
                                 <img
                                    src={thumbnailUrl}
                                    alt={course.name}
                                    className="w-full h-48 object-cover rounded-lg mb-4"
                                 />
                                 <h2 className="text-xl font-bold text-black dark:text-white mb-2">{course.name}</h2>
                                 <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">{course.description}</p>

                                 {/* Tags */}
                                 {course.tags && (
                                    <div className="flex flex-wrap gap-1 mb-3">
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
                                 <div className="flex items-center gap-2 mb-3">
                                    <span className="text-yellow-400 text-sm">{'★'.repeat(Math.round(course.ratings ?? 0))}{'☆'.repeat(5 - Math.round(course.ratings ?? 0))}</span>
                                    <span className="text-gray-600 dark:text-gray-300 text-xs">{course.ratings?.toFixed(1) || '0.0'}</span>
                                    <span className="text-gray-500 dark:text-gray-400 text-xs">({course.purchased || 0} students)</span>
                                 </div>

                                 <div className="flex-1" />
                                 <div className="flex items-center justify-between mt-2">
                                    <span className="text-cyan-600 font-semibold text-lg">₹{course.price}</span>
                                    <Link href={`/courses/${course._id}`} className="px-4 py-2 bg-cyan-200 hover:bg-cyan-300 text-black font-bold rounded-lg transition-all duration-200 cursor-pointer shadow-md hover:shadow-xl transform hover:scale-105 focus:scale-95 focus:ring-2 focus:ring-cyan-400">
                                       View Course
                                    </Link>
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