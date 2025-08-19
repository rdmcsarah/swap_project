"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar } from "./calendar"
import { Popover, PopoverTrigger, PopoverContent } from "./popover"
import { Input } from "./input"
import { cn } from "@/lib/utils"

type Range = { from: Date | undefined; to: Date | undefined }

export default function DateRangePicker({
  value,
  onChange,
  className,
  
}: {
  value?: Range
  onChange?: (r: Range) => void
  className?: string,
  
}) {
  const [open, setOpen] = React.useState(false)
  const [range, setRange] = React.useState<Range>(
    value ?? { from: undefined, to: undefined }
  )

  React.useEffect(() => {
    if (value) setRange(value)
  }, [value])

  function handleSelect(selected: any) {
//    if(selected.from !== undefined && selected.to !== undefined) 

const newRange = selected.from !== null && selected.to !== null ?  { from: null, to: selected.to} :  { from: selected.from, to: selected.to }
    setRange(newRange)
    // alert("Selected date range: " + JSON.stringify(selected))
    onChange?.(newRange)
  }

  function formatInput(d?: Date) {
    return d ? format(d, "yyyy-LL-dd") : ""
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
    
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex gap-2 w-[340px]">
            <Input
              readOnly
              value={formatInput(range.from)}
              placeholder="From"
              className="w-1/2 cursor-pointer"
              onClick={() => setOpen(true)}
            />
            <Input
              readOnly
              value={formatInput(range.to)}
              placeholder="To"
              className="w-1/2 cursor-pointer"
              onClick={() => setOpen(true)}
            />
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <div className="p-4">
            <Calendar
              mode="range"
              selected={range}
              onSelect={handleSelect}
              numberOfMonths={2}
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                type="button"
                onClick={() => {
                  setRange({ from: undefined, to: undefined })
                  onChange?.({ from: undefined, to: undefined })
                }}
                className="px-3 py-1 rounded-md bg-muted text-muted-foreground"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-3 py-1 rounded-md bg-primary text-primary-foreground"
              >
                Done
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
