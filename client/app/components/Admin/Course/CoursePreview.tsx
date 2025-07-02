'use client';

import CoursePlayer from '@/app/utils/CoursePlayer';
import { CourseFormData } from '@/types/course';
import Lottie from 'lottie-react';
import React, { FC, useEffect, useState } from 'react';

type Props = {
   course: CourseFormData;
   onEdit: () => void;
   onSubmit: () => void;
   onPrevious?: () => void;
   isEditMode?: boolean;
};

const CoursePreview: FC<Props> = ({ course, onEdit, onSubmit, onPrevious, isEditMode = false }) => {
   const [selectedVideo, setSelectedVideo] = useState<{ videoUrl: string; title: string } | null>(null);
   const [animationData, setAnimationData] = useState<object|null>(null);

   useEffect(() => {
      fetch('/animation.json')
         .then((res) => res.json())
         .then(setAnimationData);
   }, []);

   // Collect all videos for preview
   const allVideos: { videoUrl: string; title: string; type: string }[] = [];

   // Add demo video if available
   if (course.demoUrl) {
      allVideos.push({
         videoUrl: course.demoUrl,
         title: 'Demo Video',
         type: 'demo'
      });
   }

   // Add course content videos
   course.courseContent.forEach((section, secIndex) => {
      section.components.forEach((comp, compIndex) => {
         if (comp.videoUrl) {
            allVideos.push({
               videoUrl: comp.videoUrl,
               title: `${section.title || `Section ${secIndex + 1}`} - ${comp.videoTitle || `Video ${compIndex + 1}`}`,
               type: 'course'
            });
         }
      });
   });

   return (
      <div className="w-full max-w-5xl mx-auto mt-8 p-8 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-xl border border-gray-200/50 dark:border-slate-700/50 transition-all duration-300">
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Course Preview</h1>
            <p className="text-gray-600 dark:text-gray-400">Review your course before publishing</p>
         </div>

         {/* Video Player Preview */}
         {selectedVideo && (
            <div className="mb-8">
               <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Video Preview: {selectedVideo.title}</h3>
               <div className="bg-black rounded-2xl overflow-hidden shadow-lg">
                  <CoursePlayer videoUrl={selectedVideo.videoUrl} title={selectedVideo.title} />
               </div>
               <button
                  onClick={() => setSelectedVideo(null)}
                  className="mt-4 px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-all duration-300"
               >
                  Close Preview
               </button>
            </div>
         )}

         {/* All Videos Preview Section */}
         {allVideos.length > 0 && (
            <div className="mb-8">
               <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">All Course Videos</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allVideos.map((video, index) => (
                     <div key={index} className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-3">
                           <span className={`px-2 py-1 rounded-full text-xs font-semibold ${video.type === 'demo'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                              : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                              }`}>
                              {video.type === 'demo' ? 'Demo' : 'Course'}
                           </span>
                           <span className="text-xs text-gray-500 dark:text-gray-400">#{index + 1}</span>
                        </div>
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-3 line-clamp-2">
                           {video.title}
                        </h4>
                        <button
                           onClick={() => setSelectedVideo({ videoUrl: video.videoUrl, title: video.title })}
                           className="w-full px-3 py-2 bg-cyan-200 hover:bg-cyan-300 text-black font-semibold rounded-lg text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                           ▶️ Watch Video
                        </button>
                     </div>
                  ))}
               </div>
            </div>
         )}

         {/* Thumbnail */}
            <div className="mb-8">
               <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Course Thumbnail</h3>
               <div className="relative overflow-hidden rounded-2xl shadow-lg">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
               </div>
            </div>

         {/* Course Info */}
         <div className="mb-8 p-6 bg-gray-50 dark:bg-slate-700/50 rounded-2xl">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-3">
                  <div>
                     <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Title</span>
                     <p className="text-lg font-semibold text-gray-900 dark:text-white">{course.name || 'Not specified'}</p>
                  </div>
                  <div>
                     <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</span>
                     <p className="text-lg font-semibold text-gray-900 dark:text-white">{course.level || 'Not specified'}</p>
                  </div>
                  <div>
                     <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</span>
                     <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                        ${typeof course.price === 'string' ? course.price || '0' : course.price}
                     </p>
                  </div>
               </div>
               <div className="space-y-3">
                  <div>
                     <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Estimated Price</span>
                     <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        ${typeof course.estimatedPrice === 'string' ? course.estimatedPrice || '0' : course.estimatedPrice}
                     </p>
                  </div>
                  <div>
                     <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tags</span>
                     <p className="text-lg font-semibold text-gray-900 dark:text-white">{course.tags || 'No tags'}</p>
                  </div>
                  <div>
                     <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Demo URL</span>
                     <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        {course.demoUrl ? (
                           <a href={course.demoUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              {course.demoUrl}
                           </a>
                        ) : (
                           'Not provided'
                        )}
                     </p>
                  </div>
               </div>
            </div>
            <div className="mt-6">
               <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</span>
               <p className="text-gray-900 dark:text-white mt-2 leading-relaxed">{course.description || 'No description provided'}</p>
            </div>
         </div>

         {/* Benefits */}
         <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">What You&apos;ll Learn</h3>
            <ul className="space-y-2">
               {course.benefits.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                     <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                     <span className="text-gray-900 dark:text-white">{item.title || `Benefit ${index + 1}`}</span>
                  </li>
               ))}
            </ul>
         </div>

         {/* Prerequisites */}
         <div className="mb-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Prerequisites</h3>
            <ul className="space-y-2">
               {course.prerequisites.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                     <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                     <span className="text-gray-900 dark:text-white">{item.title || `Prerequisite ${index + 1}`}</span>
                  </li>
               ))}
            </ul>
         </div>

         {/* Course Content */}
         <div className="mb-8 p-6 bg-gray-50 dark:bg-slate-700/50 rounded-2xl">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Course Content</h3>
            <div className="space-y-6">
               {course.courseContent.map((section, secIndex) => (
                  <div key={secIndex} className="border border-gray-200 dark:border-slate-600 rounded-xl p-4 bg-white dark:bg-slate-900">
                     <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                        {section.title || `Section ${secIndex + 1}`}
                     </h4>
                     <div className="space-y-4">
                        {section.components.map((comp, compIndex) => (
                           <div key={compIndex} className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                              <div className="space-y-2">
                                 <div className="flex items-center justify-between">
                                    <p className="font-medium text-gray-900 dark:text-white">
                                       <span className="text-blue-600 dark:text-blue-400">Video {compIndex + 1}:</span> {comp.videoTitle || 'Untitled'}
                                    </p>
                                    {comp.videoUrl && (
                                       <button
                                          onClick={() => setSelectedVideo({ videoUrl: comp.videoUrl, title: comp.videoTitle || 'Untitled' })}
                                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold rounded-lg text-sm transition-all duration-300"
                                       >
                                          Preview Video
                                       </button>
                                    )}
                                 </div>
                                 {comp.videoUrl && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                       <span className="font-medium">URL:</span> {comp.videoUrl}
                                    </p>
                                 )}
                                 {comp.videoDescription && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                       <span className="font-medium">Description:</span> {comp.videoDescription}
                                    </p>
                                 )}
                                 {comp.links.length > 0 && (
                                    <div>
                                       <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Resources:</p>
                                       <ul className="space-y-1">
                                          {comp.links.map((link, linkIndex) => (
                                             <li key={linkIndex} className="text-sm">
                                                <a
                                                   href={link.url}
                                                   target="_blank"
                                                   rel="noopener noreferrer"
                                                   className="text-blue-600 dark:text-blue-400 hover:underline"
                                                >
                                                   {link.title || `Link ${linkIndex + 1}`}
                                                </a>
                                             </li>
                                          ))}
                                       </ul>
                                    </div>
                                 )}
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Action Buttons */}
         <div className="flex justify-between pt-8 border-t border-gray-200 dark:border-slate-700">
            <button
               onClick={onPrevious}
               className="px-8 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all duration-300 hover:shadow-md cursor-pointer"
            >
               ← Previous
            </button>
            <div className="flex gap-4">
               <button
                  onClick={onEdit}
                  className="px-8 py-3 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold rounded-xl transition-all duration-300 hover:shadow-md cursor-pointer"
               >
                  Edit Course
               </button>
               <button
                  onClick={onSubmit}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
               >
                  {isEditMode ? 'Update Course →' : 'Publish Course →'}
               </button>
            </div>
         </div>
      </div>
   );
};

export default CoursePreview;

