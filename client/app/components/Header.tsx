'use client'

import React, { FC, useState, useEffect } from "react";
import Link from "next/link";
import NavItems from "../utils/NavItems";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import {HiOutlineMenuAlt3,HiOutlineUserCircle} from "react-icons/hi"
import CustomModal from "../utils/CustomModal";
import Login from "../components/Auth/Login";
type Props = {
    activeItem: number;
    open?: boolean;
    setOpen?: (open: boolean) => void;
    route:string;
    setRoute?: (route: string) => void;
};

const Header: FC<Props> = ({ activeItem, setOpen, route,open,setRoute}) => {
    const [active, setActive] = useState(false);
const [openSidebar,setOpenSidebar]=useState(false);
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 80) {
                setActive(true);
            } else {
                setActive(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
const handleClose=(e:any)=>{
    if(e.target.id==="screen")
    {
        setOpenSidebar(false);
    }

}

    return (
        <div className="w-full relative">
            <div className={`${active
                ? "dark:bg-opacity-50 dark:bg-slate-900 bg-white fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500"
                : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow bg-white dark:bg-slate-900"
            }`}>
                <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
                    <div className="w-full h-[80px] flex items-center justify-between p-3">
                        <div>
                            <Link
                                href={"/"}
                                className={`text-[25px] font-Poppins font-[500] text-black dark:text-white hover:text-[#37a39a] dark:hover:text-[#37a39a] transition-colors`}
                            >
                                Elearning
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <NavItems
                                activeItem={activeItem}
                                isMobile={false}
                            />
                            <ThemeSwitcher />
                            {/* {only for mobile} */}
                            <div className="80px:block">
                                <HiOutlineMenuAlt3
                                size={25}
                                className="cursor-pointer dark:text-white text-black"
                                onClick={()=>setOpenSidebar(true)}
                                />
                            
                            </div>
                            <HiOutlineUserCircle 
                            size={25}
                            className="800px:block  cursor-pointer dark:text-white text-black"
                            onClick={()=>setOpen?.(true)}
                            />
                        </div>
                    </div>
                </div>
                {/* {Mobile Sidebar} */}
                {
                    openSidebar && (
                        <div 
                        className="fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]"
                        onClick={handleClose}
                        id="screen"
                        >
                         <div className="w-[70%] fixed h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0">
                            <NavItems activeItem={activeItem} isMobile={true}/>
                             <HiOutlineUserCircle 
                            size={25}
                            className="cursor-pointer dark:text-white text-black"
                            onClick={()=>setOpen?.(true)}
                            />
                            <br />
                            <br />
                            <p className="text-[16px] px-2 pl-5 text-black dark:text-white">
                                copyright &copy; 2023 Elearning. All rights reserved.
                            </p>
                        </div>
                        </div>
                    )
                }
            </div> 
            
            {
                route==="Login" && (
                    <>
                    open && ( 
                        <CustomModal  
                            open={open ?? false}
                            setOpen={setOpen ?? (() => {})}
                            setRoute={setRoute}
                            component={Login}
                            activeItem={activeItem}
                        />)
                        </>
                    
                )
            }
            {
                route ==="Sign-Up"&&(
                    <>
                    </>
                )
            }
        </div>
    );
};

export default Header;