/*
  Warnings:

  - You are about to drop the `UserFile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserFile" DROP CONSTRAINT "UserFile_userId_fkey";

-- DropTable
DROP TABLE "UserFile";
