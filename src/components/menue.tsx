"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export function DropdownMenuRadioGroupDemo() {
  const [position, setPosition] = React.useState("bottom")
  const router = useRouter();
    const handleSelect = (value: string) => {
    if (value === 'swap') {
      router.push('/swap'); // Replace with your actual route
    }
  };

  return (
<DropdownMenu  dir="rtl">
  <DropdownMenuTrigger asChild>
    <Button variant="outline" className="bg-green-700 hover:bg-green-600">
       تقديم طلب
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent
    // dir="rtl"
    align="end"
    sideOffset={8} // adds spacing between trigger & dropdown
    className="w-56 mr-2 mt-2"
  >
    {/* <DropdownMenuLabel>نوع الطلب</DropdownMenuLabel> */}
    {/* <DropdownMenuSeparator /> */}
    <DropdownMenuRadioGroup value={position} onValueChange={handleSelect}>
      <DropdownMenuRadioItem value="swap">طلب تبديل</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="evaluation">تقييم متدرب</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="shadowing">مرافقة سائق</DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
  </DropdownMenuContent>
</DropdownMenu>


  )
}
