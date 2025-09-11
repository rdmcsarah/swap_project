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

type Request = {
  id: string;
  employeeId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  requestType: string;
  firstApprovment: string;
  secondApprovment: string;
  shiftType1: string;
  shiftType2: string;
  shiftDate1: string;
  shiftDate2: string;
  requestComment: string;
  replier1_Comment: string;
  replier2_Comment: string;
  approvalDate1: string;
  approvalDate2: string;
};


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
  APPROVED:"تمت الموافقه"
};

const requestTypeMap: Record<string, string> = {
  "shift-exchange": "تبديل المناوبة",
};


const globalFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
  if (!filterValue) return true;
  
  const searchTerm = filterValue.toLowerCase();
  const originalData = row.original;
  
  // Search across multiple relevant fields
  return (
    String(originalData.id || '').toLowerCase().includes(searchTerm) ||
    String(originalData.employeeId || '').toLowerCase().includes(searchTerm) ||
    String(originalData.requestType || '').toLowerCase().includes(searchTerm) ||
    String(originalData.status || '').toLowerCase().includes(searchTerm) ||
    String(originalData.firstApproval || '').toLowerCase().includes(searchTerm)
  );
};

export const requestColumns: ColumnDef<z.infer<typeof requestSchema>>[] = [
  {
    accessorKey: "view",
    header: () => <div className="text-center font-semibold">عرض</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Button className="bg-green-700 hover:bg-green-500 rounded-xl px-6 py-2 text-white">
          <Link href={`/${row.original.id}`}>عرض</Link>
        </Button>
      </div>
    ),
  },
  {
    
    accessorKey: "reviewerdf",
    header: () => <div className="text-center font-semibold">ثانية موافقة</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge
          variant="outline"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
        >
          {row.original.secondApprovment === "APPROVED" ? (
            <IconCircleCheckFilled className="w-4 h-4 fill-green-500 dark:fill-green-400" />
          ) : (
            <IconLoader className="w-4 h-4 animate-spin" />
          )}
          {row.original.secondApprovment===null?"قيد الانتظار":statusMap[row.original.secondApprovment] || row.original.secondApprovment}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "target",
    header: () => <div className="text-center font-semibold">موافقة أولى</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge
          variant="outline"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
        >
          {row.original.firstApprovment === "APPROVED" ? (
            <IconCircleCheckFilled className="w-4 h-4 fill-green-500 dark:fill-green-400" />
          ) : (
            <IconLoader className="w-4 h-4 animate-spin" />
          )}

          {row.original.firstApprovment===null?"قيد الانتظار":statusMap[row.original.firstApprovment] || row.original.firstApprovment}

          {/* {row.original.firstApprovment || "not found"} */}
          {/* {statusMap[row.original.firstApprovment] || row.original.firstApprovment} */}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center font-semibold">نوع الطلب</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge variant="outline" className="px-3 py-1.5 rounded-lg text-sm">
          {requestTypeMap[row.original.requestType] || row.original.requestType}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: () => <div className="text-center font-semibold">مقدم الطلب</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge variant="outline" className="px-3 py-1.5 rounded-lg text-sm">
          {row.original.employeeId}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "header",
    header: () => <div className="text-center font-semibold">رقم الطلب</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge variant="outline" className="px-3 py-1.5 rounded-lg text-sm">
          {row.original.id}
        </Badge>
      </div>
    ),

  //   filterFn: (row, columnId, filterValue) => {
  //   const rawValue = row.getValue(columnId) as string; // ✅ Cast
  //   const rowValue = requestTypeMap[rawValue] || rawValue;
  //   return filterRequests(rowValue, String(filterValue));
  // },
    enableHiding: false,
  },

];







export function DataTable({ data }: { data: Request[] }) {
  const router = useRouter();

  const [tableData, setTableData] = React.useState(() => data);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
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





  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => tableData?.map(({ id }) => id) || [],
    [tableData, router]
  );




  const memoizedColumns = React.useMemo(() => requestColumns, []);

  console.log("dataa in table", tableData);

  const table = useReactTable({
    data: tableData ?? [],
    columns: memoizedColumns,

    state: {
      sorting,
      columnVisibility,
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
  {/* Top Toolbar */}
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-4 lg:px-6 py-3 bg-white border-b border-gray-200 rounded-t-lg">
    {/* Search Input */}


    {/* Actions */}
    <div className="flex flex-wrap gap-2">
      {/* Column Toggle Dropdown */}
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            <IconLayoutColumns className="w-4 h-4" />
            <span className="hidden sm:inline">إدارة الأعمدة</span>
            <IconChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {table
            .getAllColumns()
            .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
            .map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu> */}

      {/* Custom Menu */}
      <DropdownMenuRadioGroupDemo />
    </div>

    <div className="flex items-center gap-2 w-full sm:w-auto "  dir="rtl">
      <input
        type="text"
        placeholder="بحث..."
        value={table.getState().globalFilter ?? ""}
        onChange={(e) => table.setGlobalFilter(e.target.value)}
        className="w-full sm:w-72 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
      />
    </div>


  </div>

  {/* Table Section */}
  <TabsContent value="outline" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
        id={sortableId}
      >
        <Table>
          {/* Table Header */}
          <TableHeader className="bg-gray-100 sticky top-0 z-10 text-gray-700 text-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan} className="px-4 py-3">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                {table.getRowModel().rows.map((row) => (
                  <DraggableRow key={row.id} row={row} />
                ))}
              </SortableContext>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={requestColumns.length}
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
              <SelectValue placeholder={table.getState().pagination.pageSize} />
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
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            صفحة {table.getState().pagination.pageIndex + 1} من {table.getPageCount()}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <IconChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <IconChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <IconChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <IconChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </TabsContent>

  {/* Other Tabs (empty states) */}
  <TabsContent value="past-performance" className="flex flex-col px-4 lg:px-6">
    <div className="aspect-video w-full flex-1 rounded-lg border border-dashed bg-gray-50"></div>
  </TabsContent>
  <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
    <div className="aspect-video w-full flex-1 rounded-lg border border-dashed bg-gray-50"></div>
  </TabsContent>
  <TabsContent value="focus-documents" className="flex flex-col px-4 lg:px-6">
    <div className="aspect-video w-full flex-1 rounded-lg border border-dashed bg-gray-50"></div>
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