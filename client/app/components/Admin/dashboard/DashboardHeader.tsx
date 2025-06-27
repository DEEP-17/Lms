import { ThemeSwitcher } from '@/app/utils/ThemeSwitcher';
import { useGetAllNotificationsQuery, useUpdateNotificationMutation } from '@/redux/features/api/apiSlice';
import { Button } from '@mui/material';
import { AlertTriangle, Bell, CheckCircle, MessageSquare } from 'lucide-react';
import React, { useState } from 'react';

const DashboardHeader: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  const { data, isLoading, isError, refetch } = useGetAllNotificationsQuery();
  const [updateNotification] = useUpdateNotificationMutation();
  const notifications = data?.notifications || [];

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const markAsRead = async (id: string) => {
    await updateNotification(id);
    refetch();
  };

  const markAllAsRead = async () => {
    await Promise.all(
      notifications.filter(n => n.status === 'unread').map(n => updateNotification(n._id))
    );
    refetch();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-800 px-6 py-4 transition-colors duration-300 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-4">
          <div className="text-gray-900 dark:text-white text-xl font-bold">
            Dashboard
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-4">
          {/* Theme Switcher */}
          <ThemeSwitcher />

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-all duration-200 relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-10 cursor-pointer"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-20">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium cursor-pointer"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-700">
                    {isLoading ? (
                      <div className="p-4 text-center text-slate-500 dark:text-slate-400">Loading...</div>
                    ) : isError ? (
                      <div className="p-4 text-center text-red-500">Failed to load notifications</div>
                    ) : notifications.length === 0 ? (
                      <div className="p-4 text-center text-slate-500 dark:text-slate-400">No notifications</div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className={`p-4 border-b border-slate-100 dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${notification.status === 'unread' ? 'bg-blue-50 dark:bg-slate-700/50' : ''}`}
                        >
                          <div className="flex items-start space-x-3">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-slate-900 dark:text-white">
                                  {notification.title}
                                </p>
                                {notification.status === 'unread' && (
                                  <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 ml-2" />
                                )}
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                {new Date(notification.createdAt).toLocaleString()}
                              </p>
                              {notification.status === 'unread' && (
                                <button
                                  onClick={() => markAsRead(notification._id)}
                                  className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors duration-200 cursor-pointer"
                                >
                                  Mark as Read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;