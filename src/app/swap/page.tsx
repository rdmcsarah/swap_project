
// export default DateRangeSubmissionForm;
"use client";
import Calendar21 from "@/components/calender";
import { set } from "date-fns";
import { Link } from "lucide-react";
import React, { use, useEffect, useMemo,  useRef,useState } from "react";
import { useRouter } from "next/navigation";

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
interface Request {
  id: string;
  employeeId: string;
  requestType: string;
  shiftType1: string;
  shiftType2?: string; // Optional for the second shift type
  shiftDate1: Date | null;
  shiftDate2?: Date | null; // Optional for the second shift date
  requesterComment: string;
  recieverId: string; // Assuming this is the receiver's employee ID
}

const DateRangeSubmissionForm = () => {
  const router = useRouter();
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
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [res,setRes] = useState<Request | null>(null);

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
function isAfterNoon(): boolean {
  const now = new Date();
  return now.getHours() >= 12; // 12 or later (afternoon)
}
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const sortedEmployees = useMemo(() => {
    return [...employees].sort((a, b) => a.name.localeCompare(b.name));
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    if (!searchTerm.trim()) return sortedEmployees;
    return sortedEmployees.filter((emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, sortedEmployees]);

  const handleSelect = (emp: any) => {
    setFormData({ ...formData, receiverId: emp.employeeId });
    setSearchTerm(emp.name);
    setShowDropdown(false);
  };
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

      const tommorrow = new Date();
      tommorrow.setDate(tommorrow.getDate() + 1);
      console.log("yydddddddd", tommorrow);

      const shiftDate1Date = formData.shiftDate1 ? new Date(formData.shiftDate1) : null;
      // Compare only the date part (ignore time)
      const isSameDay =
        shiftDate1Date &&
        tommorrow &&
        shiftDate1Date.getFullYear() === tommorrow.getFullYear() &&
        shiftDate1Date.getMonth() === tommorrow.getMonth() &&
        shiftDate1Date.getDate() === tommorrow.getDate();
        if (isSameDay && isAfterNoon()) {
          setError("لا يمكن تقديم طلب لتبادل الوردية ليوم الغد بعد الظهر");
          setIsSubmitting(false);
          return;
        }
      const requestData = {
        employeeId,
        requestType: "shift-exchange",
        status: "pending",
        shiftType1: formData.shiftType,
        shiftType2: formData.shiftType2,

        // shiftDate1: formData.shiftDate1 ? new Date(formData.shiftDate1) : null,
        shiftDate1:formData.shiftDate1,

        shiftDate2: formData.shiftDate2 ,
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
      setRes(result); 
      //   router.push('/requests/success'); // Redirect to success page
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };
const dropdownRef = useRef<HTMLDivElement>(null); // for employee search
const calendarRef = useRef<HTMLDivElement>(null); // for calendar

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;

    // Close dropdown if clicked outside
    if (dropdownRef.current && !dropdownRef.current.contains(target)) {
      setShowDropdown(false);
    }

    // Close calendar if clicked outside
    if (calendarRef.current && !calendarRef.current.contains(target)) {
      setShowCalendar(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

  function getCurrentTime(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}
  const wrapperRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



console.log(getCurrentTime()); // e.g., "13:45:07"
  const [showCalendar, setShowCalendar] = useState(false)

useEffect(() => {

  console.log("emps:vc ddd", res);
  if (res?.id) {
    router.push(`/swap/${res.id}`); // Redirect to the swap page with the request ID
  }

},[res]);


  // const [isResetCalendar,setIsResetCalendar]= useState(false);

  function resetCalendar(value:boolean): void {

setFormData((prev) => ({
  ...prev,
  shiftDate1: "",
  shiftDate2: "",
}));

    // setIsResetCalendar(value);
  }

  // Close the calendar when the user clicks outside of it
  

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
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200" >
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
 <div  >
      <label className="block text-sm font-medium text-gray-700 mb-2" >
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
{!(formData.shiftDate1 && formData.shiftDate2) && <p>يجب اختيار الفترة</p>}

      {/* Calendar component toggled */}
      {showCalendar && (
        <div ref={calendarRef} className="relative z-50"  >
{/* <Calendar21
  value={
    formData.shiftDate1 && formData.shiftDate2
      ? {
          from: new Date(formData.shiftDate1),
          to: new Date(formData.shiftDate2),
        }
      : formData.shiftDate1
      ? { from: new Date(formData.shiftDate1) }
      : null
  }
  onChange={(range: { from?: Date; to?: Date } | undefined) => {
    const fromDate = range?.from;
    const toDate = range?.to;

    setFormData((prev) => {
      // case 1: already selected a full range → reset and start over
      if (prev.shiftDate1 && prev.shiftDate2 && fromDate && !toDate) {
        return {
          ...prev,
          shiftDate1: fromDate.toLocaleDateString("sv-SE"),
          shiftDate2: "",
        };
      }

      // case 2: normal behavior
      return {
        ...prev,
        shiftDate1: fromDate ? fromDate.toLocaleDateString("sv-SE") : "",
        shiftDate2: toDate ? toDate.toLocaleDateString("sv-SE") : "",
      };
    });
  }}
/> */}
<Calendar21 
  value={
    formData.shiftDate1 && formData.shiftDate2
      ? {
          from: new Date(formData.shiftDate1),
          to: new Date(formData.shiftDate2),
        }
      : formData.shiftDate1
      ? { from: new Date(formData.shiftDate1) }
      : null
  }
  onChange={(range: { from?: Date; to?: Date } | undefined) => {
    const fromDate = range?.from;
    const toDate = range?.to;

    // Booking.com behaviour:
    // - If there is already a full range selected (shiftDate1 & shiftDate2)
    //   and user clicks any other date, treat that click as a new "from" date:
    //   clear the previous "to" and set "from" to the clicked date.
    // - Otherwise keep normal range behaviour.
    if (formData.shiftDate1 && formData.shiftDate2) {
      const prevFrom = new Date(formData.shiftDate1);
      // If user clicked a single date (no to) OR clicked a different start date,
      // reset the to-date and make the clicked date the new from-date.
      if (fromDate && (!toDate || fromDate.getTime() !== prevFrom.getTime())) {
        setFormData((prev) => ({
          ...prev,
          shiftDate1: fromDate.toLocaleDateString("sv-SE"),
          shiftDate2: "",
        }));
        return;
      }
    }

    // Normal range selection behavior (either setting from, or from+to)
    setFormData((prev) => ({
      ...prev,
      shiftDate1: fromDate ? fromDate.toLocaleDateString("sv-SE") : "",
      shiftDate2: toDate ? toDate.toLocaleDateString("sv-SE") : "",
    }));
  }}
/>

        </div>

      )}

      
    </div>


        </div>
      </section>

      {/* بيانات الموظف الآخر */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200"  >
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <svg className="w-5 h-5 ml-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
          </svg>
          معلومات الموظف والوردية البديلة
        </h2>

          <div className="relative"  ref={wrapperRef}>
      <label htmlFor="receiverId" className="block text-sm font-medium text-gray-700 mb-2">
        الموظف المراد التبادل معه <span className="text-red-500">*</span>
      </label>

      <input 
      required
        type="text"
        id="receiverId"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        placeholder="ابحث عن الموظف..."
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
      />

      {showDropdown && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg max-h-48 overflow-auto shadow-lg">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((emp) => (
              <li
                key={emp?.employeeId}
                onClick={() => handleSelect(emp)}
                className="px-4 py-2 hover:bg-green-100 cursor-pointer"
              >
                {emp?.name}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">لا يوجد موظفين متاحين</li>
          )}
        </ul>
      )}
    </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
          <div>
            <label htmlFor="shiftType2" className="block text-sm font-medium text-gray-700 mb-2 mt-2">
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
        {/* <button

          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3.5 px-6 rounded-lg text-white font-semibold focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition flex items-center justify-center ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 shadow-md"
          }`


        
        
        }
        >
          {isSubmitting && formData.shiftDate1 ? (
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
        </button> */}

        <button
  type="submit"
  disabled={
    isSubmitting || 
    !formData.shiftType || 
    !formData.shiftDate1 || 
    !formData.shiftDate2
  }
  className={`px-4 py-2 rounded text-white flex items-center justify-center ${
    isSubmitting || !formData.shiftType || !formData.shiftDate1 || !formData.shiftDate2 || !formData.shiftType2 || !formData.receiverId
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-green-600 hover:bg-green-700"
  }`}
>
  {isSubmitting  ? (
    <>
      <svg
        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2
             5.291A7.962 7.962 0 014 12H0c0 3.042
             1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      جاري معالجة الطلب...
    </>
  ) : (
    <>
      <svg
        className="w-5 h-5 ml-2"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16
             8 8 0 000 16zm3.707-8.707l-3-3a1
             1 0 00-1.414 1.414L10.586 9H7a1
             1 0 100 2h3.586l-1.293
             1.293a1 1 0 101.414
             1.414l3-3a1 1 0 000-1.414z"
          clipRule="evenodd"
        />
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
