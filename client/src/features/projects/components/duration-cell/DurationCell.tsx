import { PROJECT_STATUS_LABELS } from "@/entities/project/utils/status";

import type { Project } from "@entities/project/types/apiTypes";

import { getProjectDateRange } from "../../utils/duration";

type DurationCellProps = {
  project: Project;
};

const DurationCell = ({ project }: DurationCellProps) => {
  const now = new Date();
  const { startDate, endDate } = getProjectDateRange(project.start_date, project.duration);

  const pct =
    project.duration === 0
      ? 0
      : ((now.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime())) * 100;
  const barColor = project.status === PROJECT_STATUS_LABELS.NOT_STARTED ? "#767586" : "#4648d4";

  return (
    <div className="flex flex-col gap-2">
      <span className="text-base font-medium ">
        {Math.floor((pct / 100) * project.duration)} / {project.duration} Months
      </span>
      <div className="h-1.5 rounded-full  overflow-hidden w-full min-w-[80px]">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
};

export default DurationCell;
