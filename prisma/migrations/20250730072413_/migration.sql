-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "image" TEXT,
    "department" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "employeeId" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "project" TEXT,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "requestType" TEXT NOT NULL,
    "firstApprovment" TEXT,
    "secondApprovment" TEXT,
    "shiftType" TEXT,
    "shiftDate1" TIMESTAMP(3),
    "shiftDate2" TIMESTAMP(3),
    "requesterComment" TEXT,
    "replier1_Comment" TEXT,
    "replier2_Comment" TEXT,
    "approvalDate1" TIMESTAMP(3),
    "approvalDate2" TIMESTAMP(3),

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RequestReceivers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RequestReceivers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_employeeId_key" ON "Employee"("employeeId");

-- CreateIndex
CREATE INDEX "_RequestReceivers_B_index" ON "_RequestReceivers"("B");

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RequestReceivers" ADD CONSTRAINT "_RequestReceivers_A_fkey" FOREIGN KEY ("A") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RequestReceivers" ADD CONSTRAINT "_RequestReceivers_B_fkey" FOREIGN KEY ("B") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;
