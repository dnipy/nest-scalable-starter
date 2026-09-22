-- CreateEnum
CREATE TYPE "AiJobType" AS ENUM ('SUMMARY', 'QUIZ_GENERATION');

-- CreateEnum
CREATE TYPE "AiJobStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "AiJob" (
    "id" TEXT NOT NULL,
    "type" "AiJobType" NOT NULL,
    "status" "AiJobStatus" NOT NULL DEFAULT 'PENDING',
    "input" TEXT NOT NULL,
    "output" TEXT,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "AiJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiJob_status_idx" ON "AiJob"("status");
