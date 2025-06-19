'use client';

import  Heading  from "../utils/Heading";
import React from "react";
import AdminSidebar from "../components/Admin/sidebar/AdminSidebar";
import AdminProtected from "../hooks/adminProtected";
import DashboardHero from "../components/Admin/dashboard/DashboardHero";
import { redirect } from "next/navigation";
type props ={}
const page=(props: props) => {
  return (
    <div>
        <AdminProtected>
            <Heading title="Elearning-Admin"
            description="Admin Dashboard for Elearning Platform"
            keywords="programming,MERN,REDUX"/>
            <div className="flex h-[200vh]">
                <div className="1500px:w-[16%] w-1/5">
                <AdminSidebar onNavigate={redirect} />
                </div>
                <div className="w-[85%]">
                <DashboardHero/>
                </div>
            </div>
        </AdminProtected>
    </div>
  );
}
export default page;