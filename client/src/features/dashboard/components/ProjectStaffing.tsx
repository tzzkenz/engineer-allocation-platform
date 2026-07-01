import { cn } from "@shared/lib/utils";

type StaffingStatus = "full" | "understaffed" | "overstaffed";

interface StaffingRow {
  project: string;
  assigned: number;
  required: number;
  status: StaffingStatus;
}

const rows: StaffingRow[] = [
  { project: "Inventory Sys", assigned: 6, required: 6, status: "full" },
  { project: "Mobile Pay", assigned: 4, required: 4, status: "full" },
  { project: "AI Analytics", assigned: 0, required: 5, status: "understaffed" },
];

const statusLabel: Record<StaffingStatus, { text: string; className: string }> = {
  full: { text: "Full", className: "text-green-700 bg-green-100" },
  understaffed: { text: "0 Needed", className: "text-destructive bg-red-100" },
  overstaffed: { text: "Overstaffed", className: "text-amber-700 bg-amber-100" },
};

function StaffingBar({ row }: { row: StaffingRow }) {
  const assignedPct = row.required === 0 ? 0 : (row.assigned / row.required) * 100;
  const isUnderstaffed = row.status === "understaffed";
  const { text, className } = statusLabel[row.status];

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{row.project}</span>
        <span
          className={cn(
            "text-[10px] font-extrabold tracking-wide uppercase px-2 py-0.5 rounded-full",
            className
          )}
        >
          {text}
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            isUnderstaffed ? "bg-destructive" : "bg-primary"
          )}
          style={{ width: `${Math.max(assignedPct, isUnderstaffed ? 0 : 100)}%` }}
        />
      </div>
    </div>
  );
}

export function ProjectStaffing() {
  return (
    <div
      className="bg-surface rounded-2xl p-6 border border-white/40 flex flex-col gap-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <h3 className="text-base font-semibold text-foreground">
        Project Staffing{" "}
        <span className="text-muted-foreground font-normal text-sm">(Assigned vs Required)</span>
      </h3>

      <div className="flex flex-col gap-4">
        {rows.map((r) => (
          <StaffingBar key={r.project} row={r} />
        ))}
      </div>
    </div>
  );
}
