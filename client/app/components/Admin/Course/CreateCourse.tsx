'use client';
import React, { useState } from 'react';
import CourseContent from './CourseContent';
import CourseData from './CourseData';
import CourseInformation from './CourseInformation';
import CourseOptions from './CourseOptions';

const CreateCourse = () => {
  const [active, setActive] = useState(2);
  const [course, setCourse] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    estimatedPrice: '',
    level: '',
    tags: '',
    demoUrl: '',
    thumbnail: '',
  });
  const [benefits, setBenefits] = useState([{ title: '' }]);
  const [prerequisites, setPrerequisites] = useState([{ title: '' }]);

  return (
    <div className="w-full min-h-screen flex bg-white dark:bg-slate-900 transition-colors duration-300">

      {/* Sidebar */}
      <div className="w-[250px] p-4 border-r border-slate-300 dark:border-slate-700 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto hidden md:block">
        <CourseOptions active={active} setActive={setActive} />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {active === 0 && (
          <CourseInformation
            course={course}
            setCourse={setCourse}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 1 && (
          <CourseData
            benefits={benefits}
            prerequisites={prerequisites}
            setbenefits={setBenefits}
            setPrerequisites={setPrerequisites}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 2 && (
          <CourseContent
            active={active}
            setActive={setActive}
            benefits={benefits}
            prerequisites={prerequisites}
          />
        )}
      </div>

    </div>
  );
};

export default CreateCourse;
