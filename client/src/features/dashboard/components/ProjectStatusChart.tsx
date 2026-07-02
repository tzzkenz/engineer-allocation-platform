import type { ProjectStatus } from "@/entities/project/types/apiTypes";
import { PROJECT_STATUS_BADGE_CLASSES } from "@/entities/project/utils/status";
import { List } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { Card, CardContent, CardHeader } from "@shared/components/ui/card";

// const data = [
//   { name: "Active", value: 8, color: "#4648D4" },
//   { name: "Closed", value: 40, color: "#e2e4ea" },
// ];

type ProjectStatusProps = {
  data: { name: string; value: number; status: ProjectStatus }[];
  total: number;
};

// const TOTAL = data.reduce((s, d) => s + d.value, 0);

export function ProjectStatusChart({ data, total }: ProjectStatusProps) {
  console.log(PROJECT_STATUS_BADGE_CLASSES, data);
  return (
    <Card className=" rounded-2xl flex flex-col gap-4">
      <CardHeader className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">Project Status</h3>
        <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground">
          <List className="size-4" />
        </button>
      </CardHeader>

      <CardContent className="flex items-center gap-6">
        <div className="relative shrink-0 size-36">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={44}
                outerRadius={68}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={PROJECT_STATUS_BADGE_CLASSES[entry.status]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-foreground leading-none">{total}</span>
            <span className="text-[10px] font-extrabold tracking-widest text-muted-foreground uppercase mt-0.5">
              Total
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 flex-1">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: PROJECT_STATUS_BADGE_CLASSES[d.status] }}
                />
                <span className="text-sm text-muted-foreground">{d.name}</span>
              </div>
              <span className="text-sm font-bold text-foreground tabular-nums">
                {String(d.value).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
