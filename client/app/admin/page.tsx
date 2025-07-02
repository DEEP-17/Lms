'use client';

import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import DashboardHeader from '../components/Admin/dashboard/DashboardHeader';
import DashboardSummary from '../components/Admin/dashboard/DashboardSummary';
import AdminSidebar from '../components/Admin/sidebar/AdminSidebar';
import AdminProtected from "../hooks/adminProtected";
import Heading from "../utils/Heading";
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import { Loader } from 'lucide-react';

const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { status: sessionStatus } = useSession();
  const { data: userData, isLoading } = useLoadUserQuery(undefined);
  const router = useRouter();

  const handleSidebarToggle = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };
  const pathname = usePathname() || '';

  React.useEffect(() => {
    if (sessionStatus === 'unauthenticated' && !userData) {
      toast.error('You must be an admin to access this page.');
      router.replace('/');
    }
  }, [sessionStatus, router, userData]);

  // Map path to sidebar item id
  const getActiveItemId = (path: string) => {
    if (path.startsWith('/admin/dashboard')) return 'dashboard';
    if (path.startsWith('/admin/users')) return 'users';
    if (path.startsWith('/admin/invoices')) return 'invoices';
    if (path.startsWith('/admin/courses/create')) return 'create-course';
    if (path.startsWith('/admin/courses/live')) return 'live-courses';
    if (path.startsWith('/admin/customization/hero')) return 'hero';
    if (path.startsWith('/admin/customization/faq')) return 'faq';
    if (path.startsWith('/admin/customization/categories')) return 'categories';
    if (path.startsWith('/admin/team')) return 'manage-team';
    if (path.startsWith('/admin/analytics/courses')) return 'course-analytics';
    if (path.startsWith('/admin/analytics/orders')) return 'order-analytics';
    if (path.startsWith('/admin/analytics/users')) return 'user-analytics';
    if (path.startsWith('/admin/settings')) return 'settings';
    return '';
  };

  const activeItem = getActiveItemId(pathname);

  // Show loader until admin user is loaded
  if (sessionStatus === 'loading' || isLoading) {
    return (
      <Loader/>
    );
  }
  if (sessionStatus === 'unauthenticated' && !userData) return null;

  return (
    <div className="admin-layout overflow-hidden">
      <AdminProtected>
        <Heading title="Elearning-Admin"
          description="Admin Dashboard for Elearning Platform"
          keywords="programming,MERN,REDUX" />

        <AdminSidebar
          onNavigate={router.push}
          onToggle={handleSidebarToggle}
          activeItem={activeItem}
        />
        <div
          className={`transition-all duration-300 ease-in-out min-h-screen overflow-x-hidden text-black ${isSidebarCollapsed ? 'ml-16' : 'ml-72'
            }`}
        >
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto text-black">
            <DashboardSummary />
          </main>
        </div>
      </AdminProtected>
    </div>
  );
};

export default AdminLayout;