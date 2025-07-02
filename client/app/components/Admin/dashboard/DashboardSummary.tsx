import { useGetAllCoursesQuery, useGetAllOrdersQuery, useGetCourseAnalyticsQuery, useGetOrderAnalyticsQuery, useGetUserAnalyticsQuery } from '@/redux/features/api/apiSlice';
import { useGetAllUsersQuery } from '@/redux/features/user/userApi';
import React from 'react';
import { User } from '@/types/user';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const cardData = [
   {
      title: 'Users',
      color: 'border-blue-500',
      iconBg: 'bg-blue-100',
      textColor: 'text-blue-600',
      icon: (
         <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
      ),
   },
   {
      title: 'Orders',
      color: 'border-orange-400',
      iconBg: 'bg-orange-100',
      textColor: 'text-orange-500',
      icon: (
         <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v4a1 1 0 001 1h3m10-5h3a1 1 0 011 1v4a1 1 0 01-1 1h-3m-10 4h10m-10 4h10" /></svg>
      ),
   },
   {
      title: 'Courses',
      color: 'border-green-500',
      iconBg: 'bg-green-100',
      textColor: 'text-green-600',
      icon: (
         <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20l9-5-9-5-9 5 9 5zm0-10V4m0 0L3 9m9-5l9 5" /></svg>
      ),
   },
];

const DashboardSummary: React.FC = () => {
   // Fetch summary data
   const { data: usersData, isLoading: usersLoading, isError: usersError } = useGetAllUsersQuery();
   const users = (usersData && 'users' in usersData ? usersData.users : []) as User[];
   const { data: orders, isLoading: ordersLoading, isError: ordersError } = useGetAllOrdersQuery();
   const { data: courses, isLoading: coursesLoading, isError: coursesError } = useGetAllCoursesQuery();

   // Fetch analytics data
   const { data: userAnalytics, isLoading: userAnalyticsLoading } = useGetUserAnalyticsQuery();
   const { data: orderAnalytics, isLoading: orderAnalyticsLoading } = useGetOrderAnalyticsQuery();
   const { data: courseAnalytics, isLoading: courseAnalyticsLoading } = useGetCourseAnalyticsQuery();

   const summary = [
      {
         ...cardData[0],
         value: users ? users.length : 0,
         loading: usersLoading,
         error: usersError,
      },
      {
         ...cardData[1],
         value: orders ? orders.orders?.length || 0 : 0,
         loading: ordersLoading,
         error: ordersError,
      },
      {
         ...cardData[2],
         value: courses ? courses.courses?.length || 0 : 0,
         loading: coursesLoading,
         error: coursesError,
      },
   ];

   return (
      <div className="p-8 space-y-8">
         {/* Summary Cards */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {summary.map((item, idx) => (
               <div
                  key={item.title}
                  className={`bg-white dark:bg-slate-900 border-l-8 ${item.color} rounded-xl shadow p-6 flex items-center space-x-4 min-h-[120px]`}
               >
                  <div className={`flex-shrink-0 rounded-full ${cardData[idx].iconBg} p-3 flex items-center justify-center`}>{item.icon}</div>
                  <div>
                     <div className="text-gray-900 dark:text-white text-lg font-semibold">{item.title}</div>
                     <div className={`text-3xl font-bold mt-2 ${cardData[idx].textColor}`}>
                        {item.loading ? '...' : item.error ? '!' : item.value}
                     </div>
                  </div>
               </div>
            ))}
         </div>

         {/* Analytics Charts */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Users Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-6">
               <div className="font-semibold mb-2 dark:text-white">Users (Last 12 Months)</div>
               {userAnalyticsLoading ? (
                  <div>Loading...</div>
               ) : (
                  <ResponsiveContainer width="100%" height={200}>
                     <LineChart data={userAnalytics?.users?.last12Months || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" hide />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                     </LineChart>
                  </ResponsiveContainer>
               )}
            </div>
            {/* Orders Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-6">
               <div className="font-semibold mb-2 dark:text-white">Orders (Last 12 Months)</div>
               {orderAnalyticsLoading ? (
                  <div>Loading...</div>
               ) : (
                  <ResponsiveContainer width="100%" height={200}>
                     <LineChart data={orderAnalytics?.orders?.last12Months || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" hide />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#f59e42" strokeWidth={3} dot={{ r: 4 }} />
                     </LineChart>
                  </ResponsiveContainer>
               )}
            </div>
            {/* Courses Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-6">
               <div className="font-semibold mb-2 dark:text-white">Courses (Last 12 Months)</div>
               {courseAnalyticsLoading ? (
                  <div>Loading...</div>
               ) : (
                  <ResponsiveContainer width="100%" height={200}>
                     <LineChart data={courseAnalytics?.courses?.last12Months || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" hide />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                     </LineChart>
                  </ResponsiveContainer>
               )}
            </div>
         </div>
      </div>
   );
};

export default DashboardSummary; 