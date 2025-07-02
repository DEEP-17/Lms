import { CourseFormData, StepValidation } from '@/types/course';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import React, { FC } from 'react';

export type TitleItem = { title: string };

type Props = {
    benefits: TitleItem[];
    prerequisites: TitleItem[];
    setBenefits: (benefits: TitleItem[]) => void;
    setPrerequisites: (prerequisites: TitleItem[]) => void;
    onNext?: () => void;
    onPrevious?: () => void;
    validation?: StepValidation;
    courseInfo: CourseFormData;
    setCourseInfo: (info: CourseFormData) => void;
};

const CourseData: FC<Props> = ({
    benefits,
    prerequisites,
    setBenefits,
    setPrerequisites,
    onNext,
    onPrevious,
    validation,
    courseInfo,
    setCourseInfo
}) => {
    const RequiredStar = () => <span className="text-red-500 ml-1">*</span>;

    return (
        <div className='w-full max-w-4xl mx-auto mt-8 p-8 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-xl border border-gray-200/50 dark:border-slate-700/50 transition-all duration-300'>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Course Benefits/Prerequisites</h1>
                <p className="text-gray-600 dark:text-gray-400">Define what students will learn and what they need to know</p>

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

            {/* Category */}
            <div className="mb-8">
                <label className="block text-xl font-semibold mb-6 text-gray-900 dark:text-white transition-colors duration-300">
                    Course Category <RequiredStar />
                </label>
                <select
                    required
                    value={courseInfo.level}
                    onChange={(e) => setCourseInfo({ ...courseInfo, level: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300"
                >
                    <option value="">Select a category</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Complex">Complex</option>
                </select>
            </div>

            {/* Benefits */}
            <div className="mb-12">
                <label className="block text-xl font-semibold mb-6 text-gray-900 dark:text-white transition-colors duration-300">
                    What are the benefits of studying this course? <RequiredStar />
                </label>
                <div className="space-y-4">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="relative group">
                            <input
                                name='benefit'
                                type="text"
                                value={benefit.title}
                                onChange={(e) => {
                                    const newBenefits = [...benefits];
                                    newBenefits[index].title = e.target.value;
                                    setBenefits(newBenefits);
                                }}
                                placeholder={`Benefit ${index + 1}`}
                                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-sm text-gray-400 dark:text-gray-500">#{index + 1}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => setBenefits([...benefits, { title: '' }])}
                    className="mt-4 flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg transition-all duration-300 group cursor-pointer"
                >
                    <AddCircleIcon className="w-5 h-5" />
                    <span className="font-medium">Add Benefit</span>
                </button>
            </div>

            {/* Prerequisites */}
            <div className="mb-12">
                <label className="block text-xl font-semibold mb-6 text-gray-900 dark:text-white transition-colors duration-300">
                    What are the prerequisites of studying this course? <RequiredStar />
                </label>
                <div className="space-y-4">
                    {prerequisites.map((prerequisite, index) => (
                        <div key={index} className="relative group">
                            <input
                                name='prerequisite'
                                type="text"
                                value={prerequisite.title}
                                onChange={(e) => {
                                    const newPrerequisites = [...prerequisites];
                                    newPrerequisites[index].title = e.target.value;
                                    setPrerequisites(newPrerequisites);
                                }}
                                placeholder={`Prerequisite ${index + 1}`}
                                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-sm text-gray-400 dark:text-gray-500">#{index + 1}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => setPrerequisites([...prerequisites, { title: '' }])}
                    className="mt-4 flex items-center space-x-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg transition-all duration-300 group cursor-pointer"
                >
                    <AddCircleIcon className="w-5 h-5" />
                    <span className="font-medium">Add Prerequisite</span>
                </button>
            </div>

            {/* Navigation Buttons */}
            <div className='w-full flex items-center justify-between pt-8 border-t border-gray-200 dark:border-slate-700'>
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
    );
};

export default CourseData;
