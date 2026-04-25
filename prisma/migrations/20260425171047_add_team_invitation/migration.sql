-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('pending', 'accepted', 'revoked', 'expired');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "lastActiveAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "invitations" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'viewer',
    "status" "InviteStatus" NOT NULL DEFAULT 'pending',
    "invitedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "invitations_organizationId_status_idx" ON "invitations"("organizationId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "invitations_organizationId_email_key" ON "invitations"("organizationId", "email");

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
