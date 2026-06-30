import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";

import RequirementForm from "../../requirement-form/RequirementForm";

type RequirementFormDialogProps = {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
};
const RequirementFormDialog = ({ isOpen, onOpenChange }: RequirementFormDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl max-w-md border-border-strong">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Raise a Request
          </DialogTitle>
        </DialogHeader>

        <RequirementForm onSubmit={console.log} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default RequirementFormDialog;
