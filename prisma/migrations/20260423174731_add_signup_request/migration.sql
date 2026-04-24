-- CreateEnum
CREATE TYPE "SignupState" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "signup_requests" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "requestedPlan" "CustomerPlan" NOT NULL,
    "state" "SignupState" NOT NULL DEFAULT 'pending',
    "signedUpAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "signup_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "signup_requests_organizationId_state_idx" ON "signup_requests"("organizationId", "state");

-- AddForeignKey
ALTER TABLE "signup_requests" ADD CONSTRAINT "signup_requests_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
