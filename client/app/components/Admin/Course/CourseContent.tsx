'use client';
import { ContentSectionData, StepValidation } from '@/types/course';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
// import toast from 'react-hot-toast';
import { Button } from '@mui/material';
import ContentSection from './ContentSection';

interface Props {
  contentData: ContentSectionData[];
  setContentData: (content: ContentSectionData[]) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  validation?: StepValidation;
}

const CourseContent: React.FC<Props> = ({
  contentData,
  setContentData,
  onNext,
  onPrevious,
  validation
}) => {
  const [sections, setSections] = useState<ContentSectionData[]>(contentData.length > 0 ? contentData : [
    {
      id: '1',
      title: 'Untitled Section',
      components: []
    }
  ]);

  const addSection = () => {
    const newSection: ContentSectionData = {
      id: Date.now().toString(),
      title: 'New Section',
      components: []
    };
    const updatedSections = [...sections, newSection];
    setSections(updatedSections);
    setContentData(updatedSections);
  };

  const updateSection = (updatedSection: ContentSectionData) => {
    const updatedSections = sections.map(section =>
      section.id === updatedSection.id ? updatedSection : section
    );
    setSections(updatedSections);
    setContentData(updatedSections);
  };

  const deleteSection = (sectionId: string) => {
    const updatedSections = sections.filter(section => section.id !== sectionId);
    setSections(updatedSections);
    setContentData(updatedSections);
  };

  // const saveContent = () => {
  //   console.log('Saving content:', sections);
  //   setContentData(sections);
  //   toast.success('Content saved successfully!');
  // };

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 p-8 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-xl border border-gray-200/50 dark:border-slate-700/50 transition-all duration-300">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Course Content</h1>
            <p className="text-gray-600 dark:text-gray-400">Organize your course content into sections and components</p>

            {/* Validation Errors */}
            {validation && validation.errors.length > 0 && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">Please fix the following errors:</h3>
                <ul className="list-disc list-inside text-red-700 dark:text-red-300 text-sm space-y-1">
                  {validation.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {sections.map((section) => (
          <ContentSection
            key={section.id}
            section={section}
            onUpdate={updateSection}
            onDelete={() => deleteSection(section.id)}
          />
        ))}

        {/* Add Section Button */}
        <button
          onClick={addSection}
          className="w-full p-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-300 group cursor-pointer"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-gray-100 dark:bg-slate-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 rounded-full transition-all duration-300">
              <Plus className="w-8 h-8 text-gray-400 group-hover:text-blue-500" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                Add New Section
              </h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Create a new content section for your course
              </p>
            </div>
          </div>
        </button>

        {/* Navigation */}
        <div className="w-full flex items-center justify-between pt-8 border-t border-gray-200 dark:border-slate-700">
          <button
            onClick={onPrevious}
            className='px-6 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-xl flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold transition-all duration-300 hover:shadow-md cursor-pointer'
          >
            ← Previous
          </button>
          <button
            onClick={onNext}
            className='px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl flex items-center justify-center text-white font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer'
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
