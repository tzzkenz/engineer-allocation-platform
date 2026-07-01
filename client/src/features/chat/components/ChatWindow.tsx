import { cn } from "@/shared/lib/utils";

import { type Message } from "../types/type";

import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";

interface ChatWindowProps {
  messages: Message[];
  isTyping: boolean;
  showSuggestions: boolean;
  expanded: boolean;
  onSend: (text: string) => void;
  onClose: () => void;
  onToggleExpand: () => void;
}

/**
 * Chat panel — normal: 400 × 600 px  |  full-screen: 100vw × 100vh.
 * Size transitions are smooth via Tailwind `transition-all`.
 */
export function ChatWindow({
  messages,
  isTyping,
  showSuggestions,
  expanded,
  onSend,
  onClose,
  onToggleExpand,
}: ChatWindowProps) {
  return (
    <div
      className={cn(
        "flex flex-col bg-card overflow-hidden border border-border-strong",
        "transition-all duration-300 ease-in-out",
        expanded ? "w-screen h-screen rounded-none" : "w-[400px] h-[600px] rounded-2xl"
      )}
      style={{ boxShadow: expanded ? "none" : "0 25px 50px -12px rgba(0,0,0,0.25)" }}
    >
      <ChatHeader expanded={expanded} onToggleExpand={onToggleExpand} onClose={onClose} />

      <MessageList
        messages={messages}
        isTyping={isTyping}
        showSuggestions={showSuggestions}
        onSuggestionSelect={onSend}
      />

      <ChatInput onSend={onSend} disabled={isTyping} />
    </div>
  );
}
