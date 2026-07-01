import { Bot, Maximize2, Minimize2, Minus, X } from "lucide-react";

import { Button } from "@shared/components/ui/button";

interface ChatHeaderProps {
  expanded: boolean;
  onToggleExpand: () => void;
  onClose: () => void;
  onMinimize?: () => void;
}

/**
 * Indigo header bar matching the Figma "Header" component.
 * The expand icon switches between Maximize2 (normal) and Minimize2 (full-screen).
 */
export function ChatHeader({ expanded, onToggleExpand, onClose, onMinimize }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3.5 bg-primary shrink-0 rounded-t-2xl">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <Bot className="size-[22px] text-white shrink-0" strokeWidth={1.8} />
        <span className="text-base font-bold text-white leading-6">AI Assistant</span>
      </div>

      {/* Window controls */}
      <div className="flex items-center gap-0.5">
        {/* Expand / restore toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleExpand}
          className="size-7 rounded text-white/70 hover:text-white hover:bg-white/15"
          aria-label={expanded ? "Restore window" : "Full screen"}
        >
          {expanded ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
        </Button>

        {/* Minimize (close-but-keep-fab) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMinimize ?? onClose}
          className="size-7 rounded text-white/70 hover:text-white hover:bg-white/15"
          aria-label="Minimize"
        >
          <Minus className="size-3.5" />
        </Button>

        {/* Close */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="size-7 rounded text-white/70 hover:text-white hover:bg-white/15"
          aria-label="Close"
        >
          <X className="size-3.5" />
        </Button>
      </div>
    </header>
  );
}
