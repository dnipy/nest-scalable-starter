/*
  Warnings:

  - The values [QUIZ_GENERATION] on the enum `AiJobType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `completedAt` on the `AiJob` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `AiJob` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `AiJob` table. All the data in the column will be lost.
  - The `output` column on the `AiJob` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `user_id` to the `AiJob` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `input` on the `AiJob` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING_PROFILE', 'PROCESSING', 'READY');

-- AlterEnum
BEGIN;
CREATE TYPE "AiJobType_new" AS ENUM ('SUMMARY');
ALTER TABLE "AiJob" ALTER COLUMN "type" TYPE "AiJobType_new" USING ("type"::text::"AiJobType_new");
ALTER TYPE "AiJobType" RENAME TO "AiJobType_old";
ALTER TYPE "AiJobType_new" RENAME TO "AiJobType";
DROP TYPE "public"."AiJobType_old";
COMMIT;

-- AlterTable
ALTER TABLE "AiJob" DROP COLUMN "completedAt",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "completed_at" TIMESTAMP(3),
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "started_at" TIMESTAMP(3),
ADD COLUMN     "user_id" TEXT NOT NULL,
DROP COLUMN "input",
ADD COLUMN     "input" JSONB NOT NULL,
DROP COLUMN "output",
ADD COLUMN     "output" JSONB;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING_PROFILE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "disabled_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "age" INTEGER,
    "occupation" TEXT NOT NULL,
    "experience_years" INTEGER NOT NULL,
    "education" TEXT,
    "skills" TEXT[],
    "interests" TEXT[],
    "goals" TEXT[],
    "preferred_work_style" TEXT,
    "bio" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiSummary" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "strengths" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "recommendations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "User_created_at_idx" ON "User"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_user_id_key" ON "Profile"("user_id");

-- CreateIndex
CREATE INDEX "AiSummary_user_id_idx" ON "AiSummary"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "AiSummary_user_id_key" ON "AiSummary"("user_id");

-- CreateIndex
CREATE INDEX "AiJob_user_id_idx" ON "AiJob"("user_id");

-- CreateIndex
CREATE INDEX "AiJob_user_id_type_status_idx" ON "AiJob"("user_id", "type", "status");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiJob" ADD CONSTRAINT "AiJob_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiSummary" ADD CONSTRAINT "AiSummary_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
