import React from 'react';

interface FormFieldProps {
   label: string;
   value: string;
   onChange: (value: string) => void;
   placeholder?: string;
   type?: 'text' | 'url' | 'textarea';
   rows?: number;
}

const FormField: React.FC<FormFieldProps> = ({
   label, value, onChange, placeholder, type = 'text', rows = 4
}) => {
   return (
      <div className="space-y-3">
         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            {label}
         </label>
         {type === 'textarea' ? (
            <textarea
               value={value}
               onChange={(e) => onChange(e.target.value)}
               placeholder={placeholder}
               rows={rows}
               className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300 resize-none"
            />
         ) : (
            <input
               type={type}
               value={value}
               onChange={(e) => onChange(e.target.value)}
               placeholder={placeholder}
               className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300"
            />
         )}
      </div>
   );
};

export default FormField;
