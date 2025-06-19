'use client';
import React from 'react'
import AdminSidebar from '@/app/components/Admin/sidebar/AdminSidebar';
import Heading from '@/app/utils/Heading';
import CreateCourse from "../../components/Admin/Course/CreateCourse";
import DashboardHeader from '@/app/components/Admin/dashboard/DashboardHeader';

type Props = {}

const page = (props: Props) => {
  return (
    <div>
        <Heading
          title="Create Course"
          description="Fill in the details below to create a new course."
            keywords="create course, admin, elearning, course management"
        />
        <div className="flex">
            <div className="1550px:w-[16%] w-1/5">
                <AdminSidebar />
            </div>
            <div className="w-[85%]">
                <DashboardHeader  />
                <CreateCourse />
            </div>
        </div>
    </div>
  )
}