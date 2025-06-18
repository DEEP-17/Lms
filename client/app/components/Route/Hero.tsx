'use client';

import { Button } from '@mui/material';
import { Play, Search } from 'lucide-react';
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary to-secondary dark:from-background-dark dark:to-primary overflow-hidden py-20 transition-colors duration-500">
      {/* Decorative background */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-accent/20 dark:bg-accent/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-secondary/20 dark:bg-secondary/10 rounded-full blur-lg"></div>

      <div className="container mx-auto px-6 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">

          {/* Left side content */}
          <div className="space-y-8 text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-text dark:text-text-light">
              <span>Master</span>{' '}
              <span className="text-primary dark:text-accent">Cyber Security</span>{' '}
              <span>Skills Today</span>
            </h1>

            <p className="text-xl text-text/80 dark:text-text-light/80 max-w-lg mx-auto lg:mx-0">
              Trusted by <span className="text-primary dark:text-accent font-semibold">500K+</span> learners. Learn from <span className="text-primary dark:text-accent font-semibold">40K+</span> top security courses & build a secure digital future.
            </p>

            {/* Call to Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="large" className="bg-primary hover:bg-secondary text-white font-bold shadow-lg rounded-xl px-8 py-3 transition-all">
                Start Learning Now
              </Button>
              <Button size="large" variant="outlined" className="border-accent text-accent hover:bg-accent/10 flex items-center font-bold rounded-xl px-8 py-3 transition-all">
                <Play className="w-4 h-4 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-lg mx-auto lg:mx-0 mt-6">
              <input
                type="search"
                placeholder="Search Security Courses"
                className="w-full h-14 px-6 pr-16 rounded-xl bg-surface-light dark:bg-surface-dark backdrop-blur-sm border border-primary/30 text-text dark:text-text-light placeholder-text/50 dark:placeholder-text-light/60 text-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button className="absolute right-2 top-2 h-10 w-10 bg-primary hover:bg-secondary rounded-lg flex items-center justify-center transition-colors duration-200">
                <Search className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center space-x-4 justify-center lg:justify-start mt-6 text-sm">
              <div className="flex -space-x-2">
                <img src="https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2" alt="Student" className="w-10 h-10 rounded-full border-2 border-primary object-cover" />
                <img src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2" alt="Student" className="w-10 h-10 rounded-full border-2 border-primary object-cover" />
                <img src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2" alt="Student" className="w-10 h-10 rounded-full border-2 border-primary object-cover" />
              </div>
              <div className="text-text/80 dark:text-text-light/80">
                <span className="font-semibold text-text dark:text-text-light">500K+</span> learners joined.{' '}
                <a href="#courses" className="text-primary dark:text-accent hover:underline font-semibold">View Courses →</a>
              </div>
            </div>
          </div>

          {/* Right side - Cyber Security Illustration */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-80 h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] bg-surface-light dark:bg-surface-dark rounded-full flex items-center justify-center overflow-hidden border border-primary/20 shadow-xl">
              <div className="absolute bottom-32 w-48 h-32 bg-gray-300 dark:bg-slate-900 rounded-lg border border-primary/30 flex items-center justify-center">
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

              {/* Floating tech elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-cyan-400 rounded-full animate-float flex items-center justify-center">
                <div className="w-4 h-4 border border-white rounded"></div>
              </div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400 rounded-full animate-float flex items-center justify-center" style={{ animationDelay: '1s' }}>
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>

              {/* Badge */}
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-black px-4 py-2 rounded-full font-semibold shadow-lg">
                #1 Cyber Platform
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
