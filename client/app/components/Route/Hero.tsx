'use client';
import React from 'react';
import { Search } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-hidden transition-colors duration-500">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-cyan-400/10 dark:bg-cyan-400/5 rounded-full blur-xl"></div>
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-green-400/10 dark:bg-green-400/5 rounded-full blur-lg"></div>

      <div className="container mx-auto px-6 py-10 lg:px-10">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-[80vh]">
          {/* Left side - Cyber Security Illustration */}
          <div className="lg:w-1/2 flex justify-center lg:justify-start mb-12 lg:mb-0">
            <div className="relative">
              <div className="w-80 h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] bg-gray-200 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center relative overflow-hidden border border-cyan-400/20">
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Computer/Monitor */}
                  <div className="absolute bottom-32 w-48 h-32 bg-gray-300 dark:bg-slate-900 rounded-lg border-2 border-cyan-400/30 flex items-center justify-center">
                    <div className="w-40 h-24 bg-green-100 dark:bg-green-900 rounded border border-green-400/50 flex items-center justify-center">
                      <div className="text-green-700 dark:text-green-400 text-xs font-mono">
                        <div className="mb-1">$ security_scan</div>
                        <div className="text-green-600 dark:text-green-300">✓ System Protected</div>
                      </div>
                    </div>
                  </div>

                  {/* Person at computer */}
                  <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 bg-amber-500 dark:bg-amber-600 rounded-full mb-2"></div>
                    <div className="w-16 h-20 bg-blue-500 dark:bg-blue-600 rounded-lg"></div>
                    <div className="absolute -left-2 top-12 w-6 h-12 bg-blue-500 dark:bg-blue-600 rounded-lg transform -rotate-12"></div>
                    <div className="absolute -right-2 top-12 w-6 h-12 bg-blue-500 dark:bg-blue-600 rounded-lg transform rotate-12"></div>
                  </div>

                  {/* Shield */}
                  <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-16 h-20 bg-green-500 dark:bg-green-600 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-10 border-2 border-white rounded-md flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>

                  {/* Animated Floating Elements */}
                  <div className="absolute top-16 right-20 w-8 h-8 bg-red-500 rounded flex items-center justify-center animate-pulse">
                    <div className="w-4 h-4 border border-white rounded-full"></div>
                  </div>
                  <div className="absolute top-32 left-16 w-6 h-6 bg-yellow-500 rounded flex items-center justify-center animate-bounce">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="absolute bottom-48 right-16 w-7 h-7 bg-cyan-400 rounded flex items-center justify-center animate-pulse" style={{ animationDelay: '0.5s' }}>
                    <div className="w-3 h-3 border border-white"></div>
                  </div>

                  {/* Pinging Network Nodes */}
                  <div className="absolute top-24 right-32 w-4 h-4 bg-cyan-400 rounded-full animate-ping"></div>
                  <div className="absolute bottom-24 left-20 w-3 h-3 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>

                  {/* Lock Symbol */}
                  <div className="absolute top-40 left-24 w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                    <div className="w-3 h-3 border border-white rounded-sm"></div>
                  </div>
                </div>
              </div>

              {/* Floating tech elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-cyan-400 rounded-full animate-float flex items-center justify-center">
                <div className="w-4 h-4 border border-white rounded"></div>
              </div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400 rounded-full animate-float flex items-center justify-center" style={{ animationDelay: '1s' }}>
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                <span>Improve Your Online</span>
                <br />
                <span className="text-cyan-600 dark:text-cyan-400">Cyber Security</span>
                <br />
                <span>Skills Instantly</span>
              </h1>
            </div>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto lg:mx-0">
              We have <span className="text-cyan-600 dark:text-cyan-400 font-semibold">40k+</span> Cyber Security courses & <span className="text-cyan-600 dark:text-cyan-400 font-semibold">500K+</span> Online registered students. Find your desired Security Courses from them.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-lg mx-auto lg:mx-0">
              <input
                type="search"
                placeholder="Search Security Courses"
                className="w-full h-14 px-6 pr-16 rounded-xl bg-gray-100 dark:bg-white/10 backdrop-blur-sm border border-cyan-400/30 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              />
              <button className="absolute right-2 top-2 h-10 w-10 bg-cyan-600 hover:bg-cyan-700 rounded-lg flex items-center justify-center transition-colors duration-200">
                <Search className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center space-x-4 justify-center lg:justify-start">
              <div className="flex -space-x-2">
                <img
                  src="https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2"
                  alt="Student"
                  className="w-10 h-10 rounded-full border-2 border-cyan-400 object-cover"
                />
                <img
                  src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2"
                  alt="Student"
                  className="w-10 h-10 rounded-full border-2 border-cyan-400 object-cover"
                />
                <img
                  src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2"
                  alt="Student"
                  className="w-10 h-10 rounded-full border-2 border-cyan-400 object-cover"
                />
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold text-gray-900 dark:text-white">500K+</span> People already trusted us.{' '}
                <a href="#courses" className="text-cyan-600 dark:text-cyan-400 hover:underline font-semibold">
                  View Courses →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
