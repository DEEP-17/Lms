'use client';
import { useLogOutQuery, useSocialAuthMutation } from "@/redux/features/auth/authApi";
import { Button } from '@mui/material';
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { User } from "../../types/user";
import Login from "../components/Auth/Login";
import SignUp from "../components/Auth/SignUp";
import Verification from "../components/Auth/Verification";
import CustomModal from "../utils/CustomModal";
import NavItems from "../utils/NavItems";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";

type Props = {
    activeItem: number;
    open?: boolean;
    setOpen?: (open: boolean) => void;
    route: string;
    setRoute?: (route: string) => void;
};

const Header: FC<Props> = ({ activeItem, setOpen, route, open, setRoute }) => {
    console.log(activeItem);
    const [active, setActive] = useState(false);
    const [openSidebar, setOpenSidebar] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const { user } = useSelector((state: { auth: { user: User | null } }) => state.auth);
    const { data } = useSession();
    const [socialAuth, { isSuccess, error }] = useSocialAuthMutation();
    const [logout, setLogout] = useState(false);
    const pathname = usePathname();
    useLogOutQuery(undefined, { skip: !logout ? true : false });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!user && data) {
            socialAuth({
                name: data?.user?.name,
                email: data?.user?.email,
                avatar: {
                    public_id: "social_avatar",
                    url: data?.user?.image
                }
            });
        }
        if (data === null && isSuccess) {
            toast.success("Social login successful!");
        }
        if (data === null) {
            setLogout(true);
        }
        if (error) {
            if ("data" in error) {
                interface ErrorResponse {
                    data: { message: string };
                }
                const errorData = error as ErrorResponse;
                toast.error(errorData.data.message);
            } else {
                toast.error("An error occurred during social login. Please try again.");
            }
        }
    }, [data, user]);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    setActive(scrollY > 10);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll);

        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);


    const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLDivElement).id === "screen") {
            setOpenSidebar(false);
        }
    };

    const handleNavClick = () => {
        setOpenSidebar(false); // Close mobile sidebar when any nav item is clicked
    };

    return (
        <div>
            {/* Main Header */}
            <header
                className={`w-full top-0 z-50 fixed transition-all duration-300 ease-in-out
                  ${active
                        ? 'bg-white/80 dark:bg-slate-800/80 shadow-lg backdrop-blur-md h-16'
                        : 'bg-white/60 dark:bg-slate-800/60 shadow-none backdrop-blur h-16'}
                `}
                style={{
                    boxShadow: active ? '0 2px 16px 0 rgba(0,0,0,0.08)' : 'none',
                    borderBottom: active ? '1px solid rgba(0,0,0,0.04)' : 'none',
                }}
            >
                <div className="h-16 flex items-center justify-between mx-10">
                    <div className="flex w-full h-full items-center gap-6">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 h-full">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">E</span>
                            </div>
                            <span className="text-xl font-bold text-black dark:text-white hover:text-[#37a39a] dark:hover:text-[#37a39a] transition-colors">
                                Elearning
                            </span>
                        </Link>

                        {/* Centered Nav */}
                        <nav className="hidden md:flex items-center justify-center gap-8 h-full relative w-full">
                            <NavItems isMobile={false} onNavClick={handleNavClick} pathname={pathname} />
                        </nav>

                        {/* Desktop Right Side */}
                        <div className="hidden md:flex items-center space-x-4 h-full flex-shrink-0">
                            <ThemeSwitcher />
                            {isMounted && user ? (
                                <Link href="/profile" className="h-[35px] w-[35px] flex items-center justify-center">
                                    <Image
                                        src={(user && user.avatar && user.avatar.public_id !== "default_avatar" && user.avatar.url)
                                            ? user.avatar.url
                                            : "/avatar.jpg"}
                                        alt="Profile"
                                        width={35}
                                        height={35}
                                        className="rounded-full border-2 border-cyan-400 dark:border-cyan-200 shadow-xl object-cover w-full h-full"
                                    
                                    />
                                </Link>
                            ) : (
                                <HiOutlineUserCircle
                                    size={26}
                                    className="text-black dark:text-white cursor-pointer transition-colors"
                                    onClick={() => setOpen?.(true)}
                                />
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden flex items-center justify-center h-full cursor-pointer"
                            onClick={() => setOpenSidebar(true)}
                        >
                            <HiOutlineMenuAlt3
                                size={24}
                                className="text-black dark:text-white cursor-pointer transition-colors"
                            />
                        </button>
                    </div>
                </div>
            </header>

            {/* Sidebar for Mobile */}
            {openSidebar && (
                <div
                    id="screen"
                    onClick={handleClose}
                    className="fixed inset-0 z-[9999] bg-black bg-opacity-40 cursor-pointer"
                >
                    <aside className="fixed top-0 right-0 w-[80%] sm:w-[70%] max-w-[350px] h-full bg-white dark:bg-slate-800 p-6 space-y-4">
                        <nav className="flex flex-col space-y-4">
                            <NavItems activeItem={activeItem} isMobile={true} onNavClick={handleNavClick} pathname={pathname} />

                            <HiOutlineUserCircle
                                size={26}
                                className="text-black dark:text-white cursor-pointer transition-colors"
                                onClick={() => {
                                    setOpen?.(true);
                                    setOpenSidebar(false);
                                }}
                            />

                            <p className="text-sm text-black dark:text-white pt-10">
                                &copy; 2025 Elearning. All rights reserved.
                            </p>
                        </nav>
                    </aside>
                </div>
            )}

            {/* Auth Modals */}
            {route === "Login" && open && (
                <CustomModal
                    open={open}
                    setOpen={setOpen ?? (() => { })}
                    setRoute={setRoute}
                    component={Login}
                    activeItem={activeItem}
                />
            )}
            {route === "Sign-Up" && open && (
                <CustomModal
                    open={open}
                    setOpen={setOpen ?? (() => { })}
                    setRoute={setRoute}
                    component={SignUp}
                    activeItem={activeItem}
                />
            )}
            {route === "Verification" && open && (
                <CustomModal
                    open={open}
                    setOpen={setOpen ?? (() => { })}
                    setRoute={setRoute}
                    component={Verification}
                    activeItem={activeItem}
                />
            )}
        </div>
    );
};

export default Header;
