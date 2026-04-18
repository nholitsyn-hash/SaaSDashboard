/**
 * Mock recent signups — Western names, realistic plan/status distribution.
 * Pass 2 will replace this with a paginated API query.
 */

export type SignupPlan = "Free" | "Pro" | "Enterprise";
export type SignupStatus = "trial" | "active" | "churned";

export interface Signup {
  id: string;
  name: string;
  email: string;
  plan: SignupPlan;
  status: SignupStatus;
  joinedAt: string; // ISO yyyy-mm-dd
}

export const mockSignups: Signup[] = [
  { id: "1", name: "Emma Carter", email: "emma@acme.co", plan: "Pro", status: "active", joinedAt: "2026-04-17" },
  { id: "2", name: "Liam Walsh", email: "liam@northwind.io", plan: "Enterprise", status: "active", joinedAt: "2026-04-17" },
  { id: "3", name: "Sophia Reed", email: "sophia@lab.dev", plan: "Free", status: "trial", joinedAt: "2026-04-16" },
  { id: "4", name: "Noah Bennett", email: "noah@mailbox.co", plan: "Pro", status: "trial", joinedAt: "2026-04-16" },
  { id: "5", name: "Olivia Hughes", email: "olivia@corp.io", plan: "Enterprise", status: "churned", joinedAt: "2026-04-15" },
  { id: "6", name: "Ethan Brooks", email: "ethan@harbor.dev", plan: "Pro", status: "active", joinedAt: "2026-04-15" },
  { id: "7", name: "Ava Sullivan", email: "ava@meridian.io", plan: "Free", status: "active", joinedAt: "2026-04-14" },
  { id: "8", name: "Mason Clark", email: "mason@aperture.co", plan: "Pro", status: "active", joinedAt: "2026-04-14" },
  { id: "9", name: "Isabella Mitchell", email: "isabella@glacier.io", plan: "Enterprise", status: "active", joinedAt: "2026-04-13" },
  { id: "10", name: "James Parker", email: "james@vantage.dev", plan: "Free", status: "churned", joinedAt: "2026-04-13" },
  { id: "11", name: "Mia Thompson", email: "mia@pinnacle.io", plan: "Pro", status: "trial", joinedAt: "2026-04-12" },
  { id: "12", name: "Benjamin Foster", email: "ben@lighthouse.co", plan: "Enterprise", status: "active", joinedAt: "2026-04-12" },
  { id: "13", name: "Charlotte Hayes", email: "charlotte@spruce.dev", plan: "Pro", status: "active", joinedAt: "2026-04-11" },
  { id: "14", name: "Henry Morgan", email: "henry@beacon.io", plan: "Free", status: "trial", joinedAt: "2026-04-11" },
  { id: "15", name: "Amelia Rivera", email: "amelia@summit.co", plan: "Pro", status: "active", joinedAt: "2026-04-10" },
];
