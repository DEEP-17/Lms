import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileText,
  GraduationCap,
  HelpCircle,
  Home,
  LogOut,
  Monitor,
  PlayCircle,
  Settings,
  ShoppingCart,
  Tag,
  TrendingUp,
  UserCog,
  Users,
  Video
} from 'lucide-react';
import { default as React, useEffect, useState } from 'react';

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  path: string;
  badge?: string | number;
  children?: MenuItem[];
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface AdminSidebarProps {
  className?: string;
  onNavigate?: (path: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ className = '', onNavigate }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [expandedSections, setExpandedSections] = useState<string[]>(['dashboard']);
  const [userInfo] = useState({
    name: 'Shahriar Sajeeb',
    role: 'Admin',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
  });

  // Menu configuration matching your exact requirements
  const menuSections: MenuSection[] = [
    {
      title: 'Dashboard',
      items: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          icon: <Home size={18} />,
          path: '/admin/dashboard'
        }
      ]
    },
    {
      title: 'Data',
      items: [
        {
          id: 'users',
          title: 'Users',
          icon: <Users size={18} />,
          path: '/admin/users',
          badge: '1.2k'
        },
        {
          id: 'invoices',
          title: 'Invoices',
          icon: <FileText size={18} />,
          path: '/admin/invoices',
          badge: 'new'
        }
      ]
    },
    {
      title: 'Content',
      items: [
        {
          id: 'create-course',
          title: 'Create Course',
          icon: <GraduationCap size={18} />,
          path: '/admin/courses/create'
        },
        {
          id: 'live-courses',
          title: 'Live Courses',
          icon: <PlayCircle size={18} />,
          path: '/admin/courses/live',
          badge: 5
        }
      ]
    },
    {
      title: 'Customization',
      items: [
        {
          id: 'hero',
          title: 'Hero',
          icon: <Monitor size={18} />,
          path: '/admin/customization/hero'
        },
        {
          id: 'faq',
          title: 'FAQ',
          icon: <HelpCircle size={18} />,
          path: '/admin/customization/faq'
        },
        {
          id: 'categories',
          title: 'Categories',
          icon: <Tag size={18} />,
          path: '/admin/customization/categories'
        }
      ]
    },
    {
      title: 'Controllers',
      items: [
        {
          id: 'manage-team',
          title: 'Manage Team',
          icon: <UserCog size={18} />,
          path: '/admin/team'
        }
      ]
    },
    {
      title: 'Analytics',
      items: [
        {
          id: 'course-analytics',
          title: 'Course Analytics',
          icon: <BookOpen size={18} />,
          path: '/admin/analytics/courses'
        },
        {
          id: 'order-analytics',
          title: 'Order Analytics',
          icon: <ShoppingCart size={18} />,
          path: '/admin/analytics/orders'
        },
        {
          id: 'user-analytics',
          title: 'User Analytics',
          icon: <TrendingUp size={18} />,
          path: '/admin/analytics/users'
        }
      ]
    },
    {
      title: 'Extra',
      items: [
        {
          id: 'settings',
          title: 'Settings',
          icon: <Settings size={18} />,
          path: '/admin/settings'
        }
      ]
    }
  ];

  // Handle menu item click
  const handleItemClick = (item: MenuItem) => {
    setActiveItem(item.id);
    if (onNavigate) {
      onNavigate(item.path);
    }
  };

  // Toggle section expansion
  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionTitle)
        ? prev.filter(s => s !== sectionTitle)
        : [...prev, sectionTitle]
    );
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        setIsCollapsed(!isCollapsed);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isCollapsed]);

  // Responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-expand sections based on active item
  useEffect(() => {
    const activeSection = menuSections.find(section =>
      section.items.some(item => item.id === activeItem)
    );

    if (activeSection && !expandedSections.includes(activeSection.title)) {
      setExpandedSections(prev => [...prev, activeSection.title]);
    }
  }, [activeItem]);

  return (
    <div className={`${className}`}>
      <div
        className={`
          fixed left-0 top-0 h-full bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 z-50
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-16' : 'w-72'}
          flex flex-col shadow-2xl
        `}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-800 bg-gray-100 dark:bg-slate-800/50 transition-colors duration-300">
          <div className={`flex items-center space-x-3 ${isCollapsed ? 'hidden' : 'block'}`}>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500 shadow-lg">
              <img
                src={userInfo.avatar}
                alt={userInfo.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-gray-900 dark:text-white font-semibold text-sm">{userInfo.name}</span>
              <span className="text-gray-500 dark:text-slate-400 text-xs">- {userInfo.role}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 shadow-md hover:shadow-lg"
              title={isCollapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar (Ctrl+B)'}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-700 scrollbar-track-gray-100 dark:scrollbar-track-slate-800 transition-colors duration-300">
          {menuSections.map((section) => (
            <div key={section.title} className="mb-6">
              {/* Section Header */}
              {!isCollapsed && (
                <div
                  className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-300 transition-colors duration-200 flex items-center justify-between group"
                  onClick={() => toggleSection(section.title)}
                >
                  <span>{section.title}</span>
                  <ChevronRight
                    size={12}
                    className={`transform transition-transform duration-200 ${expandedSections.includes(section.title) ? 'rotate-90' : ''
                      }`}
                  />
                </div>
              )}

              {/* Section Items */}
              <div className={`space-y-1 transition-all duration-300 ${isCollapsed ? '' : expandedSections.includes(section.title) ? 'block' : 'hidden'
                }`}>
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`
                      w-full flex items-center px-3 py-2.5 rounded-lg text-left
                      transition-all duration-200 group relative transform hover:scale-105
                      ${activeItem === item.id
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25 border border-blue-500/30'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white hover:shadow-md'
                      }
                      ${isCollapsed ? 'justify-center' : 'justify-start'}
                    `}
                    title={isCollapsed ? item.title : ''}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className={`flex-shrink-0 transition-colors duration-200 ${activeItem === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'
                        }`}>
                        {item.icon}
                      </div>

                      {!isCollapsed && (
                        <>
                          <span className="font-medium text-sm truncate">{item.title}</span>
                          {item.badge && (
                            <span className={`
                              ml-auto px-2 py-0.5 text-xs rounded-full font-medium shadow-sm
                              ${typeof item.badge === 'number'
                                ? 'bg-red-500 text-white'
                                : 'bg-green-500 text-white'
                              }
                            `}>
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap shadow-xl border border-slate-700">
                        {item.title}
                        {item.badge && (
                          <span className={`
                            ml-2 px-1.5 py-0.5 text-xs rounded-full
                            ${typeof item.badge === 'number'
                              ? 'bg-red-500 text-white'
                              : 'bg-green-500 text-white'
                            }
                          `}>
                            {item.badge}
                          </span>
                        )}
                        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-slate-800"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Section - Logout */}
        <div className="border-t border-slate-800 p-4 bg-slate-800/30">
          <button
            onClick={() => handleItemClick({ id: 'logout', title: 'Logout', icon: <LogOut size={18} />, path: '/logout' })}
            className={`
              w-full flex items-center px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300
              transition-all duration-200 group transform hover:scale-105 border border-transparent hover:border-red-500/20
              ${isCollapsed ? 'justify-center' : 'justify-start'}
            `}
            title={isCollapsed ? 'Logout' : ''}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!isCollapsed && <span className="ml-3 font-medium text-sm">Logout</span>}

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap shadow-xl border border-slate-700">
                Logout
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-slate-800"></div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </div>
  );
};

export default AdminSidebar;