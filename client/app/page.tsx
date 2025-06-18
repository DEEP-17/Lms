'use client'
import React, { FC, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";
import Heading from "./utils/Heading";
import Footer from "./components/Footer";
type Props = Record<string, never>;
const Page: FC<Props> = () => {
  const [open, setOpen] = useState(false);
  const [activeItem] = useState(0);

  const [route, setRoute] = useState("Login");
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
        setRoute={setRoute}
        route={route}
      />
      <Hero />
      <Footer/>
    </div>
  );
};
export default Page;