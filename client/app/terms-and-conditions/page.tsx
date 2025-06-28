import React from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';

const TermsAndConditionsPage = () => (
   <>
      <Header activeItem={-1} route="/terms-and-conditions" />
      <section className="min-h-screen py-30 bg-gradient-to-br from-cyan-50 via-white to-cyan-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 flex items-center justify-center">
         <div className="max-w-3xl w-full mx-auto px-6 py-12 bg-white dark:bg-slate-900 rounded-xl shadow text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-cyan-700 dark:text-cyan-200 mb-6">Terms &amp; Conditions</h1>
            <p className="mb-4 text-gray-700 dark:text-gray-300">By using our platform, you agree to the following terms and conditions. Please read them carefully.</p>
            <h2 className="text-xl font-semibold mt-8 mb-2 text-cyan-700 dark:text-cyan-200">Use of Service</h2>
            <ul className="list-disc ml-6 mb-4 text-left text-gray-700 dark:text-gray-300">
               <li>You must be at least 13 years old to use our platform.</li>
               <li>Do not misuse our services or attempt to disrupt them.</li>
               <li>Respect intellectual property and copyright laws.</li>
            </ul>
            <h2 className="text-xl font-semibold mt-8 mb-2 text-cyan-700 dark:text-cyan-200">Accounts</h2>
            <ul className="list-disc ml-6 mb-4 text-left text-gray-700 dark:text-gray-300">
               <li>You are responsible for maintaining the confidentiality of your account.</li>
               <li>Notify us immediately of any unauthorized use of your account.</li>
            </ul>
            <h2 className="text-xl font-semibold mt-8 mb-2 text-cyan-700 dark:text-cyan-200">Limitation of Liability</h2>
            <ul className="list-disc ml-6 mb-4 text-left text-gray-700 dark:text-gray-300">
               <li>We are not liable for any damages resulting from the use of our platform.</li>
               <li>Our services are provided &quot;as is&quot; without warranties of any kind.</li>
            </ul>
            <p className="mt-8 text-gray-700 dark:text-gray-300">For questions about these terms, please <a href="/contact-us" className="text-cyan-600 underline">contact us</a>.</p>
         </div>
      </section>
      <Footer/>
   </>
);

export default TermsAndConditionsPage; 