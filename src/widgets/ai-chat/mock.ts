/**
 * Mock AI Assistant data — suggested prompts + canned responses.
 *
 * Each canned response ties to one of the 4 suggestion cards so clicks
 * feel tailored. Free-text input falls back to a generic mock reply so
 * users don't get a "sorry I don't understand" when real wiring lands
 * in Phase 6.
 */

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface SuggestedPrompt {
  id: string;
  title: string;
  subtitle: string;
  prompt: string;
  response: string;
}

export const suggestedPrompts: SuggestedPrompt[] = [
  {
    id: "mrr-trend",
    title: "MRR trend this month",
    subtitle: "Revenue growth across segments",
    prompt: "What's our MRR trend this month?",
    response:
      "MRR grew 12.4% month-over-month to $48,250. The Pro plan contributed 67% of that growth — led by 4 new customers in North America (Emma Carter, Noah Bennett, Grace Parker, Amelia Rivera). Enterprise added $6.7k through a single expansion deal. Want a cohort-level breakdown?",
  },
  {
    id: "churn-spike",
    title: "Why did churn happen?",
    subtitle: "Recent cancellation reasons",
    prompt: "Why did churn happen this quarter?",
    response:
      "3 accounts churned in April — Quartz Digital (Pro · $320 MRR, reason: \"consolidating tools\"), Arcade Robotics (Enterprise · $750 MRR, reason: \"acquired by competitor\"), and Obsidian Media (Pro · $160 MRR, reason: \"missing integrations\"). Two of those had trending-down engagement 30 days before cancelling — a signal worth alerting on.",
  },
  {
    id: "best-plan",
    title: "Best-performing plan",
    subtitle: "Tier comparison",
    prompt: "Which plan performs best?",
    response:
      "Enterprise wins on LTV ($8,750 vs Pro's $1,240) and retention (2.1% churn vs Pro's 5.4%). Pro wins on volume — 356 subscribers driving $441k cumulative revenue. Payback period favors Enterprise (2.1 months vs Pro's 3.7). For growth focus, Pro. For cash efficiency, Enterprise.",
  },
  {
    id: "top-region",
    title: "Top region by ARPU",
    subtitle: "Geographic performance",
    prompt: "Which region has the highest ARPU?",
    response:
      "North America leads at $160 ARPU ($32,650 MRR across 203 subscribers), followed by APAC at $152 — notable because APAC only has 25 subs but 41.6% YoY growth, fastest of any region. Europe ranks 3rd at $158 ARPU but contributes the largest Enterprise cohort ($6,750 MRR).",
  },
];

export const fallbackResponse =
  "I'm a UI preview right now — real Claude wiring lands in Phase 6 and will answer questions over your live data. In the meantime, try one of the suggested prompts above.";

export const initialMessages: ChatMessage[] = [];
