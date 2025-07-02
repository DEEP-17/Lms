import { useLogOutQuery } from '@/redux/features/auth/authApi';
import { User } from '@/types/user';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileText,
  GraduationCap,
  HelpCircle,
  Home,
  LogOut,
  Mail,
  Monitor,
  PlayCircle,
  ShoppingCart,
  Tag,
  TrendingUp,
  UserCog,
  Users
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { cookies } from 'next/headers';
import { usePathname, useRouter } from 'next/navigation';
import { default as React, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaQuestionCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  path: string;
  children?: MenuItem[];
  badge?: string | number;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface AdminSidebarProps {
  className?: string;
  onNavigate?: (path: string) => void;
  onToggle?: (collapsed: boolean) => void;
  activeItem?: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  className = '',
  onNavigate,
  onToggle,
  activeItem: activeItemProp
}: AdminSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['dashboard']);
  const user = useSelector((state: { auth: { user: User } }) => state.auth.user);
  const avatar = user && user.avatar && user.avatar.public_id !== 'default_avatar' ? user.avatar.url : '/avatar.jpg';
  const name = user?.name || 'Admin';
  const role = user?.role || 'Admin';
  const router = useRouter();
  const pathname = usePathname();
  const [logout, setLogout] = useState(false);
  const { refetch: logoutRefetch } = useLogOutQuery(undefined, { skip: !logout });

  // Map path to sidebar item id
  const getActiveItemId = (path: string) => {
    if (path.startsWith('/admin/dashboard')) return 'dashboard';
    if (path.startsWith('/admin/users')) return 'users';
    if (path.startsWith('/admin/invoices')) return 'invoices';
    if (path.startsWith('/admin/courses/create')) return 'create-course';
    if (path.startsWith('/admin/courses/live')) return 'live-courses';
    if (path.startsWith('/admin/newsletter')) return 'newsletter-management';
    if (path.startsWith('/admin/customization/hero')) return 'hero';
    if (path.startsWith('/admin/customization/faq')) return 'faq';
    if (path.startsWith('/admin/customization/categories')) return 'categories';
    if (path.startsWith('/admin/customization/testimonials')) return 'testimonials';
    if (path.startsWith('/admin/customization/why-trust-us')) return 'why-trust-us';
    if (path.startsWith('/admin/customization/newsletter')) return 'newsletter';
    if (path.startsWith('/admin/customization/knowledge-guarantee')) return 'knowledge-guarantee';
    if (path.startsWith('/admin/team')) return 'manage-team';
    if (path.startsWith('/admin/analytics/courses')) return 'course-analytics';
    if (path.startsWith('/admin/analytics/orders')) return 'order-analytics';
    if (path.startsWith('/admin/analytics/users')) return 'user-analytics';
    if (path.startsWith('/admin/settings')) return 'settings';
    if (path.startsWith('/admin/queries')) return 'user-queries';
    return '';
  };

  const activeItem = activeItemProp || getActiveItemId(pathname || '');

  // Menu configuration matching your exact requirements
  const menuSections: MenuSection[] = [
    {
      title: 'Dashboard',
      items: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          icon: <Home size={18} />,
          path: '/admin'
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
          path: '/admin/users'
        },
        {
          id: 'invoices',
          title: 'Invoices',
          icon: <FileText size={18} />,
          path: '/admin/invoices',
          badge: 'new'
        },
        {
          id: 'user-queries',
          title: 'User Queries',
          icon: <FaQuestionCircle size={18} />,
          path: '/admin/queries',
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
      title: 'Newsletter Management',
      items: [
        {
          id: 'newsletter-management',
          title: 'Send Emails',
          icon: <Mail size={18} />,
          path: '/admin/newsletter'
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
          id: 'categories',
          title: 'Categories',
          icon: <Tag size={18} />,
          path: '/admin/customization/categories'
        },
        {
          id: 'testimonials',
          title: 'Testimonials',
          icon: <Users size={18} />,
          path: '/admin/customization/testimonials'
        },
        {
          id: 'why-trust-us',
          title: 'Why Trust Us',
          icon: <HelpCircle size={18} />,
          path: '/admin/customization/why-trust-us'
        },
        {
          id: 'newsletter',
          title: 'Newsletter',
          icon: <FileText size={18} />,
          path: '/admin/customization/newsletter'
        },
        {
          id: 'knowledge-guarantee',
          title: 'Knowledge Guarantee',
          icon: <GraduationCap size={18} />,
          path: '/admin/customization/knowledge-guarantee'
        },
        {
          id: 'faq',
          title: 'FAQ',
          icon: <HelpCircle size={18} />,
          path: '/admin/customization/faq'
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
    }
  ];

  // Handle menu item click
  const handleItemClick = (item: MenuItem) => {
    if (item.path && typeof item.path === 'string') {
      router.push(item.path);
      if (onNavigate) {
        onNavigate(item.path);
      }
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

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onToggle) {
      onToggle(newCollapsedState);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        const newCollapsedState = !isCollapsed;
        setIsCollapsed(newCollapsedState);
        if (onToggle) {
          onToggle(newCollapsedState);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isCollapsed, onToggle]);

  // Responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
        if (onToggle) {
          onToggle(true);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [onToggle]);

  // Auto-expand sections based on active item
  useEffect(() => {
    const activeSection = menuSections.find(section =>
      section.items.some(item => item.id === activeItem)
    );

    if (activeSection && !expandedSections.includes(activeSection.title)) {
      setExpandedSections(prev => [...prev, activeSection.title]);
    }
  }, [activeItem]);

  useEffect(() => {
    if (logout) {
      (async () => {
        await logoutRefetch();
        await signOut({ callbackUrl: '/' });
        toast.success('Logged out successfully');
        setLogout(false);
      })();
    }
  }, [logout, logoutRefetch]);

  const logOutHandler = async () => {
    setLogout(true);
    await signOut({ callbackUrl: '/' });
    (await cookies()).delete('refresh_token');
  };

  return (
    <div className={`${className} overflow-hidden`}>
      <div
        className={`
          absolute left-0 top-0 h-full bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-800 z-40
          transition-all duration-300 ease-in-out overflow-hidden
          ${isCollapsed ? 'w-16' : 'w-72'}
          flex flex-col shadow-lg
        `}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 transition-colors duration-300 flex-shrink-0">
          <div className={`flex items-center space-x-3 ${isCollapsed ? 'hidden' : 'block'}`}>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500 shadow-lg flex-shrink-0">
              <img
                src={avatar}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-gray-900 dark:text-white font-semibold text-sm truncate">{name}</span>
              <span className="text-gray-500 dark:text-slate-400 text-xs truncate">- {role}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={handleSidebarToggle}
              className="p-2 rounded-lg bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
              title={isCollapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar (Ctrl+B)'}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-700 scrollbar-track-gray-100 dark:scrollbar-track-slate-800 transition-colors duration-300">
          {menuSections.map((section) => (
            <div key={section.title} className="mb-4">
              {/* Section Header */}
              {!isCollapsed && (
                <div
                  className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-300 transition-colors duration-200 flex items-center justify-between group cursor-pointer"
                  onClick={() => toggleSection(section.title)}
                >
                  <span className="truncate">{section.title}</span>
                  <ChevronRight
                    size={12}
                    className={`transform transition-transform duration-200 flex-shrink-0 ${expandedSections.includes(section.title) ? 'rotate-90' : ''
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
                      transition-all duration-200 group relative transform hover:scale-105 cursor-pointer
                      ${activeItem === item.id
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25 border border-blue-500/30'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white hover:shadow-md'
                      }
                      ${isCollapsed ? 'justify-center' : 'justify-start'}
                    `}
                    title={isCollapsed ? item.title : ''}
                  >
                    <div className="flex items-center space-x-3 min-w-0 w-full">
                      <div className={`flex-shrink-0 transition-colors duration-200 ${activeItem === item.id ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                        }`}>
                        {item.icon}
                      </div>

                      {!isCollapsed && (
                        <>
                          <span className="font-medium text-sm truncate flex-1">{item.title}</span>
                        </>
                      )}
                    </div>

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap shadow-xl border border-slate-700">
                        {item.title}
                        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-slate-800"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Section - Landing Page Redirect and Logout */}
        <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/30 flex-shrink-0">
          {/* Landing Page Button */}
          <button
            onClick={() => router.push('/')}
            className={`
              w-full flex items-center px-3 py-2.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-700 dark:hover:text-blue-300
              transition-all duration-200 group transform hover:scale-105 border border-transparent hover:border-blue-200 dark:hover:border-blue-500/20 
              ${isCollapsed ? 'justify-center mb-2' : 'justify-start mb-2'}
              cursor-pointer
            `}
            title={isCollapsed ? 'Go to Landing Page' : ''}
          >
            <Home size={18} className="flex-shrink-0" />
            {!isCollapsed && <span className="ml-3 font-medium text-sm truncate">Go to Home</span>}
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap shadow-xl border border-slate-700">
                Go to Home
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-slate-800"></div>
              </div>
            )}
          </button>
          {/* Logout Button */}
          <button
            onClick={logOutHandler}
            className={`
              w-full flex items-center px-3 py-2.5 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300
              transition-all duration-200 group transform hover:scale-105 border border-transparent hover:border-red-200 dark:hover:border-red-500/20 
              ${isCollapsed ? 'justify-center' : 'justify-start'}
              cursor-pointer
            `}
            title={isCollapsed ? 'Logout' : ''}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!isCollapsed && <span className="ml-3 font-medium text-sm truncate">Logout</span>}

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap shadow-xl border border-slate-700">
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
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm cursor-pointer"
          onClick={() => {
            setIsCollapsed(true);
            if (onToggle) {
              onToggle(true);
            }
          }}
        />
      )}
    </div>
  );
};

export default AdminSidebar;