'use client'
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import React, { FC, useEffect, useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Categories from "./components/Landing/Categories";
import FAQ from "./components/Landing/FAQ";
import KnowledgeGuarantee from "./components/Landing/KnowledgeGuarantee";
import Newsletter from "./components/Landing/Newsletter";
import Testimonials from "./components/Landing/Testimonials";
import WhyTrustUs from "./components/Landing/WhyTrustUs";
import Hero from "./components/Route/Hero";
import Heading from "./utils/Heading";

type Props = Record<string, never>;

const Page: FC<Props> = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");

  useLoadUserQuery(undefined);

  // Section IDs in order
  const sectionIds = [
    "hero",
    "courses",
    "knowledge-guarantee",
    "categories",
    "why-trust-us",
    "testimonials",
    "faq",
    "newsletter"
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120; // Increased offset for header
      const bodyHeight = document.body.offsetHeight;

      // If near the bottom, highlight the last section
      if (window.innerHeight + window.scrollY >= bodyHeight - 10) {
        setActiveItem(sectionIds.length - 1);
        return;
      }

      // Find which section is currently in view
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const element = document.getElementById(sectionIds[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveItem(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page">
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
      <FAQ />
      <Newsletter />
      <Footer />
    </div>
  );
};
export default Page;