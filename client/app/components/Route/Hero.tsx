'use client';

import { useGetHeroDataQuery } from '@/redux/features/Layout/layoutApi';
import { Button } from '@mui/material';
import Lottie from 'lottie-react';
import { Play, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Hero: React.FC = () => {
  const { data } = useGetHeroDataQuery({
    refetchOnMountOrArgChange: true
  });
  const router = useRouter();

  // Extract hero data from the response
  const heroData = data?.layout?.bannerImage;
  const title = heroData?.title || "Master Cyber Security Skills Today";
  const subTitle = heroData?.subTitle || "Trusted by 500K+ learners. Learn from 40K+ top security courses & build a secure digital future.";

  const [animationData, setAnimationData] = useState<unknown>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/Animation - 1750995199955.json')
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, []);

  return (
    <section id="hero" className="relative bg-gradient-to-br from-cyan-50 via-white to-cyan-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 overflow-hidden transition-colors duration-500 pt-28 h-screen flex items-center justify-center">
      {/* Decorative background */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-[#E78B48]/10 dark:bg-[#E78B48]/5 rounded-full blur-xl"></div>
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-green-400/10 dark:bg-green-400/5 rounded-full blur-lg"></div>

      <div className="container mx-auto px-6 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left side content */}
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-gray-900 dark:text-white">
              {title.split(' ').map((word: string, index: number) => (
                <span key={index}>
                  {word.includes('Cyber') || word.includes('Security') ? (
                    <span className="text-cyan-600 dark:text-cyan-200">{word}</span>
                  ) : (
                    word
                  )}
                  {index < title.split(' ').length - 1 && ' '}
                </span>
              ))}
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto lg:mx-0">
              {subTitle}
            </p>

            {/* Call to Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="large" className="bg-[#BE3D2A] text-white hover:bg-cyan-700 cursor-pointer" onClick={() => router.push('/courses')}>
                Start Learning Now
              </Button>
              <Button size="large" variant="outlined" className="border-cyan-400 text-cyan-200 hover:bg-[#E78B48]/10 flex items-center" onClick={() => router.push('/watch-demo')}>
                <Play className="w-4 h-4 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Search Bar */}
            <form
              className="relative max-w-lg mx-auto lg:mx-0 mt-6"
              onSubmit={e => {
                e.preventDefault();
                if (search.trim()) router.push(`/courses?search=${encodeURIComponent(search.trim())}`);
              }}
            >
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search Security Courses"
                className="w-full h-14 px-6 pr-16 rounded-xl bg-gray-100 dark:bg-white/10 backdrop-blur-sm border border-cyan-400/30 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              />
              <button type="submit" className="absolute right-2 top-2 h-10 w-10 bg-[#BE3D2A] hover:bg-cyan-700 rounded-lg flex items-center justify-center transition-colors duration-200 cursor-pointer">
                <Search className="w-5 h-5 text-white" />
              </button>
            </form>

            {/* Trust indicators */}
            <div className="flex items-center space-x-4 justify-center lg:justify-start mt-6 text-sm">
              <div className="flex -space-x-2">
                <img src="https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2" alt="Student" className="w-10 h-10 rounded-full border-2 border-cyan-400 object-cover" />
                <img src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2" alt="Student" className="w-10 h-10 rounded-full border-2 border-cyan-400 object-cover" />
                <img src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2" alt="Student" className="w-10 h-10 rounded-full border-2 border-cyan-400 object-cover" />
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold text-gray-900 dark:text-white">500K+</span> learners joined.{' '}
                <a href="/courses" className="text-cyan-600 dark:text-cyan-200 hover:underline font-semibold">View Courses →</a>
              </div>
            </div>
          </div>

          {/* Right side - Animation or fallback image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-120 h-80 md:w-150 md:h-96 lg:w-[700px] lg:h-[500px] rounded-2xl overflow-hidden border border-cyan-400/20 shadow-2xl bg-white dark:bg-blue-900 flex items-center justify-center">
              {animationData ? (
                <Lottie
                  animationData={animationData}
                  loop
                  autoplay
                  style={{ width: '100%', height: '100%' }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">Loading animation...</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
