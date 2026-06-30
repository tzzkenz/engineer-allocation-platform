import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Field, FieldContent, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Controller, useForm } from "react-hook-form";

export type AssignEngineerFormValues = {
  startDate: string;
  shadowAssignment: boolean;
};

type AssignEngineerConfirmationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultRole?: string;
  onSubmit: (values: AssignEngineerFormValues) => void;
  isSubmitting: boolean;
};

export default function AssignFormDialog({
  open,
  onOpenChange,
  defaultRole = "",
  onSubmit,
  isSubmitting = false,
}: AssignEngineerConfirmationDialogProps) {
  const { register, control, handleSubmit } = useForm<AssignEngineerFormValues>({
    defaultValues: {
      startDate: "",
      shadowAssignment: false,
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Engineer</DialogTitle>

          <DialogDescription>
            Configure the assignment before assigning the engineer to this project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Field>
            <FieldLabel>Start Date</FieldLabel>

            <FieldContent>
              <Input type="date" {...register("startDate")} />
            </FieldContent>
          </Field>

          <Field orientation="horizontal">
            <Controller
              control={control}
              name="shadowAssignment"
              render={({ field }) => (
                <>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />

                  <FieldLabel>Shadow Assignment</FieldLabel>
                </>
              )}
            />
          </Field>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Assigning" : "Assign Engineer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
