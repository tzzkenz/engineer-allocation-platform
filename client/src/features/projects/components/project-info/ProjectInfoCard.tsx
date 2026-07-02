import { useState } from "react";

import PermissionGate from "@/entities/auth/components/permission-gate/PermissionGate";
import { SYSTEM_ROLES } from "@/entities/config/lib/roles";
import {
  PROJECT_STATUS_BADGE_CLASSES,
  PROJECT_STATUS_LABELS,
} from "@/entities/project/utils/status";
import DeleteConfirmationDialog from "@/shared/components/confirm-dlalog/DeleteConfirmationDialog";
import { Badge } from "@/shared/components/ui/badge";
import { useAppSelector } from "@/store/store";
import { CheckCircle, Delete, Pencil, Trash } from "lucide-react";
import { useNavigate } from "react-router";

import type { BaseProject, ProjectStatus } from "@entities/project/types/apiTypes";

import { IconButton } from "@shared/components/icon-button/IconButton";
import { formatDate } from "@shared/lib/format";

import { useDeleteProjectMutation, useEditProjectMutation } from "../../services/projectEditApi";
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
  const navigate = useNavigate();
  const action = getProjectStatusAction(project.status);
  const [updateProject, { isLoading: isUpdating }] = useEditProjectMutation();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleUpdateStatus = async () => {
    console.log("Updating project status to:", action?.status);
    if (action) {
      await updateProject({ projectId: project.id, status: action.status }).unwrap();
    }
  };

  const handleDeleteClick = async () => {
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirmation = async () => {
    try {
      console.log("Deleting project with ID:", project.id);
      await deleteProject(project.id.toString()).unwrap();

      navigate("/");

      setShowDeleteConfirmation(false);
    } catch (err) {}
  };
  return (
    <SectionCard>
      <SectionCardInner>
        <SectionHeader
          title="Project Information"
          actions={
            <>
              <Badge className={PROJECT_STATUS_BADGE_CLASSES[project.status]}>
                {PROJECT_STATUS_LABELS[project.status]}
              </Badge>

              <PermissionGate requiredRoles={[SYSTEM_ROLES.HR]}>
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

                <IconButton
                  varient="destructive"
                  className=""
                  icon={<Trash size="3.5" />}
                  label="Discard Project"
                  onClick={handleDeleteClick}
                />
              </PermissionGate>
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

      <DeleteConfirmationDialog
        open={showDeleteConfirmation}
        onOpenChange={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDeleteConfirmation}
        isDeleting={isDeleting}
        title="Are you sure you want to discard this project?"
        description="This action cannot be undone. This will permanently delete the project and all associated data."
      />
    </SectionCard>
  );
}
