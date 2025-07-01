'use client';

import { useGetEnrolledCoursesQuery } from '@/redux/features/api/apiSlice';
import { CourseFormData } from '@/types/course';
import { Clock, Play, Star, Users } from 'lucide-react';
import Link from 'next/link';
import React, { FC } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
}

type Props = {
  user: User;
};

const EnrolledCourses: FC<Props> = () => {
  const { data, isLoading, isError, refetch } = useGetEnrolledCoursesQuery();

  const courses: CourseFormData[] = Array.isArray(data?.courses)
    ? data.courses
    : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">Failed to load enrolled courses</div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="text-gray-500 mb-4">You haven&apos;t enrolled in any courses yet</div>
        <Link
          href="/courses"
          className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition"
        >
          Browse Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          My Enrolled Courses
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Continue learning from where you left off
        </p>
      </div>

      {/* Course List */}
      <div className="space-y-3 mb-6">
        {courses.map((course, index) => (
          <div
            key={course._id}
            className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {course.name}
                    </h3>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2 ml-11">
                  {course.description}
                </p>

                {/* Course Stats */}
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 ml-11">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Self-paced</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{course.purchased || 0} students</span>
                  </div>
                  {course.ratings && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current text-yellow-400" />
                      <span>{typeof course.ratings === 'number' ? course.ratings.toFixed(1) : course.ratings}</span>
                    </div>
                  )}
                  {course.level && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                      {course.level}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="flex-shrink-0 ml-4">
                <Link
                  href={`/courses/${course._id}/components`}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-cyan-50 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-300 font-semibold transition cursor-pointer"
                >
                  <Play className="w-4 h-4" />
                  Continue Learning
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <div className="w-4 h-4 text-blue-600 dark:text-blue-400 flex justify-center items-center">📚</div>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {courses.length}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Enrolled</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <div className="w-4 h-4 text-green-600 dark:text-green-400 flex justify-center items-center">⏱️</div>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {courses.length}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">In Progress</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <div className="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex justify-center items-center">⭐</div>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {courses.filter(c => c.ratings).length}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Rated</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <div className="w-4 h-4 text-purple-600 dark:text-purple-400 flex justify-center items-center">✅</div>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                0
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourses; 