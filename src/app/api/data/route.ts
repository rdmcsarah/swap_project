import { NextResponse } from "next/server";
import * as XLSX from 'xlsx';
import { EMPTYPE, PrismaClient } from "@/generated/prisma"; // ✅ match your actual output path

export async function POST(request: Request) {
  try {
    // 1. Get the file from FormData
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 2. Read the Excel file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // 3. Convert to JSON
    const excelData = XLSX.utils.sheet_to_json(worksheet);

    // 4. Transform all records (don't skip any)
const transformedEmployees = (excelData as any[])
  // .filter(row => row['Employee Code']) // Skip rows with no employee code
  .map(row => {
    const phone = row['Phone'] ? String(row['Phone']) : null;

    return {
      name:( row['First Name'] +" "+row['First Name'] )||'Unknown Employee',
      email: row['Emails from AD'] || 'Unassigned',
      phone: phone,
      image: null,
      department: row['Department']?.toString() || 'Unassigned',
      employeeId: row['Employee Code'],
      position: row['Position'] || 'Employee',
      empType: "EMPLOYEE" as const,
      managerId: null,
      typeOfWork: []
    };
  });

// Log how many were filtered out due to missing employee code
const filteredOutCount = excelData.length - transformedEmployees.length;
console.log(`Filtered out ${filteredOutCount} records with no employee code`);

// 5. Insert all valid records
// console.log("Transformed Employees:", transformedEmployees);

// console.log("Transformed Employees:", transformedEmployees);

// 1. Get all existing employee IDs from the database
const existingEmployees = await prisma.emp.findMany({
  select: {
    employeeId: true // Assuming employeeId is your unique field
  }
});

const existingIds = existingEmployees.map((emp: { employeeId: any; }) => emp.employeeId);

// 2. Find duplicates in your input data
const duplicates = transformedEmployees.filter(emp => 
  existingIds.includes(emp.employeeId)
);

console.log("Duplicate employees (will be skipped):#########################", duplicates);


let insertResult;
try {
  insertResult = await prisma.emp.createMany({
    data: transformedEmployees,
    skipDuplicates: true, // Skip duplicates based on unique fields (likely employeeId)
  });
console.log("Insert Result:################################################");
  console.log("Valid records with employee codes:", transformedEmployees.length);
  console.log("Successfully inserted employees:", insertResult.count);
  
  return NextResponse.json({
    message: "Excel data processed successfully",
    totalRecords: excelData.length,
    filteredOutDueToNoEmployeeCode: filteredOutCount,
    validRecords: transformedEmployees.length,
    insertedCount: insertResult.count,
    duplicatesSkipped: transformedEmployees.length - insertResult.count,
  });
} catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Database operation failed", details: dbError },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Error processing Excel:", error);
    return NextResponse.json(
      { error: "Failed to process Excel file", details: error },
      { status: 500 }
    );
  }
}
