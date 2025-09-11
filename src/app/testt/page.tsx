
// "use client";

// import { useState } from "react";
// import Calendar21 from "@/components/calender";

// export default function Page() {
//   const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
//   const [toDate, setToDate] = useState<Date | undefined>(undefined);
//   const now = new Date()
//   const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
//   const tomorrow = new Date(today)
//   tomorrow.setDate(tomorrow.getDate() + 1)

//   const isAfterNoon = now.getHours() >= 12
//   const disabledDays = [{before: today}, today, ...(isAfterNoon ? [tomorrow] : [])]

//   const handleFromDateChange = (range: { from?: Date; to?: Date } | undefined) => {
//     // If clicking the same date again, reset it
//     if (range?.from && fromDate && range.from.getTime() === fromDate.getTime()) {
//       setFromDate(undefined);
//     } else {
//       setFromDate(range?.from);
      
//       // If the new fromDate is after the current toDate, reset toDate
//       if (range?.from && toDate && range.from > toDate) {
//         setToDate(undefined);
//       }
//     }
//   };

//   const handleToDateChange = (range: { from?: Date; to?: Date } | undefined) => {
//     // If clicking the same date again, reset it
//     if (range?.from && toDate && range.from.getTime() === toDate.getTime()) {
//       setToDate(undefined);
//     } else if (range?.from && fromDate && range.from < fromDate) {
//       // Optional: block selecting toDate before fromDate
//       alert("تاريخ النهاية لا يمكن أن يكون قبل تاريخ البداية");
//       return;
//     } else {
//       setToDate(range?.from);
//     }
//   };

//   return (
//     <div className="p-8">
//       <h2 className="mb-4 text-lg font-medium">Date range picker (Arabic calendars)</h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* FROM Date Calendar */}
//         <div>
//           <h3 className="mb-2 font-semibold text-right">من تاريخ</h3>
//           <Calendar21
//             value={{ from: fromDate, to: fromDate }}
//             onChange={handleFromDateChange}
//           />
//         </div>

//         {/* TO Date Calendar */}
//         <div>
//           <h3 className="mb-2 font-semibold text-right">إلى تاريخ</h3>
//           <Calendar21
//             value={{ from: toDate, to: toDate }}
//             onChange={handleToDateChange}
//           />
//         </div>
//       </div>

//       {/* Show selected range */}
//       <div className="mt-6">
//         <p className="text-right">
//           <span className="font-medium">من:</span> {fromDate?.toLocaleDateString("ar-EG") || "—"}
//           &nbsp;&nbsp;|&nbsp;&nbsp;
//           <span className="font-medium">إلى:</span> {toDate?.toLocaleDateString("ar-EG") || "—"}
//         </p>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import Calendar21 from "@/components/calender";

export default function Page() {
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const isAfterNoon = now.getHours() >= 12
  const disabledDays = [{before: today}, today, ...(isAfterNoon ? [tomorrow] : [])]

  const handleFromDateChange = (range: { from?: Date; to?: Date } | undefined) => {
    // If clicking the same date again, reset it
    if (range?.from && fromDate && range.from.getTime() === fromDate.getTime()) {
      setFromDate(undefined);
    } else {
      setFromDate(range?.from);
      
      // If the new fromDate is after the current toDate, reset toDate
      if (range?.from && toDate && range.from > toDate) {
        setToDate(undefined);
      }
    }
  };

  const handleToDateChange = (range: { from?: Date; to?: Date } | undefined) => {
    // If clicking the same date again, reset it
    if (range?.from && toDate && range.from.getTime() === toDate.getTime()) {
      setToDate(undefined);
    } else if (range?.from && fromDate && range.from < fromDate) {
      // Optional: block selecting toDate before fromDate
      alert("تاريخ النهاية لا يمكن أن يكون قبل تاريخ البداية");
      return;
    } else {
      setToDate(range?.from);
    }
  };

  const clearSelection = () => {
    setFromDate(undefined);
    setToDate(undefined);
  };

  return (
    <div className="p-8">
      <h2 className="mb-4 text-lg font-medium">Date range picker (Arabic calendars)</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* FROM Date Calendar */}
        <div>
          <h3 className="mb-2 font-semibold text-right">من تاريخ</h3>
          <Calendar21
            value={{ from: fromDate, to: fromDate }}
            onChange={handleFromDateChange}
            disabled={fromDate ? [{ before: fromDate }] : disabledDays}
          />
        </div>

        {/* TO Date Calendar */}
        <div>
          <h3 className="mb-2 font-semibold text-right">إلى تاريخ</h3>
          <Calendar21
            value={{ from: toDate, to: toDate }}
            onChange={handleToDateChange}
            disabled={[
              ...disabledDays,
              ...(fromDate ? [{ before: new Date(fromDate.getTime() + 24 * 60 * 60 * 1000) }] : [])
            ]}
          />
        </div>
      </div>

      {/* Show selected range */}
      <div className="mt-6 flex justify-between items-center">
        <p className="text-right">
          <span className="font-medium">من:</span> {fromDate?.toLocaleDateString("ar-EG") || "—"}
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <span className="font-medium">إلى:</span> {toDate?.toLocaleDateString("ar-EG") || "—"}
        </p>
        
        {/* Clear button */}
        {(fromDate || toDate) && (
          <button
            onClick={clearSelection}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            مسح التحديد
          </button>
        )}
      </div>
    </div>
  );
}
