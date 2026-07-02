import { useState } from "react";

import ProjectPermissionGate from "@/entities/auth/components/project-permission-gate/ProjectPermissionGate";
import type { EmployeeResponse } from "@/entities/employee/types/apiTypes";
import {
  useDeleteRequirementMutation,
  useUpdateRequirementMutation,
} from "@/features/projects/services/projectApi";
import DeleteConfirmationDialog from "@/shared/components/confirm-dlalog/DeleteConfirmationDialog";
import { Bell, Plus } from "lucide-react";

import type { RequirementResponse } from "@entities/project/types/apiTypes";

import { IconButton } from "@shared/components/icon-button/IconButton";

import AssignEngineerDialog from "../../assigned-engineer-card/AssignedEngineerCard";
import { SectionCard, SectionCardInner, SectionHeader } from "../../section/SectionCard";
import RequirementFormDialog from "../requirement-form-dlalog/requirement-form/RequirementFormDialog";
import { RequirementTable } from "../requirement-table/RequirementTable";

type RequirementsCardProps = {
  requirements: RequirementResponse[];
  projectId: string;
};

export function RequirementsCard({ requirements, projectId }: RequirementsCardProps) {
  const [updateRequirement, { isLoading: isUpdateLoading }] = useUpdateRequirementMutation();
  const [deleteRequirement, { isLoading: isDeleteLoading }] = useDeleteRequirementMutation();
  const [raiseOpen, setRaiseOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<RequirementResponse | null>(null);
  const [pendingEdit, setPendingEdit] = useState<RequirementResponse | null>(null);

  const [pendingDelete, setPendingDelete] = useState<RequirementResponse | null>(null);

  const handleAssignClick = (requirement: RequirementResponse) => {
    setSelectedRequirement(requirement);
  };

  const handleRemoveClick = (requirement: RequirementResponse) => {
    setPendingDelete(requirement);
  };

  const handleDeleteConfirm = async () => {
    if (!pendingDelete) return;

    try {
      await deleteRequirement(pendingDelete.id as number).unwrap();
      setPendingDelete(null);
    } catch (err) {}
  };

  const handleClear = () => {
    setSelectedRequirement(null);
  };

  const handleEditClick = (requirement: RequirementResponse) => {
    setRaiseOpen(true);
    setPendingEdit(requirement);
  };

  const handleCloseFormDialog = () => {
    setRaiseOpen(false);
    setPendingEdit(null);
  };

  const handleApproveClick = async (requirement: RequirementResponse) => {
    try {
      await updateRequirement({
        requestId: requirement.id as number,
        body: {
          status: "APPROVED",
        },
      }).unwrap();
    } catch (err) {}
  };

  return (
    <>
      <SectionCard>
        <SectionCardInner>
          <SectionHeader
            title="Project Requirements"
            actions={
              <ProjectPermissionGate>
                <IconButton
                  varient="outline"
                  icon={<Plus className="size-3.5" />}
                  label="Raise Request"
                  onClick={() => setRaiseOpen(true)}
                  className=" text-primary shadow-[6px_6px_12px_rgba(0,0,0,0.05),-6px_-6px_12px_rgba(255,255,255,0.8)]"
                />
              </ProjectPermissionGate>
            }
          />
          <RequirementTable
            requirements={requirements}
            onAssign={handleAssignClick}
            onRemove={handleRemoveClick}
            onEdit={handleEditClick}
            onApprove={handleApproveClick}
          />
        </SectionCardInner>
      </SectionCard>

      <RequirementFormDialog
        projectId={projectId}
        isOpen={raiseOpen}
        onOpenChange={handleCloseFormDialog}
        requirement={pendingEdit || undefined}
      />
      {selectedRequirement && (
        <AssignEngineerDialog
          requirement={selectedRequirement}
          open={true}
          onOpenChange={handleClear}
          onAssign={handleClear}
        />
      )}

      {pendingDelete && (
        <DeleteConfirmationDialog
          open={true}
          onOpenChange={() => setPendingDelete(null)}
          onConfirm={handleDeleteConfirm}
          isDeleting={isDeleteLoading}
          title="Delete Requirement"
          description={`Are you sure you want to delete the requirement? This action cannot be undone.`}
        />
      )}
    </>
  );
}
