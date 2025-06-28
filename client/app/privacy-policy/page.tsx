import React from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';

const PrivacyPolicyPage = () => (
   <>
      <Header activeItem={-1} route="/privacy-policy" />
      <section className="min-h-screen py-30 bg-gradient-to-br from-cyan-50 via-white to-cyan-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 flex items-center justify-center">
         <div className="max-w-3xl w-full mx-auto px-6 py-12 bg-white dark:bg-slate-900 rounded-xl shadow text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-cyan-700 dark:text-cyan-200 mb-6">Privacy Policy</h1>
            <p className="mb-4 text-gray-700 dark:text-gray-300">Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our platform.</p>
            <h2 className="text-xl font-semibold mt-8 mb-2 text-cyan-700 dark:text-cyan-200">Information We Collect</h2>
            <ul className="list-disc ml-6 mb-4 text-left text-gray-700 dark:text-gray-300">
               <li>Personal information you provide (name, email, etc.)</li>
               <li>Usage data and analytics</li>
               <li>Cookies and tracking technologies</li>
            </ul>
            <h2 className="text-xl font-semibold mt-8 mb-2 text-cyan-700 dark:text-cyan-200">How We Use Your Information</h2>
            <ul className="list-disc ml-6 mb-4 text-left text-gray-700 dark:text-gray-300">
               <li>To provide and improve our services</li>
               <li>To communicate with you</li>
               <li>To ensure platform security</li>
               <li>To comply with legal obligations</li>
            </ul>
            <h2 className="text-xl font-semibold mt-8 mb-2 text-cyan-700 dark:text-cyan-200">Your Rights</h2>
            <ul className="list-disc ml-6 mb-4 text-left text-gray-700 dark:text-gray-300">
               <li>Access, update, or delete your personal information</li>
               <li>Opt out of marketing communications</li>
               <li>Request data portability</li>
            </ul>
            <p className="mt-8 text-gray-700 dark:text-gray-300">For any questions or requests regarding your privacy, please contact us at <a href="/contact-us" className="text-cyan-600 underline">Contact Us</a>.</p>
         </div>
      </section>
      <Footer/>
   </>
);

export default PrivacyPolicyPage; 