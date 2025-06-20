'use client'
import React from 'react'
import { useState } from 'react';
import CourseInformation from './CourseInformation';
import CourseOptions from './CourseOptions';
import CourseData from './CourseData';
import CourseContent from './CourseContent';
type Props = {}

const CreateCourse = (props: Props) => {
    const [active, setActive] = useState(2);
    const [course, setCourse] = useState({
        title: '',
        description: '',
        category: '',
        price: '',
        estimatedPrice:'',
        level: '',
        tags: '',
        demoUrl: '',
        thumbnail: '',
    });
    const [benefits, setBenefits] = useState([{title:""}]);
    const [prerequisites, setPrerequisites] = useState([{title:""}]);
    const [courseContentData, setCourseContentData] = useState([
        {
            videoUrl: '',
            title: '',
            description: '',
            videoSection: '',
            links:[
                {
                    title: '',
                    url: ''
                },
            ],
            suggestions:'',
        }
    ]);
    const [courseData, setCourseData] = useState({
    });
  return (
    <div className='w-full flex min-h-screen'>
       <div className="w-[80%]">
        {
          active === 0 && ( <CourseInformation  course={course} setCourse={setCourse}  active={active} setActive={setActive}/> )
        }
        {
          active === 1 && ( <CourseData  benefits={benefits} prerequisites={prerequisites} setbenefits={setBenefits} setPrerequisites={setPrerequisites} active={active} setActive={setActive} /> )
        }
         {
          active === 2 && ( <CourseContent active={active} setActive={setActive}
            courseContentData={courseContentData} setCourseContentData={setCourseContentData}
            handleSubmit={() => {
              if (courseContentData.length === 0) {
                toast.error('Please add at least one content item before proceeding');
              } else {
                setActive(active + 1);
              }
            }} />
        )}
       </div>
       <div className="w-[20%] mt-[100px] h-screen fixed z-[-1] top-18 right-0">
        <CourseOptions active={active} setActive={setActive}/>
       </div>
    </div>
  )
}

export default CreateCourse;