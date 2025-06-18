'use client';

import Link from 'next/link';
import React from 'react';

export const navItemsData = [
  { name: "Home", url: "/" },
  { name: "Courses", url: "/courses" },
  { name: "About", url: "/about" },
  { name: "Policy", url: "/policy" },
  { name: "FAQ", url: "/faq" },
];

type Props = {
  activeItem: number;
  isMobile: boolean;
};

const NavItems: React.FC<Props> = ({ activeItem, isMobile }) => {
  return (
    <>
      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-8">
        {navItemsData.map((item, index) => (
          <Link
            key={index}
            href={item.url}
            className={`text-[18px] font-Poppins font-[400] transition-colors ${activeItem === index
                ? 'text-[crimson] dark:text-[#37a39a]'
                : 'text-black dark:text-white'
              }`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Mobile nav */}
      {isMobile && (
        <div className="block md:hidden mt-6">
          {navItemsData.map((item, index) => (
            <Link
              key={index}
              href={item.url}
              className={`block py-3 px-4 text-[18px] font-Poppins font-[400] transition-colors ${activeItem === index
                  ? 'text-[crimson] dark:text-[#37a39a]'
                  : 'text-black dark:text-white'
                }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default NavItems;
