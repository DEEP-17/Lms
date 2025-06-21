'use client';
import { useLogOutQuery, useSocialAuthMutation } from "@/redux/features/auth/authApi";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
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
    const { user } = useSelector((state: any) => state.auth);
    const { data } = useSession();
    const [socialAuth, { isSuccess, error }] = useSocialAuthMutation();
    const [logout, setLogout] = useState(false);
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

    return (
        <div>
            {/* Main Header */}
            <header
                className={`w-full top-0 z-50 fixed transition-colors duration-500 ease-in-out ${!active
                    ? "bg-white dark:bg-slate-900 shadow-lg backdrop-blur-md"
                    : "bg-transparent  dark:bg-slate-900/60 shadow-none backdrop-blur-0"
                    }`}
            >
                <div className="max-w-[1200px] mx-auto px-4">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">E</span>
                            </div>
                            <span className="text-xl font-bold text-black dark:text-white hover:text-[#37a39a] dark:hover:text-[#37a39a] transition-colors">
                                Elearning
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <NavItems activeItem={activeItem} isMobile={false} />
                        </nav>

                        {/* Desktop Right Side */}
                        <div className="hidden md:flex items-center space-x-4">
                            <ThemeSwitcher />

                            {isMounted && user ? (
                                <Link href="/profile" className="h-[35px] w-[35px]">
                                    <Image
                                        src={user && user.avatar && user.avatar.public_id !== "default_avatar"
                                            ? user.avatar.url
                                            : "/avatar.jpg"}
                                        alt="Profile"
                                        width={35}
                                        height={35}
                                        className="rounded-full border-2 border-black dark:border-black shadow-xl object-cover w-full h-full"
                                        style={{ border: (activeItem === 5) ? "3px solid #ffc107" : "none" }}
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
                            className="md:hidden"
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
                    className="fixed inset-0 z-[9999] bg-black bg-opacity-40"
                >
                    <aside className="fixed top-0 right-0 w-[80%] sm:w-[70%] max-w-[350px] h-full bg-white dark:bg-slate-900 p-6 space-y-4">
                        <nav className="flex flex-col space-y-4">
                            <NavItems activeItem={activeItem} isMobile={true} />

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
