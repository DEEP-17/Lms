import { styles } from '@/app/styles/style';
import React, { FC, useState } from 'react';

type Props = {
    course: any;
    setCourse: (course: any) => void;
    active: number;
    setActive: (active: number) => void;
}

const CourseInformation: FC<Props> = ({ course, setCourse, active, setActive }) => {
    const [dragging, setDragging] = useState(0);
    const handleSubmit = (e: any) => {
        e.preventDefault();
        setActive(active + 1);
    }
    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = (e: any) => {
                if (reader.readyState === 2) {
                    setCourse({ ...course, thumbnail: e.target.result });
                }
            };
            reader.readAsDataURL(file);
        }
    };
    const handleDragOver = (e: any) => {
        e.preventDefault();
        setDragging(1);
    };
    const handleDragLeave = (e: any) => {
        e.preventDefault();
        setDragging(0);
    };
    const handleDrop = (e: any) => {
        e.preventDefault();
        setDragging(0);
        const file = e.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = (e: any) => {
                if (reader.readyState === 2) {
                    setCourse({ ...course, thumbnail: e.target.result });
                }
            };
            reader.readAsDataURL(file);
        }
    };
    return (
        <div className='w-[80%] m-auto mt-24 min-h-screen p-8 rounded-lg bg-white dark:bg-slate-900 transition-colors duration-300'>

            <form onSubmit={handleSubmit} className={`${styles.label}`}>
                <div>
                    <label htmlFor="" className="text-gray-900 dark:text-white transition-colors duration-300">
                        Course Name
                    </label>
                    <input type="name"
                        required
                        value={course.name}
                        onChange={(e) => setCourse({ ...course, name: e.target.value })}
                        id='name'
                        placeholder='Enter Course Name'
                        className={`${styles.input}`}
                    />
                </div>
                <br />
                <div className='mb-5'>
                    <label className={`${styles.label} text-gray-900 dark:text-white transition-colors duration-300`}>Course Description</label>
                    <textarea
                        required
                        value={course.description}
                        onChange={(e) => setCourse({ ...course, description: e.target.value })}
                        id='description'
                        placeholder='Enter Course Description'
                        className={`${styles.input}`}
                    />
                </div>
                <br />
                <div className='w-full flex gap-5'>
                    <div className='w-[50%]'>
                        <label className={`${styles.label} text-gray-900 dark:text-white transition-colors duration-300`}>Category</label>
                        <input
                            type="text"
                            required
                            value={course.category}
                            onChange={(e) => setCourse({ ...course, category: e.target.value })}
                            id='category'
                            placeholder='Enter Course Category'
                            className={`${styles.input}`}
                        />
                    </div>
                    <div className='w-[50%]'>
                        <label className={`${styles.label} text-gray-900 dark:text-white transition-colors duration-300`}>Price</label>
                        <input
                            type="number"
                            required
                            value={course.price}
                            onChange={(e) => setCourse({ ...course, price: e.target.value })}
                            id='price'
                            placeholder='Enter Course Price'
                            className={`${styles.input}`}
                        />
                    </div>
                </div>
                <br />
                <div className='w-full flex gap-5'>
                    <div className='w-[50%]'>
                        <label className={`${styles.label} text-gray-900 dark:text-white transition-colors duration-300`}>Expected Price</label>
                        <input
                            type="number"
                            value={course.expectedPrice || ''}
                            onChange={(e) => setCourse({ ...course, expectedPrice: e.target.value })}
                            id='expectedPrice'
                            placeholder='Enter Expected Price'
                            className={`${styles.input}`}
                        />
                    </div>
                    <div className='w-[50%]'>
                        <label className={`${styles.label} text-gray-900 dark:text-white transition-colors duration-300`}>Course Level</label>
                        <select
                            value={course.level || ''}
                            onChange={(e) => setCourse({ ...course, level: e.target.value })}
                            id='level'
                            className={`${styles.input} text-gray-900 dark:text-white bg-white dark:bg-slate-800 transition-colors duration-300`}
                        >
                            <option value="" className="text-gray-900 dark:text-white bg-white dark:bg-slate-800">Select Level</option>
                            <option value="Beginner" className="text-gray-900 dark:text-white bg-white dark:bg-slate-800">Beginner</option>
                            <option value="Intermediate" className="text-gray-900 dark:text-white bg-white dark:bg-slate-800">Intermediate</option>
                            <option value="Advanced" className="text-gray-900 dark:text-white bg-white dark:bg-slate-800">Advanced</option>
                        </select>
                    </div>
                </div>
                <br />
                <div className='mb-5'>
                    <label className={`${styles.label} text-gray-900 dark:text-white transition-colors duration-300`}>Demo URL</label>
                    <input
                        type="url"
                        value={course.demoUrl || ''}
                        onChange={(e) => setCourse({ ...course, demoUrl: e.target.value })}
                        id='demoUrl'
                        placeholder='Enter Demo URL'
                        className={`${styles.input}`}
                    />
                </div>
                <br />
                <div className='w-full'>
                    <input type="file"
                        accept="image/*"
                        id='file'
                        className='hidden'
                        onChange={handleFileChange}
                    />
                    <label htmlFor="file"
                        className={`w-full h-[200px] flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer relative transition-colors duration-300 ${dragging ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-transparent'}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {course.thumbnail ? (
                            <img src={course.thumbnail} alt="Course Thumbnail" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                            <span className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500 transition-colors duration-300">Upload Image</span>
                        )}
                    </label>
                </div>
                <br />
                <div className='w-full flex justify-center'>
                    <input type="submit"
                        value='Next'
                        className="w-[200px] py-2 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-lg text-white font-bold text-center cursor-pointer transition-colors duration-300"
                    />
                </div>
                <br />
                <br />

            </form>
        </div>
    )
}

export default CourseInformation;