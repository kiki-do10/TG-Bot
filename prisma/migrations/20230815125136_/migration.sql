/*
  Warnings:

  - You are about to drop the column `id_admin` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "id_admin",
ADD COLUMN     "is_admin" BOOLEAN NOT NULL DEFAULT false;
