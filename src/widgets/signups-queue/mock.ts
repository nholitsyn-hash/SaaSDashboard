/**
 * Mock signup queue — three buckets.
 * 12 pending (matches the sidebar count badge), 6 approved, 3 rejected.
 */

export type SignupState = "pending" | "approved" | "rejected";
export type SignupPlan = "Free" | "Pro" | "Enterprise";

export interface SignupRequest {
  id: string;
  name: string;
  email: string;
  company: string;
  requestedPlan: SignupPlan;
  signedUpAt: string;
  state: SignupState;
}

export const mockSignupRequests: SignupRequest[] = [
  { id: "sr-1", name: "Emma Carter", email: "emma@acme.co", company: "Acme Corp", requestedPlan: "Pro", signedUpAt: "2026-04-17", state: "pending" },
  { id: "sr-2", name: "Liam Walsh", email: "liam@northwind.io", company: "Northwind Labs", requestedPlan: "Enterprise", signedUpAt: "2026-04-17", state: "pending" },
  { id: "sr-3", name: "Sophia Reed", email: "sophia@lab.dev", company: "Lab Dev", requestedPlan: "Free", signedUpAt: "2026-04-16", state: "pending" },
  { id: "sr-4", name: "Noah Bennett", email: "noah@mailbox.co", company: "Mailbox Co", requestedPlan: "Pro", signedUpAt: "2026-04-16", state: "pending" },
  { id: "sr-5", name: "Ava Sullivan", email: "ava@meridian.io", company: "Meridian Systems", requestedPlan: "Free", signedUpAt: "2026-04-15", state: "pending" },
  { id: "sr-6", name: "Mason Clark", email: "mason@aperture.co", company: "Aperture Media", requestedPlan: "Pro", signedUpAt: "2026-04-15", state: "pending" },
  { id: "sr-7", name: "Isabella Mitchell", email: "isabella@glacier.io", company: "Glacier Works", requestedPlan: "Enterprise", signedUpAt: "2026-04-14", state: "pending" },
  { id: "sr-8", name: "James Parker", email: "james@vantage.dev", company: "Vantage", requestedPlan: "Free", signedUpAt: "2026-04-14", state: "pending" },
  { id: "sr-9", name: "Mia Thompson", email: "mia@pinnacle.io", company: "Pinnacle Partners", requestedPlan: "Pro", signedUpAt: "2026-04-13", state: "pending" },
  { id: "sr-10", name: "Benjamin Foster", email: "ben@lighthouse.co", company: "Lighthouse Ltd", requestedPlan: "Enterprise", signedUpAt: "2026-04-13", state: "pending" },
  { id: "sr-11", name: "Charlotte Hayes", email: "charlotte@spruce.dev", company: "Spruce Analytics", requestedPlan: "Pro", signedUpAt: "2026-04-12", state: "pending" },
  { id: "sr-12", name: "Henry Morgan", email: "henry@beacon.io", company: "Beacon Industries", requestedPlan: "Free", signedUpAt: "2026-04-12", state: "pending" },

  { id: "sr-13", name: "Grace Parker", email: "grace@kite.dev", company: "Kite Software", requestedPlan: "Pro", signedUpAt: "2026-04-10", state: "approved" },
  { id: "sr-14", name: "Oliver Reed", email: "oliver@tangent.io", company: "Tangent Labs", requestedPlan: "Pro", signedUpAt: "2026-04-09", state: "approved" },
  { id: "sr-15", name: "Ella Foster", email: "ella@foxglove.co", company: "Foxglove Inc", requestedPlan: "Enterprise", signedUpAt: "2026-04-08", state: "approved" },
  { id: "sr-16", name: "Nathan Wells", email: "nathan@blueprint.co", company: "Blueprint Studio", requestedPlan: "Pro", signedUpAt: "2026-04-07", state: "approved" },
  { id: "sr-17", name: "Lucas Bennett", email: "lucas@cedar.vc", company: "Cedar Ventures", requestedPlan: "Enterprise", signedUpAt: "2026-04-06", state: "approved" },
  { id: "sr-18", name: "Amelia Rivera", email: "amelia@summit.co", company: "Summit & Co", requestedPlan: "Pro", signedUpAt: "2026-04-05", state: "approved" },

  { id: "sr-19", name: "Dexter Quinn", email: "dex@unknown-org.xyz", company: "— unverified —", requestedPlan: "Enterprise", signedUpAt: "2026-04-11", state: "rejected" },
  { id: "sr-20", name: "Zane Keller", email: "zane@test.example", company: "Test Test", requestedPlan: "Pro", signedUpAt: "2026-04-09", state: "rejected" },
  { id: "sr-21", name: "Aria Vance", email: "spam-bot@temp-mail.io", company: "—", requestedPlan: "Free", signedUpAt: "2026-04-07", state: "rejected" },
];

export const signupCounts = {
  pending: mockSignupRequests.filter((s) => s.state === "pending").length,
  approved: mockSignupRequests.filter((s) => s.state === "approved").length,
  rejected: mockSignupRequests.filter((s) => s.state === "rejected").length,
};
