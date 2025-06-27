import React from 'react';
import Header from '../components/Header';
import AboutUs from '../components/Landing/AboutUs';

const AboutUsPage = () => (
   <>
      <Header activeItem={-1} route="" />
      <main className="">
         <AboutUs />
      </main>
   </>
);

export default AboutUsPage; 