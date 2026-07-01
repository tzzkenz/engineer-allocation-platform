import { LayoutList } from "lucide-react";

import { Card, CardContent, CardHeader } from "@shared/components/ui/card";

type EngineerDistributionProps = {
  roles: { label: string; count: number; max: number }[];
};
export function EngineerDistribution({ roles }: EngineerDistributionProps) {
  return (
    <Card
      className="rounded-2xl p-6 flex flex-col gap-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <CardHeader className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">Engineer Distribution</h3>
        <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground">
          <LayoutList className="size-4" />
        </button>
      </CardHeader>

      <CardContent className="flex flex-col gap-3.5">
        {roles.map((r) => (
          <div key={r.label} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground font-medium">{r.label}</span>
              <span className="text-sm font-bold text-foreground tabular-nums">{r.count}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${(r.count / r.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
