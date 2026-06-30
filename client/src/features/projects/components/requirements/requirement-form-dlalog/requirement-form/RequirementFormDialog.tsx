import { useCreateRequirementMutation } from "@features/projects/services/projectApi";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@shared/components/ui/dialog";

import RequirementForm, {
  type RequirementFormValues,
} from "../../requirement-form/RequirementForm";

type RequirementFormDialogProps = {
  projectId: string;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
};
const RequirementFormDialog = ({ projectId, isOpen, onOpenChange }: RequirementFormDialogProps) => {
  const [createRequirement, { isLoading: isCreating, isError }] = useCreateRequirementMutation();

  const handleSubmit = (data: RequirementFormValues) => {
    const payload = {
      projectId: Number(projectId),
      body: {
        project_role_id: data.role.id,
        requested_count: data.requiredCount,
        stack_ids: data.requiredSkills.map((skill) => skill.id),
      },
    };
    createRequirement(payload);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl max-w-md border-border-strong">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Raise a Request
          </DialogTitle>
        </DialogHeader>

        <RequirementForm
          projectId={projectId}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isCreating}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RequirementFormDialog;
