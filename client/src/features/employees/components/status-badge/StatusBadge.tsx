import { cn } from "@/shared/lib/utils";

import { Badge } from "@shared/components/ui/badge";

type Status = "in_progress" | "planning" | "on_hold" | "completed";

const statusConfig: Record<Status, { label: string; className: string }> = {
  in_progress: {
    label: "IN PROGRESS",
    className:
      "bg-[rgba(70,72,212,0.1)] text-[#4648d4] border-transparent hover:bg-[rgba(70,72,212,0.1)]",
  },
  planning: {
    label: "PLANNING",
    className:
      "bg-[rgba(113,42,226,0.1)] text-[#712ae2] border-transparent hover:bg-[rgba(113,42,226,0.1)]",
  },
  on_hold: {
    label: "ON HOLD",
    className:
      "bg-[rgba(88,90,104,0.1)] text-[#585a68] border-transparent hover:bg-[rgba(88,90,104,0.1)]",
  },
  completed: {
    label: "COMPLETED",
    className:
      "bg-[rgba(16,185,129,0.1)] text-[#059669] border-transparent hover:bg-[rgba(16,185,129,0.1)]",
  },
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge
      className={cn(
        "rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-tight",
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
