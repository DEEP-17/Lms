'use client';

import React, { FC } from 'react';
import { IoMdCheckmark } from 'react-icons/io';

type Props = {
  active: number;
  setActive: (active: number) => void;
};

const CourseOptions: FC<Props> = ({ active, setActive }) => {
  const options: string[] = [
    'Course Information',
    'Course Options',
    'Course Content',
    'Course Preview',
  ];

  return (
    <div className="space-y-2">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Course Setup</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Follow the steps to create your course</p>
      </div>

      {options.map((option, index) => (
        <div key={index} className="relative">
          <div
            className={`w-full flex items-center py-4 px-4 rounded-xl cursor-pointer transition-all duration-300 group ${active === index
              ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
              : 'hover:bg-gray-50 dark:hover:bg-slate-700/50 border-2 border-transparent'
              }`}
            onClick={() => setActive(index)}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center relative transition-all duration-300 ${active + 1 > index
                ? 'bg-blue-500 shadow-lg'
                : 'bg-gray-200 dark:bg-slate-600'
                }`}
            >
              <IoMdCheckmark
                className={`text-xl transition-all duration-300 ${active + 1 > index
                  ? 'text-white'
                  : 'text-gray-400 dark:text-gray-300'
                  }`}
              />
              {index !== options.length - 1 && (
                <div
                  className={`absolute h-12 w-0.5 bottom-[-48px] left-1/2 transform -translate-x-1/2 transition-all duration-300 ${active + 1 > index
                    ? 'bg-blue-500'
                    : 'bg-gray-200 dark:bg-slate-600'
                    }`}
                />
              )}
            </div>

            <div className="ml-4 flex-1">
              <h5
                className={`text-sm font-semibold transition-all duration-300 ${active === index
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300'
                  }`}
              >
                {option}
              </h5>
              <p className={`text-xs mt-1 transition-all duration-300 ${active === index
                ? 'text-blue-500 dark:text-blue-300'
                : 'text-gray-500 dark:text-gray-400'
                }`}>
                Step {index + 1} of {options.length}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseOptions;
