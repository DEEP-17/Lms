'use client';

import { useCreateCourseMutation, useEditCourseMutation } from '@/redux/features/api/apiSlice';
import { CourseFormData, CourseStepStatus, StepValidation } from '@/types/course';
import { CheckCircle, Menu, Save } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import CourseContent from './CourseContent';
import CourseData from './CourseData';
import CourseInformation from './CourseInformation';
import CourseOptions from './CourseOptions';
import CoursePreview from './CoursePreview';

interface CreateCourseProps {
  isEditMode?: boolean;
  courseId?: string;
  initialCourseData?: CourseFormData;
  onSuccess?: () => void;
  onRefetch?: () => void;
}

const CreateCourse: React.FC<CreateCourseProps> = ({
  isEditMode = false,
  courseId,
  initialCourseData,
  onSuccess,
  onRefetch
}) => {
  const [active, setActive] = useState<number>(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showCourseOptionsMobile, setShowCourseOptionsMobile] = useState(false);
  const [showValidation, setShowValidation] = useState<{ [key: number]: boolean }>({ 0: false, 1: false, 2: false, 3: false });

  const [courseInfo, setCourseInfo] = useState<CourseFormData>({
    name: '', description: '', level: '', price: '', estimatedPrice: '', tags: '', demoUrl: '', thumbnail: '',
    ratings: 0, purchased: 0,
    benefits: [{ title: '' }], prerequisites: [{ title: '' }],
    courseContent: [{ id: '1', title: '', components: [{ id: '1', videoTitle: '', videoUrl: '', videoDescription: '', links: [{ id: '1', title: '', url: '' }] }] }]
  });

  const [stepStatus, setStepStatus] = useState<CourseStepStatus>({
    step0: { isCompleted: false, isSaved: false, errors: [] },
    step1: { isCompleted: false, isSaved: false, errors: [] },
    step2: { isCompleted: false, isSaved: false, errors: [] },
    step3: { isCompleted: false, isSaved: false, errors: [] },
  });

  const [createCourse] = useCreateCourseMutation();
  const [editCourse] = useEditCourseMutation();

  useEffect(() => {
    if (isEditMode && initialCourseData) {
      const transformCourseData = (courseData: Array<any>) => courseData.map((item: any, index: number) => ({
        id: item._id || `section-${index + 1}`,
        title: item.title || item.videoSection || '',
        components: [{
          id: item._id || `component-${index + 1}`,
          videoTitle: item.title || '',
          videoUrl: item.videoUrl || '',
          videoDescription: item.description || '',
          links: item.links?.map((link: any, idx: number) => ({ id: link._id || `link-${idx + 1}`, title: link.title || '', url: link.url || '' })) || [{ id: '1', title: '', url: '' }]
        }]
      }));

      const courseDataWithDefaults: CourseFormData = {
        ...initialCourseData,
        thumbnail:
          typeof initialCourseData.thumbnail === 'object' && initialCourseData.thumbnail !== null
            ? initialCourseData.thumbnail
            : typeof initialCourseData.thumbnail === 'string'
              ? initialCourseData.thumbnail
              : '',
        courseContent: initialCourseData.courseData?.length
          ? transformCourseData(initialCourseData.courseData)
          : initialCourseData.courseContent || courseInfo.courseContent,
        benefits: Array.isArray(initialCourseData.benefits) && initialCourseData.benefits.length
          ? initialCourseData.benefits
          : [{ title: '' }],
        prerequisites: Array.isArray(initialCourseData.prerequisites) && initialCourseData.prerequisites.length
          ? initialCourseData.prerequisites
          : [{ title: '' }]
      };

      setCourseInfo(courseDataWithDefaults);
      setStepStatus({
        step0: validateStep0(courseDataWithDefaults),
        step1: validateStep1(courseDataWithDefaults),
        step2: validateStep2(courseDataWithDefaults),
        step3: { isCompleted: true, isSaved: true, errors: [] },
      });
    }
  }, [isEditMode, initialCourseData]);

  const validateStep0 = (course = courseInfo): StepValidation => {
    const errors: string[] = [];
    if (!course.name.trim()) errors.push('Course title is required');
    if (!course.description.trim()) errors.push('Course description is required');
    if (!course.price) errors.push('Course price is required');
    return { isCompleted: errors.length === 0, isSaved: stepStatus.step0.isSaved, errors };
  };

  const validateStep1 = (course = courseInfo): StepValidation => {
    const errors: string[] = [];
    const benefits = course.benefits || [];
    const prerequisites = course.prerequisites || [];
    const hasValidBenefits = benefits.some((b) => b.title.trim() !== '');
    const hasValidPrerequisites = prerequisites.some((p) => p.title.trim() !== '');
    if (!course.level.trim()) errors.push('Course category is required');
    if (!hasValidBenefits) errors.push('At least one benefit is required');
    if (!hasValidPrerequisites) errors.push('At least one prerequisite is required');
    return { isCompleted: errors.length === 0, isSaved: stepStatus.step1.isSaved, errors };
  };

  const validateStep2 = (course = courseInfo): StepValidation => {
    const errors: string[] = [];
    if (!Array.isArray(course.courseContent) || course.courseContent.length === 0) {
      errors.push('At least one course section is required');
    } else {
      course.courseContent.forEach((section, idx) => {
        if (!section.title.trim()) errors.push(`Section ${idx + 1} title is required`);
        const component = section.components[0];
        if (!component.videoTitle.trim()) errors.push(`Video title missing in section ${idx + 1}`);
        if (!component.videoUrl.trim()) errors.push(`Video URL missing in section ${idx + 1}`);
      });
    }
    return { isCompleted: errors.length === 0, isSaved: stepStatus.step2.isSaved, errors };
  };

  const handleSubmit = async () => {
    const safeContent = courseInfo.courseContent?.length ? courseInfo.courseContent : courseInfo.courseContent;
    const payload = {
      ...courseInfo,
      price: Number(courseInfo.price),
      estimatedPrice: courseInfo.estimatedPrice ? Number(courseInfo.estimatedPrice) : undefined,
      courseData: safeContent.map(section => ({
        title: section.title,
        description: section.components[0].videoDescription,
        videoUrl: section.components[0].videoUrl,
        videoThumbnail: {},
        videoSection: section.title,
        videoLength: 0,
        videoPlayer: '',
        links: section.components[0].links || [],
        suggestion: '',
        questions: []
      }))
    };

    if (isEditMode && courseId) {
      const isNewThumbnail = (
        typeof courseInfo.thumbnail === 'string' &&
        typeof initialCourseData?.thumbnail === 'object' &&
        initialCourseData?.thumbnail?.url !== courseInfo.thumbnail
      );
      if (isNewThumbnail) {
        payload.newThumbnail = courseInfo.thumbnail;
        payload.thumbnail = initialCourseData.thumbnail;
      }

      try {
        await editCourse({ id: courseId, data: { ...payload, price: String(payload.price), estimatedPrice: String(payload.estimatedPrice || '') } }).unwrap();
        toast.success('Course updated successfully!');
        onSuccess?.();
        onRefetch?.();
      } catch (err) {
        toast.error('Failed to update course');
      }
    } else {
      try {
        await createCourse(payload).unwrap();
        toast.success('Course created successfully!');
        onSuccess?.();
        onRefetch?.();
      } catch (err) {
        toast.error('Failed to create course');
      }
    }
  };

  const handleSidebarToggle = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
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
              {isEditMode ? 'Edit Course' : 'Create Course'} - Step {active + 1} of 4
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
              className="flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-cyan-50 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-300 font-semibold transition cursor-pointer"
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
              isEditMode={isEditMode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
