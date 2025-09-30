
"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect, use } from "react";

type Employee = {
  id: string;
  name: string;
  employeeId: string;
  project: string;
  employeeType: string;
};

type Request = {
  id: string;
  employeeId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  requestType: string;
  firstApprovment: string;
  secondApprovment: string;
  shiftType1: string;
  shiftType2: string;
  shiftDate1: string;
  shiftDate2: string;
  requestComment: string;
  replier1_Comment: string;
  replier2_Comment: string;
  approvalDate1: string;
  approvalDate2: string;
  read?: boolean; // Added read status
};

type NotificationItem = Request & {
  message: string;
  time: string;
  type: 'request' | 'approval' | 'rejection' | 'system';
};

export function SiteHeader() {
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [employee, setEmployee] = useState<Employee>();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Helper to manage read notification ids in localStorage (client-only persistence)
  const READ_KEY = "readNotifications";

  const getReadIds = (): Set<string> => {
    try {
      const raw = localStorage.getItem(READ_KEY);
      if (!raw) return new Set();
      const arr = JSON.parse(raw) as string[];
      return new Set(arr);
    } catch (e) {
      console.warn("Failed to parse readNotifications from localStorage", e);
      return new Set();
    }
  };

  const saveReadIds = (set: Set<string>) => {
    try {
      localStorage.setItem(READ_KEY, JSON.stringify(Array.from(set)));
    } catch (e) {
      console.warn("Failed to save readNotifications to localStorage", e);
    }
  };

  // Get employeeId from localStorage
  useEffect(() => {
    const id = localStorage.getItem("employeeId");
    setEmployeeId(id);
  }, []);

  // Format date to relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "الآن";
    if (diffInSeconds < 3600) return `منذ ${Math.floor(diffInSeconds / 60)} دقيقة`;
    if (diffInSeconds < 86400) return `منذ ${Math.floor(diffInSeconds / 3600)} ساعة`;
    if (diffInSeconds < 2592000) return `منذ ${Math.floor(diffInSeconds / 86400)} يوم`;
    
    return date.toLocaleDateString('ar-EG');
  };

  // Generate notification message based on request type and status
  const generateNotificationMessage = (request: Request): string => {
    const requestTypeMap: Record<string, string> = {
      'shift-exchange': 'تبديل المناوبة',
      'leave': 'طلب إجازة',
      'overtime': 'طلب عمل إضافي'
    };

    const requestType = requestTypeMap[request.requestType] || 'طلب';

    switch (request.status) {
      case 'PENDING':
        return `طلب ${requestType} جديد   `;
      case 'APPROVED':
        return `تم الموافقة على طلب ${requestType}`;
      case 'REJECTED':
        return `تم رفض طلب ${requestType}`;
      case 'COMPLETED':
        return `طلب ${requestType} مكتمل`;
      default:
        return `تحديث على طلب ${requestType}`;
    }
  };

  // Fetch notifications
  // useEffect(() => {
  //   const fetchNotifications = async () => {
  //     try {
  //       const id = localStorage.getItem("employeeId");
  //       if (!id) return;
        
  //       const res = await fetch(`/api/requests?notfication_empid=${id}`);
  //       if (!res.ok) throw new Error(`Notifications fetch failed: ${res.status}`);
  //       const requests: Request[] = await res.json();
  //       console.log("Fetched requests for notifications:", requests.length);
        
  //       // Transform requests into notification items
  //       const notificationItems: NotificationItem[] = requests.map(request => ({
  //         ...request,
  //         message: generateNotificationMessage(request),
  //         time: formatRelativeTime(request.updatedAt),
  //         type: request.status === 'PENDING' ||  request.status === null ? 'request' : 
  //               request.status === 'APPROVED' || request.status === 'COMPLETED' ? 'approval' : 
  //               request.status === 'REJECTED' ? 'rejection' : 'system',
  //         // Apply persisted read state from localStorage so marking stays after reload
  //         read: getReadIds().has(request.id) || request.read || false
  //       }));

  //       setNotifications(notificationItems);
        
  //       // Calculate unread count
  //       const unread = notificationItems.filter(n => !n.read).length;
  //       setUnreadCount(unread);
        
  //     } catch (err) {
  //       console.error("Error fetching notifications:", err);
  //     }
  //   };

  //   if (employeeId) {
  //     fetchNotifications();
      
  //     // Set up interval to refresh notifications every 30 seconds
  //     const interval = setInterval(fetchNotifications, 30000);
  //     return () => clearInterval(interval);
  //   }
  // }, [employeeId]);

  // Fetch notifications
useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const id = localStorage.getItem("employeeId");
      if (!id) return;
      
      const res = await fetch(`/api/requests?notfication_empid=${id}`);


      if (!res.ok) throw new Error(`Notifications fetch failed: ${res.status}`);
      const requests: Request[] = await res.json();
      console.log("Fetched requests for notifications:", requests.length);
      
      // Sort requests by updatedAt in descending order (newest first)
      const sortedRequests = requests.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      
      // Transform requests into notification items
      const notificationItems: NotificationItem[] = sortedRequests.map(request => ({
        ...request,
        message: generateNotificationMessage(request),
        time: formatRelativeTime(request.updatedAt),
        type: request.status === 'PENDING' ||  request.status === null ? 'request' : 
              request.status === 'APPROVED' || request.status === 'COMPLETED' ? 'approval' : 
              request.status === 'REJECTED' ? 'rejection' : 'system',
        // Apply persisted read state from localStorage so marking stays after reload
        read: getReadIds().has(request.id) || request.read || false
      }));

      setNotifications(notificationItems);
      
      // Calculate unread count
      const unread = notificationItems.filter(n => !n.read).length;
      setUnreadCount(unread);
      
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  if (employeeId) {
    fetchNotifications();
    
    // Set up interval to refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }
}, [employeeId]);

      console.log("employeeId in header fetch:##################*****************", notifications);


  useEffect(() => {
   

    const fetchNotifications = async () => {
      try {
        const id = localStorage.getItem("employeeId");
        if (!id) return;
        
        const res = await fetch(`/api/requests?notfication_empid=${id}`);
        if (!res.ok) throw new Error(`Notifications fetch failed: ${res.status}`);
        const requests: Request[] = await res.json();
        console.log("Fetched requests for notifications:ddddddddddd", requests.length);

      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    }
    fetchNotifications();


  }, []);


  // Handle notification click: mark as read in UI immediately, then navigate
  const handleNotificationClick = (notification: NotificationItem) => {
    // Persist this id as read in localStorage
    const readSet = getReadIds();
    const alreadyRead = readSet.has(notification.id);
    if (!alreadyRead) {
      readSet.add(notification.id);
      saveReadIds(readSet);
    }

    // Update local state to mark this notification as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );

    // Recalculate unread count from current state
    setUnreadCount((prev) => Math.max(0, prev - (alreadyRead ? 0 : 1)));

    // Navigate based on notification type
    if (notification.requestType === 'shift-exchange') {
      router.push(`/${notification.id}`);
    } else {
      router.push(`/requests/${notification.id}`);
    }

    setShowNotifications(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
console.log("employeeId in header:", notifications.length);
  // Fetch employee data
  useEffect(() => {
    if (!employeeId) return;

    const fetchEmployee = async () => {
      try {
        const res = await fetch(`/api/employees?employeeId=${employeeId}`);
        if (!res.ok) throw new Error(`Employee fetch failed: ${res.status}`);
        const data = await res.json();
        console.log("Fetched employee data:", data);
        setEmployee(data);
      } catch (err) {
        console.error("Error fetching employee:", err);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'request':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'approval':
        return (
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'rejection':
        return (
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };



  return (
    
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b bg-white dark:bg-gray-900 px-4 lg:px-6 shadow-sm">
      {/* Left section with notification bell */}
      <div className="flex items-center">
        {/* Notification Button */}
        <div className="relative mr-4" ref={dropdownRef}>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full relative transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Notifications"
            onClick={() => setShowNotifications((prev) => !prev)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-700 dark:text-gray-300"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>

            {/* Notification badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center ring-2 ring-white dark:ring-gray-900 font-medium">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Button>

          {/* Dropdown menu */}
          {showNotifications && (
            <div className="absolute left-0 mt-2 w-96 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 dark:text-white">الإشعارات</h3>
                {/* {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    تعيين الكل كمقروء
                  </button>
                )} */}
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors cursor-pointer group ${
                        !notification.read 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-r-blue-500' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-3 space-x-reverse">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${
                            !notification.read 
                              ? 'text-gray-900 dark:text-white font-medium' 
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <p className="mt-2">لا توجد إشعارات حالياً</p>
                  </div>
                )}
              </div>
              
              {/* {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <button 
                    className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:underline py-1"
                    onClick={() => router.push('/notifications')}
                  >
                    عرض جميع الإشعارات
                  </button>
                </div>
              )} */}
            </div>
          )}
        </div>

        <Separator
          orientation="vertical"
          className="h-6 bg-gray-300 dark:bg-gray-700"
        />
      </div>

      {/* Right section with welcome message and home button */}
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
          {employee ? `مرحباً، ${employee.name}` : ""}
        </h1>
        
        <Separator
          orientation="vertical"
          className="h-6 bg-gray-300 dark:bg-gray-700 mx-3"
        />
        
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Home"
          onClick={() => router.push("/")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-700 dark:text-gray-300"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </Button>
      </div>
    </header>
  );
}