'use client';

import Link from 'next/link';
import React from 'react';

export const navItemsData = [
  { name: "Home", url: "/home" },
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
      <div className="hidden 800px:flex">
        {navItemsData.map((i, index) => (
          <Link href={i.url} key={index}>
            <span
              className={`${
                activeItem === index
                  ? "text-[crimson] dark:text-[#37a39a]"
                  : "text-black dark:text-white"
              } text-[18px] px-6 font-Poppins font-[400]`}
            >
              {i.name}
            </span>
          </Link>
        ))}
      </div>

      {/* Mobile nav */}
      {isMobile && (
        <div className="800px:hidden mt-5 w-full text-center py-6">
          {navItemsData.map((i, index) => (
            <Link href={i.url} key={index}>
              <span
                className={`${
                  activeItem === index
                    ? "text-[crimson] dark:text-[#37a39a]"
                    : "text-black dark:text-white"
                } text-[18px] block py-2 font-Poppins font-[400]`}
              >
                {i.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default NavItems;
