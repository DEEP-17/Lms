'use client';

import { CourseStepStatus } from '@/types/course';
import { Button } from '@mui/material';
import { CheckCircle, ChevronLeft, ChevronRight, Eye, FileText, Lock, PlayCircle, Save, Settings } from 'lucide-react';
import React, { FC, useState } from 'react';

type Props = {
  active: number;
  setActive: (active: number) => void;
  onToggle?: (collapsed: boolean) => void;
  stepStatus?: CourseStepStatus;
  isStepAccessible?: (stepIndex: number) => boolean;
};

const CourseOptions: FC<Props> = ({
  active,
  setActive,
  onToggle,
  stepStatus,
  isStepAccessible
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const options = [
    {
      title: 'Course Information',
      icon: <FileText size={18} />,
      description: 'Basic course details'
    },
    {
      title: 'Course Benefits/Prerequisites',
      icon: <Settings size={18} />,
      description: 'Benefits and prerequisites'
    },
    {
      title: 'Course Content',
      icon: <PlayCircle size={18} />,
      description: 'Video content and materials'
    },
    {
      title: 'Course Preview',
      icon: <Eye size={18} />,
      description: 'Review and submit'
    },
  ];

  const handleToggle = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onToggle) {
      onToggle(newCollapsedState);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (isStepAccessible && !isStepAccessible(stepIndex)) {
      return; // Don't allow navigation to locked steps
    }
    setActive(stepIndex);
  };

  const getStepStatus = (stepIndex: number) => {
    if (!stepStatus) return { isCompleted: false, isSaved: false };
    const stepKey = `step${stepIndex}` as keyof CourseStepStatus;
    return stepStatus[stepKey] || { isCompleted: false, isSaved: false };
  };

  return (
    <div className={`h-full overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-full'}`}>
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header with toggle button */}
        <div className={`flex-shrink-0 ${isCollapsed ? 'px-2' : 'px-4'} py-4 border-b border-gray-200 dark:border-slate-700`}>
          <div className="flex items-center justify-between mb-3">
            {!isCollapsed && (
              <>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">Course Setup</h2>
                <button
                  onClick={handleToggle}
                  className="p-1.5 rounded-lg bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 btn-hover flex-shrink-0 cursor-pointer"
                  title="Collapse sidebar"
                >
                  <ChevronLeft size={16} />
                </button>
              </>
            )}
            {isCollapsed && (
              <button
                onClick={handleToggle}
                className="p-1.5 rounded-lg bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 btn-hover cursor-pointer"
                title="Expand sidebar"
              >
                <ChevronRight size={16} />
              </button>
            )}
          </div>
          {!isCollapsed && (
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Follow the steps to create your course</p>
          )}
        </div>

        {/* Options List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-700">
          {options.map((option, index) => {
            const stepStatus = getStepStatus(index);
            const isAccessible = isStepAccessible ? isStepAccessible(index) : true;
            const isLocked = !isAccessible;

            return (
              <div key={index} className="relative">
                <div
                  className={`w-full flex  items-center py-3 px-4 rounded-xl cursor-pointer transition-all duration-300 group card-hover ${active === index
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 shadow-lg'
                    : isLocked
                      ? 'bg-gray-100 dark:bg-slate-700/50 border-2 border-gray-300 dark:border-slate-600 opacity-60'
                      : 'hover:bg-gray-50 dark:hover:bg-slate-700/50 border-2 border-transparent'
                    } ${isCollapsed ? 'justify-center px-2' : ''} ${isLocked ? 'cursor-not-allowed' : ''}`}
                  onClick={() => handleStepClick(index)}
                  title={isCollapsed ? `${option.title} - ${option.description}` : ''}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center relative transition-all duration-300 flex-shrink-0 ${active === index
                      ? 'bg-blue-500 shadow-lg'
                      : stepStatus.isSaved
                        ? 'bg-green-500 shadow-lg'
                        : stepStatus.isCompleted
                          ? 'bg-yellow-500 shadow-lg'
                          : 'bg-gray-200 dark:bg-slate-600'
                      }`}
                  >
                    {isLocked ? (
                      <Lock size={18} className="text-gray-400" />
                    ) : stepStatus.isSaved ? (
                      <CheckCircle size={18} className="text-white" />
                    ) : stepStatus.isCompleted ? (
                      <Save size={18} className="text-white" />
                    ) : (
                      <div className={`${active === index ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                        {option.icon}
                      </div>
                    )}

                    {/* Step number for collapsed state */}
                    {isCollapsed && (
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white dark:border-slate-800 text-xs ${stepStatus.isSaved ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
                        }`}>
                        {index + 1}
                      </div>
                    )}

                    {index !== options.length - 1 && !isCollapsed && (
                      <div
                        className={`absolute h-12 w-0.5 bottom-[-48px] left-1/2 transform -translate-x-1/2 transition-all duration-300 ${stepStatus.isSaved ? 'bg-green-500' : 'bg-gray-200 dark:bg-slate-600'
                          }`}
                      />
                    )}
                  </div>

                  {!isCollapsed && (
                    <div className="ml-4 flex-1 min-w-0">
                      <h5
                        className={`text-sm font-semibold transition-all duration-300 truncate ${active === index
                          ? 'text-blue-600 dark:text-blue-400'
                          : stepStatus.isSaved
                            ? 'text-green-600 dark:text-green-400'
                            : stepStatus.isCompleted
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}
                      >
                        {option.title}
                      </h5>
                      <p className={`text-xs mt-1 transition-all duration-300 truncate ${active === index
                        ? 'text-blue-500 dark:text-blue-300'
                        : stepStatus.isSaved
                          ? 'text-green-500 dark:text-green-300'
                          : stepStatus.isCompleted
                            ? 'text-yellow-500 dark:text-yellow-300'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                        Step {index + 1} of {options.length}
                      </p>
                    </div>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap shadow-xl border border-slate-700 max-w-xs">
                      <div className="font-semibold mb-1">{option.title}</div>
                      <div className="text-xs text-slate-300">{option.description}</div>
                      <div className="text-xs text-slate-400 mt-1">Step {index + 1} of {options.length}</div>
                      {stepStatus.isSaved && (
                        <div className="text-xs text-green-400 mt-1">✓ Saved</div>
                      )}
                      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-slate-800"></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseOptions;
