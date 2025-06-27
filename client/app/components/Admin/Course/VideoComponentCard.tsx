'use client';
import { VideoComponent } from '@/types/course';
import React, { useState } from 'react';
import ComponentHeader from './ComponentHeader';
import FormField from './FormField';
import LinkSection from './LinkSection';

interface Props {
   component: VideoComponent;
   componentIndex: number;
   onUpdate: (component: VideoComponent) => void;
   onDelete: () => void;
}

const VideoComponentCard: React.FC<Props> = ({
   component, componentIndex, onUpdate, onDelete
}) => {
   const [isExpanded, setIsExpanded] = useState(true);

   const updateField = (field: keyof VideoComponent, value: any) => {
      onUpdate({ ...component, [field]: value });
   };

   return (
      <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-200 dark:border-slate-600 hover:shadow-md transition-all duration-300">
         <ComponentHeader
            title={component.videoTitle}
            componentIndex={componentIndex}
            isExpanded={isExpanded}
            onToggle={() => setIsExpanded(!isExpanded)}
            onDelete={onDelete}
         />

         {isExpanded && (
            <div className="p-6 space-y-6">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FormField
                     label="Video Title"
                     value={component.videoTitle}
                     onChange={(value) => updateField('videoTitle', value)}
                     placeholder="Enter video title..."
                  />

                  <FormField
                     label="Video URL"
                     value={component.videoUrl}
                     onChange={(value) => updateField('videoUrl', value)}
                     placeholder="https://example.com/video"
                     type="url"
                  />
               </div>

               <FormField
                  label="Video Description"
                  value={component.videoDescription}
                  onChange={(value) => updateField('videoDescription', value)}
                  placeholder="Enter detailed description of this video..."
                  type="textarea"
                  rows={4}
               />

               <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-gray-200 dark:border-slate-600">
                  <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resource Links</h5>
                  <LinkSection
                     links={component.links}
                     onLinksChange={(links) => updateField('links', links)}
                  />
               </div>
            </div>
         )}
      </div>
   );
};

export default VideoComponentCard;
