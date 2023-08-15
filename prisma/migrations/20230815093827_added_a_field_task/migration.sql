/*
  Warnings:

  - Added the required column `task` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "task" TEXT NOT NULL;
