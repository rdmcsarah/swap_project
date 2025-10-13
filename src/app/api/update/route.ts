import { EMPTYPE, PrismaClient } from "@/generated/prisma"; // ✅ match your actual output path
import { NextResponse } from "next/server";
import sql from 'mssql';

const prisma = new PrismaClient();
const config = {
  server: '10.20.69.185',
  database: 'DataLake',
  user: 'digital',
  password: 'Digital@2024!',
  options: {
    encrypt: false, // Set to true if using Azure
    trustServerCertificate: true, // For development only
    enableArithAbort: true,
    connectTimeout: 90000, // 30 seconds
    requestTimeout: 90000,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 90000
  }
};


export async function GET() {
  const pool = new sql.ConnectionPool(config);
  await pool.connect();

  console.log("Connected to SQL Server successfully");

  // Get the latest createdAt from Prisma (fallback to old date if none found)
  const latestEmp = await prisma.employee.findFirst({
    select: { createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const fromDate = latestEmp?.createdAt ?? new Date(0); // fallback to Unix epoch if none

  console.log("Latest createdAt from Prisma:", fromDate);

const result = await pool
  .request()
  .input("fromDate", sql.DateTime, fromDate)
  .input("toDate", sql.DateTime, new Date("2030-12-31"))
  .query(`
    SELECT
      "Employee code" AS employeeId,
      "Email" AS email,
      "Corporate Phone Number" AS phone,
      "updatedate" AS updated,
      "Department" AS department,
      "First Name AR" + ' ' + "Last Name AR" AS name,
      "Position" AS position
    FROM vw_HHP_HR
    WHERE
      updatedate >= @fromDate AND
      updatedate <= @toDate AND
      "Department" = 'Operations L3' AND
      "Position" = 'Metro Driver'
    ORDER BY updatedate ASC
  `);


  console.log("SQL Server query result count:", result.recordset.length);

  await pool.close();

  // Upsert employees
  const newEmployees = await Promise.all(
    result.recordset.map((emp) =>
      prisma.employee.upsert({
        where: { employeeId: emp.employeeId },
        create: {
          employeeId: emp.employeeId,
          email: emp.email,
          phone: emp.phone,
          department: emp.department,
          name: emp.name,
          position: emp.position,
          employeeType: "DRIVER",
          createdAt: emp.updated ? new Date(emp.updated) : new Date(),
        },
        update: {
          email: emp.email,
          phone: emp.phone,
          department: emp.department,
          name: emp.name,
          position: emp.position,
          employeeType: "DRIVER",
          // **Do NOT update createdAt here** (usually createdAt is immutable)
          // You can update updatedAt if you track it in your schema
        },
      })
    )
  );

  return new Response(JSON.stringify(newEmployees), { status: 200 });
}


// export async function GET() {
//   const pool = new sql.ConnectionPool(config);
//   await pool.connect();

//   console.log("Connected to SQL Server successfully");

//   // Get the latest createdAt from Prisma (fallback to old date if none found)
//   const latestEmp = await prisma.employee.findFirst({
//     select: { createdAt: true },
//     orderBy: { createdAt: "desc" },
//   });

//   const fromDate = latestEmp?.createdAt ?? new Date(0); // fallback to Unix epoch if none

//   console.log("Latest createdAt from Prisma:", fromDate);

// const result = await pool
//   .request()
//   .input("fromDate", sql.DateTime, fromDate)
//   .input("toDate", sql.DateTime, new Date("2030-12-31"))
//   .query(`
//     SELECT 
//      *
//     FROM vw_HHP_HR
//     WHERE 
//       updatedate >= @fromDate 
//       AND updatedate <= @toDate
//       AND "Department" = 'Operations L3'
//       AND "Position" = 'Metro Driver'
//     ORDER BY updatedate ASC
//   `);

//   console.log("SQL Server query result count:", result.recordset.length);

//   await pool.close();



//   return new Response(JSON.stringify(result), { status: 200 });
// }



