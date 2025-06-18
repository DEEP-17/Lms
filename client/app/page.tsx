'use client'
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import React, { FC, use, useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Categories from "./components/Landing/Categories";
import KnowledgeGuarantee from "./components/Landing/KnowledgeGuarantee";
import Newsletter from "./components/Landing/Newsletter";
import Testimonials from "./components/Landing/Testimonials";
import WhyTrustUs from "./components/Landing/WhyTrustUs";
import Hero from "./components/Route/Hero";
import Heading from "./utils/Heading";

type Props = Record<string, never>;
const Page: FC<Props> = () => {
  const [open, setOpen] = useState(false);
  const [activeItem] = useState(5);

  const [route, setRoute] = useState("Login");
  useLoadUserQuery(undefined);
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
      <KnowledgeGuarantee />
      <Categories />
      <WhyTrustUs />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  );
};
export default Page;