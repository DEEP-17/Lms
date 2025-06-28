import React from 'react';

const AboutUs = () => (
   <section id="aboutus" className="h-screen py-56 bg-gradient-to-br from-cyan-50 via-white to-cyan-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-6 text-center">
         <h2 className="text-3xl md:text-4xl font-bold text-[#2563eb] dark:text-cyan-200 mb-4">About Us</h2>
         <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
            SecureWave is dedicated to providing world-class cybersecurity education for all. Our mission is to empower learners with practical skills, expert knowledge, and real-world experience.
         </p>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-cyan-50 dark:bg-slate-900 rounded-xl p-6 shadow">
               <h3 className="text-xl font-semibold text-[#2563eb] dark:text-cyan-200 mb-2">Expert Instructors</h3>
               <p className="text-gray-600 dark:text-gray-400">Learn from industry leaders and certified professionals with years of experience.</p>
            </div>
            <div className="bg-cyan-50 dark:bg-slate-900 rounded-xl p-6 shadow">
               <h3 className="text-xl font-semibold text-[#2563eb] dark:text-cyan-200 mb-2">Hands-on Learning</h3>
               <p className="text-gray-600 dark:text-gray-400">Engage in real-world labs, projects, and challenges to build practical skills.</p>
            </div>
            <div className="bg-cyan-50 dark:bg-slate-900 rounded-xl p-6 shadow">
               <h3 className="text-xl font-semibold text-cyan-700 dark:text-cyan-200 mb-2">Community Support</h3>
               <p className="text-gray-600 dark:text-gray-400">Join a vibrant community of learners, mentors, and experts for ongoing support.</p>
            </div>
         </div>
      </div>
   </section>
);

export default AboutUs; 