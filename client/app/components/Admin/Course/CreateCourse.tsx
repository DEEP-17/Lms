'use client';

import { CourseFormData } from '@/types/course';
import React, { useState } from 'react';
import CourseContent from './CourseContent';
import CourseData from './CourseData';
import CourseInformation from './CourseInformation';
import CourseOptions from './CourseOptions';
import CoursePreview from './CoursePreview';


const CreateCourse = () => {
  const [active, setActive] = useState<number>(0);

  const [courseInfo, setCourseInfo] = useState<CourseFormData>({
    name: '',
    description: '',
    level: '',
    price: '',
    estimatedPrice: '',
    tags: '',
    demoUrl: '',
    thumbnail: '',
    benefits: [{ title: '' }],
    prerequisites: [{ title: '' }],
    courseContent: [
      {
        id: '1',
        title: '',
        components: [
          {
            id: '1',
            videoTitle: '',
            videoUrl: '',
            videoDescription: '',
            links: [{ id: '1', title: '', url: '' }],
          },
        ],
      },
    ],
  });

  const handleSubmit = async () => {
    console.log('Course Data:', courseInfo);
    // You can also: await createCourse(courseInfo);
  };

  return (
    <div className="w-full min-h-screen flex bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-300">
      {/* Sidebar */}
      <div className="w-[280px] p-6 border-r border-gray-200 dark:border-slate-700 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto hidden md:block bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg">
        <CourseOptions active={active} setActive={setActive} />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {active === 0 && (
            <CourseInformation
              course={courseInfo}
              setCourse={setCourseInfo}
              active={active}
              setActive={setActive}
            />
          )}

          {active === 1 && (
            <CourseData
              benefits={courseInfo.benefits}
              prerequisites={courseInfo.prerequisites}
              setBenefits={(updatedBenefits) =>
                setCourseInfo((prev) => ({ ...prev, benefits: updatedBenefits }))
              }
              setPrerequisites={(updatedPrerequisites) =>
                setCourseInfo((prev) => ({ ...prev, prerequisites: updatedPrerequisites }))
              }
              active={active}
              setActive={setActive}
            />
          )}

          {active === 2 && (
            <CourseContent
              active={active}
              setActive={setActive}
              contentData={courseInfo.courseContent}
              setContentData={(updatedContent) =>
                setCourseInfo((prev) => ({ ...prev, courseContent: updatedContent }))
              }
            />
          )}

          {active === 3 && (
            <CoursePreview
              course={courseInfo}
              onEdit={() => setActive(0)}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
