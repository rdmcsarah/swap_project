
// export default DateRangeSubmissionForm;
"use client";
import Calendar21 from "@/components/calender";
import { set } from "date-fns";
import React, { use, useEffect, useState } from "react";
// import { useRouter } from 'next/router';

interface FormData {
  requestType: string;
  shiftType: string;
  shiftDate1: string;
  shiftDate2: string;
  requesterComment: string;
  receiverId: string;
  shiftType2: string; // Optional for the second shift date
}
interface Employee {
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
}

const DateRangeSubmissionForm = () => {
  //   const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    requestType: "shift-exchange",
    shiftType: "",
    shiftType2: "",
    shiftDate1: "",
    shiftDate2: "",
    requesterComment: "",
    receiverId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [employees, setEmployees] = useState([]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    try {
      const getEmployees = async () => {
        const response = await fetch("/api/employees");
        if (!response.ok) {
          throw new Error("Failed to fetch employees");
        }
        const employees = await response.json();
        setEmployees(employees);
        console.log("Employees fetched successfully:", employees);
      };
      getEmployees();
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to fetch employees. Please try again later.");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Get employeeId from your auth context or local storage
      // This is just an example - adjust based on your auth system
      const employeeId = localStorage.getItem("employeeId") || "RDMC2851";

      if (!employeeId) {
        throw new Error("Employee ID not found. Please log in again.");
      }

      const requestData = {
        employeeId,
        requestType: "shift-exchange",
        status: "pending",
        shiftType1: formData.shiftType,
        shiftType2: formData.shiftType2,
        shiftDate1: formData.shiftDate1 ? new Date(formData.shiftDate1) : null,
        shiftDate2: formData.shiftDate2 ? new Date(formData.shiftDate2) : null,
        requesterComment: formData.requesterComment,
        // Assuming you'll select a receiver (employee to exchange with)
        // receivers: {
        //   connect: [{ employeeId: formData.receiverId }],
        // },
        recieverId:formData.receiverId
      };

      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit request");
      }

      const result = await response.json();
      console.log("Request submitted successfully:", result);
      //   router.push('/requests/success'); // Redirect to success page
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  function getCurrentTime(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}
function isAfterNoon(): boolean {
  const now = new Date();
  return now.getHours() >= 12; // 12 or later (afternoon)
}

console.log(getCurrentTime()); // e.g., "13:45:07"
  const [showCalendar, setShowCalendar] = useState(false)


  console.log("emps:", employees);
//   return (
// //     <div dir="rtl" className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
// //   <div className="w-full max-w-3xl bg-white p-10 rounded-xl shadow-md">
// //     <header className="mb-10 text-center">
// //       <h1 className="text-3xl font-bold text-gray-800 mb-2">نموذج طلب تبادل ورديات</h1>
// //       <p className="text-gray-600 text-lg">
// //         يرجى تعبئة جميع الحقول المطلوبة لتقديم طلب التبديل
// //       </p>
// //       <div className="w-20 h-1 bg-green-500 mx-auto mt-4 rounded-full"></div>
// //     </header>

// //     {error && (
// //       <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md shadow-sm">
// //         <div className="flex items-center">
// //           <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
// //             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
// //           </svg>
// //           <span className="font-medium">{error}</span>
// //         </div>
// //       </div>
// //     )}

// // {isAfterNoon() ? (
// //   <div className="text-center text-red-600 font-semibold text-lg mt-8">
// //     لا يمكن تقديم الطلب بعد الساعة 12:00 ظهرًا.
// //   </div>
// // ) : (
// //   <form className="space-y-8" onSubmit={handleSubmit}>
// //     {/* your full form content goes here */}
// //   </form>
// // )}

// //     <form className="space-y-8" onSubmit={handleSubmit}>
// //       <input type="hidden" name="requestType" value="shift-exchange" />

// //       <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
// //         <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
// //           <svg className="w-5 h-5 ml-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
// //             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
// //           </svg>
// //           معلومات الوردية الحالية
// //         </h2>
        
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //           <div>
// //             <label htmlFor="shiftType" className="block text-sm font-medium text-gray-700 mb-2">
// //               نوع الوردية <span className="text-red-500">*</span>
// //             </label>
// //             <select
// //               id="shiftType"
// //               name="shiftType"
// //               required
// //               value={formData.shiftType}
// //               onChange={handleChange}
// //               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
// //             >
// //               <option value="">اختر نوع الوردية</option>
// //               <option value="morning">صباحية (8ص - 4م)</option>
// //               <option value="evening">مسائية (4م - 12ص)</option>
// //               <option value="night">ليلية (12ص - 8ص)</option>
// //             </select>
// //           </div>

// //           <div>
// //             <label htmlFor="shiftDate1" className="block text-sm font-medium text-gray-700 mb-2">
// //               تاريخ الوردية <span className="text-red-500">*</span>
// //             </label>
// //             <div className="relative">
// //               <input
// //                 type="date"
// //                 id="shiftDate1"
// //                 name="shiftDate1"
// //                 required
// //                 value={formData.shiftDate1}
// //                 onChange={handleChange}
// //                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
// //               />
// //             </div>
// //           </div>
// //         </div>
// //       </section>

// //       <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
// //         <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
// //           <svg className="w-5 h-5 ml-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
// //             <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
// //           </svg>
// //           معلومات الموظف والوردية البديلة
// //         </h2>
        
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //           <div>
// //             <label htmlFor="receiverId" className="block text-sm font-medium text-gray-700 mb-2">
// //               الموظف المراد التبادل معه <span className="text-red-500">*</span>
// //             </label>
// //             <select
// //               id="receiverId"
// //               name="receiverId"
// //               required
// //               value={formData.receiverId}
// //               onChange={handleChange}
// //               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
// //             >
// //               <option value="" disabled>اختر الموظف</option>
// //               {employees.length > 0 ? (
// //                 employees.map((emp: Employee) => (
// //                   <option key={emp.employeeId} value={emp.employeeId}>
// //                     {emp.name} 
// //                   </option>
// //                 ))
// //               ) : (
// //                 <option value="" disabled>لا يوجد موظفين متاحين</option>
// //               )}
// //             </select>
// //           </div>

// //           <div>
// //             <label htmlFor="shiftDate2" className="block text-sm font-medium text-gray-700 mb-2">
// //               تاريخ الوردية البديلة <span className="text-red-500">*</span>
// //             </label>
// //             <input
// //               type="date"
// //               id="shiftDate2"
// //               name="shiftDate2"
// //               required
// //               value={formData.shiftDate2}
// //               onChange={handleChange}
// //               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
// //             />
// //           </div>

// //           <div>
// //             <label htmlFor="shiftType2" className="block text-sm font-medium text-gray-700 mb-2">
// //               نوع الوردية البديلة <span className="text-red-500">*</span>
// //             </label>
// //             <select
// //               id="shiftType2"
// //               name="shiftType2"
// //               required
// //               value={formData.shiftType2}
// //               onChange={handleChange}
// //               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
// //             >
// //               <option value="">اختر نوع الوردية</option>
// //               <option value="morning">صباحية (8ص - 4م)</option>
// //               <option value="evening">مسائية (4م - 12ص)</option>
// //               <option value="night">ليلية (12ص - 8ص)</option>
// //             </select>
// //           </div>
// //         </div>
// //       </section>

// //       <section>
// //         <label htmlFor="requesterComment" className="block text-sm font-medium text-gray-700 mb-2">
// //           ملاحظات إضافية
// //         </label>
// //         <textarea
// //           id="requesterComment"
// //           name="requesterComment"
// //           rows={4}
// //           value={formData.requesterComment}
// //           onChange={handleChange}
// //           placeholder="يمكنك إضافة أي متطلبات أو تفاصيل إضافية هنا..."
// //           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
// //         ></textarea>
// //       </section>

// //       <div className="pt-4">
// //         <button
// //           type="submit"
// //           disabled={isSubmitting}
// //           className={`w-full py-3.5 px-6 rounded-lg text-white font-semibold focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition flex items-center justify-center ${
// //             isSubmitting
// //               ? "bg-gray-400 cursor-not-allowed"
// //               : "bg-green-600 hover:bg-green-700 shadow-md"
// //           }`}
// //         >
// //           {isSubmitting ? (
// //             <>
// //               <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
// //                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
// //                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
// //               </svg>
// //               جاري معالجة الطلب...
// //             </>
// //           ) : (
// //             <>
// //               <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
// //                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
// //               </svg>
// //               إرسال طلب التبديل
// //             </>
// //           )}
// //         </button>
// //       </div>
// //     </form>
// //   </div>
// // </div>

// <div dir="rtl" className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
//   <div className="w-full max-w-3xl bg-white p-10 rounded-xl shadow-md">
//     <header className="mb-10 text-center">
//       <h1 className="text-3xl font-bold text-gray-800 mb-2">نموذج طلب تبادل ورديات</h1>
//       <p className="text-gray-600 text-lg">
//         يرجى تعبئة جميع الحقول المطلوبة لتقديم طلب التبديل
//       </p>
//       <div className="w-20 h-1 bg-green-500 mx-auto mt-4 rounded-full"></div>
//     </header>

//     {error && (
//       <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md shadow-sm">
//         <div className="flex items-center">
//           <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//           </svg>
//           <span className="font-medium">{error}</span>
//         </div>
//       </div>
//     )}
// {/* 
//     {isAfterNoon() ? (
//       <div className="text-center text-red-600 font-semibold text-lg mt-8">
//         لا يمكن تقديم الطلب بعد الساعة 12:00 ظهرًا.
//       </div>
//     ) : ( */}
//       <form className="space-y-8" onSubmit={handleSubmit}>
//         <input type="hidden" name="requestType" value="shift-exchange" />

//         {/* وردية الموظف الحالي */}
//         <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
//             <svg className="w-5 h-5 ml-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
//             </svg>
//          الطرف الاول
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label htmlFor="shiftType" className="block text-sm font-medium text-gray-700 mb-2">
//                 نوع الوردية <span className="text-red-500">*</span>
//               </label>
//               <select
//                 id="shiftType"
//                 name="shiftType"
//                 required
//                 value={formData.shiftType}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
//               >
//                 <option value="">اختر نوع الوردية</option>
//                 <option value="morning">صباحية (8ص - 4م)</option>
//                 <option value="evening">مسائية (4م - 12ص)</option>
//                 <option value="night">ليلية (12ص - 8ص)</option>
//               </select>
//             </div>

//             <div>
//               <label htmlFor="shiftDate1" className="block text-sm font-medium text-gray-700 mb-2">
//                 تاريخ الوردية <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="date"
//                 id="shiftDate1"
//                 name="shiftDate1"
//                 required
//                 value={formData.shiftDate1}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
//               />
//             </div>
//           </div>
//         </section>

//         {/* بيانات الموظف الآخر */}
//         <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
//             <svg className="w-5 h-5 ml-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
//               <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
//             </svg>
//             معلومات الموظف والوردية البديلة
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label htmlFor="receiverId" className="block text-sm font-medium text-gray-700 mb-2">
//                 الموظف المراد التبادل معه <span className="text-red-500">*</span>
//               </label>
//               <select
//                 id="receiverId"
//                 name="receiverId"
//                 required
//                 value={formData.receiverId}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
//               >
//                 <option value="" disabled>اختر الموظف</option>
//                 {employees.length > 0 ? (
//                   employees.map((emp: Employee) => (
//                     <option key={emp.employeeId} value={emp.employeeId}>
//                       {emp.name}
//                     </option>
//                   ))
//                 ) : (
//                   <option value="" disabled>لا يوجد موظفين متاحين</option>
//                 )}
//               </select>
//             </div>

//             <div>
//               <label htmlFor="shiftDate2" className="block text-sm font-medium text-gray-700 mb-2">
//                 تاريخ الوردية البديلة <span className="text-red-500">*</span>
//               </label>
//               {/* <input
//                 type="date"
//                 id="shiftDate2"
//                 name="shiftDate2"
//                 required
//                 value={formData.shiftDate2}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
//               /> */}
//               {/* <Calendar21/> */}
//             </div>

//             <div>
//               <label htmlFor="shiftType2" className="block text-sm font-medium text-gray-700 mb-2">
//                 نوع الوردية البديلة <span className="text-red-500">*</span>
//               </label>
//               <select
//                 id="shiftType2"
//                 name="shiftType2"
//                 required
//                 value={formData.shiftType2}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
//               >
//                 <option value="">اختر نوع الوردية</option>
//                 <option value="morning">صباحية (8ص - 4م)</option>
//                 <option value="evening">مسائية (4م - 12ص)</option>
//                 <option value="night">ليلية (12ص - 8ص)</option>
//               </select>
//             </div>
//           </div>
//         </section>

//         {/* ملاحظات إضافية */}
//         <section>
//           <label htmlFor="requesterComment" className="block text-sm font-medium text-gray-700 mb-2">
//             ملاحظات إضافية
//           </label>
//           <textarea
//             id="requesterComment"
//             name="requesterComment"
//             rows={4}
//             value={formData.requesterComment}
//             onChange={handleChange}
//             placeholder="يمكنك إضافة أي متطلبات أو تفاصيل إضافية هنا..."
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
//           />
//         </section>

//         {/* زر الإرسال */}
//         <div className="pt-4">
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className={`w-full py-3.5 px-6 rounded-lg text-white font-semibold focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition flex items-center justify-center ${
//               isSubmitting
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-green-600 hover:bg-green-700 shadow-md"
//             }`}
//           >
//             {isSubmitting ? (
//               <>
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 جاري معالجة الطلب...
//               </>
//             ) : (
//               <>
//                 <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
//                 </svg>
//                 إرسال طلب التبديل
//               </>
//             )}
//           </button>
//         </div>
//       </form>
//     {/* // )}  */}
//   </div>
// </div>

//   );
return (

  <div dir="rtl" className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
  <div className="w-full max-w-3xl bg-white p-10 rounded-xl shadow-md">
    <header className="mb-10 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">نموذج طلب تبادل ورديات</h1>
      <p className="text-gray-600 text-lg">
        يرجى تعبئة جميع الحقول المطلوبة لتقديم طلب التبديل
      </p>
      <div className="w-20 h-1 bg-green-500 mx-auto mt-4 rounded-full"></div>
    </header>

    {error && (
      <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md shadow-sm">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{error}</span>
        </div>
      </div>
    )}

    <form className="space-y-8" onSubmit={handleSubmit}>
      <input type="hidden" name="requestType" value="shift-exchange" />

      {/* وردية الموظف الحالي */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <svg className="w-5 h-5 ml-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          الطرف الاول
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="shiftType" className="block text-sm font-medium text-gray-700 mb-2">
              نوع الوردية <span className="text-red-500">*</span>
            </label>
            <select
              id="shiftType"
              name="shiftType"
              required
              value={formData.shiftType}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            >
              <option value="">اختر نوع الوردية</option>
              <option value="morning">صباحية (8ص - 4م)</option>
              <option value="evening">مسائية (4م - 12ص)</option>
              <option value="night">ليلية (12ص - 8ص)</option>
            </select>
          </div>

{/* <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    من إلى تاريخ الوردية <span className="text-red-500">*</span>
  </label>

  <Calendar21
    value={
      formData.shiftDate1 && formData.shiftDate2
        ? {
            from: new Date(formData.shiftDate1),
            to: new Date(formData.shiftDate2),
          }
        : null
    }
    onChange={(range: { from?: Date; to?: Date } | undefined) => {
      setFormData((prev) => ({
        ...prev,
        shiftDate1: range?.from
          ? range.from.toLocaleDateString("sv-SE") // ✅ no shift
          : "",
        shiftDate2: range?.to
          ? range.to.toLocaleDateString("sv-SE") // ✅ no shift
          : "",
      }))
    }}
  />
</div> */}
 <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        من إلى تاريخ الوردية <span className="text-red-500">*</span>
      </label>

      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setShowCalendar(!showCalendar)}
        className="mb-3 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        اختر الفترة
      </button>

      {/* Display selected range */}
    {formData.shiftDate1 && formData.shiftDate2 && (
  <p className="text-sm text-gray-700 mb-2">
    من:{" "}
    <span className="font-semibold">
      {new Date(formData.shiftDate1).toLocaleDateString("ar-EG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
    </span>{" "}
    إلى:{" "}
    <span className="font-semibold">
      {new Date(formData.shiftDate2).toLocaleDateString("ar-EG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
    </span>
  </p>
)}

      {/* Calendar component toggled */}
      {showCalendar && (
        <Calendar21
          value={
            formData.shiftDate1 && formData.shiftDate2
              ? {
                  from: new Date(formData.shiftDate1),
                  to: new Date(formData.shiftDate2),
                }
              : null
          }
       onChange={(range: { from?: Date; to?: Date } | undefined) => {
  const fromDate = range?.from
  const toDate = range?.to

  setFormData((prev) => ({
    ...prev,
    shiftDate1: fromDate ? fromDate.toLocaleDateString("sv-SE") : "",
    shiftDate2: toDate ? toDate.toLocaleDateString("sv-SE") : "",
  }))

  // ✅ Close only when both dates are selected and not the same
  if (fromDate && toDate && fromDate.getTime() !== toDate.getTime()) {
    setShowCalendar(false)
  }
}}
        />
      )}
    </div>


        </div>
      </section>

      {/* بيانات الموظف الآخر */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <svg className="w-5 h-5 ml-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
          </svg>
          معلومات الموظف والوردية البديلة
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="receiverId" className="block text-sm font-medium text-gray-700 mb-2">
              الموظف المراد التبادل معه <span className="text-red-500">*</span>
            </label>
            <select
              id="receiverId"
              name="receiverId"
              required
              value={formData.receiverId}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            >
              <option value="" disabled>اختر الموظف</option>
              {employees.length > 0 ? (
                employees.map((emp: Employee) => (
                  <option key={emp.employeeId} value={emp.employeeId}>
                    {emp.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>لا يوجد موظفين متاحين</option>
              )}
            </select>
          </div>

       

          <div>
            <label htmlFor="shiftType2" className="block text-sm font-medium text-gray-700 mb-2">
              نوع الوردية البديلة <span className="text-red-500">*</span>
            </label>
            <select
              id="shiftType2"
              name="shiftType2"
              required
              value={formData.shiftType2}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            >
              <option value="">اختر نوع الوردية</option>
              <option value="morning">صباحية (8ص - 4م)</option>
              <option value="evening">مسائية (4م - 12ص)</option>
              <option value="night">ليلية (12ص - 8ص)</option>
            </select>
          </div>
        </div>
      </section>

      {/* ملاحظات إضافية */}
      <section>
        <label htmlFor="requesterComment" className="block text-sm font-medium text-gray-700 mb-2">
          ملاحظات إضافية
        </label>
        <textarea
          id="requesterComment"
          name="requesterComment"
          rows={4}
          value={formData.requesterComment}
          onChange={handleChange}
          placeholder="يمكنك إضافة أي متطلبات أو تفاصيل إضافية هنا..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
        />
      </section>

      {/* زر الإرسال */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3.5 px-6 rounded-lg text-white font-semibold focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition flex items-center justify-center ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 shadow-md"
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جاري معالجة الطلب...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
              إرسال طلب التبديل
            </>
          )}
        </button>
      </div>
    </form>
  </div>
</div>

);
};

export default DateRangeSubmissionForm;
