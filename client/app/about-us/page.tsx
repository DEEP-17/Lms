import React from 'react';
import Header from '../components/Header';
import AboutUs from '../components/Landing/AboutUs';
import Footer from '../components/Footer';

const AboutUsPage = () => (
   <>
      <Header activeItem={-1} route="" />
      <main className="">
         <AboutUs />
      </main>
      <Footer/>
   </>
);

export default AboutUsPage; 