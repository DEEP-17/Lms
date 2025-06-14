import React from 'react';
import { Search } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background decorative elements - subtle tech pattern */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-cyan-400/5 rounded-full blur-xl"></div>
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-green-400/5 rounded-full blur-lg"></div>
      
      <div className="container mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-[80vh]">
          
          {/* Left side - Cyber Security Illustration */}
          <div className="lg:w-1/2 flex justify-center lg:justify-start mb-12 lg:mb-0">
            <div className="relative">
              {/* Main circular background with cyber theme */}
              <div className="w-80 h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] bg-gradient-to-br from-slate-800 to-slate-700 rounded-full flex items-center justify-center relative overflow-hidden border border-cyan-400/20">
                
                {/* Cyber Security themed illustration */}
                <div className="relative w-full h-full flex items-center justify-center">
                  
                  {/* Computer/Monitor */}
                  <div className="absolute bottom-32 w-48 h-32 bg-slate-900 rounded-lg border-2 border-cyan-400/30 flex items-center justify-center">
                    <div className="w-40 h-24 bg-green-900 rounded border border-green-400/50 flex items-center justify-center">
                      <div className="text-green-400 text-xs font-mono">
                        <div className="mb-1">$ security_scan</div>
                        <div className="text-green-300">✓ System Protected</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Person at computer */}
                  <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 bg-amber-600 rounded-full mb-2"></div>
                    <div className="w-16 h-20 bg-blue-600 rounded-lg"></div>
                    <div className="absolute -left-2 top-12 w-6 h-12 bg-blue-600 rounded-lg transform -rotate-12"></div>
                    <div className="absolute -right-2 top-12 w-6 h-12 bg-blue-600 rounded-lg transform rotate-12"></div>
                  </div>
                  
                  {/* Shield icon */}
                  <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-16 h-20 bg-green-600 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-10 border-2 border-white rounded-md flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Floating security elements */}
                  <div className="absolute top-16 right-20 w-8 h-8 bg-red-500 rounded flex items-center justify-center animate-pulse">
                    <div className="w-4 h-4 border border-white rounded-full"></div>
                  </div>
                  <div className="absolute top-32 left-16 w-6 h-6 bg-yellow-500 rounded flex items-center justify-center animate-bounce">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="absolute bottom-48 right-16 w-7 h-7 bg-cyan-400 rounded flex items-center justify-center animate-pulse" style={{animationDelay: '0.5s'}}>
                    <div className="w-3 h-3 border border-white"></div>
                  </div>
                  
                  {/* Network nodes */}
                  <div className="absolute top-24 right-32 w-4 h-4 bg-cyan-400 rounded-full animate-ping"></div>
                  <div className="absolute bottom-24 left-20 w-3 h-3 bg-green-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                  
                  {/* Lock symbols */}
                  <div className="absolute top-40 left-24 w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                    <div className="w-3 h-3 border border-white rounded-sm"></div>
                  </div>
                </div>
              </div>
              
              {/* Floating tech elements around the circle */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-cyan-400 rounded-full animate-float flex items-center justify-center">
                <div className="w-4 h-4 border border-white rounded"></div>
              </div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400 rounded-full animate-float flex items-center justify-center" style={{animationDelay: '1s'}}>
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          
          {/* Right side - Content */}
          <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                <span className="text-white">
                  Improve Your Online
                </span>
                <br />
                <span className="text-cyan-400">
                  Cyber Security
                </span>
                <br />
                <span className="text-white">Skills Instantly</span>
              </h1>
            </div>
            
            <p className="text-lg md:text-xl text-gray-300 max-w-lg mx-auto lg:mx-0">
              We have <span className="text-cyan-400 font-semibold">40k+</span> Cyber Security courses & <span className="text-cyan-400 font-semibold">500K+</span> Online registered students. Find your desired Security Courses from them.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-lg mx-auto lg:mx-0">
              <input
                type="search"
                placeholder="Search Security Courses"
                className="w-full h-14 px-6 pr-16 rounded-xl bg-white/10 backdrop-blur-sm border border-cyan-400/30 text-white placeholder-gray-400 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50"
              />
              <button className="absolute right-2 top-2 h-10 w-10 bg-cyan-500 hover:bg-cyan-600 rounded-lg flex items-center justify-center transition-colors duration-200">
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
              <div className="text-gray-300">
                <span className="font-semibold text-white">500K+</span> People already trusted us.{' '}
                <a href="#courses" className="text-cyan-400 hover:text-cyan-300 font-semibold underline transition-colors">
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