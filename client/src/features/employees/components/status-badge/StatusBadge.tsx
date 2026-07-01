import type { ProjectStatus } from "@entities/project/types/apiTypes";

import { Badge } from "@shared/components/ui/badge";
import { cn } from "@shared/lib/utils";

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  ONGOING: {
    label: "ONGOING",
    className:
      "bg-[rgba(70,72,212,0.1)] text-[#4648d4] border-transparent hover:bg-[rgba(70,72,212,0.1)]",
  },
  COMPLETED: {
    label: "COMPLETED",
    className:
      "bg-[rgba(16,185,129,0.1)] text-[#059669] border-transparent hover:bg-[rgba(16,185,129,0.1)]",
  },
  STOPPED: {
    label: "STOPPED",
    className:
      "bg-[rgba(239,68,68,0.1)] text-[#ef4444] border-transparent hover:bg-[rgba(239,68,68,0.1)]",
  },
  DISCARDED: {
    label: "DISCARDED",
    className:
      "bg-[rgba(239,68,68,0.1)] text-[#ef4444] border-transparent hover:bg-[rgba(239,68,68,0.1)]",
  },
  NOT_STARTED: {
    label: "NOT STARTED",
    className:
      "bg-[rgba(88,90,104,0.1)] text-[#585a68] border-transparent hover:bg-[rgba(88,90,104,0.1)]",
  },
};

interface StatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge
      className={cn(
        "rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-tight",
        config?.className,
        className
      )}
    >
      {config?.label}
    </Badge>
  );
}
