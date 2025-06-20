import React, { FC } from 'react';
import { IoMdCheckmark } from 'react-icons/io';

type Props = {
  active: number;
  setActive: (active: number) => void;
};

const CourseOptions: FC<Props> = ({ active, setActive }) => {
  const options = [
    'Course Information',
    'Course Options',
    'Course Content',
    'Course preview',
  ];

  return (
    <div className="transition-colors duration-300">
      {options.map((option: string, index: number) => (
        <div key={index} className="w-full flex py-5">
          <div
            className={`w-[35px] h-[35px] rounded-full flex items-center justify-center relative transition-colors duration-300
              ${active + 1 > index ? "bg-blue-500" : "bg-gray-300 dark:bg-slate-700"}`}
          >
            <IoMdCheckmark className={`text-[25px] ${active + 1 > index ? 'text-white' : 'text-gray-500 dark:text-gray-300'} transition-colors duration-300`} />
            {index !== options.length - 1 && (
              <div
                className={`absolute h-[30px] w-1 bottom-[-100%] transition-colors duration-300
                  ${active + 1 > index ? "bg-blue-500" : "bg-gray-300 dark:bg-slate-700"}`}
              />
            )}
          </div>
          <h5
            className={`pl-3 text-[18px] font-semibold cursor-pointer transition-colors duration-300
              ${active === index ? "text-blue-500" : "text-gray-700 dark:text-gray-300"}`}
            onClick={() => setActive(index)}
          >
            {option}
          </h5>
        </div>
      ))}
    </div>
  );
};

export default CourseOptions;