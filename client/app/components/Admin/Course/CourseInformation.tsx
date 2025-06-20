'use client'
import { styles } from '@/app/styles/style';
import React, { FC, useState } from 'react';

type Props = {
    course: any;
    setCourse: (course: any) => void;
    active: number;
    setActive: (active: number) => void;
}

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
        <div className='w-[80%] m-auto mt-24 min-h-screen p-8 rounded-lg bg-white dark:bg-slate-900 transition-colors duration-300'>
            <form onSubmit={handleSubmit} className={`${styles.label}`}>

                {/* Course Title */}
                <div>
                    <label className="text-gray-900 dark:text-white transition-colors duration-300">
                        Course Title
                    </label>
                    <input
                        type="text"
                        required
                        value={course.title}
                        onChange={(e) => setCourse({ ...course, title: e.target.value })}
                        placeholder='Enter Course Title'
                        className={`${styles.input}`}
                    />
                </div>

                <br />

                {/* Description */}
                <div className='mb-5'>
                    <label className="text-gray-900 dark:text-white transition-colors duration-300">
                        Course Description
                    </label>
                    <textarea
                        required
                        value={course.description}
                        onChange={(e) => setCourse({ ...course, description: e.target.value })}
                        placeholder='Enter Course Description'
                        className={`${styles.input}`}
                    />
                </div>

                <br />

                {/* Category + Price */}
                <div className='w-full flex gap-5'>
                    <div className='w-[50%]'>
                        <label className="text-gray-900 dark:text-white transition-colors duration-300">
                            Category
                        </label>
                        <input
                            type="text"
                            required
                            value={course.category}
                            onChange={(e) => setCourse({ ...course, category: e.target.value })}
                            placeholder='Enter Course Category'
                            className={`${styles.input}`}
                        />
                    </div>
                    <div className='w-[50%]'>
                        <label className="text-gray-900 dark:text-white transition-colors duration-300">
                            Price
                        </label>
                        <input
                            type="number"
                            required
                            value={course.price}
                            onChange={(e) => setCourse({ ...course, price: e.target.value })}
                            placeholder='Enter Course Price'
                            className={`${styles.input}`}
                        />
                    </div>
                </div>

                <br />

                {/* Expected Price + Level */}
                <div className='w-full flex gap-5'>
                    <div className='w-[50%]'>
                        <label className="text-gray-900 dark:text-white transition-colors duration-300">
                            Expected Price
                        </label>
                        <input
                            type="number"
                            value={course.estimatedPrice}
                            onChange={(e) => setCourse({ ...course, estimatedPrice: e.target.value })}
                            placeholder='Enter Expected Price'
                            className={`${styles.input}`}
                        />
                    </div>
                    <div className='w-[50%]'>
                        <label className="text-gray-900 dark:text-white transition-colors duration-300">
                            Course Level
                        </label>
                        <select
                            value={course.level}
                            onChange={(e) => setCourse({ ...course, level: e.target.value })}
                            className={`${styles.input} text-gray-900 dark:text-white bg-white dark:bg-slate-800 transition-colors duration-300`}
                        >
                            <option value="">Select Level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>
                </div>

                <br />

                {/* Demo URL */}
                <div className='mb-5'>
                    <label className="text-gray-900 dark:text-white transition-colors duration-300">
                        Demo URL
                    </label>
                    <input
                        type="url"
                        value={course.demoUrl}
                        onChange={(e) => setCourse({ ...course, demoUrl: e.target.value })}
                        placeholder='Enter Demo URL'
                        className={`${styles.input}`}
                    />
                </div>

                <br />

                {/* Thumbnail Upload */}
                <div className='w-full'>
                    <input
                        type="file"
                        accept="image/*"
                        id='file'
                        className='hidden'
                        onChange={handleFileChange}
                    />
                    <label
                        htmlFor="file"
                        className={`w-full h-[200px] flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer relative transition-colors duration-300 ${dragging ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-transparent'}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {course.thumbnail ? (
                            <img src={course.thumbnail} alt="Course Thumbnail" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                            <span className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500 transition-colors duration-300">
                                Upload Image
                            </span>
                        )}
                    </label>
                </div>

                <br />

                {/* Next Button */}
                <div className='w-full flex justify-center'>
                    <input
                        type="submit"
                        value='Next'
                        className="w-[200px] py-2 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-lg text-white font-bold text-center cursor-pointer transition-colors duration-300"
                    />
                </div>

                <br /><br />

            </form>
        </div>
    );
};

export default CourseInformation;
