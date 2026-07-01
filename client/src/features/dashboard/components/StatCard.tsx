import { type ReactNode } from "react";

import { Card, CardContent } from "@shared/components/ui/card";
import { cn } from "@shared/lib/utils";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  sub: string;
  badge?: {
    text: string;
    variant: "success" | "danger" | "neutral";
  };
  iconBg?: string;
  className?: string;
}

const badgeStyles: Record<string, string> = {
  success: "bg-green-100 text-green-700",
  danger: "bg-red-100 text-destructive",
  neutral: "bg-secondary text-muted-foreground",
};

export function StatCard({
  icon,
  label,
  value,
  sub,
  badge,
  iconBg = "bg-primary/10",
  className,
}: StatCardProps) {
  return (
    <Card className={cn("relative rounded-2xl p-5 flex flex-col gap-3", className)}>
      <CardContent className="flex items-start justify-between">
        <div className={cn("size-10 rounded-xl flex items-center justify-center shrink-0", iconBg)}>
          {icon}
        </div>
        {badge && (
          <span
            className={cn(
              "text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-full",
              badgeStyles[badge.variant]
            )}
          >
            {badge.text}
          </span>
        )}
      </CardContent>

      <div>
        <p className="text-xs font-extrabold tracking-widest text-muted-foreground uppercase mb-1">
          {label}
        </p>
        <p className="text-3xl font-bold text-foreground leading-none">{value}</p>
      </div>

      <p className="text-xs text-muted-foreground font-medium">{sub}</p>
    </Card>
  );
}
