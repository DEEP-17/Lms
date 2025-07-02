import { useGetTestimonialsDataQuery } from '@/redux/features/Layout/layoutApi';
import React, { useEffect, useRef, useState } from 'react';
interface Testimonial {
   name: string;
   text: string;
   rating: number;
   avatar: string;
   date: string;
}
export default function Testimonials() {
   const [current, setCurrent] = useState(0);
   const VISIBLE_COUNT = 3;
   const intervalRef = useRef<NodeJS.Timeout | null>(null);

   const { data, isLoading, error } = useGetTestimonialsDataQuery(undefined, {
      refetchOnMountOrArgChange: true
   });

   const defaultTestimonials = [
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

   const testimonials = data?.layout?.testimonials || defaultTestimonials;

   const nextSlide = () => {
      setCurrent((prev) => (prev + 1) % (testimonials.length - VISIBLE_COUNT + 1));
   };

   useEffect(() => {
      startAutoSlide();
      return () => stopAutoSlide();
   }, [testimonials.length]);

   const startAutoSlide = () => {
      stopAutoSlide();
      intervalRef.current = setInterval(nextSlide, 4000);
   };

   const stopAutoSlide = () => {
      if (intervalRef.current) {
         clearInterval(intervalRef.current);
         intervalRef.current = null;
      }
   };

   // Layout constants
   const CARD_WIDTH = 340;
   const CARD_MARGIN = 16;
   const fullCardWidth = CARD_WIDTH + CARD_MARGIN * 2;
   const containerWidth = fullCardWidth * VISIBLE_COUNT;
   const maxIndex = Math.max(0, testimonials.length - VISIBLE_COUNT);
   const safeCurrent = Math.min(current, maxIndex);

   if (isLoading) {
      return (
         <section className="bg-gray-100 dark:bg-slate-900 py-12 min-h-[600px]">
            <div className="mx-auto px-4" style={{ width: containerWidth }}>
               <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded mb-8 w-64"></div>
                  <div className="flex gap-4">
                     {[1, 2, 3].map((i) => (
                        <div key={i} className="h-48 bg-gray-200 dark:bg-slate-700 rounded-xl w-80"></div>
                     ))}
                  </div>
               </div>
            </div>
         </section>
      );
   }

   if (error) {
      return (
         <section className="bg-gray-100 dark:bg-slate-900 py-12 min-h-[600px]">
            <div className="mx-auto px-4" style={{ width: containerWidth }}>
               <p className="text-center text-gray-600 dark:text-gray-400">
                  Unable to load testimonials. Please try again later.
               </p>
            </div>
         </section>
      );
   }

   return (
      <section
         id="testimonials"
         className="bg-gray-100 dark:bg-slate-900 py-20 min-h-[700px] flex items-center"
         onMouseEnter={stopAutoSlide}
         onMouseLeave={startAutoSlide}
      >
         <div className="mx-auto" style={{ width: `${containerWidth}px` }}>
            <h2 className="text-2xl md:text-3xl font-bold text-[#2563eb] dark:text-cyan-200 mb-8 text-center">
               Our customers&apos; opinions
            </h2>

            <div className="overflow-hidden relative min-h-[370px]">
               <div
                  className="flex transition-transform duration-200 ease-in-out"
                  style={{
                     width: `${fullCardWidth * testimonials.length}px`,
                     transform: `translateX(-${safeCurrent * fullCardWidth}px)`
                  }}
               >
                  {testimonials.map((testimonial:Testimonial, index:number) => (
                     <div
                        key={index}
                        className="flex-shrink-0"
                        style={{
                           width: `${CARD_WIDTH}px`,
                           marginLeft: `${CARD_MARGIN}px`,
                           marginRight: `${CARD_MARGIN}px`,
                        }}
                     >
                        <div className="text-black dark:text-white bg-white dark:bg-slate-800 rounded-xl shadow p-6 h-full min-h-[320px] flex flex-col justify-between">
                           <div>
                              <div className="flex items-center gap-3 mb-2">
                                 <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                 />
                                 <div>
                                    <div className="font-semibold dark:text-white">
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
                              <div className="text-black dark:text-gray-300 mb-2 text-sm">
                                 {testimonial.text}
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>

               {/* Navigation dots */}
               <div className="flex justify-center mt-6 gap-2">
                  {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                     <button
                        key={idx}
                        className={`w-3 h-3 rounded-full transition-all duration-200 transform hover:scale-125 focus:scale-90 focus:ring-2 cursor-pointer ${current === idx ? 'bg-[#BE3D2A] dark:bg-[#BE3D2A]' : 'bg-gray-300 dark:bg-gray-600'
                           }`}
                        onClick={() => setCurrent(idx)}
                        aria-label={`Go to testimonial ${idx + 1}`}
                     />
                  ))}
               </div>

               {/* Avatar row */}
               <div className="flex gap-2 items-center justify-center mt-6">
                  {testimonials.slice(0, 5).map((t:Testimonial, i:number) => (
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
         </div>
      </section>
   );
}
