import { useState } from "react";

import { Bot, X } from "lucide-react";

import { Button } from "@shared/components/ui/button";
import { cn } from "@shared/lib/utils";

import { useChat } from "../../hooks/useChat";
import { ChatWindow } from "../ChatWindow";

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { messages, isStreaming, sendMessage } = useChat();

  const handleClose = () => {
    setExpanded(false);
    setOpen(false);
  };

  const handleToggleExpand = () => setExpanded((v) => !v);

  return (
    <>
      {/* Chat window container — repositions between full-screen and bottom-right */}
      <div
        className={cn(
          "fixed z-50 transition-all duration-200 ease-out will-change-transform",
          expanded
            ? "inset-0" // covers full viewport
            : "bottom-6 right-6 flex flex-col items-end", // anchored bottom-right
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        )}
        aria-hidden={!open}
      >
        <ChatWindow
          messages={messages}
          isTyping={isStreaming}
          showSuggestions={false}
          expanded={expanded}
          onSend={sendMessage}
          onClose={handleClose}
          onToggleExpand={handleToggleExpand}
        />
      </div>

      {/* FAB — always visible in bottom-right, sits above the chat window */}
      <div className="fixed bottom-6 right-6 z-[51]">
        <Button
          onClick={() => {
            if (open && expanded) {
              // already full-screen → just close
              handleClose();
            } else {
              setOpen((v) => !v);
            }
          }}
          className={cn(
            "size-14 rounded-full bg-primary text-primary-foreground",
            "hover:bg-primary/90 transition-all duration-200",
            "shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]",
            // Hide FAB when the window is expanded (the header X button is enough)
            expanded && open && "opacity-0 pointer-events-none scale-90"
          )}
          aria-label={open ? "Close AI Assistant" : "Open AI Assistant"}
        >
          {open ? <X className="size-6" /> : <Bot className="size-6" />}
        </Button>
      </div>
    </>
  );
}
