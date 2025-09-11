import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  return (
<header className="sticky top-0 z-50 flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b bg-white dark:bg-gray-900 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[var(--header-height)]">
  <div className="flex w-full items-center gap-1 p-4 px-4 lg:gap-2 lg:px-6">
    {/* <SidebarTrigger className="-ml-1" /> */}
    <Separator
      orientation="vertical"
      className="mx-2 data-[orientation=vertical]:h-4"
    />
    <h1 className="text-base font-medium text-gray-900 dark:text-white">
      Drivers App
    </h1>
  </div>
</header>

  )
}
