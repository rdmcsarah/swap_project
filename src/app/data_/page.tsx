// "use client"
// import { AppSidebar } from "@/components/app-sidebar"
// import { ChartAreaInteractive } from "@/components/chart-area-interactive"
// import { DataTable } from "@/components/data-table"
// import { SectionCards } from "@/components/section-cards"
// import { SiteHeader } from "@/components/site-header"
// import {
//   SidebarInset,
//   SidebarProvider,
// } from "@/components/ui/sidebar"
// import { da } from "date-fns/locale"

// import React, { use, useEffect, useMemo,  useRef,useState } from "react";


// type Employee={
//     id: string
//     name: string
//     email: string
//     phone: string
//     department: string
//     position: string
//     employeeId: string
//     project: string
//     employeeType:string

// }
// type Request={
//     id: string
//     employeeId: string
//     status: string
//     createdAt: string
//     updatedAt: string
//     requestType: string
//      firstApprovment: string;
//   secondApprovment: string;
//     shiftType1: string
//     shiftType2: string
//     shiftDate1: string
//     shiftDate2: string
//     requestComment: string
//     replier1_Comment: string
//     replier2_Comment: string
//     approvalDate1: string
//     approvalDate2: string
//     RequestReceivers: {
//     id: string  
//     requestId: string
//     employeeId: string
//     recieverId: string
//     employee: Employee
//     reciever: Employee
//   }[]



// }
// type Data = {
//     requests: Request[]
//     employees: Employee[]
// }

// export default function Page() {

// const [requests, setRequests] = React.useState<Request[]>([]);
// const [employee, setEmployee] = React. useState<Employee>()  
// const [dataa, setData] =  React.useState<Data>({
//     requests: [],
//     employees: []
// })




//   const [employeeId, setEmployeeId] = useState<string | null>(null);

//   // Get employeeId from localStorage (client-side only)
//   useEffect(() => {
//     const id = localStorage.getItem("employeeId");
//     setEmployeeId(id);
//   }, []);

//   console.log(employee)



//   // Fetch employee data when employeeId is available
//   useEffect(() => {
//     if (!employeeId) return; // ⛔ Skip if employeeId is null

//     const fetchEmployee = async () => {
//       try {
//         const res = await fetch(`/api/employees?employeeId=${employeeId}`);
//         if (!res.ok) throw new Error(`Employee fetch failed: ${res.status}`);
//         const data = await res.json();
//         setEmployee(data);
//       } catch (err) {
//         console.error("Error fetching employee:", err);
//       }
//     };

//     fetchEmployee();
//   }, [employeeId]);

 

//   // Fetch requests when employeeId is available
//   useEffect(() => {
//     if (!employeeId) return; // ⛔ Skip if employeeId is null

//     // if(!employee)return;

//     if(employee?.employeeType=="ADMIN"){

//           const fetchRequests = async () => {
//       try {

//             console.log("heree")
            

//         // const res = await fetch(`/api/requests?employeeId=${employeeId}`);
//         const res = await fetch(`/api/requests?firstApprovment=APPROVED`);

//         if (!res.ok) throw new Error(`Requests fetch failed: ${res.status}`);
//         const data = await res.json();
//         setRequests(data);

//         console.log("daa: ",data)
//       } catch (err) {
//         console.error("Error fetching requests:", err);
//       }
//     };

//     fetchRequests();
//     }else{

//           const fetchRequests = async () => {
//       try {
//         const res = await fetch(`/api/requests/?employeeId_related=${employeeId}`);



//         if (!res.ok) throw new Error(`Requests fetch failed: ${res.status}`);
//         const data = await res.json();
//         setRequests(data);


//       } catch (err) {
//         console.error("Error fetching requests:", err);
//       }
//     };

//     fetchRequests();
//     }

//   }, [employee]);


//   console.log("requestffffffffffs############################################",requests)
//   // console.log("ppppppppppoooooooooooopppppp")


//  useEffect(() => {
//   if (requests.length > 0 && employee) {
//     // ensure RequestReceivers is an array and keep shape consistent
//     const normalized = requests.map((r) => ({
//       ...r,
//       RequestReceivers: Array.isArray(r.RequestReceivers)
//         ? r.RequestReceivers
//         : r.RequestReceivers
//         ? [r.RequestReceivers]
//         : [],
//     }));

//     setData({
//       requests: normalized,
//       employees: [employee],
//     });
//   }
// }, [requests, employee]);

//     if (dataa.requests.length === 0 || dataa.employees.length === 0) {
//         return  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-gray-500 text-lg">جاري التحميل...</div>
//       </div>
//     }

// console.log("dataa in pagexx",dataa.requests);

//   return (
//     <SidebarProvider
//       style={
//         {
//           "--sidebar-width": "calc(var(--spacing) * 72)",
//           "--header-height": "calc(var(--spacing) * 12)",
//         } as React.CSSProperties
//       }
//     >
//       {/* <AppSidebar variant="inset" /> */}
//       <SidebarInset>

//         {/* <SiteHeader /> */}
//         <div className="flex flex-1 flex-col">
//           <div className="@container/main flex flex-1 flex-col gap-2">
//             <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6  ">
//               {/* <SectionCards /> */}
//               <div className="px-4 lg:px-6">
//                 {/* <ChartAreaInteractive /> */}
//               </div>
//               {/* <DataTable data={dataa.requests} /> */}
// {employee && (
//   <DataTable
//     data={[...dataa.requests].sort(
//       (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//     )}
//     employee={employee}
//   />
// )}


//             </div>
//           </div>
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   )
// }
"use client";

import React, { useEffect, useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DataTable } from "@/components/data-table";

type Employee = {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  employeeId: string;
  project: string;
  employeeType: string;
};

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
  RequestReceivers: {
    id: string;
    requestId: string;
    employeeId: string;
    recieverId: string;
    employee: Employee;
    reciever: Employee;
  }[];
};

export default function Page() {
  const [requests, setRequests] = useState<Request[] | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [employeeId, setEmployeeId] = useState<string | null>(null);

  // Get employeeId from localStorage
  useEffect(() => {
    const id = localStorage.getItem("employeeId");
    setEmployeeId(id);
  }, []);

  // Fetch employee data
  useEffect(() => {
    if (!employeeId) return;

    async function fetchEmployee() {
      try {
        const res = await fetch(`/api/employees?employeeId=${employeeId}`);
        if (!res.ok) throw new Error(`Employee fetch failed: ${res.status}`);
        const data = await res.json();
        setEmployee(data);
      } catch (error) {
        console.error("Error fetching employee:", error);
        setEmployee(null);
      }
    }

    fetchEmployee();
  }, [employeeId]);

  // Fetch requests based on employee
  useEffect(() => {
    if (!employeeId || !employee) return;

    async function fetchRequests() {
      try {
        let url = "";
        if (employee?.employeeType === "ADMIN") {
          url = `/api/requests?firstApprovment=APPROVED`;
        } else {
          url = `/api/requests/?employeeId_related=${employeeId}`;
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Requests fetch failed: ${res.status}`);
        const data = await res.json();

        // Normalize RequestReceivers to always be an array
        const normalized = data.map((r: Request) => ({
          ...r,
          RequestReceivers: Array.isArray(r.RequestReceivers)
            ? r.RequestReceivers
            : r.RequestReceivers
            ? [r.RequestReceivers]
            : [],
        }));

        setRequests(normalized);
      } catch (error) {
        console.error("Error fetching requests:", error);
        setRequests([]);
      }
    }

    fetchRequests();
  }, [employee, employeeId]);

  // Show loading while fetching employee or requests
  if (!employee || requests === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-lg">جاري التحميل...</div>
      </div>
    );
  }

  // Show message if no requests
  if (requests.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-lg">لا توجد طلبات حتى الآن.</div>
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {employee && (
                <DataTable
                  data={[...requests].sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )}
                  employee={employee}
                />
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
