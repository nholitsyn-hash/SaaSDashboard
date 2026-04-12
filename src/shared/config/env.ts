import { z } from "zod";

/**
 * Server-side environment variables — validated with Zod at import time.
 *
 * WHY Zod validation instead of raw process.env:
 * If DATABASE_URL is missing, you'd get a cryptic Prisma connection error
 * deep in a request handler. Validating at import time surfaces the problem
 * immediately with a clear message: "DATABASE_URL is required."
 *
 * WHY a separate server schema:
 * Server env vars (secrets, DB URLs) must NEVER leak to the client bundle.
 * Next.js only exposes vars prefixed with NEXT_PUBLIC_ to the browser.
 * Keeping them in a server-only module ensures a build error if you
 * accidentally import this file in a client component.
 */
const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),
  AUTH_URL: z.string().url("AUTH_URL must be a valid URL"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export const env = serverEnvSchema.parse(process.env);
