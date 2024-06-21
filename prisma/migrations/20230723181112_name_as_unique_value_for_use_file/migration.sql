/*
  Warnings:

  - The primary key for the `UserFile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UserFile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `UserFile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `UserFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserFile" DROP CONSTRAINT "UserFile_pkey",
DROP COLUMN "id",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserFile_name_key" ON "UserFile"("name");
