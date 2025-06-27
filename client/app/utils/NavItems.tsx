'use client';

import { Button } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { FaBook, FaEnvelope, FaHome, FaInfoCircle, FaListAlt, FaPhoneAlt, FaQuestionCircle, FaQuoteRight, FaShieldAlt, FaUserShield } from 'react-icons/fa';

interface NavItem {
  name: string;
  url?: string;
  isModal?: boolean;
  isScroll?: boolean;
  targetId?: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

export const navItemsData: NavItem[] = [
  {
    name: "Home",
    isScroll: true,
    targetId: "hero",
    icon: <FaHome />,
    children: [
      { name: "Knowledge Guarantee", isScroll: true, targetId: "knowledge-guarantee", icon: <FaShieldAlt /> },
      { name: "Categories", isScroll: true, targetId: "categories", icon: <FaListAlt /> },
      { name: "Why Trust Us", isScroll: true, targetId: "why-trust-us", icon: <FaUserShield /> },
      { name: "Testimonials", isScroll: true, targetId: "testimonials", icon: <FaQuoteRight /> },
      { name: "FAQ", isScroll: true, targetId: "faq", icon: <FaQuestionCircle /> },
      { name: "Newsletter", isScroll: true, targetId: "newsletter", icon: <FaEnvelope /> },


    ]
  },
  {
    name: "Courses",
    url: "/courses",
    icon: <FaBook />
  },
  { name: "About Us", url: "/about-us", icon: <FaInfoCircle /> },
  { name: "Contact", url: "/contact-us", icon: <FaPhoneAlt /> },
];

type Props = {
  isMobile: boolean;
  onNavClick?: () => void;
  pathname?: string;
};

const NavItems: React.FC<Props> = ({ isMobile, onNavClick, pathname: propPathname }) => {
  const router = useRouter();
  const pathname = propPathname || usePathname();
  const [expand, setExpand] = React.useState(false);

  // Determine active item based on pathname
  let activeItem = -1;
  if (pathname === '/') activeItem = 0;
  else if (pathname === '/courses') activeItem = 1;
  else if (pathname?.startsWith('/courses/')) activeItem = 1;
  else if (pathname === '/about-us') activeItem = 2;
  else if (pathname === '/contact-us') activeItem = 3;
  // else keep Home as default

  const handleItemClick = (item: NavItem) => {
    if (item.name === "Home") {
      setExpand(true);
    }
    if (item.isScroll && item.targetId) {
      if (pathname === '/' || pathname === undefined) {
        const element = document.getElementById(item.targetId);
        if (element) {
          const headerHeight = 100;
          const elementPosition = element.offsetTop - headerHeight;
          window.scrollTo({ top: elementPosition, behavior: 'smooth' });
        }
        onNavClick?.();
        return;
      } else {
        router.push(`/#${item.targetId}`);
        onNavClick?.();
        return;
      }
    }
    if (item.url) {
      router.push(item.url);
      onNavClick?.();
      return;
    }
  };

  // Home and Courses as top-level nav items
  const homeItem = navItemsData[0];
  const coursesItem = navItemsData[1];
  const aboutItem = navItemsData[2];
  const contectItem = navItemsData[3];

  return (
    <>
      {/* Desktop nav */}
      <div className="hidden md:flex items-center justify-center gap-8 relative w-full">
        {/* Home nav item with expand */}
        <div
          className="relative"
          onMouseEnter={() => setExpand(true)}
        >
          <button
            className={`flex items-center gap-2 text-[18px] font-Poppins font-[400] transition-colors cursor-pointer  ${activeItem === 0
              ? 'text-[crimson] dark:text-[#37a39a]'
              : 'text-black dark:text-white'
              }`}
            onClick={() => handleItemClick(homeItem)}
          >
            {homeItem.icon}
            {homeItem.name}
          </button>
          {/* Expand box - full width, low opacity, modern design */}
          {expand && (
            <div className="fixed left-0 right-0 top-full w-screen bg-white/80 dark:bg-slate-800/80 shadow-2xl rounded-b-xl px-6 py-4 flex flex-wrap gap-2 z-50 border-t border-gray-200 dark:border-slate-700 backdrop-blur-md" style={{ opacity: 0.97 }} onMouseLeave={() => setExpand(false)}>
              {homeItem.children?.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleItemClick(item)}
                  className="flex items-center gap-2 px-6 py-4 rounded-lg hover:bg-[#BE3D2A] dark:hover:bg-slate-900 transition-colors text-md font-medium text-black dark:text-white min-w-[240px] shadow-sm border border-transparent hover:border-cyan-300 dark:hover:border-cyan-700 cursor-pointer"
                >
                  {item.icon}
                  {item.name}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Courses nav item */}
        <button
          className={`flex items-center gap-2 text-[18px] font-Poppins font-[400] transition-colors cursor-pointer ${activeItem === 1
            ? 'text-[crimson] dark:text-[#37a39a]'
            : 'text-black dark:text-white'
            }`}
          onClick={() => handleItemClick(coursesItem)}
        >
          {coursesItem.icon}
          {coursesItem.name}
        </button>
        <button
          className={`flex items-center gap-2 text-[18px] font-Poppins font-[400] transition-colors cursor-pointer ${activeItem === 2
            ? 'text-[crimson] dark:text-[#37a39a]'
            : 'text-black dark:text-white'
            }`}
          onClick={() => handleItemClick(aboutItem)}
        >
          {aboutItem.icon}
          {aboutItem.name}
        </button>
        <button
          className={`flex items-center gap-2 text-[18px] font-Poppins font-[400] transition-colors cursor-pointer ${activeItem === 3
            ? 'text-[crimson] dark:text-[#37a39a]'
            : 'text-black dark:text-white'
            }`}
          onClick={() => handleItemClick(contectItem)}
        >
          {contectItem.icon}
          {contectItem.name}
        </button>
      </div>

      {/* Mobile nav (all as vertical list) */}
      {isMobile && (
        <div className="block md:hidden mt-6">
          {[homeItem, ...homeItem.children ?? [], coursesItem, aboutItem, contectItem].map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleItemClick(item)}
              className={`block w-full text-left py-3 px-4 text-[18px] font-Poppins font-[400] transition-colors cursor-pointer text-black dark:text-white`}
            >
              {item.icon} {item.name}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default NavItems;
