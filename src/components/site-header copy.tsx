
"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";

type Employee = {
  id: string;
  name: string;
  employeeId: string;
  project: string;
  employeeType: string;
};

// type Request = {
//   id: string;
//   employeeId: string;
//   status: string;
//   createdAt: string;
//   updatedAt: string;
//   requestType: string;
//   firstApprovment: string;
//   secondApprovment: string;
//   shiftType1: string;
//   shiftType2: string;
//   shiftDate1: string;
//   shiftDate2: string;
//   requestComment: string;
//   replier1_Comment: string;
//   replier2_Comment: string;
//   approvalDate1: string;
//   approvalDate2: string;
//   read?: boolean; // Added read status
// };



type Request={
    id: string
    employeeId: string
    status: string
    createdAt: string
    updatedAt: string
    requestType: string
     firstApprovment: string;
  secondApprovment: string;
    shiftType1: string
    shiftType2: string
    shiftDate1: string
    shiftDate2: string
    requestComment: string
    replier1_Comment: string
    replier2_Comment: string
    approvalDate1: string
    approvalDate2: string
      read?: boolean; // Added read status

    RequestReceivers: {
      requestId: string
      employeeId: string
      recieverId: string
  
  }



}
type NotificationItem = Request & {
  message: string;
  time: string;
  type: 'request' | 'approval' | 'rejection' | 'system';
  sortTime?: number;
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

  console.log("Current employee:/**/******************", employee);

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



    //we have to change hereee
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

  // Fetch  HEREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const id = localStorage.getItem("employeeId");
        if (!id) return;

        const res = await fetch(`/api/requests?notfication_empid=${id}`);
        if (!res.ok) throw new Error(`Notifications fetch failed: ${res.status}`);
        const requests: Request[] = await res.json();

        // Transform requests into notification items
        const readIds = getReadIds();

        const items: NotificationItem[] = [];

        for (const request of requests) {
          const baseId = request.id;

          // Helper to resolve a time number and formatted string
          const resolveTime = (iso?: string) => {
            const d = iso ? new Date(iso) : new Date(request.updatedAt || request.createdAt);
            const t = isNaN(d.getTime()) ? Date.now() : d.getTime();
            return { sortTime: t, time: formatRelativeTime(d.toISOString()) };
          };

          // 1) If request is newly created / pending — notify receivers (not the requester)
          // The requester should not receive a "new request" notification; they get notified on first approval only.
          if ((request.status === 'PENDING' || request.status === null) && request.employeeId !== employeeId) {
            const { sortTime, time } = resolveTime(request.updatedAt || request.createdAt);
            items.push({
              ...request,
              id: `${baseId}_req`,
              message: generateNotificationMessage(request),
              time,
              type: 'request',
              sortTime,
              read: readIds.has(`${baseId}_req`),
            });
          }

          // 2) First approvment events — Only notify the original requester (creator)
          // Previously this could notify receivers as well; change to show only to the requester
          if ((request.firstApprovment === 'APPROVED' || request.firstApprovment === 'REJECTED') && request.employeeId === employeeId) {
            const { sortTime, time } = resolveTime(request.approvalDate1 || request.updatedAt);
            items.push({
              ...request,
              id: `${baseId}_first`,
              message: request.firstApprovment === 'APPROVED' ? `الموافق الأول: تم الموافقة على الطلب` : `الموافق الأول: تم رفض الطلب`,
              time,
              type: request.firstApprovment === 'APPROVED' ? 'approval' : 'rejection',
              sortTime,
              read: readIds.has(`${baseId}_first`),
            });
          }

          // 3) Second approvment events
          if (employee?.employeeType!=="ADMIN" &&  ( (request.secondApprovment === 'APPROVED' || (request.secondApprovment === 'REJECTED' && request.firstApprovment === 'APPROVED' ))
        
        
        )) {

            console.log("+++++++++++++++++++::p ", employee?.employeeType);

            const { sortTime, time } = resolveTime(request.approvalDate2 || request.updatedAt);
            items.push({
              ...request,
              id: `${baseId}_second`,
              message: request.secondApprovment === 'APPROVED' ? `الموافق الثاني: تم الموافقة على الطلب` : `الموافق الثاني: تم رفض الطلب`,
              time,
              type: request.secondApprovment === 'APPROVED' ? 'approval' : 'rejection',
              sortTime,
              read: readIds.has(`${baseId}_second`),
            });
          }
          

        }

        // Sort newest first by sortTime and deduplicate by id if needed
        items.sort((a, b) => (b.sortTime || 0) - (a.sortTime || 0));

        setNotifications(items);

        setUnreadCount(items.filter((n) => !n.read).length);
      } catch (err) {
        // keep silent in UI; dev console only
        console.error("Error fetching notifications:", err);
      }
    };

    if (employeeId) {
      fetchNotifications();

      // refresh in background every 30s
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [employeeId, employee]);

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

    // Determine base request id for navigation (we append suffixes like _first/_second/_status/_req)
    let baseId = notification.id;
    const suffixes = ['_first', '_second', '_status', '_req'];
    for (const s of suffixes) {
      if (baseId.endsWith(s)) {
        baseId = baseId.slice(0, -s.length);
        break;
      }
    }

    // Navigate based on requestType but always use base request id
    if (notification.requestType === 'shift-exchange') {
      router.push(`/${baseId}`);
    } else {
      router.push(`/requests/${baseId}`);
    }

    setShowNotifications(false);
  };

  // Mark all as read (persist and update UI)
  const markAllAsRead = () => {
    const readSet = getReadIds();
    notifications.forEach((n) => readSet.add(n.id));
    saveReadIds(readSet);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
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
  // Keep unreadCount in sync if localStorage readIds changed externally
  useEffect(() => {
    const syncUnread = () => {
      const readIds = getReadIds();
      setUnreadCount(notifications.filter((n) => !readIds.has(n.id)).length);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: readIds.has(n.id) })));
    };

    // Poll localStorage changes occasionally (no storage event on same window)
    const interval = setInterval(syncUnread, 2000);
    return () => clearInterval(interval);
  }, [notifications]);

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
          </Button>

          {/* Notification badge positioned relative to wrapper so it isn't clipped by the Button */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center ring-2 ring-white dark:ring-gray-900 font-medium pointer-events-none">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}

          {/* Dropdown menu */}
          {showNotifications && (
            <div className="absolute left-0 mt-2 w-96 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 dark:text-white">الإشعارات</h3>
                {unreadCount > 0 ? (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    aria-label="Mark all notifications as read"
                  >
                    تعيين الكل كمقروء
                  </button>
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">لا إشعارات جديدة</span>
                )}
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