import { useEditHeroMutation, useGetLayoutDataQuery } from '@/redux/features/Layout/layoutApi';

import Lottie from 'lottie-react';
import { Play, Save, Search } from 'lucide-react';
import React, { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const animationPath = '/Animation - 1750995199955.json';

const EditHero: FC = () => {
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const { data, isLoading: isLoadingData } = useGetLayoutDataQuery(undefined, {
    refetchOnMountOrArgChange: true
  });
  const [editHero, { isLoading: isUpdating }] = useEditHeroMutation();
  const [animationData, setAnimationData] = useState<unknown>(null);

  useEffect(() => {
    if (data?.layout?.bannerImage) {
      setTitle(data.layout.bannerImage.title || "");
      setSubTitle(data.layout.bannerImage.subTitle || "");
    } else {
      setTitle("Master Cyber Security with Expert-Led Training");
      setSubTitle("10K+ SECURITY PROFESSIONALS TRUST US");
    }
  }, [data]);

  useEffect(() => {
    fetch(animationPath)
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subTitle.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      await editHero({
        type: "Banner",
        title,
        subTitle
      }).unwrap();
      toast.success('Hero section updated successfully!');
    } catch {
      toast.error('Failed to update hero section');
    }
  };

  const RequiredStar = () => <span className="text-red-500 ml-1">*</span>;

  if (isLoadingData) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 p-8 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-xl border border-gray-200/50 dark:border-slate-700/50">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded mb-8"></div>
          <div className="space-y-6">
            <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded"></div>
            <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded"></div>
            <div className="h-32 bg-gray-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
        <div className="text-center mt-4">
          <p className="text-gray-600 dark:text-gray-400">Loading hero section data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 p-8 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-xl border border-gray-200/50 dark:border-slate-700/50 transition-all duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Edit Hero Section</h1>
        <p className="text-gray-600 dark:text-gray-400">Update the main banner section of your website</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title */}
        <div className="space-y-3">
          <label className="block text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
            Hero Title <RequiredStar />
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter hero title"
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300"
          />
        </div>

        {/* Subtitle */}
        <div className="space-y-3">
          <label className="block text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
            Hero Subtitle <RequiredStar />
          </label>
          <textarea
            required
            value={subTitle}
            onChange={e => setSubTitle(e.target.value)}
            placeholder="Enter hero subtitle"
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300 resize-none"
          />
        </div>

        {/* Animation Preview */}
        <div className="p-6 bg-gray-50 dark:bg-slate-900 rounded-xl border-2 border-gray-200 dark:border-slate-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview</h3>
          <div className="relative bg-gray-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 overflow-hidden transition-colors duration-500 py-8 rounded-2xl">
            <div className="container mx-auto px-6 lg:px-10 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[60vh]">
                {/* Left side content */}
                <div className="space-y-6 text-center lg:text-left">
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight text-gray-900 dark:text-white">
                    {title.split(' ').map((word, index) => (
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
                    <button>
                      Start Learning Now
                    </button>
                    <button>
                      <Play className="w-4 h-4 mr-2" />
                      Watch Demo
                    </button>
                  </div>
                  {/* Search Bar */}
                  <div className="relative max-w-lg mx-auto lg:mx-0 mt-6">
                    <input
                      type="search"
                      placeholder="Search Security Courses"
                      className="w-full h-14 px-6 pr-16 rounded-xl bg-gray-100 dark:bg-white/10 backdrop-blur-sm border border-cyan-400/30 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                    />
                    <button>
                      <Search className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  {/* Trust indicators */}
                  <div className="flex items-center space-x-4 justify-center lg:justify-start mt-6 text-sm">
                    <div className="flex -space-x-2">
                      <img src="https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2" alt="Student" className="w-10 h-10 rounded-full border-2 border-cyan-400 object-cover" />
                      <img src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2" alt="Student" className="w-10 h-10 rounded-full border-2 border-cyan-400 object-cover" />
                      <img src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2" alt="Student" className="w-10 h-10 rounded-full border-2 border-cyan-400 object-cover" />
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      <span className="font-semibold text-gray-900 dark:text-white">500K+</span> learners joined.{' '}
                      <a href="#courses" className="text-cyan-600 dark:text-cyan-200 hover:underline font-semibold">View Courses →</a>
                    </div>
                  </div>
                </div>
                {/* Right side - Animation */}
                <div className="flex justify-center lg:justify-end">
                  <div className="relative w-80 h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] rounded-full overflow-hidden border border-cyan-400/20 shadow-2xl bg-white dark:bg-slate-800 flex items-center justify-center">
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
          </div>
        </div>
        {/* Submit Button */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={isUpdating}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-cyan-50 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-300 font-semibold transition cursor-pointer"
          >
            <Save className="h-5 w-5" />
            <span>{isUpdating ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditHero;
