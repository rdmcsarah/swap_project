// import { PrismaClient } from "@/generated/prisma"; // ✅ match your actual output path
// import { NextResponse } from "next/server";
// import crypto from "crypto";

// function generateHexId() {
//   return `SA_${crypto.randomBytes(4).toString("hex").toUpperCase()}`; // Example: SA_3FA4C9D1
// }
// const prisma = new PrismaClient();
// export async function GET(request: Request) {
//   try {

//     const url = new URL(request.url);
//     const searchParams = url.searchParams;
//     const employeeId = searchParams.get("employeeId");
//     if (employeeId) {
//       const employee = await prisma.request.findMany({
//         where: { employeeId },
//       });

//       if (!employee) {
//         return NextResponse.json(
//           { error: "Employee not found" },
//           { status: 404 }
//         );
//       }

//       return NextResponse.json(employee);
//     }
//     const first_done = searchParams.get("first_done");
//     if (first_done) {
//       const employee = await prisma.request.findMany({
//         where: { firstApprovment:first_done },
//       });

//       if (!employee) {
//         return NextResponse.json(
//           { error: "Employee not found" },
//           { status: 404 }
//         );
//       }

//       return NextResponse.json(employee);
//     }
// const employeeId_related = searchParams.get("employeeId_related");

// if (employeeId_related) {




// const relatedRequests = await prisma.request.findMany({
//   where: {
//     RequestReceivers: {
//       some: {
//         OR: [
//           { employeeId: employeeId_related },
//           { recieverId: employeeId_related },
//         ],
//       },
//     },
//   },

//   include: {
//     // include the join records and expand both related Employee records
//     RequestReceivers: {
//       include: {
//         employee: true,
//         reciever: true,
//       },
//     },
//     // also include the request creator for convenience
//   },
// });

// console.log(relatedRequests);

//       return NextResponse.json(relatedRequests);

//   // console.log(reqs);
// }

//     const id = searchParams.get("id");
//     if (id) {
//  const employee = await prisma.request.findUnique({
//     where: { id }, // Find request by ID
//     include: {
//       RequestReceivers: true, // Include related receivers
//     },
//   });

//   // console.log(employee);

//       if (!employee) {
//         return NextResponse.json(
//           { error: "Employee not found" },
//           { status: 404 }
//         );
//       }

//       return NextResponse.json(employee);
//     }
    

//     const status = searchParams.get("status");
//     if (status) {
//       const employee = await prisma.request.findMany({
//         where: { status },
//       });

//       if (!employee) {
//         return NextResponse.json(
//           { error: "Employee not found" },
//           { status: 404 }
//         );
//       }

//       return NextResponse.json(employee);
//     }
//     const requestType = searchParams.get("requestType");
//     if (requestType) {
//       const employees = await prisma.request.findMany({
//         where: { requestType },
//       });

//       if (employees.length === 0) {
//         return NextResponse.json(
//           { error: "No employees found in this department" },
//           { status: 404 }
//         );
//       }

//       return NextResponse.json(employees);
//     }



//         const shiftType1 = searchParams.get("shiftType1");
//     if (shiftType1) {
//       const employees = await prisma.request.findMany({
//         where: { shiftType1 },
//       });

//       if (employees.length === 0) {
//         return NextResponse.json(
//           { error: "No employees found in this department" },
//           { status: 404 }
//         );
//       }

//       return NextResponse.json(employees);
//     }



//     const firstApprovment=searchParams.get("firstApprovment")

//         if (firstApprovment) {
//       const reqs = await prisma.request.findMany({
//         where: { firstApprovment:firstApprovment },

//          include: {
//     // include the join records and expand both related Employee records
//     RequestReceivers: {
//       include: {
//         employee: true,
//         reciever: true,
//       },
//     },
//     // also include the request creator for convenience
//   },
//       });

    

//       return NextResponse.json(reqs);
//     }
 

//  const notfication_empid = searchParams.get("notfication_empid");

// // if (notfication_empid) {
// //   console.log("Notification Employee ID:", notfication_empid);
// //   const emp = await prisma.employee.findUnique({
// //     where: { employeeId: notfication_empid },
// //   });

// //   console.log("Employee Details:", emp);

// //   const relatedRequests = await prisma.request.findMany({
// //     where: {
// //       OR: [
// //         {
// //           OR: [

// //             {
// //             RequestReceivers: {
// //             some: {
// //               recieverId: notfication_empid,
// //             },
// //           },
// //             },{


// //             secondApprovment: {
// //             in: ["APPROVED", "REJECTED"],
// //           },
// //             }
            
// //           ],
         
// //         },
// //         {
// //           employeeId: notfication_empid,
// //           OR: [
// //             {
// //               firstApprovment: { in: ["APPROVED", "REJECTED"] },
// //             },
// //             {
// //               secondApprovment: { in: ["APPROVED", "REJECTED"] },
// //             },
// //           ],
// //         },
// //       ],
// //     },
// //     include: {
// //       RequestReceivers: true, // Optional, helpful for debugging
// //     },
// //   });

// //   return NextResponse.json(relatedRequests);
// // }

// if (notfication_empid) {
//   console.log("Notification Employee ID:", notfication_empid);
//   const emp = await prisma.employee.findUnique({
//     where: { employeeId: notfication_empid },

//   });

//   console.log("Employee Details:", emp);

//   if(emp?.employeeType==="ADMIN"){
//   const relatedRequests = await prisma.request.findMany({
//     where: {
//       firstApprovment: { in: ["APPROVED"] },
//     },
//     // include: {
//     //   RequestReceivers: true, // Optional, helpful for debugging
//     // },
//    include: {
//     // include the join records and expand both related Employee records
//     RequestReceivers: {
//       include: {
//         employee: true,
//         reciever: true,
//       },
//     },
//     // also include the request creator for convenience
//   },
//   });

//     return NextResponse.json(relatedRequests);

//   }else if(emp?.employeeType==="DRIVER"){

//     console.log("Driver Employee ID:", notfication_empid);

//    const relatedRequests = await prisma.request.findMany({
//     where: {
//       OR: [
//         {
//           OR: [

//             {
//                RequestReceivers: {
//             some: {
//               recieverId: notfication_empid,
//             },
//           },
//             },{


//                secondApprovment: {
//             in: ["APPROVED", "REJECTED"],
//           },
//             }
            
//           ],



         
         
//         },
//         {
//           employeeId: notfication_empid,
//           OR: [
//             {
//               firstApprovment: { in: ["APPROVED", "REJECTED"] },
//             },
//             {
//               secondApprovment: { in: ["APPROVED", "REJECTED"] },
//             },
//           ],
//         },
//       ],
//     },
//     include: {
//       RequestReceivers: true, // Optional, helpful for debugging
//     },
//   });

//   return NextResponse.json(relatedRequests);
//   }


// }





//     const requests = await prisma.request.findMany();

//     return NextResponse.json(requests);
//   } catch (error) {
//     console.error("Error fetching employees:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch employees", details: error },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();

//     const {
//       employeeId,
//       requestType,
//       shiftType1,
//       shiftType2,
//       shiftDate1,
//       shiftDate2,
//       requesterComment,
//       recieverId
//     } = body;

//     // Basic validation
//     if (!employeeId) {
//       return NextResponse.json(
//         { error: "employeeId and requestType are required." },
//         { status: 400 }
//       );
//     }

//     if(employeeId){
//         const employee = await prisma.employee.findUnique({
//             where: { employeeId: employeeId },
//         });
    
//         if (!employee) {
//             return NextResponse.json(
//             { error: "Employee not found" },
//             { status: 404 }
//             );
//         }
//     }

//         const hexId = generateHexId();

//     const newRequest = await prisma.request.create({
//       data: {
//         id: hexId, 

//         employeeId,
//         requestType,
//         shiftType1,
//         shiftType2,
//         shiftDate1: shiftDate1 ? new Date(shiftDate1) : undefined,
//         shiftDate2: shiftDate2 ? new Date(shiftDate2) : undefined,
//         updatedAt: new Date(),
//         status: "PENDING", // Default status
//         requesterComment,
//       },
//     });

//     const reqRec= await prisma.requestReceivers.create({
//       data: {
//         requestId: newRequest.id,
//         employeeId: newRequest.employeeId,
//         recieverId:recieverId, // Assuming the receiver is the same as the employee
//       }
//     });
//     if(!reqRec){
//       return NextResponse.json(
//         { error: "Failed to create request receiver" },
//         { status: 500 }
//       );
//     }

//     // Create notification for the receiver about the new request
//     try {
//       if (recieverId) {
//         await prisma.notification.create({
//           data: {
//             requestId: newRequest.id,
//             recipientEmployeeId: recieverId,
//             type: 'request',
//             message: `طلب جديد من ${newRequest.employeeId}`,
//             read: false,
//           },
//         });
//       }
//     } catch (e) {
//       console.error('Failed to create notification for receiver', e);
//     }

//     return NextResponse.json(newRequest, { status: 201 });
//   } catch (error) {
//     console.error("Error creating request:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
// export async function PUT(request: Request) {

//   try {
//     const data = await request.json();
//  const {
//     id,
//       employeeId,
//       firstApprovment,
//       secondApprovment,
//       replier1_Comment,
//       replier2_Comment,
//       approvalDate1,
//       approvalDate2,
//       status
//     } = data;
//     // Basic validation
//     // if (!employeeId ) {
//     //   return NextResponse.json(
//     //     { error: "employeeId  is required" },
//     //     { status: 400 }
//     //   );
//     // }

//     const updatedEmployee = await prisma.request.update({
//       where: { id },
//       data: {
//         employeeId,
//       firstApprovment,
//       secondApprovment,
//       replier1_Comment,
//       replier2_Comment,
//       approvalDate1,
//       approvalDate2,
//       status
//       },
//     });

//     return NextResponse.json(updatedEmployee);
//   } catch (error:any) {
//     return NextResponse.json(
//       { error: error },
//       { status: 500 }
//     );
//   }

// }



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
    const first_done = searchParams.get("first_done");
    if (first_done) {
      const employee = await prisma.request.findMany({
        where: { firstApprovment:first_done },
      });

      if (!employee) {
        return NextResponse.json(
          { error: "Employee not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(employee);
    }
const employeeId_related = searchParams.get("employeeId_related");

if (employeeId_related) {




const relatedRequests = await prisma.request.findMany({
  where: {
    RequestReceivers: {
      some: {
        OR: [
          { employeeId: employeeId_related },
          { recieverId: employeeId_related },
        ],
      },
    },
  },

  include: {
    // include the join records and expand both related Employee records
    RequestReceivers: {
      include: {
        employee: true,
        reciever: true,
      },
    },
    // also include the request creator for convenience
  },
});

console.log(relatedRequests);

      return NextResponse.json(relatedRequests);

  // console.log(reqs);
}

    const id = searchParams.get("id");
    if (id) {
 const employee = await prisma.request.findUnique({
    where: { id }, // Find request by ID
    include: {
      RequestReceivers: true, // Include related receivers
    },
  });

  // console.log(employee);

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



    const firstApprovment=searchParams.get("firstApprovment")

        if (firstApprovment) {
      const reqs = await prisma.request.findMany({
        where: { firstApprovment:firstApprovment },

         include: {
    // include the join records and expand both related Employee records
    RequestReceivers: {
      include: {
        employee: true,
        reciever: true,
      },
    },
    // also include the request creator for convenience
  },
      });

    

      return NextResponse.json(reqs);
    }
 

 const notfication_empid = searchParams.get("notfication_empid");

// if (notfication_empid) {
//   console.log("Notification Employee ID:", notfication_empid);
//   const emp = await prisma.employee.findUnique({
//     where: { employeeId: notfication_empid },
//   });

//   console.log("Employee Details:", emp);

//   const relatedRequests = await prisma.request.findMany({
//     where: {
//       OR: [
//         {
//           OR: [

//             {
//             RequestReceivers: {
//             some: {
//               recieverId: notfication_empid,
//             },
//           },
//             },{


//             secondApprovment: {
//             in: ["APPROVED", "REJECTED"],
//           },
//             }
            
//           ],
         
//         },
//         {
//           employeeId: notfication_empid,
//           OR: [
//             {
//               firstApprovment: { in: ["APPROVED", "REJECTED"] },
//             },
//             {
//               secondApprovment: { in: ["APPROVED", "REJECTED"] },
//             },
//           ],
//         },
//       ],
//     },
//     include: {
//       RequestReceivers: true, // Optional, helpful for debugging
//     },
//   });

//   return NextResponse.json(relatedRequests);
// }

if (notfication_empid) {
  console.log("Notification Employee ID:", notfication_empid);
  const emp = await prisma.employee.findUnique({
    where: { employeeId: notfication_empid },

  });

  console.log("Employee Details:", emp);

  if(emp?.employeeType==="ADMIN"){
  const relatedRequests = await prisma.request.findMany({
    where: {
      firstApprovment: { in: ["APPROVED"] },
    },
    // include: {
    //   RequestReceivers: true, // Optional, helpful for debugging
    // },
   include: {
    // include the join records and expand both related Employee records
    RequestReceivers: {
      include: {
        employee: true,
        reciever: true,
      },
    },
    // also include the request creator for convenience
  },
  });

    return NextResponse.json(relatedRequests);

  }else if(emp?.employeeType==="DRIVER"){

    console.log("Driver Employee ID:", notfication_empid);

   const relatedRequests = await prisma.request.findMany({
    where: {
      OR: [
        {
          OR: [

            {
               RequestReceivers: {
            some: {
              recieverId: notfication_empid,
            },
          },
            },{


               secondApprovment: {
            in: ["APPROVED", "REJECTED"],
          },
            }
            
          ],



         
         
        },
        {
          employeeId: notfication_empid,
          OR: [
            {
              firstApprovment: { in: ["APPROVED", "REJECTED"] },
            },
            {
              secondApprovment: { in: ["APPROVED", "REJECTED"] },
            },
          ],
        },
      ],
    },
    include: {
      RequestReceivers: true, // Optional, helpful for debugging
    },
  });

  return NextResponse.json(relatedRequests);
  }


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
      approvalDate2,
      status
    } = data;
    // Basic validation
    // if (!employeeId ) {
    //   return NextResponse.json(
    //     { error: "employeeId  is required" },
    //     { status: 400 }
    //   );
    // }

    const updatedEmployee = await prisma.request.update({
      where: { id },
      data: {
        employeeId,
      firstApprovment,
      secondApprovment,
      replier1_Comment,
      replier2_Comment,
      approvalDate1,
      approvalDate2,
      status
      },
    });

    return NextResponse.json(updatedEmployee);
  } catch (error:any) {
    return NextResponse.json(
      { error: error },
      { status: 500 }
    );
  }

}


