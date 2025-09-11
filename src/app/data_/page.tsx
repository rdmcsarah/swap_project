"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { da } from "date-fns/locale"

import React, { use, useEffect, useMemo,  useRef,useState } from "react";

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
}
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

type Data = {
    requests: Request[]
    employees: Employee[]
}

export default function Page() {

const [request, setRequest] = React.useState<Request>()
const [employee, setEmployee] = React. useState<Employee>()  
const [dataa, setData] =  React.useState<Data>({
    requests: [],
    employees: []
})

  const [employeeId, setEmployeeId] = useState<string | null>(null);

  // Get employeeId from localStorage (client-side only)
  useEffect(() => {
    const id = localStorage.getItem("employeeId");
    setEmployeeId(id);
  }, []);

  console.log(employee)



  // Fetch employee data when employeeId is available
  useEffect(() => {
    if (!employeeId) return; // ⛔ Skip if employeeId is null

    const fetchEmployee = async () => {
      try {
        const res = await fetch(`/api/employees?employeeId=${employeeId}`);
        if (!res.ok) throw new Error(`Employee fetch failed: ${res.status}`);
        const data = await res.json();
        setEmployee(data);
      } catch (err) {
        console.error("Error fetching employee:", err);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  // Fetch requests when employeeId is available
  useEffect(() => {
    if (!employeeId) return; // ⛔ Skip if employeeId is null

    // if(!employee)return;

    if(employee?.employeeType=="ADMIN"){

          const fetchRequests = async () => {
      try {

            console.log("heree")

        // const res = await fetch(`/api/requests?employeeId=${employeeId}`);
        const res = await fetch(`/api/requests?firstApprovment=APPROVED`);

        if (!res.ok) throw new Error(`Requests fetch failed: ${res.status}`);
        const data = await res.json();
        setRequest(data);

        console.log("daa: ",data)
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
    };

    fetchRequests();
    }else{

          const fetchRequests = async () => {
      try {
        // const res = await fetch(`/api/requests?employeeId=${employeeId}`);
        const res = await fetch(`/api/requests/?employeeId_related=${employeeId}`);

        if (!res.ok) throw new Error(`Requests fetch failed: ${res.status}`);
        const data = await res.json();
        setRequest(data);
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
    };

    fetchRequests();
    }

  }, [employee]);




    useEffect(() => {
        if (request && employee) {
            console.log('Request:', request);
            console.log('Employee:', employee);
            setData({
                requests: [request],
                employees: [employee]
            });
        }   


    }, [request, employee]);


    if (dataa.requests.length === 0 || dataa.employees.length === 0) {
        return <div className="flex h-full items-center justify-center">Loading...</div>
    }

console.log("dataa in pagexx",dataa.requests[0]);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      {/* <AppSidebar variant="inset" /> */}
      <SidebarInset>

        {/* <SiteHeader /> */}
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6  ">
              {/* <SectionCards /> */}
              <div className="px-4 lg:px-6">
                {/* <ChartAreaInteractive /> */}
              </div>
              <DataTable data={dataa.requests[0]} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
