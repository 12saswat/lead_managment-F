"use client";
import { Bell, LogOut, Moon, Settings, User, X, ChevronDown, ChevronUp, Sun, SunMedium } from 'lucide-react'
import Link from 'next/link'
import React, { useState, useEffect } from 'react' // Import useEffect
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  expanded?: boolean;
};

const Navbar = () => {
  const { theme, setTheme } = useTheme(); // Get current theme
  const [mounted, setMounted] = useState(false); // State to handle hydration

  useEffect(() => {
    setMounted(true); // Set mounted to true after hydration
  }, []);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Message',
      message: 'You have received a new message from John Doe regarding the project deadline extension. The client has agreed to extend the deadline by two weeks, but they need the initial mockups by tomorrow evening.',
      time: '2 min ago',
      read: false,
      expanded: false
    },
    {
      id: '2',
      title: 'System Update',
      message: 'Your system has been updated to version 2.0. This includes several new features and security patches. Please review the changelog for complete details.',
      time: '1 hour ago',
      read: false,
      expanded: false
    },
    {
      id: '3',
      title: 'Payment Received',
      message: 'Your payment of $100 has been received successfully. The transaction ID is TXN-456789. Thank you for your business!',
      time: '3 hours ago',
      read: true,
      expanded: false
    },
    {
      id: '4',
      title: 'Meeting Reminder',
      message: 'You have a meeting at 2:00 PM today with the marketing team to discuss the Q3 campaign strategy. Please bring your presentation materials.',
      time: 'Yesterday',
      read: true,
      expanded: false
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? {...n, read: true} : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({...n, read: true})));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const deleteAllNotifications = () => {
    setNotifications([]);
  };

  const toggleExpand = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? {...n, expanded: !n.expanded} : n
    ));
  };

  const shouldTruncate = (message: string) => {
    return message.length > 80;
  };

  if (!mounted) {
    return null; // Don't render anything on the server to prevent hydration mismatch
  }

  return (
    <nav className='dark:bg-[#0F172B] backdrop-blur-2xl flex justify-between flex-col sticky z-20 h-16 top-0 shadow-sm dark:border-b-1 dark:border-gray-700'>
      <div className='flex items-center p-2 justify-between gap-4'>
        <SidebarTrigger />
        <div className='flex items-center justify-between gap-4'>
          
          {/* Notification Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className='w-5 h-5' />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
              <DropdownMenuLabel className="flex justify-between items-center px-4 py-3">
                <span>Notifications ({notifications.length})</span>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      markAllAsRead();
                    }}
                    className="text-xs h-6"
                  >
                    Mark all read
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAllNotifications();
                    }}
                    className="text-xs h-6 text-red-500 hover:text-red-600"
                  >
                    Clear all
                  </Button>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-4 text-center text-gray-500">
                    <Bell className="w-8 h-8 mb-2" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <DropdownMenuItem 
                      key={notification.id}
                      className={`flex flex-col items-start gap-1 p-3 border-b cursor-pointer ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex justify-between w-full">
                        <h4 className="font-medium">{notification.title}</h4>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="w-full">
                        <p className={`text-sm text-gray-600 dark:text-gray-300 ${!notification.expanded && shouldTruncate(notification.message) ? 'line-clamp-2' : ''}`}>
                          {notification.message}
                        </p>
                        {shouldTruncate(notification.message) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(notification.id);
                            }}
                            className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mt-1 flex items-center"
                          >
                            {notification.expanded ? (
                              <>
                                <ChevronUp className="w-3 h-3 mr-1" />
                                See Less
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-3 h-3 mr-1" />
                                See More
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">{notification.time}</span>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
            
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/">Dashboard</Link>
          
          {/* THEME TOGGLE BUTTON */}
          <div className="relative flex items-center p-1 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300 ease-in-out">
            <button
              onClick={() => setTheme("light")}
              className={`relative z-10 px-3 py-1 text-sm rounded-full transition-all duration-300 ease-in-out 
                ${theme === 'light' ? 'text-blue-600 font-semibold' : 'text-gray-600 dark:text-gray-300'}`}
            >
             <SunMedium />
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`relative z-10 px-3 py-1 text-sm rounded-full transition-all duration-300 ease-in-out 
                ${theme === 'dark' ? 'text-blue-600 font-semibold' : 'text-gray-600 dark:text-gray-300'}`}
            >
              <Moon />
            </button>
            <div className={`absolute top-0.5 bottom-0.5 w-[calc(50%-4px)] rounded-full bg-white dark:bg-gray-800 shadow-md transition-transform duration-300 ease-in-out
              ${theme === 'dark' ? 'translate-x-full' : 'translate-x-0'} `}></div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;