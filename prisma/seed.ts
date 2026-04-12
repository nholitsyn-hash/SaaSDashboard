import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

/**
 * Seed script — creates initial dev data.
 *
 * Creates:
 *   1. "Acme Corp" organization
 *   2. super_admin user (admin@example.com / password123)
 *   3. Membership linking them
 *
 * WHY upsert instead of create:
 * Running the seed twice won't fail — upsert creates if missing,
 * updates if exists. Safe to run repeatedly during development.
 *
 * WHY "dotenv/config" import:
 * The seed runs outside of Next.js, so env vars aren't auto-loaded.
 * dotenv/config reads .env and populates process.env before PrismaClient
 * tries to connect.
 *
 * Run with: npx prisma db seed
 */
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter }) as unknown as InstanceType<typeof PrismaClient>;

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);

  const org = await db.organization.upsert({
    where: { slug: "acme-corp" },
    update: {},
    create: {
      name: "Acme Corp",
      slug: "acme-corp",
    },
  });

  const user = await db.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      passwordHash,
    },
  });

  await db.membership.upsert({
    where: {
      userId_organizationId: {
        userId: user.id,
        organizationId: org.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      organizationId: org.id,
      role: "super_admin",
    },
  });

  console.log("Seeded: Acme Corp + admin@example.com (super_admin)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
