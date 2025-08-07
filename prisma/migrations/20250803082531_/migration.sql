-- CreateTable
CREATE TABLE "RequestReceivers" (
    "requestId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,

    CONSTRAINT "RequestReceivers_pkey" PRIMARY KEY ("requestId","employeeId")
);

-- AddForeignKey
ALTER TABLE "RequestReceivers" ADD CONSTRAINT "RequestReceivers_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestReceivers" ADD CONSTRAINT "RequestReceivers_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;
