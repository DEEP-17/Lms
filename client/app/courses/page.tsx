'use client'
import { useGetAllCoursesQuery } from '@/redux/features/api/apiSlice';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import Header from '../components/Header';
import useAuth from '../hooks/useAuth';

const CoursesPage: React.FC = () => {
   const { data, isLoading, error } = useGetAllCoursesQuery();
   const courses = data?.courses || [];
   const searchParams = useSearchParams();
   const router = useRouter();
   const initialSearch = searchParams?.get('search') || '';
   const [search, setSearch] = React.useState(initialSearch);
   const isLoggedIn = useAuth();

   useEffect(() => {
      if (!isLoggedIn) {
         router.replace('/'); // or '/login' if you want to redirect to login
      }
   }, [isLoggedIn, router]);

   // Filter courses by search
   const filteredCourses = courses.filter(course => {
      const q = search.trim().toLowerCase();
      return (
         !q ||
         course.name.toLowerCase().includes(q) ||
         course.description.toLowerCase().includes(q) ||
         (course.level && course.level.toLowerCase().includes(q))
      );
   });

   const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      router.push(search ? `/courses?search=${encodeURIComponent(search)}` : '/courses');
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
               {isLoading ? (
                  <div className="text-center text-lg text-gray-600 dark:text-gray-300">Loading...</div>
               ) : error ? (
                  <div className="text-center text-red-500">{'message' in error ? error.message : 'Failed to load courses.'}</div>
               ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                     {filteredCourses.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500 dark:text-gray-400 text-lg">No courses found.</div>
                     ) : filteredCourses.map(course => {
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
               )}
            </div>
         </section>
      </>
   );
};

export default CoursesPage; 