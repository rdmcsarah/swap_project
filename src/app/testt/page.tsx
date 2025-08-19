"use client";
import DateRangePicker from "@/components/ui/date-range-picker"
import { set } from "date-fns";
import { se } from "date-fns/locale";
import { useState } from "react";

export default function Page() {

    const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
    const [toDate, setToDate] = useState<Date | undefined>(undefined);  
    const [value, setValue] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: fromDate, to: toDate });
  
const [selectedRange, setSelectedRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
    const handleDateChange = (range: { from: Date | undefined; to: Date | undefined }) => {
        // console.log("Selected date range:", range);
        setSelectedRange(range);
    //    const toDateIni = new Date("2025-10-01");
    //    setToDate(toDateIni);
    //  range.from !== undefined && range.to !== undefined ?  (range.from = undefined , range.to = undefined): null
    // if( range.from !== undefined && range.to !== undefined) {
    //     setFromDate(undefined);
    //     setToDate(undefined);
    // }else{
         setFromDate(range.from);
        setToDate(range.to);
    // }

    setValue({ from: fromDate, to: toDate });

    }
    return (
        <div className="p-8">
            <h2 className="mb-4 text-lg font-medium">Date range picker (tailwind)</h2>
            <p>{JSON.stringify(selectedRange)}</p>
            <DateRangePicker onChange={handleDateChange}   />
        </div>
    )
}