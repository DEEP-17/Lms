'use client';

import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import CoursePlayer from '@/app/utils/CoursePlayer';
import { useAddAnswerMutation, useAddQuestionMutation, useGetCourseContentQuery, useGetSingleCourseQuery } from '@/redux/features/api/apiSlice';
import Lottie from 'lottie-react';
import { Calendar, ChevronRight, Clock, Download, ExternalLink, MessageCircle, Play, User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaPlus, FaReply } from 'react-icons/fa';
import { IoCloseOutline } from 'react-icons/io5';

// Define types for question and reply
interface QuestionReply {
   _id: string;
   user?: { name?: string; email?: string };
   answer: string;
}
interface Question {
   _id: string;
   user?: { name?: string; email?: string };
   question: string;
   questionReplies?: QuestionReply[];
}

const VideoPlayerPage: FC = () => {
   const params = useParams();
   const router = useRouter();
   const courseId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : undefined;
   const componentId = typeof params?.componentId === 'string' ? params.componentId : Array.isArray(params?.componentId) ? params.componentId[0] : undefined;

   const { data: session, status: sessionStatus } = useSession();
   const { data: courseData, isLoading: isCourseLoading } = useGetSingleCourseQuery(courseId ?? '', { skip: !courseId });
   const { data: contentData, isLoading: isContentLoading } = useGetCourseContentQuery(courseId ?? '', { skip: !courseId });

   const course = courseData?.course;
   const content = contentData?.content || [];
   const [animationData, setAnimationData] = useState<any>(null);

   // Find the specific component/video
   const currentComponent = content.find((item: any) =>
      item._id === componentId ||
      (typeof componentId === 'string' && !isNaN(parseInt(componentId)) && parseInt(componentId) === content.indexOf(item))
   );

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

   const formatDuration = (seconds: number): string => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);

      if (hours > 0) {
         return `${hours}h ${minutes}m`;
      }
      return `${minutes}m`;
   };

   useEffect(() => {
      fetch('/animation.json')
         .then((res) => res.json())
         .then(setAnimationData);
   }, []);

   const [addQuestion, { isLoading: isQuestionLoading }] = useAddQuestionMutation();
   const [addAnswer, { isLoading: isAnswerLoading }] = useAddAnswerMutation();
   const [questionText, setQuestionText] = React.useState('');
   const [answerText, setAnswerText] = React.useState<{ [questionId: string]: string }>({});
   const [showAddQuestion, setShowAddQuestion] = useState(false);
   const [openAnswer, setOpenAnswer] = useState<string | null>(null);
   const [openReplies, setOpenReplies] = useState<string | null>(null);

   // Show loader until all required data is loaded
   const isLoading =
      sessionStatus === 'loading' ||
      isCourseLoading ||
      isContentLoading;

   if (isLoading) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
         </div>
      );
   }

   const handleAddQuestion = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!questionText) return toast.error('Please enter your question.');
      try {
         await addQuestion({ courseId: courseId!, question: questionText, contentId: componentId! }).unwrap();
         setQuestionText('');
         toast.success('Question submitted!');
         await refetch();
      } catch {
         toast.error('Failed to submit question.');
      }
   };

   const handleAddAnswer = async (questionId: string) => {
      if (!answerText[questionId]) return toast.error('Please enter an answer.');
      try {
         await addAnswer({ courseId: courseId!, questionId, answer: answerText[questionId], contentId: componentId! }).unwrap();
         setAnswerText((prev) => ({ ...prev, [questionId]: '' }));
         toast.success('Answer submitted!');
         await refetch();
      } catch {
         toast.error('Failed to submit answer.');
      }
   };

   if (!course || !currentComponent) {
      return (
         <>
            <Header activeItem={1} route="/courses" />
            <div className="min-h-screen flex items-center justify-center text-red-500 text-xl font-semibold">Content not found</div>
            <Footer />
         </>
      );
   }

   return (
      <>
         <Header activeItem={1} route="/courses" />
         <section className="min-h-screen py-20 bg-gradient-to-br from-cyan-50 via-white to-cyan-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
            <div className="max-w-6xl mx-auto px-4">
               {/* Breadcrumb */}
               <nav className="text-lg text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2">
                  <Link href="/courses" className="hover:underline">All courses</Link>
                  <ChevronRight className="w-4 h-4" />
                  <Link href={`/courses/${courseId}`} className="hover:underline">{course.name}</Link>
                  <ChevronRight className="w-4 h-4" />
                  <Link href={`/courses/${courseId}/components`} className="hover:underline">Course Content</Link>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-black dark:text-white font-semibold">{currentComponent.title}</span>
               </nav>

               {/* Video Player Section */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Content */}
                  <div className="lg:col-span-2">
                     {/* Video Player */}
                     <div className="bg-black rounded-xl overflow-hidden shadow-lg mb-6">
                        <div className="aspect-video">
                           {currentComponent.videoUrl ? (
                              <CoursePlayer
                                 videoUrl={currentComponent.videoUrl}
                                 title={currentComponent.title || 'Video Content'}
                              />
                           ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                 <div className="text-center text-white">
                                    <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p>Video not available</p>
                                 </div>
                              </div>
                           )}
                        </div>
                     </div>

                     {/* Video Information */}
                     <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                           {currentComponent.title || 'Video Content'}
                        </h1>

                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                           {currentComponent.videoLength && (
                              <div className="flex items-center gap-1">
                                 <Clock className="w-4 h-4" />
                                 <span>{formatDuration(currentComponent.videoLength)}</span>
                              </div>
                           )}
                           <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Self-paced</span>
                           </div>
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                           {currentComponent.description || 'No description available for this content.'}
                        </p>
                     </div>

                     {/* Downloadable Resources */}
                     {currentComponent.links && currentComponent.links.length > 0 && (
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 mb-6">
                           <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                              <Download className="w-5 h-5" />
                              Resources
                           </h3>
                           <div className="space-y-3">
                              {currentComponent.links.map((link: any, index: number) => (
                                 <a
                                    key={link._id || index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-all duration-200"
                                 >
                                    <div className="flex items-center gap-3">
                                       <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                       <span className="text-gray-900 dark:text-white font-medium">
                                          {link.title || `Resource ${index + 1}`}
                                       </span>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-gray-400" />
                                 </a>
                              ))}
                           </div>
                        </div>
                     )}

                     {/* Questions and Answers */}
                     <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
                        <div className='flex items-center justify-between'>
                           <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                              <MessageCircle className="w-5 h-5" />
                              Questions & Answers ({currentComponent.questions?.length || 0})
                           </h3>
                           {/* Add Question Button */}
                           {!showAddQuestion && (
                              <button
                                 type="button"
                                 className="mb-6 flex items-center gap-2 px-5 py-2 bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-cyan-50 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-300 font-semibold transition cursor-pointer"
                                 onClick={() => setShowAddQuestion(true)}
                              >
                                 <FaPlus className="w-4 h-4" />
                                 Add Question
                              </button>
                           )}
                        </div>
                        {/* Add Question Form */}
                        {showAddQuestion && (
                           <form onSubmit={handleAddQuestion} className="mb-6 flex gap-2 items-center bg-blue-50 dark:bg-slate-800 p-4 rounded-lg shadow-inner relative">
                              <input
                                 type="text"
                                 value={questionText}
                                 onChange={e => setQuestionText(e.target.value)}
                                 className="flex-1 rounded border border-blue-200 focus:border-blue-500 px-3 py-2 bg-white dark:bg-slate-900 text-black dark:text-white focus:outline-none transition"
                                 placeholder="Ask a question about this video..."
                              />
                              <button
                                 type="submit"
                                 className="px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:bg-blue-800 text-white rounded font-semibold transition cursor-pointer shadow"
                                 disabled={isQuestionLoading}
                              >
                                 {isQuestionLoading ? 'Submitting...' : 'Ask'}
                              </button>
                              <button
                                 type="button"
                                 className="bg-red-500 w-10 flex items-center justify-center rounded-sm h-10 text-white hover:text-cyan-600 dark:hover:text-gray-200 text-xl cursor-pointer"
                                 onClick={() => setShowAddQuestion(false)}
                                 title="Close"
                              >
                                 <IoCloseOutline />
                              </button>
                           </form>
                        )}
                        <div className="space-y-4">
                           {currentComponent.questions && currentComponent.questions.length > 0 ? (
                              (currentComponent.questions as Question[]).map((question, index) => (
                                 <div
                                    key={question._id || index}
                                    className="border-b border-gray-200 dark:border-slate-700 pb-4 last:border-b-0"
                                 >
                                    {/* Question Section */}
                                    <div className="flex items-start gap-3 mb-3">
                                       <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                                          <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                       </div>
                                       <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                             <span className="font-medium text-gray-900 dark:text-white">
                                                {question.user?.name || "Anonymous"}
                                             </span>
                                          </div>
                                          <p className="text-gray-700 dark:text-gray-300">
                                             {question.question}
                                          </p>
                                       </div>
                                    </div>

                                    {/* View Replies Toggle Button */}
                                    {question.questionReplies && question.questionReplies.length > 0 && (
                                       <button
                                          type="button"
                                          onClick={() =>
                                             setOpenReplies(openReplies === question._id ? null : question._id)
                                          }
                                          className="ml-11 mb-2 text-accent hover:text-highlight flex items-center gap-1 text-sm font-medium"
                                       >
                                          <FaReply className="w-4 h-4" />
                                          {openReplies === question._id ? "Hide Replies" : "View Replies"}
                                       </button>
                                    )}

                                    {/* Replies Section */}
                                    {question.questionReplies && question.questionReplies.length > 0 && (
                                       <div
                                          className={`ml-11 transition-all duration-300 overflow-hidden ${openReplies === question._id ? "max-h-96" : "max-h-0"
                                             }`}
                                       >
                                          <div className="space-y-3 pr-2 overflow-y-auto max-h-80 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100 dark:scrollbar-thumb-slate-600 dark:scrollbar-track-slate-800">
                                             {question.questionReplies.map((reply, replyIndex) => (
                                                <div
                                                   key={reply._id || replyIndex}
                                                   className="flex items-start gap-3"
                                                >
                                                   <div className="w-6 h-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                                                      <User className="w-3 h-3 text-green-600 dark:text-green-400" />
                                                   </div>
                                                   <div className="flex-1">
                                                      <div className="flex items-center gap-2 mb-1">
                                                         <span className="font-medium text-gray-900 dark:text-white">
                                                            {reply.user?.name || "Anonymous"}
                                                         </span>
                                                         <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            {reply.user?.email}
                                                         </span>
                                                      </div>
                                                      <p className="text-gray-700 dark:text-gray-300">
                                                         {reply.answer}
                                                      </p>
                                                   </div>
                                                </div>
                                             ))}
                                          </div>
                                       </div>
                                    )}

                                    {/* Add Answer Form */}
                                    {openAnswer === question._id && (
                                       <form
                                          onSubmit={(e) => {
                                             e.preventDefault();
                                             handleAddAnswer(question._id);
                                          }}
                                          className="mt-3 ml-11 p-3 bg-highlight/10 dark:bg-slate-800 rounded-lg shadow-inner flex flex-col sm:flex-row gap-3 relative"
                                       >
                                          <input
                                             type="text"
                                             value={answerText[question._id] || ""}
                                             onChange={(e) =>
                                                setAnswerText((prev) => ({
                                                   ...prev,
                                                   [question._id]: e.target.value,
                                                }))
                                             }
                                             placeholder="Answer this question..."
                                             className="flex-1 px-4 py-2 border border-green-400 rounded-lg bg-white dark:bg-slate-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                          />
                                          <button
                                             type="submit"
                                             disabled={isAnswerLoading}
                                             className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition cursor-pointer"
                                          >
                                             {isAnswerLoading ? "Submitting..." : "Answer"}
                                          </button>
                                          <button
                                             type="button"
                                             className="bg-red-500 w-10 flex items-center justify-center rounded-sm h-10 text-white hover:text-cyan-600 dark:hover:text-gray-200 text-xl cursor-pointer"
                                             onClick={() => setOpenAnswer(null)}
                                             title="Close"
                                          >
                                             <IoCloseOutline />
                                          </button>
                                       </form>
                                    )}

                                    {/* Reply Button */}
                                    {openAnswer !== question._id && (
                                       <button
                                          type="button"
                                          className="ml-11 mt-2 text-green-600 hover:text-green-800 flex items-center gap-1 text-sm font-medium cursor-pointer"
                                          onClick={() =>
                                             setOpenAnswer(openAnswer === question._id ? null : question._id)
                                          }
                                       >
                                          <FaReply className="w-4 h-4" />
                                          Reply
                                       </button>
                                    )}
                                 </div>
                              ))
                           ) : (
                              <div className="text-gray-500 dark:text-gray-400">
                                 No questions yet. Be the first to ask!
                              </div>
                           )}
                        </div>
                     </div>
                  </div>

                  {/* Sidebar */}
                  <div className="lg:col-span-1">
                     {/* Course Info */}
                     <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 mb-6">
                        <div className="flex flex-col items-center gap-4 mb-4">
                           {(() => {
                              if (course.thumbnail && typeof course.thumbnail === 'object' && 'url' in course.thumbnail && typeof course.thumbnail.url === 'string' && course.thumbnail.url.length > 0) {
                                 return (
                                    <img
                                       src={course.thumbnail.url}
                                       alt={course.name}
                                       className="w-72 h-60 object-cover object-center"
                                    />
                                 );
                              } else if (typeof course.thumbnail === 'string' && course.thumbnail.length > 0) {
                                 return (
                                    <img
                                       src={course.thumbnail}
                                       alt={course.name}
                                       className="w-72 h-60 object-cover object-center"
                                    />
                                 );
                              } else {
                                 return (
                                    <div className="w-72 h-60 flex items-center justify-center bg-gray-100 dark:bg-slate-900">
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
                           <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                                 {course.name}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                 {content.length} sections
                              </p>
                           </div>
                        </div>

                        <Link
                           href={`/courses/${courseId}/components`}
                           className="flex items-center gap-2 px-5 py-6 bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-cyan-50 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-300 font-semibold transition cursor-pointer"
                        >
                           <Play className="w-4 h-4" />
                           View All Content
                        </Link>
                     </div>

                     {/* Navigation */}
                     <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                           Course Navigation
                        </h3>
                        <div className="space-y-2">
                           {content.map((item: any, index: number) => (
                              <button
                                 key={item._id || index}
                                 onClick={() => router.push(`/courses/${courseId}/components/${item._id || index}`)}
                                 className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${(item._id === componentId || (typeof componentId === 'string' && !isNaN(parseInt(componentId)) && parseInt(componentId) === index))
                                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                                    : 'bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600'
                                    }`}
                              >
                                 <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                                       <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                                          {index + 1}
                                       </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                       <p className="font-medium truncate">
                                          {item.title || `Content ${index + 1}`}
                                       </p>
                                       {item.videoLength && (
                                          <p className="text-xs text-gray-500 dark:text-gray-400">
                                             {formatDuration(item.videoLength)}
                                          </p>
                                       )}
                                    </div>
                                 </div>
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>

               {/* Back Button */}
               <div className="mt-8">
                  <Link
                     href={`/courses/${courseId}/components`}
                     className="px-6 py-3 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition flex items-center gap-2"
                  >
                     <ChevronRight className="w-4 h-4 rotate-180" />
                     Back to Course Content
                  </Link>
               </div>
            </div>
         </section>
         <Footer />
      </>
   );
};

export default VideoPlayerPage; 