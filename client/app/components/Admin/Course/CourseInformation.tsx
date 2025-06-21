'use client';

import { CourseFormData } from '@/types/course';
import React, { FC, useState } from 'react';

type Props = {
    course: CourseFormData;
    setCourse: (course: CourseFormData) => void;
    active: number;
    setActive: (active: number) => void;
};

const CourseInformation: FC<Props> = ({ course, setCourse, active, setActive }) => {
    const [dragging, setDragging] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setActive(active + 1);
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

    return (
        <div className='w-full max-w-4xl mx-auto mt-8 p-8 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-xl border border-gray-200/50 dark:border-slate-700/50 transition-all duration-300'>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Course Information</h1>
                <p className="text-gray-600 dark:text-gray-400">Fill in the basic details of your course</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Course Title */}
                <div className="space-y-3">
                    <label className="block text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                        Course Title *
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
                        Course Description *
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

                {/* Category + Price */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className="space-y-3">
                        <label className="block text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                            Category *
                        </label>
                        <input
                            type="text"
                            required
                            value={course.level}
                            onChange={(e) => setCourse({ ...course, level: e.target.value })}
                            placeholder='Enter Course Category'
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="block text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                            Price *
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
                </div>

                {/* Expected Price + Level */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
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
                    <div className="space-y-3">
                        <label className="block text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                            Course Level
                        </label>
                        <select
                            value={course.level}
                            onChange={(e) => setCourse({ ...course, level: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300"
                        >
                            <option value="">Select Level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>
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
                                src={typeof course.thumbnail === 'string' ? course.thumbnail : ''}
                                alt="Course Thumbnail"
                                className="w-full h-full object-cover rounded-xl"
                            />
                        ) : (
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 transition-colors duration-300">
                                    <svg className="w-8 h-8 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                                    Click to upload or drag and drop
                                </p>
                                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                    PNG, JPG, GIF up to 10MB
                                </p>
                            </div>
                        )}
                    </label>
                </div>

                {/* Next Button */}
                <div className='w-full flex justify-center pt-6'>
                    <button
                        type="submit"
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:ring-4 focus:ring-blue-500/30 outline-none"
                    >
                        Continue to Course Options
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CourseInformation;
