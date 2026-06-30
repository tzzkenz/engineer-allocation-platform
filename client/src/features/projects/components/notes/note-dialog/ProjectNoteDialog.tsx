import { useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@shared/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@shared/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";
import { Textarea } from "@shared/components/ui/textarea";

import { projectNoteSchema } from "../schema";

export type ProjectNoteFormValues = z.infer<typeof projectNoteSchema>;

type ProjectNoteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ProjectNoteFormValues) => void | Promise<void>;
  defaultValues?: Partial<ProjectNoteFormValues>;
  isSubmitting?: boolean;
};

const ProjectNoteDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isSubmitting = false,
}: ProjectNoteDialogProps) => {
  const isEdit = !!defaultValues;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectNoteFormValues>({
    resolver: zodResolver(projectNoteSchema),
    defaultValues: {
      type: "GENERAL",
      note: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        note: defaultValues?.note ?? "",
      });
    }
  }, [open, defaultValues, reset]);

  const handleDialogChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset({
        note: defaultValues?.note ?? "",
      });
    }

    onOpenChange(nextOpen);
  };

  const handleFormSubmit = async (values: ProjectNoteFormValues) => {
    await onSubmit(values);

    reset({
      note: "",
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Project Note" : "Project Note"}</DialogTitle>

          <DialogDescription>
            {isEdit ? "Update the project note." : "Add a note for this project."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel>Note Type</FieldLabel>

              <FieldContent>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select note type" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="GENERAL">General</SelectItem>

                        <SelectItem value="PERFORMANCE">Performance</SelectItem>

                        <SelectItem value="ISSUE">Issue</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

                <FieldError errors={[errors.type]} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="note">Note</FieldLabel>

              <FieldContent>
                <Textarea
                  id="note"
                  rows={6}
                  placeholder="Enter your project note..."
                  {...register("note")}
                />

                <FieldError errors={[errors.note]} />
              </FieldContent>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleDialogChange(false)}>
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isEdit ? "Update Note" : "Save Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectNoteDialog;
