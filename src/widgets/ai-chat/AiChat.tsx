"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Sparkles } from "lucide-react";
import { Badge } from "@/shared/ui";
import {
  fallbackResponse,
  initialMessages,
  suggestedPrompts,
  type ChatMessage,
  type SuggestedPrompt,
} from "./mock";

/**
 * AiChat — empty-state with suggestions → live-feeling conversation.
 *
 * WHY a fake 700ms delay with a "thinking" indicator:
 * Users read "assistant is responding…" as a real AI. An instant
 * response reads as static mock. 700ms is short enough to feel
 * snappy, long enough to register as a thoughtful pause. When real
 * Claude streams tokens in Phase 6, the indicator behavior becomes
 * truthful rather than theatrical.
 *
 * WHY suggested prompts render only on empty state:
 * Once a conversation starts, they'd compete with message flow for
 * attention. Tucking them to empty state mirrors Claude/ChatGPT/
 * Vercel AI SDK demo patterns.
 */
export function AiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when new messages arrive.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const send = (prompt: string, cannedResponse?: string) => {
    const now = new Date();
    const userMsg: ChatMessage = {
      id: `u-${now.getTime()}`,
      role: "user",
      content: prompt,
      timestamp: now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    // Simulate latency
    window.setTimeout(() => {
      const replyTime = new Date();
      const assistantMsg: ChatMessage = {
        id: `a-${replyTime.getTime()}`,
        role: "assistant",
        content: cannedResponse ?? fallbackResponse,
        timestamp: replyTime.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsThinking(false);
    }, 700);
  };

  const handlePromptClick = (p: SuggestedPrompt) => send(p.prompt, p.response);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;
    send(trimmed);
  };

  const isEmpty = messages.length === 0;

  return (
    <section
      aria-label="AI chat"
      className="flex flex-col rounded-xl border border-border-default bg-bg-surface shadow-sm overflow-hidden h-[calc(100vh-12rem)] min-h-[560px]"
    >
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-6"
      >
        {isEmpty ? (
          <EmptyState onPromptClick={handlePromptClick} />
        ) : (
          <ul className="flex flex-col gap-5 max-w-3xl mx-auto">
            {messages.map((m) => (
              <MessageRow key={m.id} message={m} />
            ))}
            {isThinking && <ThinkingRow />}
          </ul>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-border-default bg-bg-surface px-4 sm:px-6 py-3"
      >
        <div className="mx-auto flex max-w-3xl items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as unknown as React.FormEvent);
                }
              }}
              rows={1}
              placeholder="Ask anything about your metrics…"
              className="
                w-full resize-none
                rounded-lg border border-border-default bg-bg-base
                px-3 py-2 text-sm
                text-text-primary placeholder:text-text-tertiary
                transition-colors
                hover:border-border-strong
                focus:border-border-focus focus:outline-none
                focus:ring-2 focus:ring-border-focus/30
              "
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            aria-label="Send message"
            className="
              inline-flex h-9 w-9 items-center justify-center rounded-lg
              bg-primary text-white shadow-sm
              transition-colors hover:bg-primary-hover
              disabled:opacity-40 disabled:cursor-not-allowed
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-border-focus focus-visible:ring-offset-2
            "
          >
            <ArrowUp size={16} />
          </button>
        </div>
        <p className="mx-auto max-w-3xl pt-2 text-[11px] text-text-tertiary">
          Powered by Claude · <Badge variant="secondary" className="ml-1">Soon</Badge> — real
          model wiring lands in Phase 6.
        </p>
      </form>
    </section>
  );
}

function EmptyState({
  onPromptClick,
}: {
  onPromptClick: (p: SuggestedPrompt) => void;
}) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 pt-4">
      <div
        aria-hidden
        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white"
      >
        <Sparkles size={22} />
      </div>
      <div className="flex flex-col gap-1 items-center text-center">
        <h2 className="text-xl font-semibold text-text-primary">
          Ask about your metrics
        </h2>
        <p className="text-sm text-text-secondary max-w-md">
          The assistant answers questions about MRR, churn, retention, and
          cohorts using your live workspace data.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        {suggestedPrompts.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onPromptClick(p)}
            className="
              flex flex-col gap-1 text-left
              rounded-xl border border-border-default bg-bg-surface
              p-4 transition-colors
              hover:bg-bg-muted hover:border-border-strong
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-border-focus
            "
          >
            <span className="text-sm font-medium text-text-primary">
              {p.title}
            </span>
            <span className="text-xs text-text-tertiary">{p.subtitle}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageRow({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <li className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        aria-hidden
        className={`
          flex h-8 w-8 shrink-0 items-center justify-center rounded-full
          text-[11px] font-bold text-white
          ${
            isUser
              ? "bg-gradient-to-br from-primary to-secondary"
              : "bg-gradient-to-br from-accent to-secondary"
          }
        `}
      >
        {isUser ? "You" : <Sparkles size={14} />}
      </div>
      <div
        className={`
          flex flex-col gap-1 max-w-[80%]
          ${isUser ? "items-end" : "items-start"}
        `}
      >
        <div
          className={`
            rounded-2xl px-4 py-2.5 text-sm leading-relaxed
            ${
              isUser
                ? "bg-primary text-white rounded-tr-sm"
                : "bg-bg-muted text-text-primary rounded-tl-sm"
            }
          `}
        >
          {message.content}
        </div>
        <span className="text-[10px] text-text-tertiary tabular-nums">
          {message.timestamp}
        </span>
      </div>
    </li>
  );
}

function ThinkingRow() {
  return (
    <li className="flex gap-3">
      <div
        aria-hidden
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-secondary text-white"
      >
        <Sparkles size={14} />
      </div>
      <div className="rounded-2xl rounded-tl-sm bg-bg-muted px-4 py-3">
        <div className="flex items-center gap-1.5" aria-label="Assistant is thinking">
          <span className="h-1.5 w-1.5 rounded-full bg-text-tertiary animate-bounce [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-text-tertiary animate-bounce [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-text-tertiary animate-bounce" />
        </div>
      </div>
    </li>
  );
}
