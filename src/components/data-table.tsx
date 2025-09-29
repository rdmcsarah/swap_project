"use client";

import * as React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
  IconTrendingUp,
} from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";
import { z } from "zod";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenuRadioGroupDemo } from "./menue";
import { useRouter } from "next/navigation";
import Link from "next/link";
// const router = useRouter();
import { FilterFn } from "@tanstack/react-table";
import { useState } from "react";
type Employee={
    id: string
    name: string
    email: string
    phone: string
    department: string
    position: string
    employeeId: string
    project: string
    employeeType:string

}
// type Request = {
//   id: string;
//   employeeId: string;
//   status: string;
//   createdAt: string;
//   updatedAt: string;
//   requestType: string;
//   firstApprovment: string;
//   secondApprovment: string;
//   shiftType1: string;
//   shiftType2: string;
//   shiftDate1: string;
//   shiftDate2: string;
//   requestComment: string;
//   replier1_Comment: string;
//   replier2_Comment: string;
//   approvalDate1: string;
//   approvalDate2: string;
// };
type Request={
    id: string
    employeeId: string
    status: string
    createdAt: string
    updatedAt: string
    requestType: string
     firstApprovment: string;
  secondApprovment: string;
    shiftType1: string
    shiftType2: string
    shiftDate1: string
    shiftDate2: string
    requestComment: string
    replier1_Comment: string
    replier2_Comment: string
    approvalDate1: string
    approvalDate2: string
  RequestReceivers: {
    id: string  
    requestId: string
    employeeId: string
    recieverId: string
    employee: Employee
    reciever: Employee
  }[]



}
type Data = {
  map(arg0: ({ id }: { id: any }) => any): UniqueIdentifier[];
  requests: Request[];
  // employees: Employee[]
};
export const requestSchema = z.object({
  id: z.string(),
  employeeId: z.string(),
  status: z.string(),
  createdAt: z.string(), // maybe use z.date() if you want Date objects
  updatedAt: z.string(),
  requestType: z.string(),
  firstApprovment: z.string(),
  secondApprovment: z.string(),
  shiftType1: z.string(),
  shiftType2: z.string(),
  shiftDate1: z.string(),
  shiftDate2: z.string(),
  requestComment: z.string(),
  replier1_Comment: z.string(),
  replier2_Comment: z.string(),
  approvalDate1: z.string(),
  approvalDate2: z.string(),
});

const statusMap: Record<string, string> = {
  PENDING: "قيد الانتظار",
  APPROVED: "تمت الموافقه",
  REJECTED: "مرفوض",
};

const requestTypeMap: Record<string, string> = {
  "shift-exchange": "تبديل المناوبة",
};

const globalFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
  console.log(
    "filterValue: ########################################",
    filterValue
  );
  if (!filterValue) return true;

  const searchTerm = filterValue.toLowerCase();
  const originalData = row.original;

  console.log("llll: ", originalData.requestType);
  // Search across multiple relevant fields
  return (
    String(originalData.id || "")
      .toLowerCase()
      .includes(searchTerm) ||
    String(originalData.employeeId || "")
      .toLowerCase()
      .includes(searchTerm) ||
    String(originalData.requestType || "")
      .toLowerCase()
      .includes(searchTerm) ||
    String(originalData.status || "")
      .toLowerCase()
      .includes(searchTerm) ||
    String(originalData.firstApproval || "")
      .toLowerCase()
      .includes(searchTerm)
  );
};
export const getRequestColumns = (
  employeeId: string | null,
  employee: Employee
): ColumnDef<z.infer<typeof requestSchema>>[] => [
  // export const requestColumns: ColumnDef<z.infer<typeof requestSchema>>[] = [
  {
    accessorKey: "عرض",
    header: () => <div className="text-center font-semibold">عرض</div>,
    cell: ({ row }) => {
      const rowEmployeeId = row.original.employeeId;

      return (
        <div className="flex justify-center">
          {(rowEmployeeId === employeeId || (row.original.firstApprovment !== null  && (employee.employeeType === "DRIVER" || employee.employeeType === "ADMIN"))) ? (
            <Link href={`/${row.original.id}`}>
              <Button className="bg-green-700 hover:bg-green-500 rounded-xl px-10 py-2 text-white">
                عرض
              </Button>
            </Link>
          ) : (
            <Link href={`/${row.original.id}`}>
              <Button className="bg-green-900 hover:bg-green-500 rounded-xl px-8 py-2 text-white">
                اتخذ اجراء
              </Button>
            </Link>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "موافقة الثانيه",
    header: () => (
      <div className="text-center font-semibold"> موافقة ثانية </div>
    ),
    cell: ({ row }) => {
      const status = row.original.secondApprovment ?? "PENDING";
      const statusLabel =
        status === "PENDING" ? "قيد الانتظار" : statusMap[status] || status;

      let badgeColor = "bg-yellow-100 text-yellow-700 border-yellow-300"; // default pending
      if (status === "APPROVED") {
        badgeColor = "bg-green-100 text-green-700 border-green-300";
      } else if (status === "REJECTED") {
        badgeColor = "bg-red-100 text-red-700 border-red-300";
      }

      return (
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${badgeColor}`}
          >
            {/* {status === "APPROVED" ? (
            <IconCircleCheckFilled className="w-4 h-4" />
          ) : (
            <IconLoader className="w-4 h-4" />
          )} */}
            {statusLabel}
          </Badge>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      const value = row.original.secondApprovment ?? "PENDING";
      return value === filterValue;
    },
  },
  {
    accessorKey: "موافقة اولي",
    header: () => <div className="text-center font-semibold">موافقة أولى</div>,
    cell: ({ row }) => {
      const status = row.original.firstApprovment ?? "PENDING";
      const statusLabel =
        status === "PENDING" ? "قيد الانتظار" : statusMap[status] || status;

      let badgeColor = "bg-yellow-100 text-yellow-700 border-yellow-300"; // default pending
      if (status === "APPROVED") {
        badgeColor = "bg-green-100 text-green-700 border-green-300";
      } else if (status === "REJECTED") {
        badgeColor = "bg-red-100 text-red-700 border-red-300";
      }

      return (
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${badgeColor}`}
          >
            {/* {status === "APPROVED" ? (
            <IconCircleCheckFilled className="w-4 h-4" />
          ) : (
            // <IconLoader className="w-4 h-4" />
          )} */}
            {statusLabel}
          </Badge>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      const value = row.original.firstApprovment ?? "PENDING";
      return value === filterValue;
    },
  },

  {
  accessorKey: "اسم مقدم الطلب",
  header: () => <div className="text-center font-semibold">اسم مقدم الطلب</div>,
  cell: (cellContext: any) => {
    const row = cellContext.row as Row<Request>;

    const creatorEntry = Array.isArray(row.original.RequestReceivers)
      ? row.original.RequestReceivers.find(
          (r) => r.employeeId === row.original.employeeId
        )
      : undefined;

    const employee = creatorEntry?.employee;
    console.log("employee eeeeeeeee  in col",creatorEntry)

    const creatorName = employee?.name || row.original.employeeId;
    // const creatorImage = employee?.image;
    const creatorImage = "";
console.log("employee in colrow.original.RequestReceivers",row.original.RequestReceivers)



    return (
      <div className="flex items-center gap-2 justify-center">
        <Avatar className="w-8 h-8">
          <AvatarImage src={creatorImage || undefined} alt={creatorName} />
          <AvatarFallback>
            {creatorName?.slice(0, 2) ?? "??"}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">{creatorName}</span>
      </div>
    );
  },
  enableHiding: true,
},


//   {
//   accessorKey: "اسم مقدم الطلب",
//   header: () => <div className="text-center font-semibold">اسم مقدم الطلب</div>,
//   cell: (cellContext: any) => {
//     const row = cellContext.row as Row<Request>;

//     const creatorEntry = Array.isArray(row.original.RequestReceivers)
//       ? row.original.RequestReceivers.find(
//           (r) => r.employeeId === row.original.employeeId
//         )
//       : undefined;

//     const employee = creatorEntry?.employee;
//     console.log("employee in col",employee)
//     const creatorName = employee?.name || row.original.employeeId;
//     // const creatorImage = employee?.image;
//     const creatorImage = "";

//     return (
//       <div className="flex items-center gap-2 justify-center">
//         <Avatar className="w-8 h-8">
//           <AvatarImage src={creatorImage || undefined} alt={creatorName} />
//           <AvatarFallback>
//             {creatorName?.slice(0, 2) ?? "??"}
//           </AvatarFallback>
//         </Avatar>
//         <span className="text-sm font-medium">{creatorName}</span>
//       </div>
//     );
//   },
//   enableHiding: true,
// },

  {
    accessorKey: "تاريخ",
    header: () => <div className="text-center font-semibold">تاريخ</div>,
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      // 🟢 Format the date in Arabic (long format, e.g. 11 سبتمبر 2025)
      const formattedDate = new Intl.DateTimeFormat("ar-EG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);

      return (
        <div className="flex justify-center">
          <Badge variant="outline" className="px-3 py-1.5 rounded-lg text-sm">
            {formattedDate}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "employeeId",
    header: () => <div className="text-center font-semibold">مقدم الطلب</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge variant="outline" className="px-3 py-1.5 rounded-lg text-sm">
          {row.original.employeeId}
        </Badge>
      </div>
    ),

    enableHiding: false,
  },
  {
    accessorKey: "مقدم الطلب",
    header: () => <div className="text-center font-semibold">مقدم الطلب</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge variant="outline" className="px-3 py-1.5 rounded-lg text-sm">
          {row.original.employeeId}
        </Badge>
      </div>
    ),

    enableHiding: true,
  },
...(employee.employeeType === "ADMIN"
  ? [
      {
        accessorKey: "المستبدل معه",
        header: () => <div className="text-center font-semibold">المستبدل معه</div>,
        cell: (cellContext: any) => {
          const row = cellContext.row as Row<Request>;
          const names = Array.isArray(row.original.RequestReceivers)
            ? row.original.RequestReceivers.map((r) => r.reciever?.name || r.recieverId).join(", ")
            : "N/A";
          return (
            <div className="flex justify-center">
              <Badge variant="outline" className="px-3 py-1.5 rounded-lg text-sm">
                {names}fff
              </Badge>
            </div>
          );
        },
        enableHiding: true,
      },
    ]
  : []),
 
  // {
  //   accessorKey: "مقدم الطلب اسم ",
  //   header: () => <div className="text-center font-semibold">  اسم مقدم الطلب</div>,
  //     cell: (cellContext: any) => {
  //       const row = cellContext.row as Row<Request>;
  //       // Find the RequestReceivers entry where the employeeId equals the request creator
  //       const creatorEntry = Array.isArray(row.original.RequestReceivers)
  //         ? row.original.RequestReceivers.find((r) => r.employeeId === row.original.employeeId)
  //         : undefined;
  //       const creatorName = creatorEntry?.employee?.name || row.original.employeeId;
  //       return (
  //         <div className="flex justify-center">
  //           <Badge variant="outline" className="px-3 py-1.5 rounded-lg text-sm">
  //             {creatorName}
  //           </Badge>
  //         </div>
  //       );
  //     },

  //   enableHiding: true,
  // },

  {
    accessorKey: "رقم الطلب",
    header: () => <div className="text-center font-semibold">رقم الطلب</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge variant="outline" className="px-3 py-1.5 rounded-lg text-sm">
          {row.original.id}
        </Badge>
      </div>
    ),

    enableHiding: true,
  },
];

export function DataTable({ data ,employee}: { data: Request[] ,employee: Employee}) {
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [tableData, setTableData] = React.useState<Request[]>(() => data);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [] 
  );
 console.log("ddddddddd---------------dfffffff",employee)


  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });


  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  // Get employeeId from localStorage (client-side only)
  React.useEffect(() => {
    const id = localStorage.getItem("employeeId");
    setEmployeeId(id);
  }, []);

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => tableData?.map(({ id }) => id) || [],
    [tableData, router, employeeId]
  );

  const memoizedColumns = React.useMemo(
    () => getRequestColumns(employeeId,employee),
    [employeeId,employee]
  );

  // console.log("dataa in table", tableData);

  const table = useReactTable({
    data: tableData ?? [],
    columns: memoizedColumns,

    state: {
      sorting,
      // columnVisibility,
      columnVisibility: {
     "مقدم الطلب": false, // 👈 hide by default
   "رقم الطلب": false, // 👈 hide by default
    employeeId: false, // 👈 hide by default
    
    ...columnVisibility,
  },
      rowSelection,
      columnFilters,
      pagination,
      globalFilter, // ✅ Add this
    },
    // getRowId: (row: z.infer<typeof requestSchema>) => row.id.toString(),
    getRowId: (row, index) => row.id ?? index.toString(),
    onGlobalFilterChange: setGlobalFilter, // ✅ Add this
    globalFilterFn, // ✅ Add this

    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setTableData((prev) => {
        const oldIndex = prev.findIndex((req) => req.id === active.id);
        const newIndex = prev.findIndex((req) => req.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }

  return (
   <Tabs defaultValue="outline" className="w-full flex-col gap-6">
  {/* Toolbar Section */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 py-4 bg-white border-b border-gray-200 rounded-t-lg shadow-sm">
    {/* Left: Main Action */}

    <div>
      <Button
        onClick={() => router.push("/swap")}
        className="bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg px-4 py-2"
      >
        + تقديم طلب
      </Button>
    </div>

    {/* Middle: Filters & Column Manager */}
    <div className="flex flex-wrap items-center gap-3">
      {/* Column Toggle */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 rounded-lg">
            <IconLayoutColumns className="w-4 h-4" />
            <span className="hidden sm:inline">إدارة الأعمدة</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {table.getAllColumns()
            .filter((col) => col.getCanHide())
            .map((col) => (
              <DropdownMenuCheckboxItem
                key={col.id}
                checked={col.getIsVisible()}
                onCheckedChange={(val) => col.toggleVisibility(!!val)}
                className="text-sm"
              >
                {col.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Filter: Second Approval */}
      <Select
        value={
          (table.getColumn("موافقة الثانيه")?.getFilterValue() as string) ??
          "ALL"
        }
        onValueChange={(val) =>
          table
            .getColumn("موافقة الثانيه")
            ?.setFilterValue(val === "ALL" ? undefined : val)
        }
      >
        <SelectTrigger className="w-36 text-sm rounded-lg">
          <SelectValue placeholder="موافقة ثانية" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">موافقة ثانية</SelectItem>
           <SelectItem value="APPROVED">تمت الموافقه</SelectItem>
          <SelectItem value="PENDING">قيد الانتظار</SelectItem>
          <SelectItem value="REJECTED">مرفوض</SelectItem>
        </SelectContent>
      </Select>

      {/* Filter: First Approval */}
      <Select
        value={
          (table.getColumn("موافقة اولي")?.getFilterValue() as string) ??
          "ALL"
        }
        onValueChange={(val) =>
          table
            .getColumn("موافقة اولي")
            ?.setFilterValue(val === "ALL" ? undefined : val)
        }
      >
        <SelectTrigger className="w-36 text-sm rounded-lg">
          <SelectValue placeholder="موافقة أولى" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">موافقة أولى</SelectItem>
          <SelectItem value="APPROVED">تمت الموافقه</SelectItem>
          <SelectItem value="PENDING">قيد الانتظار</SelectItem>
          <SelectItem value="REJECTED">مرفوض</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* Right: Search Input */}
  <div className="w-full md:w-72 relative">
  <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
      />
    </svg>
  </span>
  <Input
    dir="rtl"
    type="text"
    placeholder="بحث..."
    value={table.getState().globalFilter ?? ""}
    onChange={(e) => table.setGlobalFilter(e.target.value)}
    className="w-full pl-3 pr-10 rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
  />
</div>

  </div>

  {/* Table Content */}
  <TabsContent
    value="outline"
    className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
  >
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
        id={sortableId}
      >
        <Table>
          <TableHeader className="bg-gray-100 sticky top-0 z-10 text-gray-700 text-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="px-4 py-3 text-center"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              <SortableContext
                items={dataIds}
                strategy={verticalListSortingStrategy}
              >
                {table.getRowModel().rows.map((row) => (
                  <DraggableRow key={row.id} row={row} />
                ))}
              </SortableContext>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={getRequestColumns.length}
                  className="h-24 text-center text-gray-500"
                >
                  لا توجد نتائج
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DndContext>
    </div>

    {/* Pagination */}
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white rounded-lg border shadow-sm">
      <div className="text-gray-500 hidden sm:flex text-sm">
        {table.getFilteredSelectedRowModel().rows.length} من{" "}
        {table.getFilteredRowModel().rows.length} صف/صفوف محددة
      </div>

      <div className="flex items-center gap-6">
        {/* Rows per page */}
        <div className="hidden sm:flex items-center gap-2">
          <Label htmlFor="rows-per-page" className="text-sm font-medium">
            الصفوف لكل صفحة
          </Label>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
              <SelectValue
                placeholder={table.getState().pagination.pageSize}
              />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <IconChevronsLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <IconChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronsRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  </TabsContent>

  {/* Other Tabs (placeholders) */}
  <TabsContent value="past-performance" className="px-4 lg:px-6">
    <div className="aspect-video w-full rounded-lg border border-dashed bg-gray-50" />
  </TabsContent>

  <TabsContent value="key-personnel" className="px-4 lg:px-6">
    <div className="aspect-video w-full rounded-lg border border-dashed bg-gray-50" />
  </TabsContent>

  <TabsContent value="focus-documents" className="px-4 lg:px-6">
    <div className="aspect-video w-full rounded-lg border border-dashed bg-gray-50" />
  </TabsContent>
</Tabs>

  );
}

function DraggableRow({ row }: { row: Row<z.infer<typeof requestSchema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}
