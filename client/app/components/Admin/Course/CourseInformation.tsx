import { styles } from '@/app/styles/style';
import React, { FC, useState } from 'react'

type Props = {
    course: any;
    setCourse:(course:any)=> void;
    active: number;
    setActive: (active: number) => void;
}

const CourseInformation:FC<Props> = ({course, setCourse, active, setActive}) => {
    const [dragging, setDragging] = useState(0);
    const handleSubmit = (e:any) => {
        e.preventDefault();
        setActive(active + 1);
    }
  return (
    <div className='w-[80%] m-auto mt-24'>

        <form onSubmit={handleSubmit} className={`${styles.label}`}>
            <div>
                <label htmlFor="">
            Course Name
        </label>
        <input type="name"
        required
        value={course.name}
        onChange={(e) => setCourse({...course, name: e.target.value})
    }
    id='name'
    placeholder='Enter Course Name'
    className={`${styles.input}`}
        />
            </div>
        <br />
        <div className='mb-5'>
            <label className={`${styles.label}`}>Course Description</label>
            <textarea
                required
                value={course.description}
                onChange={(e) => setCourse({...course, description: e.target.value})
            }
            id='description'
            placeholder='Enter Course Description'
            className={`${styles.input}`}
            />
        </div>
        <br />
        <div className='w-full flex gap-5'>
            <div className='w-[50%]'>
                <label className={`${styles.label}`}>Category</label>
                <input type="text"
                required
                value={course.category}
                onChange={(e) => setCourse({...course, category: e.target.value})
            }
            id='category'
            placeholder='Enter Course Category'
            className={`${styles.input}`}
                />
            </div>
            <div className='w-[50%]'>
                <label className={`${styles.label}`}>Price</label>
                <input type="number"
                required
                value={course.price}
                onChange={(e) => setCourse({...course, price: e.target.value})
            }
            id='price'
            placeholder='Enter Course Price'
            className={`${styles.input}`}
                />
            </div>
        </div>
        </form>
    </div>
  )
}

export default CourseInformation