import { BookOpen, Facebook, Instagram, Link, Linkedin, Twitter } from "lucide-react";
import React from "react";

const Footer = () => {
   return (
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
         <div className="container mx-auto px-3 sm:px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 text-center md:text-left">
               {/* Logo and Description */}
               <div className="space-y-4">
                  <Link to="/" className="flex items-center justify-center md:justify-start space-x-2">
                     <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                     </div>
                     <span className="text-xl font-bold">Learnify</span>
                  </Link>
                  <p className="text-gray-400 text-sm">
                     Empowering learners worldwide with high-quality, accessible education.
                     Start your learning journey today.
                  </p>
                  <div className="flex justify-center md:justify-start space-x-4">
                     <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        <Facebook className="w-5 h-5" />
                     </a>
                     <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        <Twitter className="w-5 h-5" />
                     </a>
                     <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        <Instagram className="w-5 h-5" />
                     </a>
                     <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        <Linkedin className="w-5 h-5" />
                     </a>
                  </div>
               </div>

               {/* Quick Links */}
               <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                  <ul className="space-y-2">
                     <li>
                        <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                           Home
                        </Link>
                     </li>
                     <li>
                        <Link to="/courses" className="text-gray-400 hover:text-white transition-colors">
                           Courses
                        </Link>
                     </li>
                     <li>
                        <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                           About Us
                        </Link>
                     </li>
                     <li>
                        <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
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
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                           Programming
                        </a>
                     </li>
                     <li>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                           Data Science
                        </a>
                     </li>
                     <li>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                           Design
                        </a>
                     </li>
                     <li>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                           Business
                        </a>
                     </li>
                  </ul>
               </div>

               {/* Support */}
               <div>
                  <h3 className="text-lg font-semibold mb-4">Support</h3>
                  <ul className="space-y-2">
                     <li>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                           Help Center
                        </a>
                     </li>
                     <li>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                           Privacy Policy
                        </a>
                     </li>
                     <li>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                           Terms of Service
                        </a>
                     </li>
                     <li>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                           FAQ
                        </a>
                     </li>
                  </ul>
               </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center overflow-x-auto">
               <p className="text-gray-400 text-sm">
                  © 2024 Learnify. All rights reserved. Made with ❤️ for learners worldwide.
               </p>
            </div>
         </div>
      </footer>
   );
};

export default Footer;