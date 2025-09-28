

"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Calendar21 from "@/components/calender";

interface FormData {
  requestType: string;
  shiftType: string;
  shiftType2: string;
  shiftDate1: string;
  shiftDate2: string;
  requesterComment: string;
  receiverId: string;
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
  shiftType2?: string;
  shiftDate1: Date | null;
  shiftDate2?: Date | null;
  requesterComment: string;
  recieverId: string;
}

export default function DateRangeSubmissionForm() {
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
  const [res, setRes] = useState<Request | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);


  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();

  const dropdownRef = useRef<HTMLDivElement>(null);
const fromRef = useRef<HTMLDivElement>(null);
const toRef = useRef<HTMLDivElement>(null);

const [showFromCalendar, setShowFromCalendar] = useState(false);
const [showToCalendar, setShowToCalendar] = useState(false);


  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isAfterNoon = now.getHours() >= 12;
  const disabledDays = [{ before: today }, today, ...(isAfterNoon ? [tomorrow] : [])];
  

  // Fetch employees
  useEffect(() => {
    const getEmployees = async () => {
      try {
        const response = await fetch("/api/employees");
        if (!response.ok) throw new Error("Failed to fetch employees");
        const data = await response.json();

       const drivers = data.filter((emp: {
         employeeId: string | null;
         employeeType: string; type: Employee
}) => emp.employeeType === "DRIVER" && emp.employeeId !== (localStorage.getItem("employeeId") ));

        setEmployees(drivers);
      } catch (err) {
        setError("تعذر تحميل بيانات الموظفين");
      }
    };
    
    getEmployees();
  }, []);

  console.log("Employees--------------:", employees);
  // Close dropdown or calendars when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setShowDropdown(false);
      }
      if (fromRef.current && !fromRef.current.contains(target)) {
        setShowFromCalendar(false);
      }
      if (toRef.current && !toRef.current.contains(target)) {
        setShowToCalendar(false);
      }
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowDropdown(false);
        setShowFromCalendar(false);
        setShowToCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  // Redirect when response comes
  // useEffect(() => {
  //   if (res?.id) router.push(`/swap/${res.id}`);
  // }, [res, router]);

  // Form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Date change handlers
  const handleDateChange = (type: "from" | "to", date?: Date) => {
    if (type === "from") {
      setFromDate(date);
      setFormData((prev) => ({ ...prev, shiftDate1: date?.toLocaleDateString("sv-SE") || "" }));
      if (toDate && date && date > toDate) {
        setToDate(undefined);
        setFormData((prev) => ({ ...prev, shiftDate2: "" }));
      }
    } else {
      if (date && fromDate && date < fromDate) {
        alert("تاريخ النهاية لا يمكن أن يكون قبل تاريخ البداية");
        return;
      }
      setToDate(date);
      setFormData((prev) => ({ ...prev, shiftDate2: date?.toLocaleDateString("sv-SE") || "" }));
    }
  };

  const clearDate = (type: "from" | "to") => {
    if (type === "from") {
      setFromDate(undefined);
      setFormData((prev) => ({ ...prev, shiftDate1: "" }));
    } else {
      setToDate(undefined);
      setFormData((prev) => ({ ...prev, shiftDate2: "" }));
    }
  };

  // Employees filtering
  const sortedEmployees = useMemo(
    () => [...employees].sort((a, b) => a.name.localeCompare(b.name)),
    [employees]
  );

  const filteredEmployees = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return sortedEmployees.filter((emp) =>
      `${emp.employeeId}-${emp.name}`.toLowerCase().includes(term)
    );
  }, [searchTerm, sortedEmployees]);

  const handleSelect = (emp: Employee) => {
    setFormData((prev) => ({ ...prev, receiverId: emp.employeeId }));
    setSearchTerm(emp.name);
    setShowDropdown(false);
  };

  // Submit
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // setIsSubmitting(true);
  //   // setError("");


  //     if (isSubmitting) return; // Extra guard
  // setIsSubmitting(true);
  // setError("");

  //   try {
  //     const employeeId = localStorage.getItem("employeeId") || "RDMC2851";

  //     const requestData = {
  //       employeeId,
  //       requestType: "shift-exchange",
  //       status: "pending",
  //       shiftType1: formData.shiftType,
  //       shiftType2: formData.shiftType2,
  //       shiftDate1: fromDate,
  //       shiftDate2:toDate,
  //       requesterComment: formData.requesterComment,
  //       recieverId: formData.receiverId,
  //     };

  //     const response = await fetch("/api/requests", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(requestData),
  //     });

  //     if (!response.ok) throw new Error("فشل إرسال الطلب");
  //     setRes(await response.json());

  //     if (res?.id) router.push(`/swap/${res.id}`);

  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : "حدث خطأ غير معروف");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (isSubmitting) return; // Prevent double click
  setIsSubmitting(true);
  setError("");

  try {
    const employeeId = localStorage.getItem("employeeId") || "RDMC2851";

    const requestData = {
      employeeId,
      requestType: "shift-exchange",
      status: "pending",
      shiftType1: formData.shiftType,
      shiftType2: formData.shiftType2,
      shiftDate1: fromDate,
      shiftDate2: toDate,
      requesterComment: formData.requesterComment,
      recieverId: formData.receiverId,
    };

    const response = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) throw new Error("فشل إرسال الطلب");

    const data = await response.json(); // ✅ Don't use setRes here
    router.push(`/swap/${data.id}`);     // ✅ Navigate right away

  } catch (err) {
    setError(err instanceof Error ? err.message : "حدث خطأ غير معروف");
    setIsSubmitting(false); // Re-enable only on error
  }
};

  return (


    <div dir="rtl" className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 md:px-8 py-12">
  <div className="w-full max-w-3xl bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-md">
    <header className="mb-10 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">نموذج طلب تبادل ورديات</h1>
      <p className="text-gray-600 text-lg">يرجى تعبئة جميع الحقول المطلوبة لتقديم الطلب</p>
      <div className="w-20 h-1 bg-green-500 mx-auto mt-4 rounded-full"></div>
    </header>

    {error && (
      <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
        {error}
      </div>
    )}

    <form className="space-y-8" onSubmit={handleSubmit}>
      {/* Dates */}
      <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
          <svg className="w-6 h-6 ml-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          الطرف الأول
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
              <option value="morning">صباحية </option>
              <option value="evening">مسائية </option>
              <option value="afternoon">ليليه </option>
            </select>
          </div>

          {/* From Date */}
          <div className="relative" ref={fromRef}>
            <label className="block text-sm mb-2 font-medium">تاريخ البداية</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowFromCalendar(!showFromCalendar);
                  setShowToCalendar(false);
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                {fromDate ? fromDate.toLocaleDateString("ar-EG") : "اختر تاريخ البداية"}
              </button>
              {fromDate && (
                <button
                  type="button"
                  onClick={() => clearDate("from")}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg"
                >
                  مسح
                </button>
              )}
            </div>
            {showFromCalendar && (
              <div className="mt-2">
                <Calendar21
                  value={{ from: fromDate, to: fromDate }}
                  onChange={(r) => handleDateChange("from", r?.from)}
                  disabled={disabledDays}
                />
              </div>
            )}
          </div>

          {/* To Date */}
          <div className="relative" ref={toRef}>
            <label className="block text-sm mb-2 font-medium">تاريخ النهاية</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowToCalendar(!showToCalendar);
                  setShowFromCalendar(false);
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                {toDate ? toDate.toLocaleDateString("ar-EG") : "اختر تاريخ النهاية"}
              </button>
              {toDate && (
                <button
                  type="button"
                  onClick={() => clearDate("to")}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg"
                >
                  مسح
                </button>
              )}
            </div>
            {showToCalendar && (
              <div className="mt-2">
                <Calendar21
                  value={{ from: toDate, to: toDate }}
                  onChange={(r) => handleDateChange("to", r?.from)}
                  disabled={[
                    { before: today },
                    ...(isAfterNoon && (!toDate || toDate.getTime() !== tomorrow.getTime()) ? [tomorrow] : []),
                    ...(fromDate ? [{ before: fromDate }] : [])
                  ]}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* الموظف الآخر */}
  <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <svg className="w-5 h-5 ml-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
          </svg>
          معلومات الموظف والوردية البديلة
        </h2>

  <div className="relative" ref={dropdownRef}>
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
                    key={emp.employeeId}
                    onClick={() => handleSelect(emp)}
                    className="px-4 py-2 hover:bg-green-100 cursor-pointer"
                  >
                    {emp.employeeId}-{emp.name}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-500">لا يوجد موظفين متاحين</li>
              )}
            </ul>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
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
              <option value="morning">صباحية</option>
              <option value="evening">مسائية</option>
              <option value="afternoon">ليليه</option>
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
          disabled={
            isSubmitting ||
            !formData.shiftType ||
            !formData.shiftDate1 ||
            !formData.shiftDate2 ||
            !formData.shiftType2 ||
            !formData.receiverId
          }
          className={`w-full py-3.5 px-6 rounded-lg text-white font-semibold focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition flex items-center justify-center ${
            isSubmitting ||
            !formData.shiftType ||
            !formData.shiftDate1 ||
            !formData.shiftDate2 ||
            !formData.shiftType2 ||
            !formData.receiverId
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 shadow-md"
          }`}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              جاري معالجة الطلب...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
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

// export default DateRangeSubmissionForm;