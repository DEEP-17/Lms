import React, { useState, useEffect, useRef } from 'react';

const testimonials = [
   {
      name: 'Macrosoft Training Center',
      text: 'Exceeded my expectations! Their tailored learning, expert instruction, and holistic support propelled my career forward. Highly recommended!',
      rating: 5,
      avatar: '/avatar1.jpg',
      date: 'Feb 2024',
   },
   {
      name: 'John Doe',
      text: 'The programming courses were incredibly detailed and up-to-date. The instructors really care about your progress.',
      rating: 4,
      avatar: '/avatar2.jpg',
      date: 'Mar 2024',
   },
   {
      name: 'Sophia Lee',
      text: 'Fantastic experience! The interactive labs made learning enjoyable, and I was able to apply my new skills at work immediately.',
      rating: 5,
      avatar: '/avatar3.jpg',
      date: 'Apr 2024',
   },
   {
      name: 'David Smith',
      text: 'Very professional courses with great support. I especially appreciated the live sessions and the career guidance provided.',
      rating: 4,
      avatar: '/avatar4.jpg',
      date: 'May 2024',
   },
   {
      name: 'Emily Johnson',
      text: 'One of the best learning platforms I have used. The content is practical, and the support team is always ready to help.',
      rating: 5,
      avatar: '/avatar5.jpg',
      date: 'Jun 2024',
   },
];

export default function Testimonials() {
   const [current, setCurrent] = useState(0);
   const visibleCount = 3; // Number of cards visible at once
   const intervalRef = useRef<NodeJS.Timeout | null>(null);

   const nextSlide = () => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
   };

   useEffect(() => {
      startAutoSlide();
      return () => stopAutoSlide();
      // eslint-disable-next-line
   }, []);

   const startAutoSlide = () => {
      stopAutoSlide();
      intervalRef.current = setInterval(nextSlide, 3500);
   };

   const stopAutoSlide = () => {
      if (intervalRef.current) {
         clearInterval(intervalRef.current);
         intervalRef.current = null;
      }
   };

   // For smooth infinite loop, duplicate the first few cards at the end
   const circularTestimonials = [
      ...testimonials,
      ...testimonials.slice(0, visibleCount),
   ];

   // Calculate the width for each card and the container
   const cardWidth = 340; // px, adjust as needed
   const containerWidth = cardWidth * circularTestimonials.length;

   return (
      <section
         className="bg-gray-100 dark:dark:bg-slate-800 py-12"
         onMouseEnter={stopAutoSlide}
         onMouseLeave={startAutoSlide}
      >
         <div className="w-[1400px] mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-8">
               Our customers opinions
            </h2>

            <div className="overflow-x-hidden relative">
               <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{
                     width: `${containerWidth}px`,
                     transform: `translateX(-${current * cardWidth}px)`,
                  }}
               >
                  {circularTestimonials.map((testimonial, index) => (
                     <div
                        key={index}
                        className="flex-shrink-0"
                        style={{
                           width: `${cardWidth}px`,
                           scrollSnapAlign: 'start',
                        }}
                     >
                        <div className="text-black dark:text-white  bg-gray-200 dark:bg-slate-900 rounded-xl shadow p-6 h-full flex flex-col justify-between mx-2">
                           <div>
                              <div className="flex items-center gap-3 mb-2">
                                 <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                 />
                                 <div>
                                    <div className="font-semibold text-heading dark:text-wwhite">
                                       {testimonial.name}
                                    </div>
                                    <div className="text-xs text-subtext dark:text-gray-300">
                                       {testimonial.date}
                                    </div>
                                 </div>
                              </div>
                              <div className="flex gap-1 mb-2">
                                 {[...Array(testimonial.rating)].map((_, i) => (
                                    <span key={i} className="text-yellow-400">★</span>
                                 ))}
                              </div>
                              <div className="text-black dark:text-gray-300 mb-2">
                                 {testimonial.text}
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
               {/* Navigation dots */}
               <div className="flex justify-center mt-4 gap-2">
                  {testimonials.map((_, idx) => (
                     <button
                        key={idx}
                        className={`w-3 h-3 rounded-full ${current === idx ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                        onClick={() => setCurrent(idx)}
                        aria-label={`Go to testimonial ${idx + 1}`}
                     />
                  ))}
               </div>
            </div>

            {/* Avatars Row */}
            <div className="flex gap-2 items-center justify-center mt-6">
               {testimonials.map((t, i) => (
                  <img
                     key={i}
                     src={t.avatar}
                     alt="Customer"
                     className="w-8 h-8 rounded-full object-cover border-2 border-primary"
                  />
               ))}
               <span className="text-black dark:text-gray-300 text-sm ml-2">
                  +2000 visitors worldwide
               </span>
            </div>
         </div>
      </section>
   );
}