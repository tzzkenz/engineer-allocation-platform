import { type Message } from "../types/type";

import { MarkdownRenderer } from "./MarkdownRenderer";

/* ── Helpers ──────────────────────────────────────────────────────────── */

function relativeTime(date: Date): string {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 10) return "Just now";
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/* ── AI bubble ────────────────────────────────────────────────────────── */

function AiBubble({ message }: { message: Message }) {
  return (
    <div className="flex flex-col gap-1 items-start max-w-[85%]">
      {/*
        Figma shape: rounded-bl rounded-br rounded-tr but NOT rounded-tl.
        Achieved via border-radius override on the top-left corner.
      */}
      <div
        className="bg-secondary rounded-br-2xl rounded-bl-2xl rounded-tr-2xl px-3 py-2.5 shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
        style={{ borderTopLeftRadius: 0 }}
      >
        <MarkdownRenderer content={message.content} />
      </div>
      <span className="text-[10px] text-muted-foreground pl-1 leading-none">
        AI Assistant • {relativeTime(message.timestamp)}
      </span>
    </div>
  );
}

/* ── User bubble ──────────────────────────────────────────────────────── */

function UserBubble({ message }: { message: Message }) {
  return (
    <div className="flex flex-col gap-1 items-end max-w-[85%] self-end">
      {/*
        Mirror: rounded-bl rounded-br rounded-tl but NOT rounded-tr.
      */}
      <div
        className="bg-primary text-primary-foreground rounded-bl-2xl rounded-br-2xl rounded-tl-2xl px-3 py-2.5 text-sm leading-5 shadow-sm"
        style={{ borderTopRightRadius: 0 }}
      >
        {message.content}
      </div>
      <span className="text-[10px] text-muted-foreground pr-1 leading-none">
        You • {relativeTime(message.timestamp)}
      </span>
    </div>
  );
}

/* ── Public ───────────────────────────────────────────────────────────── */

export function MessageBubble({ message }: { message: Message }) {
  return message.role === "ai" ? <AiBubble message={message} /> : <UserBubble message={message} />;
}

/** Three animated dots shown while the AI is "thinking". */
export function TypingIndicator() {
  return (
    <div className="flex flex-col gap-1 items-start">
      <div
        className="bg-secondary rounded-br-2xl rounded-bl-2xl rounded-tr-2xl px-4 py-3 shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
        style={{ borderTopLeftRadius: 0 }}
      >
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-1.5 rounded-full bg-muted-foreground/40 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s`, animationDuration: "1s" }}
            />
          ))}
        </div>
      </div>
      <span className="text-[10px] text-muted-foreground pl-1">AI Assistant • typing…</span>
    </div>
  );
}
