'use client';

import CoursePlayer from '@/app/utils/CoursePlayer';
import { ArrowLeft, Award, Play, Shield, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';

const WatchDemoPage: React.FC = () => {
   const router = useRouter();

   // Demo video URL - you can replace this with your actual demo video ID
   const demoVideoUrl = "3a39b3ec217c1684ea985f4c5690ef6d"; // Replace with actual video ID from your video service
   const demoTitle = "Cyber Security Course Demo";

   return (

      <>
         <Header activeItem={-1} route="/terms-and-conditions" />
         <div className="py-24 min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 transition-colors duration-500">
            {/* Header */}
            <div className="">
               <div className="container mx-auto px-6 lg:px-10 py-4">
                  <div className="flex items-center justify-between">
                     <button
                        onClick={() => router.back()}
                        className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-200 transition-colors duration-200 cursor-pointer"
                     >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                     </button>
                     <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Watch Demo
                     </h1>
                     <div className="w-20"></div> {/* Spacer for centering */}
                  </div>
               </div>
            </div>

            <div className="container mx-auto px-6 lg:px-10 py-8">
               <div className="max-w-6xl mx-auto">
                  {/* Page Header */}
                  <div className="text-center mb-8">
                     <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Experience Our{' '}
                        <span className="text-cyan-600 dark:text-cyan-200">Cyber Security</span> Learning Platform
                     </h1>
                     <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Get a firsthand look at our comprehensive course structure, interactive learning modules, and expert-led training sessions.
                     </p>
                  </div>

                  {/* Video Player Section */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-cyan-200/50 dark:border-slate-700/50 overflow-hidden mb-8">
                     <div className="p-6 border-b border-cyan-200/30 dark:border-slate-700/30">
                        <div className="flex items-center space-x-3">
                           <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center">
                              <Play className="w-5 h-5 text-cyan-600 dark:text-cyan-200" />
                           </div>
                           <div>
                              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                 {demoTitle}
                              </h2>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                 Preview our learning experience
                              </p>
                           </div>
                        </div>
                     </div>

                     <div className="relative">
                        <CoursePlayer
                           title={demoTitle}
                           videoUrl={demoVideoUrl}
                        />
                     </div>
                  </div>

                  {/* Features Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                     <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-cyan-200/30 dark:border-slate-700/30 shadow-lg">
                        <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4">
                           <Shield className="w-6 h-6 text-cyan-600 dark:text-cyan-200" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                           Expert-Led Training
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                           Learn from industry professionals with years of experience in cyber security.
                        </p>
                     </div>

                     <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-cyan-200/30 dark:border-slate-700/30 shadow-lg">
                        <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4">
                           <Users className="w-6 h-6 text-cyan-600 dark:text-cyan-200" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                           Interactive Learning
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                           Engage with hands-on labs, real-world scenarios, and practical exercises.
                        </p>
                     </div>

                     <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-cyan-200/30 dark:border-slate-700/30 shadow-lg">
                        <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4">
                           <Award className="w-6 h-6 text-cyan-600 dark:text-cyan-200" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                           Industry Recognition
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                           Earn certificates recognized by top companies in the cyber security industry.
                        </p>
                     </div>
                  </div>

                  {/* Call to Action */}
                  <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 dark:from-cyan-700 dark:to-cyan-800 rounded-2xl p-8 text-center text-white shadow-xl">
                     <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        Ready to Start Your Cyber Security Journey?
                     </h2>
                     <p className="text-cyan-100 mb-6 max-w-2xl mx-auto">
                        Join thousands of learners who have already transformed their careers with our comprehensive cyber security courses.
                     </p>
                     <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                           onClick={() => router.push('/courses')}
                           className="bg-white text-cyan-600 hover:bg-cyan-50 px-8 py-3 rounded-xl font-semibold transition-colors duration-200 cursor-pointer"
                        >
                           Explore All Courses
                        </button>
                        <button
                           onClick={() => router.push('/contact-us')}
                           className="border-2 border-white text-white hover:bg-white hover:text-cyan-600 px-8 py-3 rounded-xl font-semibold transition-colors duration-200 cursor-pointer"
                        >
                           Contact Us
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <Footer />
         </>
   );
};

export default WatchDemoPage; 