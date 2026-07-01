import {
  useCreateRequirementMutation,
  useUpdateRequirementMutation,
} from "@features/projects/services/projectApi";

import type { RequirementResponse } from "@entities/project/types/apiTypes";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@shared/components/ui/dialog";

import RequirementForm, {
  type RequirementFormValues,
} from "../../requirement-form/RequirementForm";

type RequirementFormDialogProps = {
  projectId: string;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  requirement?: RequirementResponse;
};

const RequirementFormDialog = ({
  projectId,
  isOpen,
  onOpenChange,
  requirement,
}: RequirementFormDialogProps) => {
  const isEdit = !!requirement;

  const [createRequirement, { isLoading: isCreating }] = useCreateRequirementMutation();

  const [updateRequirement, { isLoading: isUpdating }] = useUpdateRequirementMutation();

  const handleSubmit = async (data: RequirementFormValues) => {
    const body = {
      project_role_id: data.role.id,
      requested_count: data.requiredCount,
      stack_ids: data.requiredSkills.map((skill) => skill.id),
    };

    if (isEdit) {
      await updateRequirement({
        requestId: requirement.id,
        body,
      });
    } else {
      await createRequirement({
        projectId: Number(projectId),
        body,
      });
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl border-border-strong">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            {isEdit ? "Edit Requirement" : "Raise a Requirement"}
          </DialogTitle>
        </DialogHeader>

        <RequirementForm
          projectId={projectId}
          defaultValues={
            requirement
              ? {
                  role: requirement.project_role_id.toString(),
                  requiredCount: requirement.requested_count,
                  requiredSkills: requirement.stack_requests.map((stack) => ({
                    id: stack.id,
                    name: stack.stack_name,
                  })),
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isCreating || isUpdating}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RequirementFormDialog;
