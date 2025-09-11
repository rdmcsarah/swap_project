/*
  Warnings:

  - You are about to drop the column `shiftType` on the `Request` table. All the data in the column will be lost.
  - Added the required column `recieverId` to the `RequestReceivers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."EMPTYPE" AS ENUM ('DRIVER', 'ADMIN');

-- AlterTable
ALTER TABLE "public"."Employee" ADD COLUMN     "employeeType" "public"."EMPTYPE" NOT NULL DEFAULT 'DRIVER';

-- AlterTable
ALTER TABLE "public"."Request" DROP COLUMN "shiftType",
ADD COLUMN     "shiftType1" TEXT,
ADD COLUMN     "shiftType2" TEXT;

-- AlterTable
ALTER TABLE "public"."RequestReceivers" ADD COLUMN     "recieverId" TEXT NOT NULL;
