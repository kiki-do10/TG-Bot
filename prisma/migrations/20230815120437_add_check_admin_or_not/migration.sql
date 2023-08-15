-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "id_admin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "password" TEXT;
