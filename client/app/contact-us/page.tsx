import React from 'react';
import Contact from '../components/Landing/Contact';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ContactUsPage = () => (
  <>
    <Header activeItem={3} route="" />
    <main className="">
      <Contact />
    </main>
    <Footer/>
  </>
);

export default ContactUsPage; 