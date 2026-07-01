import { PROJECT_STATUS_LABELS } from "@/entities/project/utils/status";

import type { Project } from "@entities/project/types/apiTypes";

import { getProjectDateRange } from "../../utils/duration";

type DurationCellProps = {
  project: Project;
};

const MS_PER_WEEK = 1000 * 60 * 60 * 24 * 7;

const DurationCell = ({ project }: DurationCellProps) => {
  const now = new Date();

  const { startDate, endDate } = getProjectDateRange(project.start_date, project.duration);

  const totalDurationMs = endDate.getTime() - startDate.getTime();
  const elapsedDurationMs = now.getTime() - startDate.getTime();

  const pct =
    project.duration === 0 || totalDurationMs <= 0
      ? 0
      : Math.min(100, Math.max(0, (elapsedDurationMs / totalDurationMs) * 100));

  const totalWeeks = Math.max(1, Math.ceil(totalDurationMs / MS_PER_WEEK));

  const elapsedWeeks = Math.max(
    0,
    Math.min(totalWeeks, Math.floor(elapsedDurationMs / MS_PER_WEEK))
  );

  const barColor = project.status === PROJECT_STATUS_LABELS.NOT_STARTED ? "#767586" : "#4648d4";

  return (
    <div className="flex flex-col gap-2">
      <span className="text-base font-medium">
        {elapsedWeeks} / {totalWeeks} Weeks
      </span>

      <div className="h-1.5 w-full min-w-[80px] overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${pct}%`,
            backgroundColor: barColor,
          }}
        />
      </div>
    </div>
  );
};

export default DurationCell;
