import type { RequirementStatus } from "@entities/project/types/apiTypes";

import { Badge } from "@shared/components/ui/badge";
import { cn } from "@shared/lib/utils";

const statusConfig: Record<RequirementStatus, { label: string; className: string }> = {
  PENDING: {
    label: "PENDING",
    className:
      "bg-[rgba(245,158,11,0.1)] text-[#d97706] border-transparent hover:bg-[rgba(245,158,11,0.1)]",
  },
  APPROVED: {
    label: "APPROVED",
    className:
      "bg-[rgba(16,185,129,0.1)] text-[#059669] border-transparent hover:bg-[rgba(16,185,129,0.1)]",
  },
  REJECTED: {
    label: "REJECTED",
    className:
      "bg-[rgba(239,68,68,0.1)] text-[#ef4444] border-transparent hover:bg-[rgba(239,68,68,0.1)]",
  },
};

interface RequirementStatusBadgeProps {
  status: RequirementStatus;
  className?: string;
}

export function RequirementStatusBadge({ status, className }: RequirementStatusBadgeProps) {
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
