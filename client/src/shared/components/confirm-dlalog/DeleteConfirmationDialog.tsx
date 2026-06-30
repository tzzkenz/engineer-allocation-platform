import { Loader2, TriangleAlert } from "lucide-react";

import { Button } from "@shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shared/components/ui/dialog";

type DeleteConfirmationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  isDeleting?: boolean;

  title?: string;
  description?: string;

  confirmText?: string;
  cancelText?: string;
};

const DeleteConfirmationDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isDeleting = false,
  title = "Delete Item",
  description = "This action cannot be undone. This item will be permanently deleted.",
  confirmText = "Delete",
  cancelText = "Cancel",
}: DeleteConfirmationDialogProps) => {
  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isDeleting) {
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex justify-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
              <TriangleAlert className="size-6 text-destructive" />
            </div>
          </div>

          <DialogTitle className="text-center">{title}</DialogTitle>

          <DialogDescription className="text-center">{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-center">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            {cancelText}
          </Button>

          <Button variant="destructive" onClick={handleConfirm} disabled={isDeleting}>
            {isDeleting && <Loader2 className="mr-2 size-4 animate-spin" />}
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
