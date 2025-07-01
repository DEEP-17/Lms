import { useGetKnowledgeGuaranteeDataQuery } from '@/redux/features/Layout/layoutApi';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';

type KnowledgeGuaranteeImage = { url: string; public_id?: string };

function getImageUrl(img: unknown): string {
   if (!img) return "/knowledge.png";
   if (typeof img === "string") return img;
   if (typeof img === "object" && img !== null && 'url' in img && typeof (img as KnowledgeGuaranteeImage).url === 'string') {
      return (img as KnowledgeGuaranteeImage).url;
   }
   return "/knowledge.png";
}

export default function KnowledgeGuarantee() {
   const { data, isLoading, error } = useGetKnowledgeGuaranteeDataQuery(undefined, {
      refetchOnMountOrArgChange: true
   });
   const router = useRouter();

   const knowledgeGuaranteeData = data?.layout?.knowledgeGuarantee;
   const [imgSrc, setImgSrc] = useState(getImageUrl(knowledgeGuaranteeData?.image));

   useEffect(() => {
      setImgSrc(getImageUrl(knowledgeGuaranteeData?.image));
   }, [knowledgeGuaranteeData?.image]);

   if (isLoading) {
      return (
         <section className="bg-card dark:bg-slate-800 py-16">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4 sm:px-6 lg:px-8">
               <div className="animate-pulse">
                  <div className="h-12 bg-gray-300 dark:bg-slate-700 rounded mb-6 w-3/4"></div>
                  <div className="h-32 bg-gray-300 dark:bg-slate-700 rounded mb-8"></div>
                  <div className="h-12 bg-gray-300 dark:bg-slate-700 rounded w-48"></div>
               </div>
               <div className="flex justify-center">
                  <div className="w-full max-w-md h-64 bg-gray-300 dark:bg-slate-700 rounded-2xl"></div>
               </div>
            </div>
         </section>
      );
   }

   if (error) {
      return (
         <section className="bg-card dark:bg-slate-800 py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center text-gray-600 dark:text-gray-400">
                  <p>Unable to load content. Please try again later.</p>
               </div>
            </div>
         </section>
      );
   }

   return (
      <section id="knowledge-guarantee" className="bg-card dark:bg-slate-900 py-20 min-h-[60vh] flex items-center">
         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4 sm:px-6 lg:px-8">
            {/* Left */}
            <div>
               <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-cyan-200 mb-6">
                  {knowledgeGuaranteeData?.title || 'Guarantee of Knowledge'}
               </h2>
               <p className="text-black dark:text-gray-400 mb-8 max-w-xl leading-relaxed text-lg">
                  {knowledgeGuaranteeData?.description || 'We\'ve trained thousands in IT, management, and business skills. Our courses are crafted by experts, regularly updated, and guarantee practical knowledge and real-world skills. Join top IT professionals and boost your career.'}
               </p>
               <button
                  className="py-4 flex items-center gap-2 px-5 bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-cyan-50 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-300 font-semibold transition cursor-pointer"
                  onClick={() => router.push('/courses')}
               >
                  <FaArrowRight className="w-4 h-4" />
                  {knowledgeGuaranteeData?.buttonText || 'Explore Courses'}
               </button>
            </div>

            {/* Right */}
            <div className="flex justify-center">
               <img
                  src={imgSrc}
                  alt="Guarantee of Knowledge"
                  className="rounded-2xl shadow-xl w-full max-w-md object-cover transition-transform duration-300 hover:scale-105"
                  onError={() => setImgSrc("/knowledge.png")}
               />
            </div>
         </div>
      </section>
   );
}
