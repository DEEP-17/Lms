import { styles } from '@/app/styles/style';
import { ThemeSwitcher } from '@/app/utils/ThemeSwitcher';
import { ChevronDown, ChevronRight, Edit2, Eye, Plus, Save, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

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
  const inputClasses = styles.input + ' transition-colors duration-300';

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-400 dark:text-gray-300">
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
        <div key={link.id} className="p-4 bg-gray-100 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-400">
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
        className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-200 group"
      >
        <div className="flex items-center justify-center space-x-2">
          <Plus className="w-5 h-5 text-gray-500 group-hover:text-blue-400" />
          <span className="text-gray-500 group-hover:text-blue-400 font-medium">
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
    <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-700/30 transition-colors duration-200 group">
      <div className="flex items-center flex-1">
        <button
          onClick={onToggle}
          className="mr-3 p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors duration-200"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </button>

        <h4 className="flex-1 text-base font-medium text-gray-900">
          Component {componentIndex + 1}
          {title && (
            <span className="text-gray-500 text-sm ml-2">- {title}</span>
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
    <div className="bg-gray-100 dark:bg-slate-800/30 rounded-lg border border-gray-300 dark:border-gray-700 animate-fade-in">
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
            <h5 className="text-sm font-medium text-gray-400 mb-4">Resource Links</h5>
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
    <div className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-200 hover:bg-gray-200/50 transition-colors duration-200 group">
      <div className="flex items-center flex-1">
        <button
          onClick={onToggle}
          className="mr-3 p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors duration-200"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
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
              className="text-lg font-medium text-gray-900 cursor-pointer hover:text-blue-400 transition-colors duration-200"
              onClick={() => setIsEditing(true)}
            >
              {title}
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
    <div className="bg-gray-100 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-xl group animate-fade-in">
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
            className="w-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-200 group"
          >
            <div className="flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5 text-gray-500 group-hover:text-blue-400" />
              <span className="text-gray-500 group-hover:text-blue-400 font-medium">
                Add Video Component
              </span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

interface CourseContentProps {
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
}

// Main CourseContent Component
export const CourseContent: React.FC<CourseContentProps> = ({ benefits,
  prerequisites,
  active,
  setActive }) => {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-100 dark:bg-slate-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Content Builder</h1>
              <p className="text-gray-500 text-sm mt-1">Create and manage your course sections</p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 mr-4">
                <button
                  onClick={expandAll}
                  className="px-3 py-1 text-xs bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-400 hover:text-gray-900 rounded transition-colors duration-200"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAll}
                  className="px-3 py-1 text-xs bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-400 hover:text-gray-900 rounded transition-colors duration-200"
                >
                  Collapse All
                </button>
              </div>

              <button
                onClick={previewContent}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 rounded-lg transition-colors duration-200"
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
            className="w-full p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:border-blue-500 hover:bg-blue-500/5 transition-all duration-300 group"
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="p-3 bg-gray-200 dark:bg-slate-800 group-hover:bg-blue-600/20 rounded-full transition-colors duration-300">
                <Plus className="w-6 h-6 text-gray-500 group-hover:text-blue-400" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-400 group-hover:text-blue-300">
                  Add New Section
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Create another content section for your course
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      
      <div className='w-full flex items-center justify-between'
      >
        <div
          className='w-[100px] h-[40px] bg-[#0c22e4] rounded-lg flex items-center justify-center text-[20px] font-semibold cursor-pointer'
          onClick={() => setActive(active - 1)}
        >Previous</div>
        <div
          className='w-[100px] h-[40px] bg-[#39e91a] rounded-lg flex items-center justify-center text-[20px] font-semibold cursor-pointer'
          onClick={() => {
            if (benefits[benefits.length - 1].title !== '' && prerequisites[prerequisites.length - 1].title !== '') { setActive(active + 1) }
            else {
              toast.error('Please fill all the fields before proceeding');
            }
          }}>Next</div>
      </div>
      {/* Footer */}
      <div className="mt-16 py-8 border-t border-gray-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm">
            Content Builder - Organize your course materials with ease
          </p>
        </div>
      </div>
    </div>

  );
};

export default CourseContent;
export type { ContentSectionData, Link, VideoComponent };

