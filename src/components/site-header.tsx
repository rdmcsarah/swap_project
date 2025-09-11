
"use client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useRouter } from "next/navigation";

export function SiteHeader() {

  const router=useRouter()
  return (
<header className="sticky top-0 z-50 flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b bg-white dark:bg-gray-900 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[var(--header-height)]">
  <div className="flex w-full items-center gap-1 p-4 px-4 lg:gap-2 lg:px-6">
    {/* <SidebarTrigger className="-ml-1" /> */}
    <Separator
      orientation="vertical"
      className="mx-2 data-[orientation=vertical]:h-4"
    />
<Button 
  variant="ghost" 
  size="icon"
  className="h-8 w-8 rounded-md"
  aria-label="Home"
  onClick={()=>{router.push("/")}}
>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
</Button>
    <h1 className="text-base font-medium text-gray-900 dark:text-white">
      Drivers App
    </h1>
  </div>
</header>

  )
}
