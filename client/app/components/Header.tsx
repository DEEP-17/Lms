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
        if (data===null && isSuccess) {
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
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setActive(true);
            } else {
                setActive(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

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
            <header
                className={`${active
                    ? "fixed top-0 left-0 w-full bg-white dark:bg-slate-900 shadow-md"
                    : "bg-white dark:bg-slate-900"
                    }`}
            >
                <div className="h-[60px] flex items-center justify-between px-4 md:px-8">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-xl md:text-2xl font-bold text-black dark:text-white hover:text-[#37a39a] dark:hover:text-[#37a39a] transition-colors"
                    >
                        Elearning
                    </Link>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex">
                            <NavItems activeItem={activeItem} isMobile={false} />
                        </div>

                        {/* Theme Switcher */}
                        <ThemeSwitcher />

                        {/* Mobile Menu Icon */}
                        <div className="md:hidden">
                            <HiOutlineMenuAlt3
                                size={24}
                                className="text-black dark:text-white cursor-pointer transition-colors"
                                onClick={() => setOpenSidebar(true)}
                            />
                        </div>

                        {/* Desktop Profile Icon */}
                        {
                            isMounted && user ? (
                                <Link href="/profile">
                                    <Image
                                        src={user && user.avatar && user.avatar.public_id !== "default_avatar"
                                            ? user.avatar.url
                                            : "/avatar.jpg"}
                                        alt="Profile"
                                        width={30}
                                        height={30}
                                        className="rounded-full cursor-pointer bg-transparent"
                                    />
                                </Link>
                            ) : (
                                <HiOutlineUserCircle size={26} className="hidden md:block text-black dark:text-white cursor-pointer transition-colors"
                                    onClick={() => setOpen?.(true)}
                                />
                            )
                        }
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
                    <aside className="fixed top-0 right-0 w-[80%] sm:w-[70%] max-w-[350px] h-full bg-white dark:bg-slate-900 p-6 space-y-4 transition-colors">
                        <NavItems activeItem={activeItem} isMobile={true} />
                        <HiOutlineUserCircle
                            size={26}
                            className="text-black dark:text-white cursor-pointer transition-colors"
                            onClick={() => {
                                setOpen?.(true);
                                setOpenSidebar(false);
                            }}
                        />
                        <p className="text-sm text-black dark:text-white pt-10 transition-colors">
                            &copy; 2025 Elearning. All rights reserved.
                        </p>
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