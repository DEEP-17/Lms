'use client';

import { CourseFormData, StepValidation } from '@/types/course';
import React, { FC, useState } from 'react';

type Props = {
    course: CourseFormData;
    setCourse: (course: CourseFormData) => void;
    active: number;
    setActive: (active: number) => void;
    onNext?: () => void;
    onPrevious?: () => void;
    validation?: StepValidation;
};

const CourseInformation: FC<Props> = ({
    course,
    setCourse,
    active,
    setActive,
    onNext,
    onPrevious,
    validation
}) => {
    const [dragging, setDragging] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onNext) {
            onNext();
        } else {
            setActive(active + 1);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCourse({ ...course, thumbnail: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCourse({ ...course, thumbnail: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const RequiredStar = () => <span className="text-red-500 ml-1">*</span>;

    return (
        <div className='w-full max-w-4xl mx-auto mt-8 p-8 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-xl border border-gray-200/50 dark:border-slate-700/50 transition-all duration-300'>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Course Information</h1>
                <p className="text-gray-600 dark:text-gray-400">Fill in the basic details of your course</p>

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

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Course Title */}
                <div className="space-y-3">
                    <label className="block text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                        Course Title <RequiredStar />
                    </label>
                    <input
                        type="text"
                        required
                        value={course.name}
                        onChange={(e) => setCourse({ ...course, name: e.target.value })}
                        placeholder='Enter Course Title'
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300"
                    />
                </div>

                {/* Description */}
                <div className="space-y-3">
                    <label className="block text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                        Course Description <RequiredStar />
                    </label>
                    <textarea
                        required
                        value={course.description}
                        onChange={(e) => setCourse({ ...course, description: e.target.value })}
                        placeholder='Enter Course Description'
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300 resize-none"
                    />
                </div>

                {/* Tags */}
                <div className="space-y-3">
                    <label className="block text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                        Tags
                    </label>
                    <input
                        type="text"
                        value={course.tags}
                        onChange={(e) => setCourse({ ...course, tags: e.target.value })}
                        placeholder='Enter Course Tags (comma separated)'
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300"
                    />
                </div>

                {/* Price */}
                <div className="space-y-3">
                    <label className="block text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                        Price <RequiredStar />
                    </label>
                    <input
                        type="number"
                        required
                        value={course.price}
                        onChange={(e) => setCourse({ ...course, price: e.target.value })}
                        placeholder='Enter Course Price'
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300"
                    />
                </div>

                {/* Expected Price */}
                <div className="space-y-3">
                    <label className="block text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                        Expected Price
                    </label>
                    <input
                        type="number"
                        value={course.estimatedPrice}
                        onChange={(e) => setCourse({ ...course, estimatedPrice: e.target.value })}
                        placeholder='Enter Expected Price'
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300"
                    />
                </div>

                {/* Demo URL */}
                <div className="space-y-3">
                    <label className="block text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                        Demo URL
                    </label>
                    <input
                        type="url"
                        value={course.demoUrl}
                        onChange={(e) => setCourse({ ...course, demoUrl: e.target.value })}
                        placeholder='Enter Demo URL'
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300"
                    />
                </div>

                {/* Thumbnail Upload */}
                <div className="space-y-3">
                    <label className="block text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                        Course Thumbnail
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        id='file'
                        className='hidden'
                        onChange={handleFileChange}
                    />
                    <label
                        htmlFor="file"
                        className={`w-full h-[250px] flex items-center justify-center border-2 border-dashed rounded-xl cursor-pointer relative transition-all duration-300 group ${dragging
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-slate-700/50'
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {course.thumbnail ? (
                            <img
                                src={course.thumbnail as string}
                                alt="Course Thumbnail"
                                className="w-full h-full object-cover rounded-xl"
                            />
                        ) : (
                            <div className="text-center">
                                <div className="text-4xl text-gray-400 dark:text-gray-500 mb-4">📷</div>
                                <p className="text-gray-600 dark:text-gray-400 font-medium">Drag and drop an image here, or click to select</p>
                                <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Recommended: 1280x720 pixels</p>
                            </div>
                        )}
                    </label>
                </div>

                {/* Navigation Buttons */}
                <div className='w-full flex items-center justify-between pt-8 border-t border-gray-200 dark:border-slate-700'>
                    <button
                        type="button"
                        onClick={onPrevious}
                        className='px-6 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-xl flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold transition-all duration-300 hover:shadow-md'
                    >
                        ← Previous
                    </button>

                    <button
                        type="submit"
                        className='px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl flex items-center justify-center text-white font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5'
                    >
                        Next →
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CourseInformation;
