// import React, { FC, useState } from 'react';
// import { AiOutlineDelete, AiOutlinePlus } from 'react-icons/ai';
// import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
// import { BsPencil } from 'react-icons/bs';

// type LinkType = { label: string; url: string };
// type ContentType = {
//   title: string;
//   description: string;
//   videoUrl: string;
//   links: LinkType[];
// };
// type SectionType = {
//   videoSection: string;
//   contents: ContentType[];
// };

// type Props = {
//   active: number;
//   setActive: (active: number) => void;
//   courseContentData: SectionType[];
//   setCourseContentData: (data: SectionType[]) => void;
//   handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
// };

// const emptyContent: ContentType = {
//   title: '',
//   description: '',
//   videoUrl: '',
//   links: [],
// };

// const CourseContent: FC<Props> = ({
//   active,
//   setActive,
//   courseContentData,
//   setCourseContentData,
//   handleSubmit,
// }) => {
//   const [isCollapsed, setIsCollapsed] = useState(
//     Array(courseContentData.length).fill(false)
//   );
//   const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);

//   // For adding new link input per content
//   const [newLinks, setNewLinks] = useState<LinkType[][]>(
//     Array.isArray(courseContentData)
//       ? courseContentData.map(section =>
//           Array.isArray(section.contents)
//             ? section.contents.map(() => ({ label: '', url: '' }))
//             : []
//         )
//       : []
//   );

//   // For adding new content input per section
//   const [newContent, setNewContent] = useState<ContentType[]>(
//     Array(courseContentData.length).fill({ ...emptyContent })
//   );

//   // Section handlers
//   const handleSectionNameChange = (sectionIdx: number, value: string) => {
//     const newData = [...courseContentData];
//     newData[sectionIdx].videoSection = value;
//     setCourseContentData(newData);
//   };

//   const handleSectionEdit = (sectionIdx: number) => setEditingSectionIndex(sectionIdx);
//   const handleSectionBlur = () => setEditingSectionIndex(null);
//   const handleSectionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') setEditingSectionIndex(null);
//   };

//   const handleCollapseToggle = (sectionIdx: number) => {
//     const updatedCollapseState = [...isCollapsed];
//     updatedCollapseState[sectionIdx] = !updatedCollapseState[sectionIdx];
//     setIsCollapsed(updatedCollapseState);
//   };

//   const handleDeleteSection = (sectionIdx: number) => {
//     if (sectionIdx > 0) {
//       const updatedData = [...courseContentData];
//       updatedData.splice(sectionIdx, 1);
//       setCourseContentData(updatedData);
//       const updatedCollapseState = [...isCollapsed];
//       updatedCollapseState.splice(sectionIdx, 1);
//       setIsCollapsed(updatedCollapseState);
//       const updatedNewContent = [...newContent];
//       updatedNewContent.splice(sectionIdx, 1);
//       setNewContent(updatedNewContent);
//       const updatedNewLinks = [...newLinks];
//       updatedNewLinks.splice(sectionIdx, 1);
//       setNewLinks(updatedNewLinks);
//     }
//   };

//   // Content handlers
//   const handleContentChange = (
//     sectionIdx: number,
//     contentIdx: number,
//     field: keyof ContentType,
//     value: string
//   ) => {
//     const newData = [...courseContentData];
//     newData[sectionIdx].contents[contentIdx][field] = value;
//     setCourseContentData(newData);
//   };

//   const handleDeleteContent = (sectionIdx: number, contentIdx: number) => {
//     const newData = [...courseContentData];
//     newData[sectionIdx].contents.splice(contentIdx, 1);
//     setCourseContentData(newData);
//     const updatedNewLinks = [...newLinks];
//     updatedNewLinks[sectionIdx].splice(contentIdx, 1);
//     setNewLinks(updatedNewLinks);
//   };

//   // Links handlers
//   const handleLinkChange = (
//     sectionIdx: number,
//     contentIdx: number,
//     linkIdx: number,
//     value: LinkType
//   ) => {
//     const newData = [...courseContentData];
//     if (!Array.isArray(newData[sectionIdx].contents[contentIdx].links))
//       newData[sectionIdx].contents[contentIdx].links = [];
//     newData[sectionIdx].contents[contentIdx].links[linkIdx] = value;
//     setCourseContentData(newData);
//   };

//   const handleAddLink = (sectionIdx: number, contentIdx: number) => {
//     const newData = [...courseContentData];
//     if (!Array.isArray(newData[sectionIdx].contents[contentIdx].links))
//       newData[sectionIdx].contents[contentIdx].links = [];
//     const link = newLinks[sectionIdx][contentIdx];
//     if (link.label.trim() !== '' || link.url.trim() !== '') {
//       newData[sectionIdx].contents[contentIdx].links.push({ ...link });
//       setCourseContentData(newData);
//       const updatedNewLinks = [...newLinks];
//       updatedNewLinks[sectionIdx][contentIdx] = { label: '', url: '' };
//       setNewLinks(updatedNewLinks);
//     }
//   };

//   const handleDeleteLink = (
//     sectionIdx: number,
//     contentIdx: number,
//     linkIdx: number
//   ) => {
//     const newData = [...courseContentData];
//     if (Array.isArray(newData[sectionIdx].contents[contentIdx].links)) {
//       newData[sectionIdx].contents[contentIdx].links.splice(linkIdx, 1);
//       setCourseContentData(newData);
//     }
//   };

//   const handleNewLinkInputChange = (
//     sectionIdx: number,
//     contentIdx: number,
//     value: LinkType
//   ) => {
//     const updatedNewLinks = [...newLinks];
//     updatedNewLinks[sectionIdx][contentIdx] = value;
//     setNewLinks(updatedNewLinks);
//   };

//   // Add new content to section
//   const handleAddContent = (sectionIdx: number) => {
//     const newData = [...courseContentData];
//     newData[sectionIdx].contents.push({ ...emptyContent });
//     setCourseContentData(newData);
//     const updatedNewLinks = [...newLinks];
//     updatedNewLinks[sectionIdx].push({ label: '', url: '' });
//     setNewLinks(updatedNewLinks);
//   };

//   // Add new section
//   const handleAddNewSection = () => {
//     setCourseContentData([
//       ...courseContentData,
//       {
//         videoSection: '',
//         contents: [{ ...emptyContent }],
//       },
//     ]);
//     setIsCollapsed([...isCollapsed, false]);
//     setNewContent([...newContent, { ...emptyContent }]);
//     setNewLinks([...newLinks, [{ label: '', url: '' }]]);
//   };

//   return (
//     <div className="w-[80%] flex flex-col items-center justify-center p-4">
//       <form onSubmit={handleSubmit}>
//         {courseContentData.map((section, sectionIdx) => (
//           <div
//             key={sectionIdx}
//             className={`w-full p-4 bg-black shadow-md rounded-lg mb-4 mt-10`}
//           >
//             {/* Section name at top right */}
//             <div className="flex justify-end items-center mb-2">
//               {editingSectionIndex === sectionIdx ? (
//                 <input
//                   type="text"
//                   value={section.videoSection || ''}
//                   autoFocus
//                   onChange={e => handleSectionNameChange(sectionIdx, e.target.value)}
//                   onBlur={handleSectionBlur}
//                   onKeyDown={handleSectionKeyDown}
//                   className="bg-gray-800 text-white px-2 py-1 rounded border border-gray-600 w-48 text-right"
//                   placeholder="Untitled Section"
//                 />
//               ) : (
//                 <div className="flex items-center">
//                   <span className="text-white font-semibold text-lg mr-2">
//                     {section.videoSection && section.videoSection.trim().length > 0
//                       ? section.videoSection
//                       : 'Untitled Section'}
//                   </span>
//                   <BsPencil
//                     className="text-white cursor-pointer"
//                     onClick={() => handleSectionEdit(sectionIdx)}
//                   />
//                 </div>
//               )}
//             </div>

//             <div className="flex w-full items-center justify-between my-0">
//               <div></div>
//               <div className="flex items-center">
//                 <AiOutlineDelete
//                   className={`text-white text-[20px] mr-2 ${
//                     sectionIdx > 0 ? 'cursor-pointer' : 'cursor-not-allowed'
//                   }`}
//                   onClick={() => handleDeleteSection(sectionIdx)}
//                 />
//                 <MdOutlineKeyboardArrowDown
//                   fontSize="large"
//                   className="text-white cursor-pointer"
//                   style={{
//                     transition: 'transform 0.2s',
//                     transform: isCollapsed[sectionIdx]
//                       ? 'rotate(180deg)'
//                       : 'rotate(0deg)',
//                   }}
//                   onClick={() => handleCollapseToggle(sectionIdx)}
//                 />
//               </div>
//             </div>

//             {/* Collapsible content */}
//             {!isCollapsed[sectionIdx] && (
//               <>
//                 {section.contents.map((content, contentIdx) => (
//                   <div key={contentIdx} className="border border-gray-700 rounded p-4 my-4 bg-gray-900">
//                     <div className="flex justify-between items-center mb-2">
//                       <span className="text-white font-semibold">
//                         Content {contentIdx + 1}
//                       </span>
//                       <AiOutlineDelete
//                         className="text-red-500 cursor-pointer"
//                         onClick={() => handleDeleteContent(sectionIdx, contentIdx)}
//                       />
//                     </div>
//                     <div className="my-3">
//                       <label
//                         htmlFor={`video-title-${sectionIdx}-${contentIdx}`}
//                         className="block text-white text-[16px] font-semibold mb-2"
//                       >
//                         Video Title
//                       </label>
//                       <input
//                         id={`video-title-${sectionIdx}-${contentIdx}`}
//                         type="text"
//                         value={content.title || ''}
//                         onChange={e =>
//                           handleContentChange(sectionIdx, contentIdx, 'title', e.target.value)
//                         }
//                         className="w-full p-2 border border-gray-300 rounded"
//                         placeholder="Enter video title"
//                       />
//                     </div>
//                     <div className="my-3">
//                       <label
//                         htmlFor={`video-description-${sectionIdx}-${contentIdx}`}
//                         className="block text-white text-[16px] font-semibold mb-2"
//                       >
//                         Video Description
//                       </label>
//                       <textarea
//                         id={`video-description-${sectionIdx}-${contentIdx}`}
//                         value={content.description || ''}
//                         onChange={e =>
//                           handleContentChange(sectionIdx, contentIdx, 'description', e.target.value)
//                         }
//                         className="w-full p-2 border border-gray-300 rounded min-h-[80px]"
//                         placeholder="Enter video description"
//                       />
//                     </div>
//                     <div className="my-3">
//                       <label
//                         htmlFor={`video-url-${sectionIdx}-${contentIdx}`}
//                         className="block text-white text-[16px] font-semibold mb-2"
//                       >
//                         Video URL
//                       </label>
//                       <input
//                         id={`video-url-${sectionIdx}-${contentIdx}`}
//                         type="text"
//                         value={content.videoUrl || ''}
//                         onChange={e =>
//                           handleContentChange(sectionIdx, contentIdx, 'videoUrl', e.target.value)
//                         }
//                         className="w-full p-2 border border-gray-300 rounded"
//                         placeholder="Enter video URL"
//                       />
//                     </div>
//                     {/* Links Section */}
//                     <div className="my-3">
//                       <label className="block text-white text-[16px] font-semibold mb-2">
//                         Links
//                       </label>
//                       <div className="space-y-2">
//                         {(content.links || []).map(
//                           (link: LinkType, linkIdx: number) => (
//                             <div key={linkIdx} className="flex flex-col md:flex-row gap-2 items-center">
//                               <input
//                                 type="text"
//                                 value={link.label}
//                                 onChange={e =>
//                                   handleLinkChange(sectionIdx, contentIdx, linkIdx, {
//                                     ...link,
//                                     label: e.target.value,
//                                   })
//                                 }
//                                 className="w-full md:w-1/2 p-2 border border-gray-300 rounded"
//                                 placeholder={`Source Code ${linkIdx + 1}`}
//                               />
//                               <input
//                                 type="text"
//                                 value={link.url}
//                                 onChange={e =>
//                                   handleLinkChange(sectionIdx, contentIdx, linkIdx, {
//                                     ...link,
//                                     url: e.target.value,
//                                   })
//                                 }
//                                 className="w-full md:w-1/2 p-2 border border-gray-300 rounded"
//                                 placeholder={`Source Code URL ${linkIdx + 1}`}
//                               />
//                               <AiOutlineDelete
//                                 className="text-red-500 ml-2 cursor-pointer"
//                                 onClick={() => handleDeleteLink(sectionIdx, contentIdx, linkIdx)}
//                               />
//                             </div>
//                           )
//                         )}
//                         <div className="flex flex-col md:flex-row gap-2 items-center mt-2">
//                           <input
//                             type="text"
//                             value={newLinks[sectionIdx]?.[contentIdx]?.label || ''}
//                             onChange={e =>
//                               handleNewLinkInputChange(sectionIdx, contentIdx, {
//                                 ...newLinks[sectionIdx]?.[contentIdx],
//                                 label: e.target.value,
//                                 url: newLinks[sectionIdx]?.[contentIdx]?.url || '',
//                               })
//                             }
//                             className="w-full md:w-1/2 p-2 border border-gray-300 rounded"
//                             placeholder="Source Code"
//                           />
//                           <input
//                             type="text"
//                             value={newLinks[sectionIdx]?.[contentIdx]?.url || ''}
//                             onChange={e =>
//                               handleNewLinkInputChange(sectionIdx, contentIdx, {
//                                 ...newLinks[sectionIdx]?.[contentIdx],
//                                 url: e.target.value,
//                                 label: newLinks[sectionIdx]?.[contentIdx]?.label || '',
//                               })
//                             }
//                             className="w-full md:w-1/2 p-2 border border-gray-300 rounded"
//                             placeholder="Source Code URL"
//                           />
//                           <AiOutlinePlus
//                             className="text-green-500 ml-2 cursor-pointer"
//                             size={24}
//                             onClick={() => handleAddLink(sectionIdx, contentIdx)}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//                 <div className="w-full flex justify-center mt-2">
//                   <button
//                     type="button"
//                     onClick={() => handleAddContent(sectionIdx)}
//                     className="w-[200px] py-2 px-4 bg-green-600 hover:bg-green-700 rounded-lg text-white font-bold text-center cursor-pointer transition"
//                   >
//                     Add Content
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         ))}
//         <div className="w-full flex justify-center mt-6">
//           <button
//             type="submit"
//             className="w-[200px] py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold text-center cursor-pointer transition"
//           >
//             Save Content
//           </button>
//         </div>
//         <div className="w-full flex justify-center mt-4">
//           <button
//             type="button"
//             onClick={handleAddNewSection}
//             className="w-[200px] py-2 px-4 bg-green-600 hover:bg-green-700 rounded-lg text-white font-bold text-center cursor-pointer transition"
//           >
//             Add New Section
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CourseContent;
import React, { useState } from 'react';
import { Plus, Save, Eye, Edit2, ChevronDown, ChevronRight, Trash2, X } from 'lucide-react';

// Types
interface Link {
  id: string;
  title: string;
  url: string;
}

interface VideoComponent {
  id: string;
  videoTitle: string;
  videoUrl: string;
  videoDescription: string;
  links: Link[];
}

interface ContentSectionData {
  id: string;
  title: string;
  components: VideoComponent[];
}

// Form Field Component
interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'url' | 'textarea';
  rows?: number;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  rows = 4,
}) => {
  const inputClasses = "w-full bg-dark-700 text-white px-4 py-3 rounded-lg border border-dark-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 placeholder-dark-400";

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-dark-200">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={inputClasses + " resize-none"}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClasses}
        />
      )}
    </div>
  );
};

// Link Section Component
interface LinkSectionProps {
  links: Link[];
  onLinksChange: (links: Link[]) => void;
}

const LinkSection: React.FC<LinkSectionProps> = ({ links, onLinksChange }) => {
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
        <div key={link.id} className="p-4 bg-dark-800/50 rounded-lg border border-dark-700">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-dark-200">
              Link {index + 1}
            </h4>
            <button
              onClick={() => removeLink(link.id)}
              className="p-1 hover:bg-red-600/20 rounded transition-colors duration-200"
            >
              <X className="w-4 h-4 text-red-400" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Link Title"
              value={link.title}
              onChange={(value) => updateLink(link.id, 'title', value)}
              placeholder="Source Code... (Link title)"
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
        className="w-full p-4 border-2 border-dashed border-dark-600 rounded-lg hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-200 group"
      >
        <div className="flex items-center justify-center space-x-2">
          <Plus className="w-5 h-5 text-dark-400 group-hover:text-blue-400" />
          <span className="text-dark-400 group-hover:text-blue-400 font-medium">
            Add Link
          </span>
        </div>
      </button>
    </div>
  );
};

// Component Header for Video Components
interface ComponentHeaderProps {
  title: string;
  componentIndex: number;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

const ComponentHeader: React.FC<ComponentHeaderProps> = ({
  title,
  componentIndex,
  isExpanded,
  onToggle,
  onDelete,
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-dark-800/50 border-b border-dark-600 hover:bg-dark-700/30 transition-colors duration-200 group">
      <div className="flex items-center flex-1">
        <button
          onClick={onToggle}
          className="mr-3 p-1 hover:bg-dark-600 rounded transition-colors duration-200"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-dark-300" />
          ) : (
            <ChevronRight className="w-4 h-4 text-dark-300" />
          )}
        </button>
        
        <h4 className="flex-1 text-base font-medium text-white">
          Component {componentIndex + 1}
          {title && (
            <span className="text-dark-400 text-sm ml-2">- {title}</span>
          )}
        </h4>
      </div>
      
      <button
        onClick={onDelete}
        className="p-2 hover:bg-red-600/20 rounded transition-colors duration-200 opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="w-4 h-4 text-red-400" />
      </button>
    </div>
  );
};

// Video Component
interface VideoComponentProps {
  component: VideoComponent;
  componentIndex: number;
  onUpdate: (component: VideoComponent) => void;
  onDelete: () => void;
}

const VideoComponentCard: React.FC<VideoComponentProps> = ({
  component,
  componentIndex,
  onUpdate,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const updateField = (field: keyof VideoComponent, value: any) => {
    onUpdate({ ...component, [field]: value });
  };

  return (
    <div className="bg-dark-800/30 rounded-lg border border-dark-600 animate-fade-in">
      <ComponentHeader
        title={component.videoTitle}
        componentIndex={componentIndex}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        onDelete={onDelete}
      />

      {isExpanded && (
        <div className="p-6 space-y-6 animate-slide-down">
          <FormField
            label="Video Title"
            value={component.videoTitle}
            onChange={(value) => updateField('videoTitle', value)}
            placeholder="Project Plan..."
          />
          
          <FormField
            label="Video URL"
            value={component.videoUrl}
            onChange={(value) => updateField('videoUrl', value)}
            placeholder="https://example.com/video"
            type="url"
          />
          
          <FormField
            label="Video Description"
            value={component.videoDescription}
            onChange={(value) => updateField('videoDescription', value)}
            placeholder="Enter video description..."
            type="textarea"
            rows={6}
          />
          
          <div>
            <h5 className="text-sm font-medium text-dark-200 mb-4">Resource Links</h5>
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

// Section Header Component
interface SectionHeaderProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  onTitleChange: (title: string) => void;
  onDelete: () => void;
  componentCount: number;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  isExpanded,
  onToggle,
  onTitleChange,
  onDelete,
  componentCount,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

  const handleSave = () => {
    onTitleChange(editTitle);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-dark-800 border-b border-dark-700 hover:bg-dark-700/50 transition-colors duration-200 group">
      <div className="flex items-center flex-1">
        <button
          onClick={onToggle}
          className="mr-3 p-1 hover:bg-dark-600 rounded transition-colors duration-200"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-dark-300" />
          ) : (
            <ChevronRight className="w-4 h-4 text-dark-300" />
          )}
        </button>
        
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyPress}
            className="flex-1 bg-dark-700 text-white px-3 py-1 rounded border border-dark-600 focus:border-blue-500 focus:outline-none"
            autoFocus
          />
        ) : (
          <div className="flex-1">
            <h3
              className="text-lg font-medium text-white cursor-pointer hover:text-blue-400 transition-colors duration-200"
              onClick={() => setIsEditing(true)}
            >
              {title}
            </h3>
            <p className="text-xs text-dark-400 mt-1">
              {componentCount} component{componentCount !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 hover:bg-dark-600 rounded transition-colors duration-200 opacity-0 group-hover:opacity-100"
        >
          <Edit2 className="w-4 h-4 text-dark-300" />
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

// Content Section Component
interface ContentSectionProps {
  section: ContentSectionData;
  onUpdate: (section: ContentSectionData) => void;
  onDelete: () => void;
}

const ContentSection: React.FC<ContentSectionProps> = ({
  section,
  onUpdate,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const updateField = (field: keyof ContentSectionData, value: any) => {
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
    <div className="bg-dark-900 rounded-xl border border-dark-700 shadow-xl group animate-fade-in">
      <SectionHeader
        title={section.title}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        onTitleChange={(title) => updateField('title', title)}
        onDelete={onDelete}
        componentCount={section.components.length}
      />
      
      {isExpanded && (
        <div className="p-6 space-y-6 animate-slide-down">
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
            className="w-full p-6 border-2 border-dashed border-dark-600 rounded-lg hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-200 group"
          >
            <div className="flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5 text-dark-400 group-hover:text-blue-400" />
              <span className="text-dark-400 group-hover:text-blue-400 font-medium">
                Add Video Component
              </span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

// Main CourseContent Component
export const CourseContent: React.FC = () => {
  const [sections, setSections] = useState<ContentSectionData[]>([
    {
      id: '1',
      title: 'Untitled Section',
      components: [
        {
          id: '1',
          videoTitle: 'Project Plan...',
          videoUrl: '',
          videoDescription: '',
          links: []
        }
      ]
    }
  ]);

  const addSection = () => {
    const newSection: ContentSectionData = {
      id: Date.now().toString(),
      title: 'New Section',
      components: [
        {
          id: Date.now().toString() + '_comp',
          videoTitle: '',
          videoUrl: '',
          videoDescription: '',
          links: []
        }
      ]
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (updatedSection: ContentSectionData) => {
    setSections(sections.map(section => 
      section.id === updatedSection.id ? updatedSection : section
    ));
  };

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId));
  };

  const saveContent = () => {
    // In a real app, this would save to a backend
    console.log('Saving content:', sections);
    // Show a toast notification
    alert('Content saved successfully!');
  };

  const previewContent = () => {
    // In a real app, this would open a preview modal
    console.log('Preview content:', sections);
    alert('Preview functionality would open here!');
  };

  const collapseAll = () => {
    // This would require state management for all sections and components
    // For now, we'll just show an alert
    alert('Collapse All functionality - would collapse all sections and components');
  };

  const expandAll = () => {
    // This would require state management for all sections and components
    // For now, we'll just show an alert
    alert('Expand All functionality - would expand all sections and components');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-dark-900/80 backdrop-blur-sm border-b border-dark-700">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Content Builder</h1>
              <p className="text-dark-400 text-sm mt-1">Create and manage your course sections</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 mr-4">
                <button
                  onClick={expandAll}
                  className="px-3 py-1 text-xs bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-white rounded transition-colors duration-200"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAll}
                  className="px-3 py-1 text-xs bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-white rounded transition-colors duration-200"
                >
                  Collapse All
                </button>
              </div>
              
              <button
                onClick={previewContent}
                className="flex items-center space-x-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors duration-200"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
              
              <button
                onClick={saveContent}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {sections.map((section) => (
            <ContentSection
              key={section.id}
              section={section}
              onUpdate={updateSection}
              onDelete={() => deleteSection(section.id)}
            />
          ))}
          
          {/* Add Section Button */}
          <button
            onClick={addSection}
            className="w-full p-8 border-2 border-dashed border-dark-600 rounded-xl hover:border-blue-500 hover:bg-blue-500/5 transition-all duration-300 group"
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="p-3 bg-dark-800 group-hover:bg-blue-600/20 rounded-full transition-colors duration-300">
                <Plus className="w-6 h-6 text-dark-400 group-hover:text-blue-400" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-dark-300 group-hover:text-blue-300">
                  Add New Section
                </h3>
                <p className="text-dark-500 text-sm mt-1">
                  Create another content section for your course
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 py-8 border-t border-dark-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-dark-500 text-sm">
            Content Builder - Organize your course materials with ease
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
export type { ContentSectionData, VideoComponent, Link };