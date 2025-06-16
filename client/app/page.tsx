'use client'
import React, { FC, useState } from "react";
import Header from "./components/Header";
import Heading from "./components/utils/Heading";
import Hero from "./components/Route/Hero";
type Props = Record<string, never>;
const Page: FC<Props> = () => {
  const [open, setOpen] = useState(false);
  const [activeItem] = useState(0);

  const [route, setRoute] = useState("Login");
  return (
    <div className="h-screen">
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
    </div>
  );
};
export default Page;