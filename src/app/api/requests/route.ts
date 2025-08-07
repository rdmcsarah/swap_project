import { PrismaClient } from "@/generated/prisma"; // ✅ match your actual output path
import { NextResponse } from "next/server";
import crypto from "crypto";

function generateHexId() {
  return `SA_${crypto.randomBytes(4).toString("hex").toUpperCase()}`; // Example: SA_3FA4C9D1
}
const prisma = new PrismaClient();
export async function GET(request: Request) {
  try {

    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const employeeId = searchParams.get("employeeId");
    if (employeeId) {
      const employee = await prisma.request.findMany({
        where: { employeeId },
      });

      if (!employee) {
        return NextResponse.json(
          { error: "Employee not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(employee);
    }

    const id = searchParams.get("id");
    if (id) {
      const employee = await prisma.request.findUnique({
        where: { id },
      });

      if (!employee) {
        return NextResponse.json(
          { error: "Employee not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(employee);
    }

    const status = searchParams.get("status");
    if (status) {
      const employee = await prisma.request.findMany({
        where: { status },
      });

      if (!employee) {
        return NextResponse.json(
          { error: "Employee not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(employee);
    }
    const requestType = searchParams.get("requestType");
    if (requestType) {
      const employees = await prisma.request.findMany({
        where: { requestType },
      });

      if (employees.length === 0) {
        return NextResponse.json(
          { error: "No employees found in this department" },
          { status: 404 }
        );
      }

      return NextResponse.json(employees);
    }



        const shiftType1 = searchParams.get("shiftType1");
    if (shiftType1) {
      const employees = await prisma.request.findMany({
        where: { shiftType1 },
      });

      if (employees.length === 0) {
        return NextResponse.json(
          { error: "No employees found in this department" },
          { status: 404 }
        );
      }

      return NextResponse.json(employees);
    }

    const requests = await prisma.request.findMany();

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Failed to fetch employees", details: error },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      employeeId,
      requestType,
      shiftType1,
      shiftType2,
      shiftDate1,
      shiftDate2,
      requesterComment,
      recieverId
    } = body;

    // Basic validation
    if (!employeeId) {
      return NextResponse.json(
        { error: "employeeId and requestType are required." },
        { status: 400 }
      );
    }

    if(employeeId){
        const employee = await prisma.employee.findUnique({
            where: { employeeId: employeeId },
        });
    
        if (!employee) {
            return NextResponse.json(
            { error: "Employee not found" },
            { status: 404 }
            );
        }
    }

        const hexId = generateHexId();

    const newRequest = await prisma.request.create({
      data: {
        id: hexId, 

        employeeId,
        requestType,
        shiftType1,
        shiftType2,
        shiftDate1: shiftDate1 ? new Date(shiftDate1) : undefined,
        shiftDate2: shiftDate2 ? new Date(shiftDate2) : undefined,
        updatedAt: new Date(),
        status: "PENDING", // Default status
        requesterComment,
      },
    });

    const reqRec= await prisma.requestReceivers.create({
      data: {
        requestId: newRequest.id,
        employeeId: newRequest.employeeId,
        recieverId:recieverId, // Assuming the receiver is the same as the employee
      }
    });
    if(!reqRec){
      return NextResponse.json(
        { error: "Failed to create request receiver" },
        { status: 500 }
      );
    }

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function PUT(request: Request) {

  try {
    const data = await request.json();
 const {
    id,
      employeeId,
      firstApprovment,
      secondApprovment,
      replier1_Comment,
      replier2_Comment,
      approvalDate1,
      approvalDate2
    } = data;
    // Basic validation
    if (!employeeId ) {
      return NextResponse.json(
        { error: "employeeId  is required" },
        { status: 400 }
      );
    }

    const updatedEmployee = await prisma.request.update({
      where: { id },
      data: {
        employeeId,
      firstApprovment,
      secondApprovment,
      replier1_Comment,
      replier2_Comment,
      approvalDate1,
      approvalDate2
      },
    });

    return NextResponse.json(updatedEmployee);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 }
    );
  }

}



