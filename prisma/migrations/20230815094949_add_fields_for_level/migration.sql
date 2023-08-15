/*
  Warnings:

  - Changed the type of `level` on the `Exercise` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ExerciseLevel" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "level",
ADD COLUMN     "level" "ExerciseLevel" NOT NULL;
