'use client';

import { useGetCourseContentQuery } from '@/redux/features/api/apiSlice';
import { Clock, Download, MessageCircle, Play } from 'lucide-react';
import React, { FC, useState } from 'react';

interface CourseContentProps {
   courseId: string;
   courseName: string;
}

const CourseContent: FC<CourseContentProps> = ({ courseId, courseName }) => {
   const { data, isLoading, isError } = useGetCourseContentQuery(courseId);
   const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
   const [selectedVideoTitle, setSelectedVideoTitle] = useState<string>('');

   const content = data?.content || [];

   if (isLoading) {
      return (
         <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
         </div>
      );
   }

   if (isError) {
      return (
         <div className="text-center p-8">
            <div className="text-red-500 mb-4">Failed to load course content</div>
            <button
               onClick={() => window.location.reload()}
               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
               Try Again
            </button>
         </div>
      );
   }

   if (content.length === 0) {
      return (
         <div className="text-center p-8">
            <div className="text-gray-500 mb-4">No content available for this course</div>
         </div>
      );
   }

   const handleVideoSelect = (videoUrl: string, title: string) => {
      setSelectedVideo(videoUrl);
      setSelectedVideoTitle(title);
   };

   const formatDuration = (seconds: number): string => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);

      if (hours > 0) {
         return `${hours}h ${minutes}m`;
      }
      return `${minutes}m`;
   };

   return (
      <div className="w-full max-w-6xl mx-auto p-6">
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
               {courseName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
               Course Content - {content.length} sections
            </p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Player */}
            <div className="lg:col-span-2">
               {selectedVideo ? (
                  <div className="bg-black rounded-xl overflow-hidden shadow-lg">
                     <div className="aspect-video">
                        <iframe
                           src={selectedVideo}
                           title={selectedVideoTitle}
                           className="w-full h-full"
                           allowFullScreen
                        />
                     </div>
                     <div className="p-4 bg-white dark:bg-slate-800">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                           {selectedVideoTitle}
                        </h3>
                     </div>
                  </div>
               ) : (
                  <div className="bg-gray-100 dark:bg-slate-800 rounded-xl aspect-video flex items-center justify-center">
                     <div className="text-center">
                        <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                           Select a video to start learning
                        </p>
                     </div>
                  </div>
               )}
            </div>

            {/* Course Content List */}
            <div className="lg:col-span-1">
               <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
                  <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                     <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Course Content
                     </h3>
                     <p className="text-sm text-gray-500 dark:text-gray-400">
                        {content.length} sections
                     </p>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                     {content.map((section, sectionIndex) => (
                        <div key={section._id || sectionIndex} className="border-b border-gray-100 dark:border-slate-700 last:border-b-0">
                           <div className="p-4">
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                 {section.title || `Section ${sectionIndex + 1}`}
                              </h4>

                              <div className="space-y-2">
                                 <div
                                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${selectedVideo === section.videoUrl
                                          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                                          : 'bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600'
                                       }`}
                                    onClick={() => handleVideoSelect(section.videoUrl, section.title)}
                                 >
                                    <div className="flex items-center justify-between">
                                       <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                             <Play className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                          </div>
                                          <div>
                                             <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {section.title || `Video ${sectionIndex + 1}`}
                                             </p>
                                             <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {section.description}
                                             </p>
                                          </div>
                                       </div>
                                       <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                          {section.videoLength && (
                                             <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {formatDuration(section.videoLength)}
                                             </span>
                                          )}
                                       </div>
                                    </div>
                                 </div>

                                 {/* Links */}
                                 {section.links && section.links.length > 0 && (
                                    <div className="ml-11 space-y-1">
                                       {section.links.map((link, linkIndex) => (
                                          <a
                                             key={linkIndex}
                                             href={link.url}
                                             target="_blank"
                                             rel="noopener noreferrer"
                                             className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                          >
                                             <Download className="w-3 h-3" />
                                             {link.title}
                                          </a>
                                       ))}
                                    </div>
                                 )}

                                 {/* Questions */}
                                 {section.questions && section.questions.length > 0 && (
                                    <div className="ml-11">
                                       <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                                          <MessageCircle className="w-3 h-3" />
                                          <span>{section.questions.length} questions</span>
                                       </div>
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Course Progress */}
               <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                     Your Progress
                  </h3>
                  <div className="space-y-4">
                     <div>
                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                           <span>Overall Progress</span>
                           <span>0%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                           <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                           <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                           <p className="text-xs text-gray-500 dark:text-gray-400">Videos Watched</p>
                        </div>
                        <div>
                           <p className="text-2xl font-bold text-gray-900 dark:text-white">{content.length}</p>
                           <p className="text-xs text-gray-500 dark:text-gray-400">Total Videos</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CourseContent; 