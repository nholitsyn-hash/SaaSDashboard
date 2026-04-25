-- CreateEnum
CREATE TYPE "IntegrationStatus" AS ENUM ('connected', 'available');

-- CreateEnum
CREATE TYPE "IntegrationCategory" AS ENUM ('Payments', 'CRM', 'Communication', 'Analytics', 'Automation');

-- CreateTable
CREATE TABLE "integrations" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "IntegrationCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "status" "IntegrationStatus" NOT NULL DEFAULT 'available',
    "connectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "integrations_organizationId_status_idx" ON "integrations"("organizationId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "integrations_organizationId_slug_key" ON "integrations"("organizationId", "slug");

-- AddForeignKey
ALTER TABLE "integrations" ADD CONSTRAINT "integrations_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
