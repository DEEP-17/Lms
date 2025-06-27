import React from 'react';
import Contact from '../components/Landing/Contact';
import Header from '../components/Header';

const ContactUsPage = () => (
  <>
    <Header activeItem={3} route="" />
    <main className="">
      <Contact />
    </main>
  </>
);

export default ContactUsPage; 