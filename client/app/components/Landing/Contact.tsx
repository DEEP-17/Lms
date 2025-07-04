"use client"
import { useSubmitContactMutation } from '@/redux/features/api/apiSlice';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaCheck, FaPaperPlane, FaSpinner } from 'react-icons/fa';
const Contact = () => {
   const [form, setForm] = useState({ name: '', email: '', message: '' });
   const [submitted, setSubmitted] = useState(false);
   const [submitContact, { isLoading }] = useSubmitContactMutation();

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm({ ...form, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         const result = await submitContact(form).unwrap();
         if (result.success) {
            setSubmitted(true);
            setForm({ name: '', email: '', message: '' });
            toast.success('Your message has been sent!');
            setSubmitted(false);
         } else {
            toast.error(result.message || 'Failed to submit. Please try again.');
         }
      } catch {
         toast.error('Failed to submit. Please try again.');
      }
   };

   return (
      <section id="contact" className="h-sreen py-30 bg-gradient-to-br from-cyan-50 via-white to-cyan-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
         <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-cyan-700 dark:text-cyan-200 mb-4">Contact Us</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
               Have questions or need support? Fill out the form below and our team will get back to you soon.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900 rounded-xl p-8 shadow">
               <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-50 dark:bg-slate-700 text-black dark:text-white"
                  required
               />
               <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-50 dark:bg-slate-700 text-black dark:text-white"
                  required
               />
               <textarea
                  name="message"
                  placeholder="Your Message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-50 dark:bg-slate-700 text-black dark:text-white resize-y"
                  required
               />
               <button
                  type="submit"
                  className="w-full p-4 text-center flex items-center justify-center gap-2 px-5 py-2 bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-cyan-50 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-300 font-semibold transition cursor-pointer"
                  disabled={isLoading}
               >
                  {isLoading ? (
                     <>
                        <FaSpinner className="w-4 h-4 animate-spin" /> Submitting...
                     </>
                  ) : submitted ? (
                     <>
                        <FaCheck className="w-4 h-4" /> Submitted!
                        </>
                     ) : (
                           <>
                              <FaPaperPlane className="w-4 h-4" /> Send Message
                           </>
                  )}
               </button>
            </form>
         </div>
      </section>
   );
};

export default Contact; 