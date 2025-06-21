'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Edit2, Trash2 } from 'lucide-react';

interface SectionHeaderProps {
   title: string;
   isExpanded: boolean;
   onToggle: () => void;
   onTitleChange: (title: string) => void;
   onDelete: () => void;
   componentCount: number;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
   title, isExpanded, onToggle, onTitleChange, onDelete, componentCount
}) => {
   const [isEditing, setIsEditing] = useState(false);
   const [editTitle, setEditTitle] = useState(title);

   const handleSave = () => {
      onTitleChange(editTitle);
      setIsEditing(false);
   };

   const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSave();
      else if (e.key === 'Escape') {
         setEditTitle(title);
         setIsEditing(false);
      }
   };

   return (
      <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-slate-800 rounded-2xl border  dark:border-slate-700 border-b border-gray-200 transition-colors duration-200 group">
         <div className="flex items-center flex-1">
            <button
               onClick={onToggle}
               className="mr-3 p-1 hover:bg-gray-200 dark:hover:bg-slate-400 rounded transition-colors duration-200"
            >
               {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" />
                  : <ChevronRight className="w-4 h-4 text-gray-400" />}
            </button>

            {isEditing ? (
               <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={handleSave}
                  onKeyDown={handleKeyPress}
                  className="flex-1 bg-gray-200 dark:bg-slate-800 text-gray-900 px-3 py-1 rounded border border-gray-300 dark:border-slate-700 focus:border-blue-500 focus:outline-none"
                  autoFocus
               />
            ) : (
               <div className="flex-1">
                  <h3
                     className="text-lg font-medium text-gray-900 dark:text-white cursor-pointer hover:text-blue-400 transition-colors duration-200"
                     onClick={() => setIsEditing(true)}
                  >
                        {title|| `Section ${componentCount}`}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                     {componentCount} component{componentCount !== 1 ? 's' : ''}
                  </p>
               </div>
            )}
         </div>

         <div className="flex items-center space-x-2">
            <button
               onClick={() => setIsEditing(true)}
               className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors duration-200 opacity-0 group-hover:opacity-100"
            >
               <Edit2 className="w-4 h-4 text-gray-400" />
            </button>
            <button
               onClick={onDelete}
               className="p-2 hover:bg-red-600/20 rounded transition-colors duration-200 opacity-0 group-hover:opacity-100"
            >
               <Trash2 className="w-4 h-4 text-red-400" />
            </button>
         </div>
      </div>
   );
};

export default SectionHeader;
