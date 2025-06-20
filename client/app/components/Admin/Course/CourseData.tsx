import AddCircleIcon from '@mui/icons-material/AddCircle';
import React, { FC } from 'react';
import toast from 'react-hot-toast';
type Props = {
    benefits: { title: string }[];
    prerequisites: { title: string }[];
    setbenefits: (benefits: { title: string }[]) => void;
    setPrerequisites: (prerequisites: { title: string }[]) => void;
    active: number;
    setActive: (active: number) => void;
    // description: string;
    // setDescription: (description: string) => void;
}
const CourseData: FC<Props> = ({
    benefits,
    prerequisites,
    setbenefits,
    setPrerequisites,
    active,
    setActive,
    // description,
    // setDescription
}) => {
    return (
        <div className='w-[80%] m-auto mt-24 block bg-white dark:bg-slate-900 rounded-lg p-8 transition-colors duration-300'>
            <div>
                <label className="block text-[20px] font-semibold mb-2 text-gray-900 dark:text-white transition-colors duration-300">
                    What are the benefits of studying this course?
                </label>
                <br />
                {
                    benefits.map((benefit, index) => (
                        <div key={index} className="mb-4">
                            <input
                                key='index'
                                name='benefit'
                                type="text"
                                value={benefit.title}
                                onChange={(e) => {
                                    const newBenefits = [...benefits];
                                    newBenefits[index].title = e.target.value;
                                    setbenefits(newBenefits);
                                }}
                                placeholder={`Benefit ${index + 1}`}
                                className="w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded transition-colors duration-300"
                            />
                        </div>
                    ))}
                <AddCircleIcon
                    style={{ margin: '10px 0px', cursor: 'pointer', width: '30px', height: '30px' }}
                    onClick={() => {
                        setbenefits([...benefits, { title: '' }]);
                    }}
                    className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-300 cursor-pointer'
                />
            </div>
            <div>
                <label className="block text-[20px] font-semibold mb-2 text-gray-900 dark:text-white transition-colors duration-300">
                    What are the prerequisites of studying this course?
                </label>
                <br />
                {
                    prerequisites.map((prerequisite, index) => (
                        <div key={index} className="mb-4">
                            <input
                                key='index'
                                name='prerequisite'
                                type="text"
                                value={prerequisite.title}
                                onChange={(e) => {
                                    const newPrerequisites = [...prerequisites];
                                    newPrerequisites[index].title = e.target.value;
                                    setPrerequisites(newPrerequisites);
                                }}
                                placeholder={`prerequisites ${index + 1}`}
                                className="w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded transition-colors duration-300"
                            />
                        </div>
                    ))}
                <AddCircleIcon
                    style={{ margin: '10px 0px', cursor: 'pointer', width: '30px', height: '30px' }}
                    onClick={() => {
                        setPrerequisites([...prerequisites, { title: '' }]);
                    }}
                    className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-300 cursor-pointer'
                />
            </div>
            <div className='w-full flex items-center justify-between'>
                <div
                    className='w-[100px] h-[40px] bg-blue-700 dark:bg-blue-800 hover:bg-blue-800 dark:hover:bg-blue-900 rounded-lg flex items-center justify-center text-[20px] font-semibold text-white cursor-pointer transition-colors duration-300'
                    onClick={() => setActive(active - 1)}
                >Previous</div>
                <div
                    className='w-[100px] h-[40px] bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 rounded-lg flex items-center justify-center text-[20px] font-semibold text-white cursor-pointer transition-colors duration-300'
                    onClick={() => {
                        if (benefits[benefits.length - 1].title !== '' && prerequisites[prerequisites.length - 1].title !== '') { setActive(active + 1) }
                        else {
                            toast.error('Please fill all the fields before proceeding');
                        }
                    }}>Next</div>
            </div>
        </div>
    )
}

export default CourseData