import { type KeyboardEvent, useRef, useState } from "react";

import { cn } from "@/shared/lib/utils";
import { SendHorizontal } from "lucide-react";

import { Button } from "@shared/components/ui/button";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

/**
 * Auto-growing textarea + send button.
 * Matches the Figma "Input Area → BackgroundBorder" component.
 *   • Enter → send
 *   • Shift+Enter → newline
 *   • Max height 128 px (then scrolls)
 */
export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    // Reset auto-grow height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    /* White strip with top border — "Input Area" */
    <div className="shrink-0 bg-card border-t border-border-strong px-4 pt-[17px] pb-4">
      {/* Input container — "BackgroundBorder" */}
      <div className="flex items-end gap-2 bg-secondary rounded-xl px-3 py-2">
        {/* Textarea — auto-grows */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          disabled={disabled}
          placeholder="Ask about available engineers, projects, staffing, or resource allocation..."
          className={cn(
            "flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground",
            "focus:outline-none leading-5 py-[6px] max-h-32 overflow-auto",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />

        {/* Send button — "Button7" in Figma */}
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            "size-10 shrink-0 rounded-lg bg-primary text-primary-foreground",
            "shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]",
            "hover:bg-primary/90 disabled:opacity-40 transition-all"
          )}
          aria-label="Send message"
        >
          <SendHorizontal className="size-4" />
        </Button>
      </div>
    </div>
  );
}
