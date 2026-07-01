import { CheckCircle, Pencil } from "lucide-react";

import type { BaseProject, ProjectStatus } from "@entities/project/types/apiTypes";

import { IconButton } from "@shared/components/icon-button/IconButton";
import { formatDate } from "@shared/lib/format";

import { getProjectStatusAction } from "../../utils/action";
import { getProjectDateRange } from "../../utils/duration";
import { InfoField } from "../info-card/InfoCard";
import { SectionCard, SectionCardInner, SectionHeader } from "../section/SectionCard";

interface ProjectInfoCardProps {
  project: BaseProject;
  onEdit?: () => void;
  onUpdateStatus?: (status: ProjectStatus) => void;
}

export function ProjectInfoCard({ project, onEdit, onUpdateStatus }: ProjectInfoCardProps) {
  const action = getProjectStatusAction(project.status);

  const handleUpdateStatus = () => {
    if (onUpdateStatus && action) {
      onUpdateStatus(action.status);
    }
  };
  return (
    <SectionCard>
      <SectionCardInner>
        <SectionHeader
          title="Project Information"
          actions={
            <>
              <IconButton
                varient="outline"
                className=" text-primary"
                icon={<Pencil className="size-3.5" />}
                label="Edit Project"
                onClick={onEdit}
              />
              {action && (
                <IconButton
                  varient="outline"
                  className={action.className}
                  icon={action.icon}
                  label={action.label}
                  onClick={handleUpdateStatus}
                />
              )}
            </>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 w-full">
          <InfoField label="Project Name" value={project.name} />
          <InfoField label="Duration" value={project.duration || "N/A"} />
          <InfoField label="Start Date" value={formatDate(project.start_date) || "N/A"} />
          <InfoField
            label="End Date"
            value={formatDate(getProjectDateRange(project.start_date, project.duration).endDate)}
          />
        </div>
      </SectionCardInner>
    </SectionCard>
  );
}
