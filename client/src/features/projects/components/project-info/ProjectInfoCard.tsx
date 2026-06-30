import { CheckCircle, Pencil } from "lucide-react";

import { IconButton } from "@shared/components/icon-button/IconButton";

import { type ProjectDetail } from "../../data/data";
import { InfoField } from "../info-card/InfoCard";
import { SectionCard, SectionCardInner, SectionHeader } from "../section/SectionCard";

interface ProjectInfoCardProps {
  project: ProjectDetail;
  onEdit?: () => void;
  onMarkComplete?: () => void;
}

export function ProjectInfoCard({ project, onEdit, onMarkComplete }: ProjectInfoCardProps) {
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
              <IconButton
                varient="outline"
                className=" bg-green-100 text-green-600"
                icon={<CheckCircle className="size-3.5" />}
                label="Mark as Completed"
                onClick={onMarkComplete}
              />
            </>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 w-full">
          <InfoField label="Project Name" value={project.name} />
          <InfoField label="Duration" value={project.duration} />
          <InfoField label="Start Date" value={project.startDate} />
          <InfoField label="End Date" value={project.endDate} />
        </div>
      </SectionCardInner>
    </SectionCard>
  );
}
