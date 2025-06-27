'use client'
import Header from '@/app/components/Header';
import { useGetSingleCourseQuery } from '@/redux/features/api/apiSlice';
import { ContentSectionData, Link as CourseLink, VideoComponent } from '@/types/course';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { FaArrowLeft, FaBookOpen, FaChalkboardTeacher, FaCheckCircle, FaExternalLinkAlt, FaListUl, FaPlayCircle, FaRupeeSign, FaTag } from 'react-icons/fa';

const CourseDetailPage: React.FC = () => {
   const params = useParams();
   const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : undefined;
   const { data, isLoading, error } = useGetSingleCourseQuery(id ?? '', { skip: !id });
   const course = data?.course;

   // Accordion state for course content
   const [openSection, setOpenSection] = useState<number | null>(null);

   if (isLoading) {
      return <div className="min-h-screen flex items-center justify-center text-lg text-gray-600 dark:text-gray-300">Loading...</div>;
   }
   if (error || !course) {
      return <div className="min-h-screen flex items-center justify-center text-red-500">{(error as { message?: string })?.message || 'Course not found.'}</div>;
   }

   // Handle thumbnail type
   let thumbnailUrl = '/avatar.jpg';
   if (course.thumbnail) {
      if (typeof course.thumbnail === 'string') {
         thumbnailUrl = course.thumbnail;
      } else if (typeof course.thumbnail === 'object' && 'url' in course.thumbnail && typeof course.thumbnail.url === 'string') {
         thumbnailUrl = course.thumbnail.url;
      }
   }

   return (
      <>
         <Header activeItem={1} route="/courses" />
         <section className="h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 flex items-center justify-center">
            <div className="w-full max-w-5xl px-2 sm:px-4 h-[600px]">
               <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-cyan-200 dark:border-slate-700 flex flex-col md:flex-row overflow-hidden h-[600px]">
                  {/* Back Button */}
                  <Link href="/courses" className="absolute left-6 top-6 z-30 flex items-center gap-2 px-4 py-2 bg-[#BE3D2A] dark:bg-[#102E50] text-cyan-700 dark:text-cyan-300 rounded-full font-semibold shadow hover:bg-[#BE3D2A] dark:hover:bg-[#102E50] transition-colors">
                     <FaArrowLeft /> Back to All Courses
                  </Link>
                  {/* Accent bar */}
                  <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-cyan-400 to-cyan-600 dark:from-cyan-700 dark:to-cyan-900 z-10" />
                  {/* Left: Image & Info */}
                  <div className="flex flex-col items-center md:items-start md:w-1/3 p-8 pt-12 bg-gradient-to-b from-cyan-50 to-white dark:from-slate-900 dark:to-slate-800 z-20">
                     <img
                        src={thumbnailUrl}
                        alt={course.name}
                        className="w-56 h-56 object-cover rounded-2xl shadow-lg border-4 border-cyan-100 dark:border-slate-700 mb-6"
                     />
                     <div className="flex flex-wrap gap-2 mb-4">
                        {course.tags && course.tags.split(',').map((tag: string, idx: number) => (
                           <span key={idx} className="flex items-center gap-1 bg-[#BE3D2A] dark:bg-[#102E50] text-cyan-700 dark:text-cyan-300 px-3 py-1 rounded-full text-xs font-semibold"><FaTag className="inline-block" />{tag.trim()}</span>
                        ))}
                     </div>
                     {course.level && <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-300 font-semibold text-base mb-2"><FaChalkboardTeacher /> {course.level}</div>}
                     {course.estimatedPrice && <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-2"><FaRupeeSign />Estimated: <span className="font-semibold">₹{course.estimatedPrice}</span></div>}
                     {course.demoUrl && <a href={course.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 dark:text-blue-400 underline text-sm hover:text-blue-800 dark:hover:text-blue-300"><FaPlayCircle /> View Demo <FaExternalLinkAlt className="ml-1" /></a>}
                  </div>
                  {/* Right: Details & CTA */}
                  <div className="flex-1 flex flex-col justify-between p-8 md:p-12">
                     <h1 className="text-4xl font-extrabold text-black dark:text-white mb-3 leading-tight flex items-center gap-3"><FaBookOpen className="text-cyan-500" /> {course.name}</h1>
                     <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">{course.description}</p>
                     <div className="flex flex-col md:flex-row gap-4 md:items-center mb-8">
                        <span className="flex items-center gap-2 text-3xl font-bold text-cyan-600 dark:text-cyan-200"><FaRupeeSign />{course.price}</span>
                        <button className="px-6 py-2 bg-cyan-200 hover:bg-cyan-300 text-black font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-xl focus:ring-2 focus:ring-cyan-400 cursor-pointer">
                           Enroll Now
                        </button>
                     </div>
                     <div className="flex flex-col md:flex-row gap-8">
                        {course.benefits && course.benefits.length > 0 && (
                           <div className="flex-1">
                              <h2 className="text-xl font-bold text-cyan-700 dark:text-cyan-300 mb-2 flex items-center gap-2"><FaCheckCircle /> What you&apos;ll learn</h2>
                              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                                 {course.benefits.map((b: { title: string }, idx: number) => (
                                    <li key={idx}>{b.title}</li>
                                 ))}
                              </ul>
                           </div>
                        )}
                        {course.prerequisites && course.prerequisites.length > 0 && (
                           <div className="flex-1">
                              <h2 className="text-xl font-bold text-cyan-700 dark:text-cyan-300 mb-2 flex items-center gap-2"><FaListUl /> Prerequisites</h2>
                              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                                 {course.prerequisites.map((p: { title: string }, idx: number) => (
                                    <li key={idx}>{p.title}</li>
                                 ))}
                              </ul>
                           </div>
                        )}
                     </div>
                  </div>
               </div>

               {/* Divider */}
               <div className="my-12 border-t border-cyan-200 dark:border-slate-700" />

               {/* Course Content Accordion */}
               {course.courseContent && course.courseContent.length > 0 && (
                  <div className="mt-8">
                     <h2 className="text-2xl font-bold text-black dark:text-white mb-6 flex items-center gap-2"><FaListUl className="text-cyan-500" /> Course Content</h2>
                     <div className="space-y-4">
                        {(course.courseContent as ContentSectionData[]).map((section, idx) => {
                           const isOpen = openSection === idx;
                           return (
                              <div key={section.id || idx} className="bg-white dark:bg-slate-900 rounded-xl shadow border border-cyan-100 dark:border-slate-800 overflow-hidden">
                                 <button
                                    className={`w-full flex justify-between items-center px-6 py-4 text-lg font-semibold text-cyan-700 dark:text-cyan-300 focus:outline-none transition-colors cursor-pointer ${isOpen ? 'bg-cyan-50 dark:bg-slate-800' : ''}`}
                                    onClick={() => setOpenSection(isOpen ? null : idx)}
                                    aria-expanded={isOpen}
                                 >
                                    <span className="flex items-center gap-2"><FaBookOpen /> {section.title}</span>
                                    <span className={`transform transition-transform ${isOpen ? 'rotate-90' : ''}`}>▶</span>
                                 </button>
                                 {isOpen && section.components && section.components.length > 0 && (
                                    <ul className="divide-y divide-cyan-100 dark:divide-slate-800">
                                       {(section.components as VideoComponent[]).map((comp, cidx) => (
                                          <li key={comp.id || cidx} className="flex flex-col md:flex-row md:items-center gap-4 px-6 py-4 bg-cyan-50 dark:bg-slate-800">
                                             <div className="flex-1">
                                                <div className="font-semibold text-black dark:text-white">{comp.videoTitle}</div>
                                                <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">{comp.videoDescription}</div>
                                                {comp.links && comp.links.length > 0 && (
                                                   <div className="flex flex-wrap gap-2 mt-1">
                                                      {(comp.links as CourseLink[]).map((link, lidx) => (
                                                         <a key={link.id || lidx} href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline text-xs hover:text-blue-800 dark:hover:text-blue-300">
                                                            {link.title}
                                                         </a>
                                                      ))}
                                                   </div>
                                                )}
                                             </div>
                                             {comp.videoUrl && (
                                                <a href={comp.videoUrl} target="_blank" rel="noopener noreferrer" className="block w-full md:w-48 h-32 bg-black/10 dark:bg-white/10 rounded-lg overflow-hidden shadow hover:scale-105 transition-transform">
                                                   <video className="w-full h-full object-cover" src={comp.videoUrl} controls preload="none" />
                                                </a>
                                             )}
                                          </li>
                                       ))}
                                    </ul>
                                 )}
                              </div>
                           );
                        })}
                     </div>
                  </div>
               )}
            </div>
         </section>
      </>
   );
};

export default CourseDetailPage; 