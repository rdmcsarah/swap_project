// import { NextResponse } from 'next/server';
import sql from 'mssql';
 import { PrismaClient } from "@prisma/client";
 
 const prisma = new PrismaClient();
 
// SQL Server configuration
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

  // ✅ get the latest createdAt from Prisma
  const latestEmp = await prisma.emp.findFirst({
    select: { createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const fromDate = latestEmp?.createdAt ; // fallback

  // ✅ query SQL Server
  const result = await pool
    .request()
    .input("fromDate", sql.DateTime, fromDate)
    .input("toDate", sql.DateTime, new Date("2030-12-31"))
    .query(`
      SELECT 
        "Employee code" as employeeId, 
        "Email" as email, 
        "Corporate Phone Number" as phone, 
        "updatedate" as updated,
        "Department" as department,
        "ID NAME" as name,
        "Position" as position
      FROM vw_HHP_HR
      WHERE updatedate >= @fromDate AND updatedate <= @toDate
      ORDER BY updatedate ASC
    `);

  await pool.close();

  // ✅ upsert one by one
  const newEmployees = await Promise.all(
    result.recordset.map((emp) =>
      prisma.emp.upsert({
        where: { employeeId: emp.employeeId },
        create: {
          employeeId: emp.employeeId,
          email: emp.email,
          phone: emp.phone,
          department: emp.department,
          managerId: emp.managerId,
          name: emp.name,
          position: emp.position,
          employeeType: "DRIVER",
          createdAt: emp.updated ? new Date(emp.updated) : new Date(),
          typeOfWork: [],
        },
        update: {
          email: emp.email,
          phone: emp.phone,
          department: emp.department,
          managerId: emp.managerId,
          name: emp.name,
          position: emp.position,
          employeeType: "DRIVER",
          createdAt: emp.updated ? new Date(emp.updated) : new Date(),
        },
      })
    )
  );

  return new Response(JSON.stringify(newEmployees), { status: 200 });
}






//update only new employees
export async function POST() {
  const pool = new sql.ConnectionPool(config);
  await pool.connect();

  console.log("Connected to SQL Server successfully");

  // get existing employee IDs from Prisma
  const dataEmployee = await prisma.emp.findMany({
    select: {
      employeeId: true,
    },
  });

  const employeeIds = dataEmployee.map((emp: { employeeId: any; }) => `'${emp.employeeId}'`).join(",");

  // build query dynamically
  const query = `
    SELECT 
      [Employee code] as employeeId,
      [Email] as email,
      [Corporate Phone Number] as phone,
      [updatedate] as updated,
      [Department] as department,
      [Direct Manager CODE] as managerId,
      [First Name]+' '+[Last Name] as name,
      [Position] as position
    FROM vw_HHP_HR 
    ${employeeIds.length > 0 ? `WHERE [Employee code] NOT IN (${employeeIds})` : ""}
    ORDER BY updatedate ASC
  `;

  const result = await pool.request().query(query);

  await pool.close();
  console.log(result.recordset);

  // insert new employees into Prisma
  const newEmployees = await prisma.emp.createMany({
    data: result.recordset.map(emp => ({
      employeeId: emp.employeeId,
      email: emp.email,
      phone: emp.phone,
      department: emp.department,
      managerId: emp.managerId,
      name: emp.name,
      position: emp.position,
      empType: "EMPLOYEE",
      createdAt: emp.updated ? new Date(emp.updated) : new Date(),
     typeOfWork: []

    })),
    skipDuplicates: true,
  });

  console.log(`Inserted ${newEmployees.count} new employees.`);

  return new Response(JSON.stringify(result.recordset), { status: 200 });
}


export async function PUT() {
  const pool = new sql.ConnectionPool(config);
  await pool.connect();

  console.log("Connected to SQL Server successfully");

  // ✅ query SQL Server
  const result = await pool.request().query(`
    SELECT 
      [Employee code] as employeeId, 
      [First Name] + ' ' + [Last Name] as name
    FROM vw_HHP_HR
  `);

  await pool.close();

  // result.recordset is an array
  const employees = result.recordset;

  const updatedEmployees = [];

  for (const emp of employees) {
    try {
      const updated = await prisma.emp.update({
        where: {
          employeeId: emp.employeeId,
        },
        data: {
          name: emp.name,
        },
      });
      updatedEmployees.push(updated);
    } catch (err) {
      console.error(`Failed to update employee ${emp.employeeId}`, err);
    }
  }

  return new Response(JSON.stringify(updatedEmployees), { status: 200 });
}
