'use client'
import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import CoursePlayer from '@/app/utils/CoursePlayer';
import {useAddReplyToReviewMutation, useAddReviewMutation, useCreatePaymentMutation, useGetAllCoursesQuery, useGetEnrolledCoursesQuery, useGetSingleCourseQuery, useGetStripePublishableKeyQuery, useLoadUserQuery } from '@/redux/features/api/apiSlice';
import { CourseFormData } from '@/types/course';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import Lottie from 'lottie-react';
import { Play } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaPlus, FaRegStar, FaReply, FaStar } from 'react-icons/fa';
import { IoCloseOutline } from 'react-icons/io5';
import CheckoutForm from './CheckoutForm';
import Loader from '@/app/components/Loader/Loader';
import router from 'next/router';


// Extend CourseFormData to match API response
interface CourseDetail extends Omit<CourseFormData, 'thumbnail' | 'ratings' | 'purchased' | 'courseData'> {
   ratings?: number;
   purchased?: number;
   reviews?: unknown[];
   courseData?: Array<{
      _id?: string;
      title?: string;
      videoSection?: string;
      videoUrl?: string;
      description?: string;
      links?: Array<{ _id?: string; title?: string; url?: string }>;
   }>;
   category?: string;
   thumbnail: {
      public_id: string;
      url: string;
   };
}

// Define a type for review and reply
interface ReviewReply {
   _id: string;
   user?: { name?: string; avatar?: { url?: string } };
   comment: string;
}
interface Review {
   _id: string;
   user?: { name?: string; avatar?: { url?: string } };
   rating: number;
   comment: string;
   commentReplies?: ReviewReply[];
}

const CourseDetailPage: React.FC = () => {
   const params = useParams();
   const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : undefined;
   const { data, isLoading: isCourseLoading, refetch: refetchCourse } = useGetSingleCourseQuery(id ?? '', { skip: !id });
   const course: CourseDetail | undefined = data?.course as CourseDetail | undefined;
   const [selectedVideo, setSelectedVideo] = useState<{ videoUrl: string; title: string } | null>(null);
   const [activeTab, setActiveTab] = useState('overview');

   // Check if user is enrolled
   const { data: session, status: sessionStatus } = useSession();
   const { data: userData, isLoading: isUserLoading } = useLoadUserQuery(undefined);
   const { data: enrolledCoursesData, isLoading: isEnrolledLoading } = useGetEnrolledCoursesQuery(undefined, {
      skip: !session?.user && !userData
   });
   const enrolledCourses = enrolledCoursesData?.courses || [];
   const isEnrolled = enrolledCourses.some((enrolledCourse: CourseFormData) => enrolledCourse._id === id);

   // Fetch all courses for related courses
   const { data: allCoursesData, isLoading: isAllCoursesLoading } = useGetAllCoursesQuery();
   const allCourses = (allCoursesData?.courses || []) as unknown as CourseDetail[];
   const [open, setOpen] = useState(false);
   const { data: config, isLoading: isConfigLoading } = useGetStripePublishableKeyQuery();
   const [createPaymentIntent, { isLoading: isPaymentLoading }] = useCreatePaymentMutation();
   const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
   const [clientSecret, setClientSecret] = useState('');

   const [addReview, { isLoading: isReviewLoading }] = useAddReviewMutation();
   const [addReplyToReview, { isLoading: isReplyLoading }] = useAddReplyToReviewMutation();
   const [reviewText, setReviewText] = useState('');
   const [reviewRating, setReviewRating] = useState(5);
   const [replyText, setReplyText] = useState<{ [reviewId: string]: string }>({});
   const [openReply, setOpenReply] = useState<string | null>(null);
   const [showAddReview, setShowAddReview] = useState(false);

   useEffect(() => {
      if (config?.publishableKey) {
         setStripePromise(loadStripe(config.publishableKey));
      }
   }, [config]);

   useEffect(() => {
      if (sessionStatus === 'unauthenticated' && !userData) {
         toast.error('You must be logged in to access this page.');
         router.replace('/');
      }
   }, [sessionStatus, router, userData]);

   const handleOrder = async () => {
      if (!course) return;
      setOpen(true);
      try {
         const amount = Math.round(Number(course.price) * 100); // Stripe expects cents
         const result = await createPaymentIntent({ amount }).unwrap();
         setClientSecret(result.clientSecret);
      } catch {
         toast.error('Failed to initialize payment. Please try again.');
         setOpen(false);
      }
   };

   // Find related courses by tag or level, excluding current course
   let relatedCourses: CourseDetail[] = [];
   if (course) {
      const courseTags = course.tags?.split(',').map((t: string) => t.trim().toLowerCase()) || [];
      relatedCourses = allCourses
         .filter((c: CourseDetail) => c._id !== course._id)
         .filter((c: CourseDetail) => {
            // Match at least one tag or same level
            const tags = c.tags?.split(',').map((t: string) => t.trim().toLowerCase()) || [];
            const tagMatch = tags.some((tag: string) => courseTags.includes(tag));
            const levelMatch = c.level && course.level && c.level.toLowerCase() === course.level.toLowerCase();
            return tagMatch || levelMatch;
         })
         .slice(0, 4);

   }

   const [animationData, setAnimationData] = useState<object|null>(null);
   useEffect(() => {
      fetch('/animation.json')
         .then((res) => res.json())
         .then(setAnimationData);
   }, []);

   const handleAddReview = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!reviewText || !reviewRating) return toast.error('Please provide a rating and comment.');
      try {
         await addReview({ courseId: id!, review: reviewText, rating: reviewRating }).unwrap();
         setReviewText('');
         setReviewRating(5);
         toast.success('Review submitted!');
         await refetchCourse();
      } catch {
         toast.error('Failed to submit review.');
      }
   };

   const handleAddReply = async (reviewId: string) => {
      if (!replyText[reviewId]) return toast.error('Please enter a reply.');
      try {
         await addReplyToReview({ courseId: id!, reviewId, comment: replyText[reviewId] }).unwrap();
         setReplyText((prev) => ({ ...prev, [reviewId]: '' }));
         toast.success('Reply added!');
         await refetchCourse();
      } catch {
         toast.error('Failed to add reply.');
      }
   };

   // Show loader until all required data is loaded
   const isLoading =
      isCourseLoading ||
      sessionStatus === 'loading' ||
      isEnrolledLoading ||
      isAllCoursesLoading ||
      isConfigLoading || isUserLoading;

   if (isLoading) {
      return (
         <Loader/>
      );
   }
   if (!course) {
      return <div className="min-h-screen flex items-center justify-center text-red-500">Course not found.</div>;
   }

   return (
      <>
         <Header activeItem={1} route="/courses" />
         <section className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 py-12">
            <div className="max-w-7xl mx-auto mt-10 px-2 sm:px-4">
               {/* Breadcrumb */}
               <nav className="text-lg text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                  <Link href="/courses" className="hover:underline">All courses</Link>
                  <span>/</span>
                  <span className="text-black dark:text-white font-semibold">{course.name}</span>
               </nav>

               {/* Video Player Modal */}
               {selectedVideo && (
                  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                     <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
                           <h2 className="text-xl font-bold text-black dark:text-white">Now Playing: {selectedVideo.title}</h2>
                           <button
                              onClick={() => setSelectedVideo(null)}
                              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                           >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                           </button>
                        </div>
                        <div className="p-6">
                           <CoursePlayer videoUrl={selectedVideo.videoUrl} title={selectedVideo.title} />
                        </div>
                     </div>
                  </div>
               )}

               {/* Hero Section with Demo Video */}
               <div className="mb-12">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">


                     {/* Course Info Section */}
                     <div className="lg:col-span-2">
                        <div className="flex items-start gap-2 mb-2">

                           <div className="flex-1">
                              <h1 className="text-3xl md:text-4xl font-extrabold text-black dark:text-white mb-2 leading-tight">
                                 {course.name}
                              </h1>
                              <div className="flex flex-wrap items-center gap-4 mb-3">
                                 <span className="text-yellow-400 text-lg">{'★'.repeat(Math.round(course.ratings ?? 0))}{'☆'.repeat(5 - Math.round(course.ratings ?? 0))}</span>
                                 <span className="text-gray-600 dark:text-gray-300 text-sm">{course.ratings?.toFixed(2)} / 5</span>

                              </div>
                              <div className="flex flex-wrap items-center gap-3 mb-4">
                                 {course.level && <span className="px-3 py-1 bg-cyan-100 dark:bg-slate-800 rounded-full text-cyan-700 dark:text-cyan-300 text-xs font-semibold">{course.level}</span>}

                              </div>
                              <div className="flex flex-wrap items-center gap-3 mb-4">
                                 {course.tags && course.tags.split(',').map((tag: string, idx: number) => (
                                    <span key={idx} className="px-3 py-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-semibold">{tag.trim()}</span>
                                 ))}
                              </div>
                              <div className="mb-6">
                                 <div className="flex items-center gap-4 mb-4">
                                    <span className="text-3xl font-bold text-cyan-600 dark:text-cyan-200">₹{course.price}</span>
                                    {course.estimatedPrice && (
                                       <span className="text-xl line-through text-gray-400">₹{course.estimatedPrice}</span>
                                    )}

                                 </div>
                                 <div className='flex items-center gap-4 mb-4'>
                                    {course.estimatedPrice && (
                                       <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
                                          {Math.round(((Number(course.estimatedPrice) - Number(course.price)) / Number(course.estimatedPrice)) * 100)}% OFF
                                       </span>
                                    )}
                                 </div>
                              </div>
                           </div>
                           <div className='flex-1 h-72 w-full'>
                              {(() => {
                                 if (course.thumbnail && typeof course.thumbnail === 'object' && 'url' in course.thumbnail && typeof course.thumbnail.url === 'string' && course.thumbnail.url.length > 0) {
                                    return (
                                       <img
                                          src={course.thumbnail.url}
                                          alt={course.name}
                                          className="w-full h-60 object-cover object-center"
                                       />
                                    );
                                 } else if (typeof course.thumbnail === 'string') {
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
                           </div>


                        </div>
                        <div className="flex flex-wrap gap-4 my-2">
                           {isEnrolled ? (
                              <>
                                 <Link
                                    href={`/courses/${course._id}/components`}
                                    className="px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex items-center gap-2"
                                 >
                                    <Play className="w-5 h-5" />
                                    Continue Learning
                                 </Link>
                              </>
                           ) : (
                              <button
                                 className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                 onClick={handleOrder}
                                 disabled={isPaymentLoading}
                              >
                                 {isPaymentLoading ? 'Initializing...' : 'Enroll Now'}
                              </button>
                           )}
                        </div>

                        {/* Course Highlights */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                           <div className="text-center p-2 bg-cyan-50 dark:bg-slate-800 rounded-xl">
                              <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                                 {Array.isArray(course.courseData) ? course.courseData.length : 0}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">Lessons</div>
                           </div>
                           <div className="text-center p-2 bg-green-50 dark:bg-slate-800 rounded-xl">
                              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                 {course.purchased ?? 0}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">Students</div>
                           </div>
                        </div>
                     </div>
                     {/* Demo Video Section */}
                     <div className="lg:col-span-1">
                        <div className="flex items-center justify-between mb-4">
                           <h2 className="text-2xl font-bold text-black dark:text-white">Course Preview</h2>
                           {course.demoUrl && (
                              <span className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 rounded-full text-sm font-semibold">
                                 Demo Available
                              </span>
                           )}
                        </div>
                        {course.demoUrl ? (
                           <div className="bg-black h-fit rounded-2xl overflow-hidden shadow-lg">
                              <div style={{ paddingTop: "56.25%", position: "relative" }}>
                                 <div style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%"
                                 }}>
                                    <CoursePlayer videoUrl={course.demoUrl} title="Course Demo" />
                                 </div>
                              </div>
                           </div>
                        ) : (
                           <div className="bg-gray-100 dark:bg-slate-800 rounded-2xl h-80 flex items-center justify-center">
                              <div className="text-center">
                                 <div className="text-4xl mb-2">📹</div>
                                 <p className="text-gray-600 dark:text-gray-400">No demo video available</p>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
               </div>

               {/* Tab Navigation */}
               <div className="mb-8">
                  <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-slate-700">
                     <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-3 cursor-pointer font-semibold rounded-t-lg transition-all duration-300 ${activeTab === 'overview'
                           ? 'bg-cyan-600 text-white'
                           : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                           }`}
                     >
                        Overview
                     </button>
                     <button
                        onClick={() => setActiveTab('curriculum')}
                        className={`px-6 py-3 cursor-pointer font-semibold rounded-t-lg transition-all duration-300 ${activeTab === 'curriculum'
                           ? 'bg-cyan-600 text-white'
                           : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                           }`}
                     >
                        Curriculum
                     </button>
                     <button
                        onClick={() => setActiveTab('reviews')}
                        className={`px-6 py-3 cursor-pointer font-semibold rounded-t-lg transition-all duration-300 ${activeTab === 'reviews'
                           ? 'bg-cyan-600 text-white'
                           : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                           }`}
                     >
                        Reviews
                     </button>
                  </div>
               </div>

               {/* Tab Content */}
               <div className="mb-12">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                     <div className="space-y-8">
                        {/* Course Description */}
                        <div>
                           <h3 className="text-2xl font-bold text-black dark:text-white mb-4">About This Course</h3>
                           <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                              {course.description}
                           </p>
                        </div>

                        {/* What You'll Learn */}
                        {course.benefits && course.benefits.length > 0 && (
                           <div>
                              <h3 className="text-2xl font-bold text-black dark:text-white mb-6">What You&apos;ll Learn</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 {course.benefits.map((b: { title: string; _id?: string }, index: number) => (
                                    <div key={b._id || index} className="flex items-start gap-3 p-4 bg-cyan-50 dark:bg-slate-800 rounded-lg">
                                       <span className="text-cyan-600 dark:text-cyan-400 text-lg">✅</span>
                                       <span className="text-gray-900 dark:text-white text-sm">{b.title}</span>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        )}

                        {/* Prerequisites */}
                        {course.prerequisites && course.prerequisites.length > 0 && (
                           <div>
                              <h3 className="text-2xl font-bold text-black dark:text-white mb-6">Prerequisites</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 {course.prerequisites.map((p: { title: string; _id?: string }, index: number) => (
                                    <div key={p._id || index} className="flex items-start gap-3 p-4 bg-green-50 dark:bg-slate-800 rounded-lg">
                                       <span className="text-green-600 dark:text-green-400 text-lg">📋</span>
                                       <span className="text-gray-900 dark:text-white text-sm">{p.title}</span>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        )}
                     </div>
                  )}

                  {/* Curriculum Tab */}
                  {activeTab === 'curriculum' && (
                     <div>
                        <h3 className="text-2xl font-bold text-black dark:text-white mb-6">Course Curriculum</h3>
                        {Array.isArray(course.courseData) && course.courseData.length > 0 ? (
                           <div className="space-y-4">
                              {(course.courseData as Array<{ _id?: string; title: string; description: string; videoLength: string; videoUrl?: string }>).map((item, index: number) => (
                                 <div key={item._id || index} className="flex items-center gap-4 p-4 bg-cyan-50 dark:bg-slate-800 rounded-xl hover:bg-cyan-100 dark:hover:bg-slate-700 transition-all duration-200">
                                    <div className="flex-shrink-0">
                                       <div className="w-12 h-12 bg-cyan-200 dark:bg-cyan-900/20 rounded-lg flex items-center justify-center">
                                          <span className="text-cyan-600 dark:text-cyan-400 font-bold">{index + 1}</span>
                                       </div>
                                    </div>
                                    <div className="flex-1">
                                       <h4 className="font-semibold text-black dark:text-white mb-1">{item.title}</h4>
                                       <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                       <span className="text-gray-500 dark:text-gray-400 text-sm">{item.videoLength} min</span>
                                       {item.videoUrl && (
                                          <button
                                             onClick={() => setSelectedVideo({ videoUrl: item.videoUrl!, title: item.title })}
                                             className="px-3 py-1 bg-cyan-200 hover:bg-cyan-300 text-black font-semibold rounded-lg text-sm transition-all duration-300"
                                          >
                                             Preview
                                          </button>
                                       )}
                                    </div>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <div className="text-center py-12">
                              <div className="text-4xl mb-4">📚</div>
                              <p className="text-gray-600 dark:text-gray-400">No curriculum available yet</p>
                           </div>
                        )}
                     </div>
                  )}

                  {/* Reviews Tab */}
                  {activeTab === 'reviews' && (
                     <div>
                        <div className='flex items-center justify-between'>
                           <h3 className="text-2xl font-bold text-black dark:text-white mb-6">Student Reviews</h3>
                           {/* Add Review Button */}
                           {isEnrolled && !showAddReview && (
                              <button
                                 type="button"
                                 className="mb-6 flex items-center gap-2 px-5 py-2 bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-cyan-50 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-300 font-semibold transition cursor-pointer"
                                 onClick={() => setShowAddReview(true)}
                              >
                                 <FaPlus className="w-4 h-4" />
                                 Add Review
                              </button>
                           )}
                        </div>

                        {/* Add Review Form */}
                        {isEnrolled && showAddReview && (
                           <form onSubmit={handleAddReview} className="mb-8 relative bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-700 rounded-xl p-6 shadow-sm max-w-lg mx-auto animate-fade-in">
                              <button
                                 type="button"
                                 className="absolute top-3 right-3 text-gray-400 hover:text-cyan-600 text-xl cursor-pointer"
                                 onClick={() => setShowAddReview(false)}
                                 title="Close"
                              >
                                 <IoCloseOutline />
                              </button>
                              <div className="mb-4 flex items-center gap-3">
                                 <span className="font-semibold text-black dark:text-white">Your Rating:</span>
                                 <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map(r => (
                                       <button
                                          key={r}
                                          type="button"
                                          className="focus:outline-none"
                                          onClick={() => setReviewRating(r)}
                                          tabIndex={0}
                                       >
                                          {reviewRating >= r ? <FaStar className="text-yellow-400 w-5 h-5 transition" /> : <FaRegStar className="text-gray-300 w-5 h-5 transition" />}
                                       </button>
                                    ))}
                                 </div>
                              </div>
                              <textarea
                                 value={reviewText}
                                 onChange={e => setReviewText(e.target.value)}
                                 className="w-full rounded-lg border border-cyan-200 dark:border-slate-700 px-4 py-2 mb-4 bg-cyan-50 dark:bg-slate-800 text-black dark:text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 dark:focus:ring-cyan-900 transition min-h-[80px]"
                                 placeholder="Write your review..."
                                 rows={3}
                              />
                              <button
                                 type="submit"
                                 className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition cursor-pointer shadow-sm"
                                 disabled={isReviewLoading}
                              >
                                 {isReviewLoading ? 'Submitting...' : 'Submit Review'}
                              </button>
                           </form>
                        )}
                        {/* Reviews List */}
                        {Array.isArray(course.reviews) && course.reviews.length > 0 ? (
                           <div className="space-y-6">
                              {(course.reviews as Review[]).map((review) => (
                                 <div key={review._id} className="border-b border-cyan-100 dark:border-slate-800 pb-8 last:border-b-0">
                                    <div className="flex items-start gap-4">
                                       <img
                                          src={review.user?.avatar?.url || '/avatar.jpg'}
                                          alt={review.user?.name || 'User'}
                                          className="w-12 h-12 rounded-full object-cover border border-cyan-100 dark:border-slate-700 shadow-sm"
                                       />
                                       <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                             <h4 className="font-semibold text-black dark:text-white text-base">{review.user?.name || 'Anonymous'}</h4>
                                             <span className="text-yellow-400 text-sm flex items-center gap-0.5">{'★'.repeat(Math.round(review.rating))}{'☆'.repeat(5 - Math.round(review.rating))}</span>
                                             <span className="text-gray-400 text-xs">{review.rating}/5</span>
                                          </div>
                                          <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{review.comment}</p>
                                          {/* Reply Button */}
                                          {isEnrolled && openReply !== review._id && (
                                             <button
                                                type="button"
                                                className="text-cyan-600 hover:text-cyan-800 text-xs font-medium flex items-center gap-1 mb-2 cursor-pointer"
                                                onClick={() => setOpenReply(openReply === review._id ? null : review._id)}
                                             >
                                                <FaReply className="w-3 h-3" /> Reply
                                             </button>
                                          )}
                                          {/* Replies */}
                                          {Array.isArray(review.commentReplies) && review.commentReplies.length > 0 && (
                                             <div className="ml-6 pl-4 border-l-2 border-cyan-100 dark:border-slate-800 space-y-2">
                                                {review.commentReplies.map((reply, idx) => (
                                                   <div key={reply._id || idx} className="flex items-start gap-2">
                                                      <img src={reply.user?.avatar?.url || '/avatar.jpg'} alt={reply.user?.name || 'User'} className="w-8 h-8 rounded-full object-cover border border-cyan-100 dark:border-slate-700" />
                                                      <div>
                                                         <span className="font-semibold text-black dark:text-white text-xs">{reply.user?.name || 'Anonymous'}</span>
                                                         <p className="text-gray-700 dark:text-gray-300 text-xs">{reply.comment}</p>
                                                      </div>
                                                   </div>
                                                ))}
                                             </div>
                                          )}
                                          {/* Reply Input - minimal, inline, with close */}
                                          {isEnrolled && openReply === review._id && (
                                             <form
                                                onSubmit={e => { e.preventDefault(); handleAddReply(review._id); }}
                                                className="mt-3 flex items-center gap-2 bg-cyan-50 dark:bg-slate-800 rounded-lg px-3 py-2 shadow-sm relative animate-fade-in"
                                             >
                                                <input
                                                   type="text"
                                                   value={replyText[review._id] || ''}
                                                   onChange={e => setReplyText(prev => ({ ...prev, [review._id]: e.target.value }))}
                                                   className="flex-1 rounded-lg border border-cyan-200 dark:border-slate-700 px-3 py-1 bg-white dark:bg-slate-900 text-black dark:text-white focus:border-cyan-500 focus:outline-none transition"
                                                   placeholder="Reply to this review..."
                                                />
                                                <button
                                                   type="submit"
                                                   className="px-4 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition cursor-pointer shadow-sm"
                                                   disabled={isReplyLoading}
                                                >
                                                   {isReplyLoading ? 'Replying...' : 'Reply'}
                                                </button>
                                                <button
                                                   type="button"
                                                   className="flex items-center justify-center bg-red-700 w-8 h-8 rounded-lg text-black hover:text-cyan-600 text-lg cursor-pointer"
                                                   onClick={() => setOpenReply(null)}
                                                   title="Close"
                                                >
                                                   <IoCloseOutline />
                                                </button>
                                             </form>
                                          )}
                                       </div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <div className="text-center py-12">
                              <div className="text-4xl mb-4">⭐</div>
                              <p className="text-gray-600 dark:text-gray-400">No reviews yet</p>
                           </div>
                        )}
                     </div>
                  )}
               </div>

               {/* Related Courses */}
               {relatedCourses.length > 0 && (
                  <div className="mb-12">
                     <h3 className="text-2xl font-bold text-black dark:text-white mb-6">Related Courses</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedCourses.map((rc) => (
                           <div
                              key={rc._id}
                              className="group transition-all duration-300 hover:scale-102"
                           >
                              <div className="relative overflow-hidden rounded-2xl mb-4">
                                 {(() => {
                                    if (rc.thumbnail && typeof rc.thumbnail === 'object' && 'url' in rc.thumbnail && typeof rc.thumbnail.url === 'string' && rc.thumbnail.url.length > 0) {
                                       return (
                                          <img
                                             src={rc.thumbnail.url}
                                             alt={rc.name}
                                             className="w-full h-60 object-cover object-center"
                                          />
                                       );
                                    } else if (typeof rc.thumbnail === 'string') {
                                       return (
                                          <img
                                             src={rc.thumbnail}
                                             alt={rc.name}
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
                                 {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div> */}
                              </div>
                              <h4 className="font-semibold text-black dark:text-white mb-2 line-clamp-2">{rc.name}</h4>
                              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">{rc.description}</p>

                              {/* Tags */}
                              {rc.tags && (
                                 <div className="flex flex-wrap gap-1 mb-2">
                                    {rc.tags.split(',').slice(0, 2).map((tag: string, idx: number) => (
                                       <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                                          {tag.trim()}
                                       </span>
                                    ))}
                                    {rc.tags.split(',').length > 2 && (
                                       <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 rounded-full text-xs font-medium">
                                          +{rc.tags.split(',').length - 2} more
                                       </span>
                                    )}
                                 </div>
                              )}

                              {/* Ratings */}
                              <div className="flex items-center gap-2 mb-3">
                                 <span className="text-yellow-400 text-sm">{'★'.repeat(Math.round(rc.ratings ?? 0))}{'☆'.repeat(5 - Math.round(rc.ratings ?? 0))}</span>
                                 <span className="text-gray-600 dark:text-gray-300 text-xs">{rc.ratings?.toFixed(1) || '0.0'}</span>
                                 <span className="text-gray-500 dark:text-gray-400 text-xs">({rc.purchased || 0} students)</span>
                              </div>

                              <div className="flex items-center justify-between">
                                 <span className="text-cyan-600 dark:text-cyan-400 font-bold">₹{rc.price}</span>
                                 <Link
                                    href={`/courses/${rc._id}`}
                                    className="px-4 py-2 bg-cyan-200 hover:bg-cyan-300 text-black font-semibold rounded-lg text-sm transition-all duration-300"
                                 >
                                    View Course
                                 </Link>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}
            </div>
         </section>
         <Footer />
         {open && (
            <div className='w-full h-screen bg-[#00000036] fixed top-0 left-0 z-50 flex items-center justify-center'>
               <div className='w-[500px] min-h-[500px] bg-white dark:bg-slate-800 rounded-xl shadow p-6'>
                  <div className="flex items-center justify-between mb-6">
                     <h2 className="text-2xl font-bold text-black dark:text-white">Complete Payment</h2>
                     <IoCloseOutline
                        size={30}
                        className='text-black dark:text-white cursor-pointer hover:text-gray-600 dark:hover:text-gray-300'
                        onClick={() => { setOpen(false); setClientSecret('') }}
                     />
                  </div>

                  {isPaymentLoading || !stripePromise || !clientSecret ? (
                     <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">
                           {isPaymentLoading ? 'Creating payment session...' : 'Loading payment form...'}
                        </p>
                     </div>
                  ) : (
                     <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <CheckoutForm courseId={course?._id || id || ''} />
                     </Elements>
                  )}
               </div>
            </div>
         )}
      </>
   );
};

export default CourseDetailPage; 