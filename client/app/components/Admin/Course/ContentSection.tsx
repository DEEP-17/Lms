'use client';
import { ContentSectionData, VideoComponent } from '@/types/course';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import SectionHeader from './SectionHeader';
import VideoComponentCard from './VideoComponentCard';

interface Props {
   section: ContentSectionData;
   onUpdate: (section: ContentSectionData) => void;
   onDelete: () => void;
}

const ContentSection: React.FC<Props> = ({ section, onUpdate, onDelete }) => {
   const [isExpanded, setIsExpanded] = useState(true);

   const updateField = <K extends keyof ContentSectionData>(field: K, value: ContentSectionData[K]) => {
      onUpdate({ ...section, [field]: value });
   };

   const addComponent = () => {
      const newComponent: VideoComponent = {
         id: Date.now().toString(),
         videoTitle: '',
         videoUrl: '',
         videoDescription: '',
         links: []
      };
      updateField('components', [...section.components, newComponent]);
   };

   const updateComponent = (updatedComponent: VideoComponent) => {
      const updatedComponents = section.components.map(comp =>
         comp.id === updatedComponent.id ? updatedComponent : comp
      );
      updateField('components', updatedComponents);
   };

   const deleteComponent = (componentId: string) => {
      const updatedComponents = section.components.filter(comp => comp.id !== componentId);
      updateField('components', updatedComponents);
   };

   return (
      <div className="bg-white text-black dark:text-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg group hover:shadow-xl transition-all duration-300">
         <SectionHeader
            title={section.title}
            isExpanded={isExpanded}
            onToggle={() => setIsExpanded(!isExpanded)}
            onTitleChange={(title) => updateField('title', title)}
            onDelete={onDelete}
            componentCount={section.components.length}
         />

         {isExpanded && (
            <div className="p-6 space-y-6">
               {section.components.map((component, index) => (
                  <VideoComponentCard
                     key={component.id}
                     component={component}
                     componentIndex={index}
                     onUpdate={updateComponent}
                     onDelete={() => deleteComponent(component.id)}
                  />
               ))}

               {/* Add Component Button */}
               <button
                  onClick={addComponent}
                  className="w-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-300 group cursor-pointer"
               >
                  <div className="flex items-center justify-center space-x-3">
                     <div className="p-2 bg-gray-100 dark:bg-slate-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 rounded-full transition-all duration-300">
                        <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                     </div>
                     <span className="text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-medium">
                        Add Video Component
                     </span>
                  </div>
               </button>
            </div>
         )}
      </div>
   );
};

export default ContentSection;
