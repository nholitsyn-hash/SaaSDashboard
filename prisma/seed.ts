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

  // Customers
  //
  // WHY deleteMany + createMany (not upsert):
  //   Upserting 20 rows needs a stable unique key per row. Email within
  //   an org would work but drags in a unique constraint we don't need
  //   for a demo seed. Nuking this org's customers and re-creating is
  //   predictable and makes the seed idempotent without extra schema.
  //
  // WHY mrrCents (not dollars):
  //   Integer cents matches the schema. Multiplying the mock dollar
  //   values by 100 is the only transform — mock → DB — needed.
  await db.customer.deleteMany({ where: { organizationId: org.id } });

  type CustomerSeed = {
    company: string;
    contact: string;
    email: string;
    plan: "Free" | "Pro" | "Enterprise";
    status: "active" | "trial" | "churned";
    mrr: number;
    region: string;
    joinedAt: string;
  };

  const customerSeeds: CustomerSeed[] = [
    { company: "Northwind Labs", contact: "Liam Walsh", email: "liam@northwind.io", plan: "Enterprise", status: "active", mrr: 4200, region: "North America", joinedAt: "2023-11-14" },
    { company: "Meridian Systems", contact: "Isabella Mitchell", email: "isabella@meridian.io", plan: "Enterprise", status: "active", mrr: 3600, region: "North America", joinedAt: "2024-02-03" },
    { company: "Glacier Works", contact: "Benjamin Foster", email: "ben@glacier.io", plan: "Enterprise", status: "active", mrr: 3250, region: "Europe", joinedAt: "2024-05-22" },
    { company: "Harbor Studios", contact: "Ethan Brooks", email: "ethan@harbor.dev", plan: "Enterprise", status: "active", mrr: 2800, region: "North America", joinedAt: "2024-07-09" },
    { company: "Aperture Media", contact: "Mason Clark", email: "mason@aperture.co", plan: "Pro", status: "active", mrr: 1450, region: "United Kingdom", joinedAt: "2025-01-18" },
    { company: "Pinnacle Partners", contact: "Mia Thompson", email: "mia@pinnacle.io", plan: "Pro", status: "active", mrr: 1220, region: "Europe", joinedAt: "2025-03-04" },
    { company: "Summit & Co", contact: "Amelia Rivera", email: "amelia@summit.co", plan: "Pro", status: "active", mrr: 1150, region: "North America", joinedAt: "2025-04-12" },
    { company: "Acme Corp", contact: "Emma Carter", email: "emma@acme.co", plan: "Pro", status: "active", mrr: 980, region: "Europe", joinedAt: "2025-08-02" },
    { company: "Beacon Industries", contact: "Henry Morgan", email: "henry@beacon.io", plan: "Pro", status: "active", mrr: 860, region: "APAC", joinedAt: "2025-11-27" },
    { company: "Lighthouse Ltd", contact: "Olivia Hughes", email: "olivia@lighthouse.co", plan: "Pro", status: "active", mrr: 740, region: "North America", joinedAt: "2026-01-15" },
    { company: "Spruce Analytics", contact: "Charlotte Hayes", email: "charlotte@spruce.dev", plan: "Pro", status: "active", mrr: 700, region: "North America", joinedAt: "2026-01-22" },
    { company: "Cedar Ventures", contact: "Lucas Bennett", email: "lucas@cedar.vc", plan: "Enterprise", status: "active", mrr: 4500, region: "Europe", joinedAt: "2024-09-30" },
    { company: "Kite Software", contact: "Grace Parker", email: "grace@kite.dev", plan: "Pro", status: "trial", mrr: 0, region: "North America", joinedAt: "2026-04-02" },
    { company: "Tangent Labs", contact: "Oliver Reed", email: "oliver@tangent.io", plan: "Pro", status: "trial", mrr: 0, region: "United Kingdom", joinedAt: "2026-04-06" },
    { company: "Foxglove Inc", contact: "Ella Foster", email: "ella@foxglove.co", plan: "Enterprise", status: "trial", mrr: 0, region: "LATAM", joinedAt: "2026-04-10" },
    { company: "Blueprint Studio", contact: "Nathan Wells", email: "nathan@blueprint.co", plan: "Pro", status: "trial", mrr: 0, region: "APAC", joinedAt: "2026-04-15" },
    { company: "Quartz Digital", contact: "Lily Brooks", email: "lily@quartz.io", plan: "Pro", status: "churned", mrr: 0, region: "Europe", joinedAt: "2025-06-11" },
    { company: "Arcade Robotics", contact: "Caleb Turner", email: "caleb@arcade.co", plan: "Enterprise", status: "churned", mrr: 0, region: "North America", joinedAt: "2025-02-18" },
    { company: "Obsidian Media", contact: "Zoe Martin", email: "zoe@obsidian.co", plan: "Pro", status: "churned", mrr: 0, region: "North America", joinedAt: "2025-07-22" },
    { company: "Brightside App", contact: "Isaac Hill", email: "isaac@brightside.app", plan: "Free", status: "active", mrr: 0, region: "APAC", joinedAt: "2026-02-14" },
  ];

  await db.customer.createMany({
    data: customerSeeds.map((c) => ({
      organizationId: org.id,
      company: c.company,
      contact: c.contact,
      email: c.email,
      plan: c.plan,
      status: c.status,
      mrrCents: c.mrr * 100,
      region: c.region,
      joinedAt: new Date(c.joinedAt),
    })),
  });

  // Subscriptions — link each mock row to the Customer we just created
  // by company name.
  //
  // WHY look up by company (not email, not id):
  //   Customer ids are cuids generated at insert time — we can't know
  //   them ahead of the seed. Company name is unique within our mock
  //   and acts as a natural join key.
  await db.subscription.deleteMany({
    where: { customer: { organizationId: org.id } },
  });

  const customerRecords = await db.customer.findMany({
    where: { organizationId: org.id },
    select: { id: true, company: true },
  });
  const customerIdByCompany = new Map(
    customerRecords.map((c) => [c.company, c.id])
  );

  type SubscriptionSeed = {
    customer: string;
    plan: "Pro" | "Enterprise";
    cycle: "monthly" | "annual";
    status: "active" | "trial" | "paused" | "canceled";
    mrr: number;
    startedAt: string;
    renewsAt: string | null;
  };

  const subscriptionSeeds: SubscriptionSeed[] = [
    { customer: "Northwind Labs", plan: "Enterprise", cycle: "annual", status: "active", mrr: 4200, startedAt: "2023-11-14", renewsAt: "2026-11-14" },
    { customer: "Meridian Systems", plan: "Enterprise", cycle: "annual", status: "active", mrr: 3600, startedAt: "2024-02-03", renewsAt: "2027-02-03" },
    { customer: "Glacier Works", plan: "Enterprise", cycle: "monthly", status: "active", mrr: 3250, startedAt: "2024-05-22", renewsAt: "2026-05-22" },
    { customer: "Harbor Studios", plan: "Enterprise", cycle: "annual", status: "active", mrr: 2800, startedAt: "2024-07-09", renewsAt: "2026-07-09" },
    { customer: "Cedar Ventures", plan: "Enterprise", cycle: "annual", status: "active", mrr: 4500, startedAt: "2024-09-30", renewsAt: "2026-09-30" },
    { customer: "Aperture Media", plan: "Pro", cycle: "monthly", status: "active", mrr: 1450, startedAt: "2025-01-18", renewsAt: "2026-05-18" },
    { customer: "Pinnacle Partners", plan: "Pro", cycle: "monthly", status: "active", mrr: 1220, startedAt: "2025-03-04", renewsAt: "2026-05-04" },
    { customer: "Summit & Co", plan: "Pro", cycle: "annual", status: "active", mrr: 1150, startedAt: "2025-04-12", renewsAt: "2026-04-12" },
    { customer: "Acme Corp", plan: "Pro", cycle: "monthly", status: "active", mrr: 980, startedAt: "2025-08-02", renewsAt: "2026-05-02" },
    { customer: "Beacon Industries", plan: "Pro", cycle: "monthly", status: "active", mrr: 860, startedAt: "2025-11-27", renewsAt: "2026-04-27" },
    { customer: "Lighthouse Ltd", plan: "Pro", cycle: "monthly", status: "active", mrr: 740, startedAt: "2026-01-15", renewsAt: "2026-05-15" },
    { customer: "Spruce Analytics", plan: "Pro", cycle: "monthly", status: "active", mrr: 700, startedAt: "2026-01-22", renewsAt: "2026-05-22" },
    { customer: "Kite Software", plan: "Pro", cycle: "monthly", status: "trial", mrr: 0, startedAt: "2026-04-02", renewsAt: "2026-04-16" },
    { customer: "Tangent Labs", plan: "Pro", cycle: "monthly", status: "trial", mrr: 0, startedAt: "2026-04-06", renewsAt: "2026-04-20" },
    { customer: "Foxglove Inc", plan: "Enterprise", cycle: "annual", status: "trial", mrr: 0, startedAt: "2026-04-10", renewsAt: "2026-04-24" },
    { customer: "Blueprint Studio", plan: "Pro", cycle: "monthly", status: "trial", mrr: 0, startedAt: "2026-04-15", renewsAt: "2026-04-29" },
    { customer: "Brightside App", plan: "Pro", cycle: "monthly", status: "paused", mrr: 0, startedAt: "2025-09-12", renewsAt: null },
    { customer: "Arcade Robotics", plan: "Enterprise", cycle: "annual", status: "canceled", mrr: 0, startedAt: "2025-02-18", renewsAt: null },
    { customer: "Quartz Digital", plan: "Pro", cycle: "monthly", status: "canceled", mrr: 0, startedAt: "2025-06-11", renewsAt: null },
    { customer: "Obsidian Media", plan: "Pro", cycle: "monthly", status: "canceled", mrr: 0, startedAt: "2025-07-22", renewsAt: null },
  ];

  const subscriptionData = subscriptionSeeds
    .map((s) => {
      const customerId = customerIdByCompany.get(s.customer);
      if (!customerId) {
        console.warn(`Skipping subscription for missing customer: ${s.customer}`);
        return null;
      }
      return {
        customerId,
        plan: s.plan,
        cycle: s.cycle,
        status: s.status,
        mrrCents: s.mrr * 100,
        startedAt: new Date(s.startedAt),
        renewsAt: s.renewsAt ? new Date(s.renewsAt) : null,
      };
    })
    .filter((s): s is NonNullable<typeof s> => s !== null);

  await db.subscription.createMany({ data: subscriptionData });

  console.log(
    `Seeded: Acme Corp + admin@example.com (super_admin) + ${customerSeeds.length} customers + ${subscriptionData.length} subscriptions`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
