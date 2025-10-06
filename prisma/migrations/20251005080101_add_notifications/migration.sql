/*
  Warnings:

  - The primary key for the `RequestReceivers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `_RequestReceivers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_RequestReceivers" DROP CONSTRAINT "_RequestReceivers_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_RequestReceivers" DROP CONSTRAINT "_RequestReceivers_B_fkey";

-- AlterTable
ALTER TABLE "public"."Request" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "public"."RequestReceivers" DROP CONSTRAINT "RequestReceivers_pkey",
ADD CONSTRAINT "RequestReceivers_pkey" PRIMARY KEY ("requestId", "employeeId", "recieverId");

-- DropTable
DROP TABLE "public"."_RequestReceivers";

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL,
    "requestId" TEXT,
    "recipientEmployeeId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_recipientEmployeeId_idx" ON "public"."Notification"("recipientEmployeeId");

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "public"."Request"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RequestReceivers" ADD CONSTRAINT "RequestReceivers_recieverId_fkey" FOREIGN KEY ("recieverId") REFERENCES "public"."Employee"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;
