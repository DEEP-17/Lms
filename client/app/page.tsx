'use client'
import React,{FC,useState} from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import NavItems from "./utils/NavItems";
interface Props{}
const Page: FC<Props>=(props)=>{
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  //re
  return (
    <div>
      <Heading
      title="Elearning"
      description="Elearning is a platform for students to learning and get help from teachers"
      keywords="Programming, JavaScript, React, Next.js, Elearning, Education, Online Learning"
      />
      <Header 
      open={open}
      setOpen={setOpen}
      activeItem={activeItem}
      />
      <NavItems activeItem={0} isMobile={false}></NavItems>
    </div>
  );
};
export default Page;