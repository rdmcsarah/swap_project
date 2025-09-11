

// "use client"
// import { useParams, useRouter } from "next/navigation"
// import { useState, useEffect } from "react"

// interface Request {
//   id: string
//   employeeId: string
//   status: string
//   createdAt: string
//   requestType: string
//   shiftType1: string
//   shiftType2: string
//   shiftDate1: string
//   shiftDate2: string
//   firstApprovment:string
//   secondApprovment:string
//   requesterComment:string
//   replier1_Comment:string
//   replier2_Comment:string
//   approvalDate1:string
//   approvalDate2:string
//   RequestReceivers:{
//     requestId:string,
//     employeeId:string,
//     recieverId:string

//   }
// }
// type Employee={
//     id: string
//     name: string
//     email: string
//     phone: string
//     department: string
//     position: string
//     employeeId: string
//     project: string
//     employeeType:string

// }
// const dataMap: Record<string, string> = {
//   PENDING: "قيد الانتظار",
//   APPROVED: "تمت الموافقه",
//   REJECTED: "مرفوض",
//   evening: "مساءية",
//   morning: "صباحية",
//   afternoon: "بعد الظهر",
//   "shift-exchange": "تبديل المناوبة"
// };

// export default function RequestDetails() {
//   const { id } = useParams()
//   const [requestData, setRequestData] = useState<Request | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [comment, setComment] = useState("")
//   const router = useRouter();
//   const [employeeId, setEmployeeId] = useState<string | null>(null);
//   const [employee,setEmployee]=useState<Employee>()
//   const [reciever,setReciever]=useState<Employee>()
//   // Get employeeId from localStorage (client-side only)
//   useEffect(() => {
//     const id = localStorage.getItem("employeeId");
//     setEmployeeId(id);
//   }, []);

//   useEffect(() => {
//     if (!employeeId) return; // ⛔ Skip if employeeId is null

//     const fetchEmployee = async () => {
//       try {
//         const res = await fetch(`/api/employees?employeeId=${employeeId}`);
//         if (!res.ok) throw new Error(`Employee fetch failed: ${res.status}`);
//         const data = await res.json();
//         setEmployee(data);
//       } catch (err) {
//         console.error("Error fetching employee:", err);
//       }
//     };

//     fetchEmployee();
//   }, [employeeId]);

 
//   console.log("emp  ",employee)
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true)
//         const response = await fetch(`/api/requests?id=${id}`)
//         if (!response.ok) {
//           throw new Error('Network response was not ok')
//         }   
//         const data = await response.json()
//         setRequestData(data)
//       } catch (error) {
//         console.error('Error fetching data:', error)
//         setError('Failed to fetch request details')
//       } finally {
//         setLoading(false)
//       }
//     }
    
//     if (id) {
//       fetchData()
//     }
//   }, [id])

//  useEffect(() => {
//     if (!requestData?.RequestReceivers.recieverId) return; // ⛔ Skip if employeeId is null

//     const recID=requestData?.RequestReceivers.recieverId
//     const fetchEmployee = async () => {
//       try {
//         const res = await fetch(`/api/employees?employeeId=${recID}`);
//         if (!res.ok) throw new Error(`Employee fetch failed: ${res.status}`);
//         const data = await res.json();
//         setReciever(data);
//       } catch (err) {
//         console.error("Error fetching employee:", err);
//       }
//     };

//     fetchEmployee();
//   }, [requestData]);

// console.log(requestData)


//   const handleAction = async (action: 'APPROVED' | 'REJECTED' ) => {

//     try {
//       if(!employeeId) return

//       if(employee?.employeeType=="ADMIN"){
//          const response = await fetch(`/api/requests?id=${id}`, {
//         method: "PUT",
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             id:id,
//             // employeeId:employeeId,
//           secondApprovment:action,
          
//           replier2_Comment: comment || undefined,
//           status:"COMPLETED",
//           approvalDate1:new Date()
//         })
//       })



      
//       if (!response.ok) {
//         throw new Error('Failed to update request')
//       }

//       const updatedData = await response.json()
//       setRequestData(updatedData)
//       setComment("") // Clear comment after successful action

//       console.log("updated Data : ",updatedData)
//       router.push(`/swap/${id}`)
//       }
//       const response = await fetch(`/api/requests?id=${id}`, {
//         method: "PUT",
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             id:id,
//             // employeeId:employeeId,
//           firstApprovment:action,
          
//           replier1_Comment: comment || undefined,
//           approvalDate1:new Date()
//         })
//       })

//       if (!response.ok) {
//         throw new Error('Failed to update request')
//       }

//       const updatedData = await response.json()
//       setRequestData(updatedData)
//       setComment("") // Clear comment after successful action

//       console.log("updated Data : ",updatedData)
//       router.push(`/swap/${id}`)
//     } catch (err) {
//       console.error('Error updating request:', err)
//       setError('Failed to update request')
//     }
//   }

//   function formatDate(dateString: string) {
//   if (!dateString) return "";
//   const date = new Date(dateString);
//   return new Intl.DateTimeFormat("ar-EG", {
//     weekday: "long",  // يوم الأسبوع
//     day: "numeric",   // اليوم
//     month: "long",    // الشهر
//     year: "numeric",  // السنة
//   }).format(date);
// }


//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-gray-500 text-lg">Loading...</div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-red-500 text-lg">Error: {error}</div>
//       </div>
//     )
//   }

//   if (!requestData) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-gray-500 text-lg">No request data found</div>
//       </div>
//     )
//   }

//   return (


// <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
//   <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

//     {employee?.employeeType=="ADMIN" ? (


//    <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
      
//       {/* العنوان */}
//       <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">طلب تبديل المناوبة</h1>
//             <p className="mt-1 text-sm text-gray-600">رقم الطلب: {requestData.id}</p>
//           </div>


//           {requestData.secondApprovment && (

//              <div className="mt-4 md:mt-0">

//               موافقة أولى
//             <span
//               className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
//                 ${requestData.secondApprovment === "APPROVED" ? "bg-green-100 text-green-800" : 
//                   requestData.secondApprovment === "PENDING" ? "bg-yellow-100 text-yellow-800" : 
//                   "bg-red-100 text-red-800"}`}
//             >
//               {requestData.secondApprovment === "APPROVED" ? "مقبول" :
//                requestData.secondApprovment === "PENDING" ? "قيد الانتظار" : "مرفوض"}
//             </span>
//           </div>
//           )}

//           <div className="mt-4 md:mt-0">
//             <span
//               className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
//                 ${requestData.status === "APPROVED" ? "bg-green-100 text-green-800" : 
//                   requestData.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : 
//                   "bg-red-100 text-red-800"}`}
//             >
//               {requestData.status === "APPROVED" ? "مقبول" :
//                requestData.status === "PENDING" ? "قيد الانتظار" : "مرفوض"}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* المحتوى الرئيسي */}
//       <div className="px-6 py-6">
//         <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          
//           {/* العمود الأيسر */}
//           <div className="md:col-span-2">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">تفاصيل الطلب</h2>
            
//             <div className="space-y-4">
//               <div>
//                 <h3 className="font-medium text-gray-700">نوع الطلب</h3>
//                 <p className="text-gray-600">{dataMap[requestData.requestType]}</p>
//               </div>

//               {requestData.requesterComment && (
//                 <div>
//                   <h3 className="font-medium text-gray-700">تعليق مقدم الطلب</h3>
//                   <p className="text-gray-600">{requestData.requesterComment}</p>
//                 </div>
//               )}

//                     {requestData.replier1_Comment && (
//                 <div>
//                   <h3 className="font-medium text-gray-700">تعليق مقد مستبدل م الطلب</h3>
//                   <p className="text-gray-600">{requestData.replier1_Comment}</p>
//                 </div>
//               )}

//               {requestData.shiftType1 && (
//                 <div>
//                   <h3 className="font-medium text-gray-700">المناوبات</h3>
//                   <p className="text-gray-600">{dataMap[requestData.shiftType1]} - {dataMap[requestData.shiftType2]}</p>
//                 </div>
//               )}

//               {requestData.shiftDate1 && (
//                 <div>
//                   <h3 className="font-medium text-gray-700">المناوبة الحالية</h3>
//                   <p className="text-gray-600">
//                     {formatDate(requestData.shiftDate1)} - {dataMap[requestData.shiftType1]}
//                   </p>
//                 </div>
//               )}

//               {requestData.shiftDate2 && (
//                 <div>
//                   <h3 className="font-medium text-gray-700">المناوبة المطلوبة</h3>
//                   <p className="text-gray-600">
//                     {formatDate(requestData.shiftDate2)} - {dataMap[requestData.shiftType2]}
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* حقل إضافة تعليق */}
//             {requestData.employeeId != employeeId && (
//               <div className="mt-8">
//                 <h3 className="text-lg font-medium text-gray-900 mb-4">التعليقات</h3>
//                 <textarea
//                   rows={3}
//                   value={comment}
//                   onChange={(e) => setComment(e.target.value)}
//                   className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-lg p-3 border"
//                   placeholder="أضف تعليقك هنا..."
//                 ></textarea>
//               </div>
//             )}
//           </div>

//           {/* العمود الأيمن */}
//           <div className="space-y-6">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات الطلب</h3>
//               <dl className="space-y-4">
//                 <div>
//                   <dt className="text-sm font-medium text-gray-500">رقم الموظف</dt>
//                   <dd className="mt-1 text-sm text-gray-900">{requestData.employeeId}</dd>
//                 </div>

//                  <div>
//                   <dt className="text-sm font-medium text-gray-500">رقم الموظف</dt>
//                   <dd className="mt-1 text-sm text-gray-900">{reciever?.employeeId}</dd>
//                 </div>
//                 <div>
//                   <dt className="text-sm font-medium text-gray-500">تاريخ التقديم</dt>
//                   <dd className="mt-1 text-sm text-gray-900">{formatDate(requestData.createdAt)}</dd>
//                 </div>

                
//                 <div>
//                   <dt className="text-sm font-medium text-gray-500">الحالة</dt>
//                   <dd className="mt-1">
//                     <span
//                       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
//                         ${requestData.status === "APPROVED" ? "bg-green-100 text-green-800" :
//                           requestData.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
//                           "bg-red-100 text-red-800"}`}
//                     >
//                       {requestData.status === "Approved" ? "مقبول" :
//                        requestData.status === "PENDING" ? "قيد الانتظار" : "مرفوض"}
//                     </span>
//                   </dd>
//                 </div>
//               </dl>
//             </div>

//             {/* أزرار الإجراءات */}
//             {requestData.status === "PENDING" && requestData.employeeId != employeeId && (
//               <div className="pt-4 border-t border-gray-200">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">الإجراءات</h3>
//                 <div className="flex flex-col space-y-3">
//                   <button
//                     type="button"
//                     onClick={() => handleAction("APPROVED")}
//                     className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg shadow-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//                   >
//                     قبول الطلب
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => handleAction("REJECTED")}
//                     className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg shadow-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                   >
//                     رفض الطلب
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//     ): reciever?.employeeId=== employee?.employeeId ?(

//  <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
      
//       {/* العنوان */}
//       <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">طلب تبديل المناوبة</h1>
//             <p className="mt-1 text-sm text-gray-600">رقم الطلب: {requestData.id}</p>
//           </div>


//           {requestData.firstApprovment && (

//              <div className="mt-4 md:mt-0">

//               موافقة أولى
//             <span
//               className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
//                 ${requestData.firstApprovment === "APPROVED" ? "bg-green-100 text-green-800" : 
//                   requestData.firstApprovment === "PENDING" ? "bg-yellow-100 text-yellow-800" : 
//                   "bg-red-100 text-red-800"}`}
//             >
//               {requestData.firstApprovment === "APPROVED" ? "مقبول" :
//                requestData.firstApprovment === "PENDING" ? "قيد الانتظار" : "مرفوض"}
//             </span>
//           </div>
//           )}

//           <div className="mt-4 md:mt-0">
//             <span
//               className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
//                 ${requestData.status === "APPROVED" ? "bg-green-100 text-green-800" : 
//                   requestData.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : 
//                   "bg-red-100 text-red-800"}`}
//             >
//               {requestData.status === "APPROVED" ? "مقبول" :
//                requestData.status === "PENDING" ? "قيد الانتظار" : "مرفوض"}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* المحتوى الرئيسي */}
//       <div className="px-6 py-6">
//         <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          
//           {/* العمود الأيسر */}
//           <div className="md:col-span-2">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">تفاصيل الطلب</h2>
            
//             <div className="space-y-4">
//               <div>
//                 <h3 className="font-medium text-gray-700">نوع الطلب</h3>
//                 <p className="text-gray-600">{dataMap[requestData.requestType]}</p>
//               </div>

//               {requestData.requesterComment && (
//                 <div>
//                   <h3 className="font-medium text-gray-700">تعليق مقدم الطلب</h3>
//                   <p className="text-gray-600">{requestData.requesterComment}</p>
//                 </div>
//               )}

//               {requestData.shiftType1 && (
//                 <div>
//                   <h3 className="font-medium text-gray-700">المناوبات</h3>
//                   <p className="text-gray-600">{dataMap[requestData.shiftType1]} - {dataMap[requestData.shiftType2]}</p>
//                 </div>
//               )}

//               {requestData.shiftDate1 && (
//                 <div>
//                   <h3 className="font-medium text-gray-700">المناوبة الحالية</h3>
//                   <p className="text-gray-600">
//                     {formatDate(requestData.shiftDate1)} - {dataMap[requestData.shiftType1]}
//                   </p>
//                 </div>
//               )}

//               {requestData.shiftDate2 && (
//                 <div>
//                   <h3 className="font-medium text-gray-700">المناوبة المطلوبة</h3>
//                   <p className="text-gray-600">
//                     {formatDate(requestData.shiftDate2)} - {dataMap[requestData.shiftType2]}
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* حقل إضافة تعليق */}
//             {requestData.employeeId != employeeId && (
//               <div className="mt-8">
//                 <h3 className="text-lg font-medium text-gray-900 mb-4">التعليقات</h3>
//                 <textarea
//                   rows={3}
//                   value={comment}
//                   onChange={(e) => setComment(e.target.value)}
//                   className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-lg p-3 border"
//                   placeholder="أضف تعليقك هنا..."
//                 ></textarea>
//               </div>
//             )}
//           </div>

//           {/* العمود الأيمن */}
//           <div className="space-y-6">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات الطلب</h3>
//               <dl className="space-y-4">
//                 <div>
//                   <dt className="text-sm font-medium text-gray-500">رقم الموظف</dt>
//                   <dd className="mt-1 text-sm text-gray-900">{requestData.employeeId}</dd>
//                 </div>
//                 <div>
//                   <dt className="text-sm font-medium text-gray-500">تاريخ التقديم</dt>
//                   <dd className="mt-1 text-sm text-gray-900">{formatDate(requestData.createdAt)}</dd>
//                 </div>
//                 <div>
//                   <dt className="text-sm font-medium text-gray-500">الحالة</dt>
//                   <dd className="mt-1">
//                     <span
//                       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
//                         ${requestData.status === "APPROVED" ? "bg-green-100 text-green-800" :
//                           requestData.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
//                           "bg-red-100 text-red-800"}`}
//                     >
//                       {requestData.status === "Approved" ? "مقبول" :
//                        requestData.status === "PENDING" ? "قيد الانتظار" : "مرفوض"}
//                     </span>
//                   </dd>
//                 </div>
//               </dl>
//             </div>

//             {/* أزرار الإجراءات */}
//             {requestData.status === "PENDING" && requestData.employeeId != employeeId && (
//               <div className="pt-4 border-t border-gray-200">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">الإجراءات</h3>
//                 <div className="flex flex-col space-y-3">
//                   <button
//                     type="button"
//                     onClick={() => handleAction("APPROVED")}
//                     className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg shadow-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//                   >
//                     قبول الطلب
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => handleAction("REJECTED")}
//                     className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg shadow-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                   >
//                     رفض الطلب
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
      
//     ): employee?.employeeId===requestData.employeeId? (
// <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
      
//       {/* العنوان */}
//       <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">طلب تبديل المناوبة</h1>
//             <p className="mt-1 text-sm text-gray-600">رقم الطلب: {requestData.id}</p>
//           </div>


//           {requestData.firstApprovment && (

//              <div className="mt-4 md:mt-0">

//               موافقة أولى
//             <span
//               className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
//                 ${requestData.firstApprovment === "APPROVED" ? "bg-green-100 text-green-800" : 
//                   requestData.firstApprovment === "PENDING" ? "bg-yellow-100 text-yellow-800" : 
//                   "bg-red-100 text-red-800"}`}
//             >
//               {requestData.firstApprovment === "APPROVED" ? "مقبول" :
//                requestData.firstApprovment === "PENDING" ? "قيد الانتظار" : "مرفوض"}
//             </span>
//           </div>
//           )}

//           <div className="mt-4 md:mt-0">
//             <span
//               className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
//                 ${requestData.status === "APPROVED" ? "bg-green-100 text-green-800" : 
//                   requestData.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : 
//                   "bg-red-100 text-red-800"}`}
//             >
//               {requestData.status === "APPROVED" ? "مقبول" :
//                requestData.status === "PENDING" ? "قيد الانتظار" : "مرفوض"}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* المحتوى الرئيسي */}
//       <div className="px-6 py-6">
//         <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          
//           {/* العمود الأيسر */}
//           <div className="md:col-span-2">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">تفاصيل الطلب</h2>
            
//             <div className="space-y-4">
//               <div>
//                 <h3 className="font-medium text-gray-700">نوع الطلب</h3>
//                 <p className="text-gray-600">{dataMap[requestData.requestType]}</p>
//               </div>

//               {requestData.requesterComment && (
//                 <div>
//                   <h3 className="font-medium text-gray-700">تعليق مقدم الطلب</h3>
//                   <p className="text-gray-600">{requestData.requesterComment}</p>
//                 </div>
//               )}

//               {requestData.shiftType1 && (
//                 <div>
//                   <h3 className="font-medium text-gray-700">المناوبات</h3>
//                   <p className="text-gray-600">{dataMap[requestData.shiftType1]} - {dataMap[requestData.shiftType2]}</p>
//                 </div>
//               )}

//               {requestData.shiftDate1 && (
//                 <div>
//                   <h3 className="font-medium text-gray-700">المناوبة الحالية</h3>
//                   <p className="text-gray-600">
//                     {formatDate(requestData.shiftDate1)} - {dataMap[requestData.shiftType1]}
//                   </p>
//                 </div>
//               )}

//               {requestData.shiftDate2 && (
//                 <div>
//                   <h3 className="font-medium text-gray-700">المناوبة المطلوبة</h3>
//                   <p className="text-gray-600">
//                     {formatDate(requestData.shiftDate2)} - {dataMap[requestData.shiftType2]}
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* حقل إضافة تعليق */}
//             {requestData.employeeId != employeeId && (
//               <div className="mt-8">
//                 <h3 className="text-lg font-medium text-gray-900 mb-4">التعليقات</h3>
//                 <textarea
//                   rows={3}
//                   value={comment}
//                   onChange={(e) => setComment(e.target.value)}
//                   className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-lg p-3 border"
//                   placeholder="أضف تعليقك هنا..."
//                 ></textarea>
//               </div>
//             )}
//           </div>

//           {/* العمود الأيمن */}
//           <div className="space-y-6">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات الطلب</h3>
//               <dl className="space-y-4">
//                 <div>
//                   <dt className="text-sm font-medium text-gray-500">رقم الموظف</dt>
//                   <dd className="mt-1 text-sm text-gray-900">{requestData.employeeId}</dd>
//                 </div>
//                 <div>
//                   <dt className="text-sm font-medium text-gray-500">تاريخ التقديم</dt>
//                   <dd className="mt-1 text-sm text-gray-900">{formatDate(requestData.createdAt)}</dd>
//                 </div>
//                 <div>
//                   <dt className="text-sm font-medium text-gray-500">الحالة</dt>
//                   <dd className="mt-1">
//                     <span
//                       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
//                         ${requestData.status === "APPROVED" ? "bg-green-100 text-green-800" :
//                           requestData.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
//                           "bg-red-100 text-red-800"}`}
//                     >
//                       {requestData.status === "Approved" ? "مقبول" :
//                        requestData.status === "PENDING" ? "قيد الانتظار" : "مرفوض"}
//                     </span>
//                   </dd>
//                 </div>
//               </dl>
//             </div>

//             {/* أزرار الإجراءات */}
//             {requestData.status === "PENDING" && requestData.employeeId != employeeId && (
//               <div className="pt-4 border-t border-gray-200">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">الإجراءات</h3>
//                 <div className="flex flex-col space-y-3">
//                   <button
//                     type="button"
//                     onClick={() => handleAction("APPROVED")}
//                     className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg shadow-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//                   >
//                     قبول الطلب
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => handleAction("REJECTED")}
//                     className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg shadow-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                   >
//                     رفض الطلب
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
      
//     ):
    
    
//     (<>YOU ARE NOT ALLOWED FOR THIS REQUEST</>)
  
//   }

   
//   </div>

//   {/* {reciever?.employeeId=="frgfr" ? (<></>) : reciever?.department="ff" ? (<></>) : (<></>)} */}




// </div>

//   )
// }



"use client"
import { useParams, useRouter } from "next/navigation"
import React from "react"
import { useState, useEffect } from "react"

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

  const [employeeId,setEmployeeId]=useState<string | null>()

 

useEffect(()=>{

      const employeeIdd = localStorage.getItem("employeeId");

          setEmployeeId(employeeIdd)
      if (!employeeIdd) {
        setError("يجب تسجيل الدخول أولاً");
        return;
      }
  
  
})

useEffect(()=>{


  const fetchReq=async ()=>{

      setLoading(true);

    

      // 1. Fetch request data with receivers
      const requestRes = await fetch(`/api/requests?id=${id}`);
      if (!requestRes.ok) throw new Error("فشل في تحميل بيانات الطلب");
      const request = await requestRes.json();
      setRequestData(request);


  }

  fetchReq()
},[id])
      console.log("request", requestData);

const recieverId = React.useMemo(() => {
  if (Array.isArray(requestData?.RequestReceivers) && requestData.RequestReceivers.length > 0) {
    return requestData.RequestReceivers[0].recieverId;
  }
  return null;
}, [requestData]);

console.log("plpl: ", requestData?.RequestReceivers?.[0]?.recieverId)

useEffect(()=>{

  if(!employeeId)return
  const fetchEmp = async () => {
      const empRes = await fetch(`/api/employees?employeeId=${employeeId}`);
      if (!empRes.ok) throw new Error("فشل في تحميل بيانات الموظف");
      const emp = await empRes.json();
      setEmployee(emp);
  }
fetchEmp()


},[employeeId])

console.log("emppp",employee)

useEffect(() => {
  const fetchAllData = async () => {
    try {

      // 2. Fetch logged-in employee


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





 fetchAllData();

 console.log("receiver",receiver)

}, [recieverId]);



          console.log("receiver", receiver);


  console.log(requestData)



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
  }, [employee, requestData])
      console.log("me: ",employee?.employeeId,"other",receiver?.employeeId)

  console.log(userRole)





  const handleAction = async (action: 'APPROVED' | 'REJECTED') => {
    try {
      if (!employee) return

      const updateData: any = {
        id: id,
        approvalDate1: new Date().toISOString()
      }

      if (employee.employeeType === "ADMIN") {
        updateData.secondApprovment = action
        updateData.replier2_Comment = comment || undefined
        updateData.status = action === "APPROVED" ? "COMPLETED" : "REJECTED"
      } else {
        updateData.firstApprovment = action
        updateData.replier1_Comment = comment || undefined
        // updateData.status = action === "APPROVED" ? "PENDING" : "REJECTED"
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

    return (
      <div className="mt-4 md:mt-0">
        <span className="text-sm font-medium text-gray-700 mb-1 block">{label}</span>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
            ${approval === "APPROVED" ? "bg-green-100 text-green-800" : 
              approval === "PENDING" ? "bg-yellow-100 text-yellow-800" : 
              "bg-red-100 text-red-800"}`}
        >
          {dataMap[approval] || approval}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-lg">جاري التحميل...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500 text-lg">خطأ: {error}</div>
      </div>
    )
  }

  if (!requestData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-lg">لم يتم العثور على بيانات الطلب</div>
      </div>
    )
  }

  // if (userRole === "UNAUTHORIZED") {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-red-500 text-lg">غير مصرح لك بمشاهدة هذا الطلب</div>
  //     </div>
  //   )
  // }

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">طلب تبديل المناوبة</h1>
                <p className="mt-1 text-sm text-gray-600">رقم الطلب: {requestData.id}</p>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-4 mt-4 md:mt-0">
                {renderApprovalBadge(requestData.firstApprovment, "الموافقة الأولى")}
                {renderApprovalBadge(requestData.secondApprovment, "الموافقة الثانية")}
                
                <div>
                  <span className="text-sm font-medium text-gray-700 mb-1 block">الحالة النهائية</span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                      ${requestData.status === "APPROVED" || requestData.status === "COMPLETED" ? "bg-green-100 text-green-800" : 
                        requestData.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : 
                        "bg-red-100 text-red-800"}`}
                  >
                    {dataMap[requestData.status] || requestData.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Left Column */}
              <div className="md:col-span-2">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">تفاصيل الطلب</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-700">نوع الطلب</h3>
                    <p className="text-gray-600">{dataMap[requestData.requestType]}</p>
                  </div>

                  {requestData.requesterComment && (
                    <div>
                      <h3 className="font-medium text-gray-700">تعليق مقدم الطلب</h3>
                      <p className="text-gray-600">{requestData.requesterComment}</p>
                    </div>
                  )}

                  {requestData.replier1_Comment && (
                    <div>
                      <h3 className="font-medium text-gray-700">تعليق الموظف المستبدَل</h3>
                      <p className="text-gray-600">{requestData.replier1_Comment}</p>
                    </div>
                  )}

                  {requestData.replier2_Comment && (
                    <div>
                      <h3 className="font-medium text-gray-700">تعليق المدير</h3>
                      <p className="text-gray-600">{requestData.replier2_Comment}</p>
                    </div>
                  )}

                  {requestData.shiftType1 && (
                    <div>
                      <h3 className="font-medium text-gray-700">المناوبات</h3>
                      <p className="text-gray-600">{dataMap[requestData.shiftType1]} - {dataMap[requestData.shiftType2]}</p>
                    </div>
                  )}

                  {requestData.shiftDate1 && (
                    <div>
                      <h3 className="font-medium text-gray-700">المناوبة الحالية</h3>
                      <p className="text-gray-600">
                        {formatDate(requestData.shiftDate1)} - {dataMap[requestData.shiftType1]}
                      </p>
                    </div>
                  )}

                  {requestData.shiftDate2 && (
                    <div>
                      <h3 className="font-medium text-gray-700">المناوبة المطلوبة</h3>
                      <p className="text-gray-600">
                        {formatDate(requestData.shiftDate2)} - {dataMap[requestData.shiftType2]}
                      </p>
                    </div>
                  )}
                </div>

                {/* Comment field for approvers */}
                {(userRole === "RECEIVER" || userRole === "ADMIN") && requestData.status === "PENDING" && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">التعليقات</h3>
                    <textarea
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-lg p-3 border"
                      placeholder="أضف تعليقك هنا..."
                    ></textarea>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات الطلب</h3>
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
                {(userRole === "RECEIVER" || userRole === "ADMIN") && requestData.status === "PENDING" && (
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">الإجراءات</h3>
                    <div className="flex flex-col space-y-3">
                      <button
                        type="button"
                        onClick={() => handleAction("APPROVED")}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg shadow-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        قبول الطلب
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction("REJECTED")}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg shadow-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
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