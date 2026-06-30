import { type ReactNode } from "react";

import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";

type SectionCardProps = {
  children: ReactNode;
  className?: string;
};

export function SectionCard({ children, className }: SectionCardProps) {
  return (
    <Card
      className={cn("relative rounded-3xl w-full ", className)}
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {children}
    </Card>
  );
}

type SectionCardInnerProps = {
  children: ReactNode;
  className?: string;
};

export function SectionCardInner({ children, className }: SectionCardInnerProps) {
  return (
    <CardContent className={cn("flex flex-col gap-8 items-start p-8 w-full", className)}>
      {children}
    </CardContent>
  );
}

type SectionHeaderProps = {
  title: string;
  actions?: ReactNode;
};

export function SectionHeader({ title, actions }: SectionHeaderProps) {
  return (
    <CardHeader className="flex items-center justify-between w-full">
      <h2 className="text-xl font-semibold text-foreground leading-6">{title}</h2>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </CardHeader>
  );
}
