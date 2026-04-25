-- CreateEnum
CREATE TYPE "CardBrand" AS ENUM ('Visa', 'Mastercard', 'Amex');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('paid', 'failed', 'upcoming');

-- CreateTable
CREATE TABLE "workspace_subscriptions" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "planTier" "CustomerPlan" NOT NULL,
    "priceMonthlyCents" INTEGER NOT NULL,
    "cycle" "BillingCycle" NOT NULL,
    "nextBillAt" TIMESTAMP(3) NOT NULL,
    "renewsAt" TIMESTAMP(3) NOT NULL,
    "eventsLimit" INTEGER NOT NULL,
    "seatsLimit" INTEGER NOT NULL,
    "storageLimitGb" DOUBLE PRECISION NOT NULL,
    "eventsUsed" INTEGER NOT NULL DEFAULT 0,
    "seatsUsed" INTEGER NOT NULL DEFAULT 0,
    "storageUsedGb" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cardBrand" "CardBrand",
    "cardLast4" TEXT,
    "cardExpMonth" INTEGER,
    "cardExpYear" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspace_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "workspaceSubId" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "status" "InvoiceStatus" NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "workspace_subscriptions_organizationId_key" ON "workspace_subscriptions"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_number_key" ON "invoices"("number");

-- CreateIndex
CREATE INDEX "invoices_workspaceSubId_date_idx" ON "invoices"("workspaceSubId", "date");

-- AddForeignKey
ALTER TABLE "workspace_subscriptions" ADD CONSTRAINT "workspace_subscriptions_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_workspaceSubId_fkey" FOREIGN KEY ("workspaceSubId") REFERENCES "workspace_subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
