import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

import { Button } from "../ui/button";

interface IconButtonProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  varient?: "ghost" | "link" | "default" | "outline" | "secondary" | "destructive";
  className?: string;
}

export function IconButton({
  icon,
  label,
  varient = "ghost",
  onClick,
  className,
}: IconButtonProps) {
  return (
    <Button
      variant={varient}
      size="sm"
      onClick={onClick}
      className={cn(
        "h-auto gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-widest",
        className
      )}
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {icon}
      {label}
    </Button>
  );
}
