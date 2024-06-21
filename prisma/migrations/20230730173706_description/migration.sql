/*
  Warnings:

  - Added the required column `description` to the `FlashcardSet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Flashcard" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "FlashcardSet" ADD COLUMN     "description" TEXT NOT NULL;
