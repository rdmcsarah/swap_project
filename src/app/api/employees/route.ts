import { PrismaClient } from "@/generated/prisma"; // ✅ match your actual output path
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function GET(request: Request) {
  try {

    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const employeeId = searchParams.get("employeeId");
    if (employeeId) {
      const employee = await prisma.employee.findUnique({
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

    const email = searchParams.get("email");
    if (email) {
      const employee = await prisma.employee.findFirst({
        where: { email },
      });

      if (!employee) {
        return NextResponse.json(
          { error: "Employee not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(employee);
    }

    const phone = searchParams.get("phone");
    if (phone) {
      const employee = await prisma.employee.findFirst({
        where: { phone },
      });

      if (!employee) {
        return NextResponse.json(
          { error: "Employee not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(employee);
    }
    const department = searchParams.get("department");
    if (department) {
      const employees = await prisma.employee.findMany({
        where: { department },
      });

      if (employees.length === 0) {
        return NextResponse.json(
          { error: "No employees found in this department" },
          { status: 404 }
        );
      }

      return NextResponse.json(employees);
    }

    const position = searchParams.get("position");
    if (position) {
      const employees = await prisma.employee.findMany({
        where: { position },
      });

      if (employees.length === 0) {
        return NextResponse.json(
          { error: "No employees found with this position" },
          { status: 404 }
        );
      }

      return NextResponse.json(employees);
    }
    const project = searchParams.get("project");
    if (project) {
      const employees = await prisma.employee.findMany({
        where: { project },
      });

      if (employees.length === 0) {
        return NextResponse.json(
          { error: "No employees found in this project" },
          { status: 404 }
        );
      }

      return NextResponse.json(employees);
    }

    const employees = await prisma.employee.findMany();

    return NextResponse.json(employees);
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
    const data = await request.json();
    const { email, name, phone, department, employeeId, position, project } = data;

    // Basic validation
    if (!employeeId || !name) {
      return NextResponse.json(
        { error: "employeeId and name are required" },
        { status: 400 }
      );
    }

    console.log("Creating new employee with data:")
    const newEmployee = await prisma.employee.create({
      data: {
        email,
        name,
        phone,
        department,
        employeeId,
        position,
        project,
      },
    });

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {

  try {
    const data = await request.json();
    const { email, name, phone, department, employeeId, position, project } = data;

    // Basic validation
    if (!employeeId ) {
      return NextResponse.json(
        { error: "employeeId  is required" },
        { status: 400 }
      );
    }

    const updatedEmployee = await prisma.employee.update({
      where: { employeeId },
      data: {
        email,
        name,
        phone,
        department,
        position,
        project,
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



