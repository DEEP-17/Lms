'use client';

import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { BiMoon, BiSun } from "react-icons/bi";

export const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme, systemTheme } = useTheme();

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const currentTheme = theme === "system" ? systemTheme : theme;

    return (
        <button
            aria-label="Toggle Theme"
            onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark"
            )}
            className="flex items-center justify-center mx-4 focus:outline-none cursor-pointer"
        >
            {currentTheme === "dark" ? (
                <BiSun
                    size={25}
                    className="text-white hover:text-[#37a39a] transition-colors duration-300 cursor-pointer"
                />
            ) : (
                <BiMoon
                    size={25}
                    className="text-black hover:text-[#37a39a] transition-colors duration-300 cursor-pointer"
                />
            )}
        </button>
    );
};
