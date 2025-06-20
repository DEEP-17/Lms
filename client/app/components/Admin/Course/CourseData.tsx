import React, { FC } from 'react'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import {styles} from '@app/styles/style';
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
const CourseData:FC<Props> = ({
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
    <div className='w-[80%] m-auto mt-24 block'>
        <div>
           <label className="block text-[20px] font-semibold mb-2">
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
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
        ))}
        <AddCircleIcon 
        stlye={{margin:'10px opx', cursor:'pointer',width:'30px', height:'30px'}}
        onClick={() => {
            setbenefits([...benefits, { title: '' }]);
        }}
        className=''
        />
        </div>
        <div>
           <label className="block text-[20px] font-semibold mb-2">
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
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
        ))}
        <AddCircleIcon 
        stlye={{margin:'10px opx', cursor:'pointer',width:'30px', height:'30px'}}
        onClick={() => {
            setPrerequisites([...prerequisites, { title: '' }]);
        }}
        className=''
        />
        </div>
        <div className='w-full flex items-center justify-between'
        >
            <div
            className='w-[100px] h-[40px] bg-[#0c22e4] rounded-lg flex items-center justify-center text-[20px] font-semibold cursor-pointer'
            onClick={()=>setActive(active-1)}
            >Previous</div>
            <div
            className='w-[100px] h-[40px] bg-[#39e91a] rounded-lg flex items-center justify-center text-[20px] font-semibold cursor-pointer'
            onClick={()=>{if(benefits[benefits.length-1].title !== '' && prerequisites[prerequisites.length-1].title !== '') {setActive(active+1)}
            else
            {
                toast.error('Please fill all the fields before proceeding');
            }
    }}>Next</div>
        </div>
    </div>
  )
}

export default CourseData