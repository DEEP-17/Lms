'use client';
import React, { useState } from 'react';
import CourseContent from './CourseContent';
import CourseData from './CourseData';
import CourseInformation from './CourseInformation';
import CourseOptions from './CourseOptions';

const CreateCourse = () => {
  const [active, setActive] = useState(0);
  const [courseInfo, setCourseInfo] = useState({
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
  const [courseData, setCourseData] = useState(null);
  const [benefits, setBenefits] = useState([{ title: '' }]);
  const [prerequisites, setPrerequisites] = useState([{ title: '' }]);
  const [courseContentData, setCourseContentData] = useState([{
    videoUrl: '',
    title: '',
    description: '',
    videoSection: '',
    links: [{ title: '', url: '' }],
    suggestion: "",
  }]);

  const handleSubmit = async () => {
    // format benefits array
    const formattedBenefits = benefits.map((benefit) => ({ title: benefit.title }));
    // format prerequisites array
    const formattedPrerequisites = prerequisites.map((prerequisite) => ({ title: prerequisite.title }));
    // format course content data
    const formattedCourseContentData = courseContentData.map((courseContent) => ({
      videoUrl: courseContent.videoUrl,
      title: courseContent.title,
      description: courseContent.description,
      videoSection: courseContent.videoSection,
      links: courseContent.links.map(link => ({ title: link.title, url: link.url })),
      suggestion: courseContent.suggestion,
    }));
    // Prepare our data object
    const data = {
      name: courseInfo.title,
      description: courseInfo.description,
      category: courseInfo.category,
      price: courseInfo.price,
      estimatedPrice: courseInfo.estimatedPrice,
      level: courseInfo.level,
      tags: courseInfo.tags,
      demoUrl: courseInfo.demoUrl,
      thumbnail: courseInfo.thumbnail,
      content: formattedCourseContentData,
      totalVideos: courseContentData.length,
      benefits: formattedBenefits,
      prerequisites: formattedPrerequisites,
      courseContent: formattedCourseContentData,
    };

    setCourseData(data);
    console.log('Course Data:', data);
  };

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
            course={courseInfo}
            setCourse={setCourseInfo}
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
            courseContentData={courseContentData}
            setCourseContentData={setCourseContentData}
            handleSubmit={handleSubmit}
          />
        )}
      </div>

    </div>
  );
};

export default CreateCourse;
