'use client';

import { useCreateCourseMutation } from '@/redux/features/api/apiSlice';
import { CourseFormData, CourseStepStatus, StepValidation } from '@/types/course';
import { Button } from '@mui/material';
import { CheckCircle, Menu, Save } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import CourseContent from './CourseContent';
import CourseData from './CourseData';
import CourseInformation from './CourseInformation';
import CourseOptions from './CourseOptions';
import CoursePreview from './CoursePreview';

const CreateCourse = () => {
  const [active, setActive] = useState<number>(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showCourseOptionsMobile, setShowCourseOptionsMobile] = useState(false);
  const [showValidation, setShowValidation] = useState<{ [key: number]: boolean }>({
    0: false,
    1: false,
    2: false,
    3: false
  });

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

  // Step validation and save status
  const [stepStatus, setStepStatus] = useState<CourseStepStatus>({
    step0: { isCompleted: false, isSaved: false, errors: [] },
    step1: { isCompleted: false, isSaved: false, errors: [] },
    step2: { isCompleted: false, isSaved: false, errors: [] },
    step3: { isCompleted: false, isSaved: false, errors: [] },
  });

  const [createCourse] = useCreateCourseMutation();

  const handleSubmit = async () => {
    // Transform courseInfo to match server expectations
    const payload: unknown = {
      ...courseInfo,
      price: Number(courseInfo.price),
      estimatedPrice: courseInfo.estimatedPrice ? Number(courseInfo.estimatedPrice) : undefined,
      courseData: courseInfo.courseContent.map(section => ({
        title: section.title,
        description: section.components[0]?.videoDescription || '',
        videoUrl: section.components[0]?.videoUrl || '',
        videoThumbnail: {}, // You may need to handle this if you support video thumbnails
        videoSection: section.title,
        videoLength: 0, // You may want to calculate or input this
        videoPlayer: '', // Set if you have this info
        links: section.components[0]?.links || [],
        suggestion: '', // Set if you have this info
        questions: [], // New course, so empty
      })),
      thumbnail: courseInfo.thumbnail, // If you need to upload to cloudinary, handle here
    };
    try {
      await createCourse(payload).unwrap();
      toast.success('Course created successfully!');
      // Reset all fields and redirect to step 1
      setCourseInfo({
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
      setStepStatus({
        step0: { isCompleted: false, isSaved: false, errors: [] },
        step1: { isCompleted: false, isSaved: false, errors: [] },
        step2: { isCompleted: false, isSaved: false, errors: [] },
        step3: { isCompleted: false, isSaved: false, errors: [] },
      });
      setActive(0);
      setShowValidation({ 0: false, 1: false, 2: false, 3: false });
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error &&
        'data' in error &&
        (error as { data?: { message?: string } }).data?.message
      ) {
        toast.error((error as { data?: { message?: string } }).data?.message ?? 'An error occurred');
      } else {
        toast.error('Failed to create course');
      }
    }
  };

  const handleSidebarToggle = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  // Validate step 0 (Course Information)
  const validateStep0 = (): StepValidation => {
    const errors: string[] = [];
    if (!courseInfo.name.trim()) errors.push('Course title is required');
    if (!courseInfo.description.trim()) errors.push('Course description is required');
    if (!courseInfo.price) errors.push('Course price is required');

    return {
      isCompleted: errors.length === 0,
      isSaved: stepStatus.step0.isSaved,
      errors
    };
  };

  // Validate step 1 (Course Benefits/Prerequisites)
  const validateStep1 = (): StepValidation => {
    const errors: string[] = [];
    const hasValidBenefits = courseInfo.benefits.some(benefit => benefit.title.trim() !== '');
    const hasValidPrerequisites = courseInfo.prerequisites.some(prereq => prereq.title.trim() !== '');
    if (!courseInfo.level.trim()) errors.push('Course category is required');

    if (!hasValidBenefits) errors.push('At least one benefit is required');
    if (!hasValidPrerequisites) errors.push('At least one prerequisite is required');

    return {
      isCompleted: errors.length === 0,
      isSaved: stepStatus.step1.isSaved,
      errors
    };
  };

  // Validate step 2 (Course Content)
  const validateStep2 = (): StepValidation => {
    const errors: string[] = [];
    if (!courseInfo.courseContent[0]?.title.trim()) errors.push('Section title is required');
    if (!courseInfo.courseContent[0]?.components[0]?.videoTitle.trim()) errors.push('Video title is required');
    if (!courseInfo.courseContent[0]?.components[0]?.videoUrl.trim()) errors.push('Video URL is required');

    return {
      isCompleted: errors.length === 0,
      isSaved: stepStatus.step2.isSaved,
      errors
    };
  };

  // Save current step
  const saveCurrentStep = () => {
    // Show validation for this step
    setShowValidation(prev => ({ ...prev, [active]: true }));

    let currentValidation: StepValidation;

    switch (active) {
      case 0:
        currentValidation = validateStep0();
        break;
      case 1:
        currentValidation = validateStep1();
        break;
      case 2:
        currentValidation = validateStep2();
        break;
      case 3:
        currentValidation = { isCompleted: true, isSaved: true, errors: [] };
        break;
      default:
        currentValidation = { isCompleted: false, isSaved: false, errors: [] };
    }

    if (currentValidation.isCompleted) {
      setStepStatus(prev => ({
        ...prev,
        [`step${active}` as keyof CourseStepStatus]: {
          ...currentValidation,
          isSaved: true
        }
      }));
      toast.success(`Step ${active + 1} saved successfully!`);
    } else {
      toast.error(`Please fix the following errors: ${currentValidation.errors.join(', ')}`);
    }
  };

  // Navigate to next step
  const goToNextStep = () => {
    // Show validation for this step
    setShowValidation(prev => ({ ...prev, [active]: true }));

    let currentValidation: StepValidation;

    switch (active) {
      case 0:
        currentValidation = validateStep0();
        break;
      case 1:
        currentValidation = validateStep1();
        break;
      case 2:
        currentValidation = validateStep2();
        break;
      case 3:
        currentValidation = { isCompleted: true, isSaved: true, errors: [] };
        break;
      default:
        currentValidation = { isCompleted: false, isSaved: false, errors: [] };
    }

    if (!currentValidation.isCompleted) {
      toast.error('Please complete all required fields before proceeding');
      return;
    }

    // Mark current step as completed and saved
    setStepStatus(prev => ({
      ...prev,
      [`step${active}` as keyof CourseStepStatus]: {
        ...currentValidation,
        isSaved: true
      }
    }));

    setActive(active + 1);
  };

  // Navigate to previous step
  const goToPreviousStep = () => {
    setActive(active - 1);
  };

  // Check if step is accessible
  const isStepAccessible = (stepIndex: number): boolean => {
    if (stepIndex === 0) return true;

    const previousStepKey = `step${stepIndex - 1}` as keyof CourseStepStatus;
    const previousStep = stepStatus[previousStepKey];

    return previousStep.isCompleted && previousStep.isSaved;
  };

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-300 overflow-x-hidden">
      {/* Course Options Sidebar - Desktop */}
      <div className={`hidden lg:block transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-[280px]'} flex-shrink-0 h-full overflow-y-auto border-r border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg`}>
        <CourseOptions
          active={active}
          setActive={setActive}
          onToggle={handleSidebarToggle}
          stepStatus={stepStatus}
          isStepAccessible={isStepAccessible}
        />
      </div>

      {/* Course Options Sidebar - Mobile Overlay */}
      {showCourseOptionsMobile && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 max-w-[80vw] h-full bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto border-r border-gray-200 dark:border-slate-700">
            <CourseOptions
              active={active}
              setActive={setActive}
              onToggle={() => setShowCourseOptionsMobile(false)}
              stepStatus={stepStatus}
              isStepAccessible={isStepAccessible}
            />
          </div>
          <div className="flex-1 bg-black/40 cursor-pointer" onClick={() => setShowCourseOptionsMobile(false)} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-full min-w-0">
        {/* Mobile toggle button for course options */}
        <button
          className="lg:hidden flex items-center gap-2 px-4 py-2 mb-4 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-all cursor-pointer"
          onClick={() => setShowCourseOptionsMobile(true)}
        >
          <Menu size={20} />
          Course Steps
        </button>

        {/* Step Header with Save Button */}
        <div className="flex items-center justify-between mb-6 p-4 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Step {active + 1} of 4
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {active === 0 && 'Course Information'}
              {active === 1 && 'Course Benefits/Prerequisites'}
              {active === 2 && 'Course Content'}
              {active === 3 && 'Course Preview'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {stepStatus[`step${active}` as keyof CourseStepStatus]?.isSaved && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle size={16} />
                <span className="text-sm font-medium">Saved</span>
              </div>
            )}
            <button
              onClick={saveCurrentStep}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all cursor-pointer"
            >
              <Save size={16} />
              Save Step
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {active === 0 && (
            <CourseInformation
              course={courseInfo}
              setCourse={setCourseInfo}
              active={active}
              setActive={setActive}
              onNext={goToNextStep}
              onPrevious={goToPreviousStep}
              validation={showValidation[0] ? validateStep0() : undefined}
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
              onNext={goToNextStep}
              onPrevious={goToPreviousStep}
              validation={showValidation[1] ? validateStep1() : undefined}
              courseInfo={courseInfo}
              setCourseInfo={setCourseInfo}
            />
          )}

          {active === 2 && (
            <CourseContent
              contentData={courseInfo.courseContent}
              setContentData={(updatedContent) =>
                setCourseInfo((prev) => ({ ...prev, courseContent: updatedContent }))
              }
              onNext={goToNextStep}
              onPrevious={goToPreviousStep}
              validation={showValidation[2] ? validateStep2() : undefined}
            />
          )}

          {active === 3 && (
            <CoursePreview
              course={courseInfo}
              onEdit={() => setActive(0)}
              onSubmit={handleSubmit}
              onPrevious={goToPreviousStep}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
