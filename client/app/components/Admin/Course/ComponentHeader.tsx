'use client';
import { Button } from '@mui/material';
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import React from 'react';

interface ComponentHeaderProps {
   title: string;
   componentIndex: number;
   isExpanded: boolean;
   onToggle: () => void;
   onDelete: () => void;
}

const ComponentHeader: React.FC<ComponentHeaderProps> = ({
   title, componentIndex, isExpanded, onToggle, onDelete
}) => {
   return (
      <div className="flex items-center justify-between p-4 bg-gray-200 dark:bg-slate-700 border-b border-gray-300 dark:border-slate-600 hover:bg-gray-300/50 dark:hover:bg-slate-600/50 transition-colors duration-200 group">
         <div className="flex items-center flex-1">
            <button
               onClick={onToggle}
               className="mr-3 p-1 hover:bg-gray-300 dark:hover:bg-slate-600 rounded transition-colors duration-200 cursor-pointer"
            >
               {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-500" />
                  : <ChevronRight className="w-4 h-4 text-gray-500" />}
            </button>

            <div className="flex-1">
               <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
                  {title || `Video ${componentIndex + 1}`}
               </h4>
               <p className="text-xs text-gray-500 mt-1">
                  Component {componentIndex + 1}
               </p>
            </div>
         </div>

         <div className="flex items-center space-x-2">
            <button
               onClick={onDelete}
               className="p-2 hover:bg-red-600/20 rounded transition-colors duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
            >
               <Trash2 className="w-4 h-4 text-red-400" />
            </button>
         </div>
      </div>
   );
};

export default ComponentHeader; 