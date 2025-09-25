
"use client"
import { useParams, useRouter } from "next/navigation"
import React from "react"
import { useState, useEffect } from "react"
import { FaClock, FaCheckCircle, FaTimesCircle, FaUser, FaCalendarAlt, FaComment, FaInfoCircle, FaArrowLeft } from "react-icons/fa"

interface Request {
  id: string
  employeeId: string
  status: string
  createdAt: string
  requestType: string
  shiftType1: string
  shiftType2: string
  shiftDate1: string
  shiftDate2: string
  firstApprovment: string
  secondApprovment: string
  requesterComment: string
  replier1_Comment: string
  replier2_Comment: string
  approvalDate1: string
  approvalDate2: string
  RequestReceivers: [{
    requestId: string
    employeeId: string
    recieverId: string
  }]
}

type Employee = {
  id: string
  name: string
  email: string
  phone: string
  department: string
  position: string
  employeeId: string
  project: string
  employeeType: string
}

type UserRole = "REQUESTER" | "RECEIVER" | "ADMIN" | "UNAUTHORIZED"

const dataMap: Record<string, string> = {
  PENDING: "قيد الانتظار",
  APPROVED: "تمت الموافقة",
  REJECTED: "مرفوض",
  evening: "مسائية",
  morning: "صباحية",
  afternoon: "بعد الظهر",
  "shift-exchange": "تبديل المناوبة",
  COMPLETED: "مكتمل"
};

export default function RequestDetails() {
  const { id } = useParams()
  const [requestData, setRequestData] = useState<Request | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [comment, setComment] = useState("")
  const router = useRouter()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [receiver, setReceiver] = useState<Employee | null>(null)
  const [employeeId, setEmployeeId] = useState<string | null>()

  useEffect(() => {
    const employeeIdd = localStorage.getItem("employeeId");
    setEmployeeId(employeeIdd)
    if (!employeeIdd) {
      setError("يجب تسجيل الدخول أولاً");
      return;
    }
  }, [])

  useEffect(() => {
    const fetchReq = async () => {
      setLoading(true);
      try {
        // 1. Fetch request data with receivers
        const requestRes = await fetch(`/api/requests?id=${id}`);
        if (!requestRes.ok) throw new Error("فشل في تحميل بيانات الطلب");
        const request = await requestRes.json();
        setRequestData(request);
      } catch (err) {
        setError("فشل في تحميل بيانات الطلب");
      }
    }

    fetchReq()
  }, [id])

  const recieverId = React.useMemo(() => {
    if (Array.isArray(requestData?.RequestReceivers) && requestData.RequestReceivers.length > 0) {
      return requestData.RequestReceivers[0].recieverId;
    }
    return null;
  }, [requestData]);

  useEffect(() => {
    if (!employeeId) return
    const fetchEmp = async () => {
      try {
        const empRes = await fetch(`/api/employees?employeeId=${employeeId}`);
        if (!empRes.ok) throw new Error("فشل في تحميل بيانات الموظف");
        const emp = await empRes.json();
        setEmployee(emp);
      } catch (err) {
        setError("فشل في تحميل بيانات الموظف");
      }
    }
    fetchEmp()
  }, [employeeId])

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 3. Fetch receiver (if exists)
        if (recieverId) {
          const receiverRes = await fetch(
            `/api/employees?employeeId=${recieverId}`
          );
          if (receiverRes.ok) {
            const receiverData = await receiverRes.json();
            setReceiver(receiverData);
          }
        }
      } catch (err) {
        console.error(err);
        setError("فشل في تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };

    if (requestData) {
      fetchAllData();
    }
  }, [recieverId, requestData]);

  const [userRole, setUserRole] = useState<UserRole>("UNAUTHORIZED")

  // Determine user role based on employee data and request data
  useEffect(() => {
    if (!employee || !requestData) return

    if (employee.employeeType === "ADMIN") {
      setUserRole("ADMIN")
    } else if (employee.employeeId === requestData.employeeId) {
      setUserRole("REQUESTER")
    } else if (employee.employeeId === recieverId) {
      setUserRole("RECEIVER")
    } else {
      setUserRole("UNAUTHORIZED")
    }
  }, [employee, requestData, recieverId])

  const handleAction = async (action: 'APPROVED' | 'REJECTED') => {
    try {
      if (!employee) return

      // Check if the first approval is already done and user is not admin
      // if ((requestData?.firstApprovment !== "PENDING" || requestData?.firstApprovment !== null) ) {
      //   setError("لا يمكنك اتخاذ إجراء على هذا الطلب");
      //   return;
      // }

      const updateData: any = {
        id: id,
        approvalDate1: new Date().toISOString()
      }

      if (employee.employeeType === "ADMIN") {
        updateData.secondApprovment = action
        updateData.replier2_Comment = comment || undefined
        updateData.status = action === "APPROVED" ? "COMPLETED" : "REJECTED"
      } else {
        if(action ==="REJECTED"){
                  updateData.firstApprovment = action
                  updateData.secondApprovment = action


        }
        updateData.firstApprovment = action
        updateData.replier1_Comment = comment || undefined
        updateData.status = action === "APPROVED" ? "PENDING" : "REJECTED"
      }

      const response = await fetch(`/api/requests?id=${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        throw new Error('فشل في تحديث الطلب')
      }

      const updatedData = await response.json()
      setRequestData(updatedData)
      setComment("")
      router.push(`/swap/${id}`)
    } catch (err) {
      console.error('Error updating request:', err)
      setError('فشل في تحديث الطلب')
    }
  }

  function formatDate(dateString: string) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ar-EG", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  }

  const renderApprovalBadge = (approval: string, label: string) => {
    if (!approval) return null;

    const getBadgeDetails = () => {
      switch (approval) {
        case "APPROVED":
          return { bg: "bg-green-100", text: "text-green-800", icon: <FaCheckCircle className="ml-1" /> };
        case "PENDING":
          return { bg: "bg-yellow-100", text: "text-yellow-800", icon: <FaClock className="ml-1" /> };
        case "REJECTED":
          return { bg: "bg-red-100", text: "text-red-800", icon: <FaTimesCircle className="ml-1" /> };
        default:
          return { bg: "bg-gray-100", text: "text-gray-800", icon: null };
      }
    };

    const { bg, text, icon } = getBadgeDetails();

    return (
      <div className="mt-4 md:mt-0">
        <span className="text-sm font-medium text-gray-700 mb-1 block">{label}</span>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bg} ${text}`}
        >
          {dataMap[approval] || approval}
          {icon}
        </span>
      </div>
    );
  };

  if (loading && !employeeId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
          <div className="text-gray-500 text-lg">جاري التحميل...</div>
        </div>
      </div>
    )
  }

  // if (error) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="text-red-500 text-lg mb-4">خطأ: {error}</div>
  //         <button 
  //           onClick={() => router.back()}
  //           className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
  //         >
  //           العودة
  //         </button>
  //       </div>
  //     </div>
  //   )
  // }

  if (!requestData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-lg">لا توجد بيانات للطلب</div>
      </div>
    )
  }
//ERROR ACCOUR HEREE
  // if (userRole === "UNAUTHORIZED") {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="text-red-500 text-lg mb-4">غير مصرح لك بمشاهدة هذا الطلب</div>
  //         <button 
  //           onClick={() => router.back()}
  //           className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
  //         >
  //           العودة
  //         </button>
  //       </div>
  //     </div>
  //   )
  // }

  console.log("Request Data:", requestData);
  console.log("Employee Data:", employee);
  console.log("Receiver Data:", receiver);
  console.log("User Role:", userRole);
  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <FaArrowLeft className="ml-2" />
          العودة
        </button>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <FaInfoCircle className="text-green-600 text-xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">طلب تبديل المناوبة</h1>
                  <p className="mt-1 text-sm text-gray-600">رقم الطلب: #{requestData.id.slice(0, 8)}</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-4 mt-4 md:mt-0">
                {renderApprovalBadge(requestData.firstApprovment, "الموافقة الأولى")}
                {renderApprovalBadge(requestData.secondApprovment, "الموافقة الثانية")}
                
                {/* <div>
                  <span className="text-sm font-medium text-gray-700 mb-1 block">الحالة النهائية</span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                      ${requestData.status === "APPROVED" || requestData.status === "COMPLETED" ? "bg-green-100 text-green-800" : 
                        requestData.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : 
                        "bg-red-100 text-red-800"}`}
                  >
                    {dataMap[requestData.status] || requestData.status}
                    {requestData.status === "APPROVED" || requestData.status === "COMPLETED" ? 
                      <FaCheckCircle className="ml-1" /> : 
                      requestData.status === "PENDING" ? 
                      <FaClock className="ml-1" /> : 
                      <FaTimesCircle className="ml-1" />}
                  </span>
                </div> */}
              </div>



            </div>
          </div>

          {/* Main Content */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Left Column */}
              <div className="md:col-span-2">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200 flex items-center">
                  <FaInfoCircle className="ml-2 text-green-600" />
                  تفاصيل الطلب
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 flex items-center">
                      <FaUser className="ml-2 text-green-600" />
                      نوع الطلب
                    </h3>
                    <p className="text-gray-600 mt-2 pr-6">{dataMap[requestData.requestType]}</p>
                  </div>

                  {requestData.requesterComment && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-700 flex items-center">
                        <FaComment className="ml-2 text-green-600" />
                        تعليق مقدم الطلب
                      </h3>
                      <p className="text-gray-600 mt-2 pr-6">{requestData.requesterComment}</p>
                    </div>
                  )}

                  {requestData.replier1_Comment && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-700 flex items-center">
                        <FaComment className="ml-2 text-green-600" />
                        تعليق الموظف المستبدَل
                      </h3>
                      <p className="text-gray-600 mt-2 pr-6">{requestData.replier1_Comment}</p>
                    </div>
                  )}

                  {requestData.replier2_Comment && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-700 flex items-center">
                        <FaComment className="ml-2 text-green-600" />
                        تعليق المدير
                      </h3>
                      <p className="text-gray-600 mt-2 pr-6">{requestData.replier2_Comment}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {requestData.shiftDate1 && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-700 flex items-center">
                          <FaCalendarAlt className="ml-2 text-green-600" />
                          المناوبة الحالية
                        </h3>
                        <p className="text-gray-600 mt-2">
                          {formatDate(requestData.shiftDate1)}
                        </p>
                        {requestData.shiftType1 && (
                          <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {dataMap[requestData.shiftType1]}
                          </span>
                        )}
                      </div>
                    )}

                    {requestData.shiftDate2 && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-700 flex items-center">
                          <FaCalendarAlt className="ml-2 text-green-600" />
                          المناوبة المطلوبة
                        </h3>
                        <p className="text-gray-600 mt-2">
                          {formatDate(requestData.shiftDate2)}
                        </p>
                        {requestData.shiftType2 && (
                          <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {dataMap[requestData.shiftType2]}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Comment field for approvers */}
                {(userRole === "RECEIVER" ) && requestData.status === "PENDING"  && (requestData.firstApprovment==="PENDING" || requestData.firstApprovment===null) && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <FaComment className="ml-2 text-green-600" />
                      التعليقات
                    </h3>
                    <textarea
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-lg p-3 border"
                      placeholder="أضف تعليقك هنا..."
                    ></textarea>
                  </div>
                )}


                {
                  (userRole === "ADMIN" && requestData.status === "PENDING" && requestData.firstApprovment === "APPROVED") && (

                    <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <FaComment className="ml-2 text-green-600" />
                      التعليقات
                    </h3>
                    <textarea
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-lg p-3 border"
                      placeholder="أضف تعليقك هنا..."
                    ></textarea>
                  </div>
                  )
                }
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200 flex items-center">
                    <FaUser className="ml-2 text-green-600" />
                    معلومات الطلب
                  </h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">مقدم الطلب</dt>
                      <dd className="mt-1 text-sm text-gray-900">{requestData.employeeId}</dd>
                    </div>

                    {receiver && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">الموظف المستبدَل</dt>
                        <dd className="mt-1 text-sm text-gray-900">{receiver.employeeId}</dd>
                      </div>
                    )}
                    
                    <div>
                      <dt className="text-sm font-medium text-gray-500">تاريخ التقديم</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatDate(requestData.createdAt)}</dd>
                    </div>

                    {requestData.approvalDate1 && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">تاريخ الموافقة الأولى</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formatDate(requestData.approvalDate1)}</dd>
                      </div>
                    )}

                    {requestData.approvalDate2 && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">تاريخ الموافقة الثانية</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formatDate(requestData.approvalDate2)}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* Action buttons for approvers */}
                {(userRole === "RECEIVER" ) && requestData.status === "PENDING" && (requestData.firstApprovment==="PENDING" || requestData.firstApprovment===null) && (
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">الإجراءات</h3>
                    <div className="flex flex-col space-y-3">
                      <button
                        type="button"
                        onClick={() => handleAction("APPROVED")}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg shadow-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                      >
                        <FaCheckCircle className="ml-2" />
                        قبول الطلب
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction("REJECTED")}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg shadow-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                      >
                        <FaTimesCircle className="ml-2" />
                        رفض الطلب
                      </button>
                    </div>
                  </div>
                )}



                {(userRole === "ADMIN" && requestData.status === "PENDING" && requestData.firstApprovment === "APPROVED") && (
                    
                     <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">الإجراءات</h3>
                    <div className="flex flex-col space-y-3">
                      <button
                        type="button"
                        onClick={() => handleAction("APPROVED")}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg shadow-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                      >
                        <FaCheckCircle className="ml-2" />
                        قبول الطلب
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction("REJECTED")}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg shadow-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                      >
                        <FaTimesCircle className="ml-2" />
                        رفض الطلب
                      </button>
                    </div>
                  </div>
                    
                    )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}