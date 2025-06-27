import { BookOpen, Facebook, Instagram, Linkedin, Link as LucideLink, Twitter } from "lucide-react";
import Link from "next/link"; // Fix: use next/link for navigation
import React from "react";

const Footer = () => {
   return (
      <footer className="bg-gradient-to-br from-cyan-50 via-white to-cyan-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 text-black dark:text-slate-100 py-8 sm:py-12">
         <div className="container mx-auto px-3 sm:px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 text-center md:text-left">

               {/* Logo and Description */}
               <div className="space-y-4">
                  <Link href="/" className="flex items-center justify-center md:justify-start space-x-2 cursor-pointer">
                     <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                     </div>
                     <span className="text-xl font-bold">Learnify</span>
                  </Link>
                  <p className="text-black dark:text-slate-400 text-sm">
                     Empowering learners worldwide with high-quality, accessible education.
                     Start your learning journey today.
                  </p>
                  <div className="flex justify-center md:justify-start space-x-4">
                     <a href="#" className="text-black dark:text-slate-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                        <Facebook className="w-5 h-5" />
                     </a>
                     <a href="#" className="text-black dark:text-slate-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                        <Twitter className="w-5 h-5" />
                     </a>
                     <a href="#" className="text-black dark:text-slate-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                        <Instagram className="w-5 h-5" />
                     </a>
                     <a href="#" className="text-black dark:text-slate-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                        <Linkedin className="w-5 h-5" />
                     </a>
                  </div>
               </div>

               {/* Quick Links */}
               <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                  <ul className="space-y-2">
                     <li>
                        <Link href="/" className="text-black dark:text-slate-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                           Home
                        </Link>
                     </li>
                     <li>
                        <Link href="/courses" className="text-black dark:text-slate-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                           Courses
                        </Link>
                     </li>
                     <li>
                        <Link href="/about-us" className="text-black dark:text-slate-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                           About Us
                        </Link>
                     </li>
                     <li>
                        <Link href="/contact-us" className="text-black dark:text-slate-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                           Contact
                        </Link>
                     </li>
                  </ul>
               </div>

               {/* Categories */}
               <div>
                  <h3 className="text-lg font-semibold mb-4">Categories</h3>
                  <ul className="space-y-2">
                     <li>
                        <a href="/courses" className="text-black dark:text-slate-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                           Beginner
                        </a>
                     </li>
                     <li>
                        <a href="/courses" className="text-black dark:text-slate-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                           Intermediate
                        </a>
                     </li>
                     <li>
                        <a href="/courses" className="text-black dark:text-slate-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                           Complex
                        </a>
                     </li>
                  </ul>
               </div>

               {/* Support */}
               <div>
                  <h3 className="text-lg font-semibold mb-4">Support</h3>
                  <ul className="space-y-2">
                     <li>
                        <a href="/contact-us" className="text-black dark:text-slate-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                           Help Center
                        </a>
                     </li>
                     <li>
                        <a href="/privacy-policy" className="text-black dark:text-slate-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                           Privacy Policy
                        </a>
                     </li>
                     <li>
                        <a href="/terms-and-conditions" className="text-black dark:text-slate-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                           Terms of Service
                        </a>
                     </li>
                     <li>
                        <a href="/faq" className="text-black dark:text-slate-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                           FAQ
                        </a>
                     </li>
                  </ul>
               </div>
            </div>

            <div className="border-t border-gray-800  text-black dark:border-slate-700 mt-8 pt-8 text-center overflow-x-auto">
               <p className="text-black dark:text-slate-400 text-sm">
                  © 2025 Learnify. All rights reserved. Made with ❤️ for learners worldwide.
               </p>
            </div>
         </div>
      </footer>
   );
};

export default Footer;
