import { useEffect, useRef } from "react";

import { type Message } from "../types/type";

import { MessageBubble, TypingIndicator } from "./MessageBubble";

// import { SuggestionChips } from "./SuggestionChips";

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  showSuggestions: boolean;
  onSuggestionSelect: (chip: string) => void;
}

/**
 * Scrollable conversation area.
 * Matches the Figma "Conversation Area": bg-surface (#f7f9ff), flex-1.
 * Auto-scrolls to the newest message on every update.
 */
export function MessageList({
  messages,
  isTyping,
  showSuggestions,
  onSuggestionSelect,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages or typing state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto bg-surface min-h-0">
      <div className="flex flex-col gap-4 p-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}

        {/* {showSuggestions && <SuggestionChips onSelect={onSuggestionSelect} />} */}

        {/* Invisible anchor that we scroll into view */}
        <div ref={bottomRef} className="h-0 shrink-0" />
      </div>
    </div>
  );
}
