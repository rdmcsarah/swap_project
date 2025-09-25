

"use client"

import * as React from "react"
import { DateRange } from "react-day-picker"
import { ar } from "date-fns/locale"
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"

function toArabicNumber(n: number | string): string {
  return n.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)])
}

interface Calendar21Props {
  value?: DateRange | null
  onChange?: (range: DateRange | undefined) => void
  disabled?: any[] // Add disabled prop
}

export default function Calendar21({ value, onChange, disabled }: Calendar21Props) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const isAfterNoon = now.getHours() >= 12
  const defaultDisabledDays = [{before: today}, today, ...(isAfterNoon ? [tomorrow] : [])]

  // Use the provided disabled days or default ones
  const disabledDays = disabled || defaultDisabledDays;

  return (
    // <div
    //   className="p-4 justify-center items-center grid grid-cols-1 md:grid-cols-2 gap-4"
    //   dir="rtl"
    // >
    //   <Calendar
    //     mode="range"
    //     defaultMonth={value?.from}
    //     selected={value ?? undefined}
    //     onSelect={onChange}
    //     numberOfMonths={1}
    //     locale={ar}
    //     disabled={disabledDays} // Use the disabledDays
    //     className="rounded-lg border shadow-sm [--cell-size:--spacing(11)] md:[--cell-size:--spacing(13)]"
    //     formatters={{
    //       formatCaption: (date) =>
    //         date.toLocaleString("ar", { month: "long" }),
    //     }}
    //     components={{
    //       DayButton: ({ children, day, modifiers, ...props }) => (
    //         <CalendarDayButton day={day} modifiers={modifiers} {...props}>
    //           {toArabicNumber(children?.toString() ?? "")}
    //         </CalendarDayButton>
    //       ),
    //     }}
    //   />
    // </div>

    <div
  className="p-4 justify-center items-center flex w-full overflow-x-auto"
  dir="rtl"
>
  <div className="max-w-full">
    <Calendar
      mode="range"
      defaultMonth={value?.from}
      selected={value ?? undefined}
      onSelect={onChange}
      numberOfMonths={1}
      locale={ar}
      disabled={disabledDays}
      className="rounded-lg border shadow-sm w-full max-w-sm md:max-w-md lg:max-w-lg"
      formatters={{
        formatCaption: (date) =>
          date.toLocaleString("ar", { month: "long" }),
      }}
      components={{
        DayButton: ({ children, day, modifiers, ...props }) => (
          <CalendarDayButton day={day} modifiers={modifiers} {...props}>
            {toArabicNumber(children?.toString() ?? "")}
          </CalendarDayButton>
        ),
      }}
    />
  </div>
</div>

  )
}