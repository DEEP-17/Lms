import { Link } from '@/types/course';
import { Plus, X } from 'lucide-react';
import React from 'react';
import FormField from './FormField';

interface Props {
   links: Link[];
   onLinksChange: (links: Link[]) => void;
}

const LinkSection: React.FC<Props> = ({ links, onLinksChange }) => {
   const addLink = () => {
      const newLink: Link = {
         id: Date.now().toString(),
         title: '',
         url: '',
      };
      onLinksChange([...links, newLink]);
   };

   const updateLink = (id: string, field: 'title' | 'url', value: string) => {
      onLinksChange(
         links.map(link =>
            link.id === id ? { ...link, [field]: value } : link
         )
      );
   };

   const removeLink = (id: string) => {
      onLinksChange(links.filter(link => link.id !== id));
   };

   return (
      <div className="space-y-4">
         {links.map((link, index) => (
            <div key={link.id} className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-200 dark:border-slate-600 hover:shadow-md transition-all duration-300">
               <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Resource Link {index + 1}</h4>
                  <button
                     onClick={() => removeLink(link.id)}
                     className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 group"
                  >
                     <X className="w-4 h-4 text-red-400 group-hover:text-red-600" />
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                     label="Link Title"
                     value={link.title}
                     onChange={(value) => updateLink(link.id, 'title', value)}
                     placeholder="Enter link title..."
                  />
                  <FormField
                     label="Link URL"
                     value={link.url}
                     onChange={(value) => updateLink(link.id, 'url', value)}
                     placeholder="https://example.com"
                     type="url"
                  />
               </div>
            </div>
         ))}

         <button
            onClick={addLink}
            className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-300 group"
         >
            <div className="flex items-center justify-center space-x-3">
               <div className="p-2 bg-gray-100 dark:bg-slate-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 rounded-full transition-all duration-300">
                  <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
               </div>
               <span className="text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-medium">
                  Add Resource Link
               </span>
            </div>
         </button>
      </div>
   );
};

export default LinkSection;
