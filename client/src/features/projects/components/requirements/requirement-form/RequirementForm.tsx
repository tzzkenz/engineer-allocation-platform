import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@shared/components/ui/button";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@shared/components/ui/combobox";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@shared/components/ui/field";
import { Input } from "@shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";

import { requirementSchema } from "../schema";

const skills = ["React", "TypeScript", "Node.js", "Python", "Docker"] as const;
const roles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "QA Engineer",
  "DevOps Engineer",
  "UI/UX Designer",
];
export type RequirementFormValues = z.infer<typeof requirementSchema>;

type RequirementFormProps = {
  defaultValues?: Partial<RequirementFormValues>;
  onSubmit: (values: RequirementFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
  onCancel: () => void;
};

const RequirementForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: RequirementFormProps) => {
  const anchor = useComboboxAnchor();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RequirementFormValues>({
    resolver: zodResolver(requirementSchema),
    defaultValues: {
      role: "",
      requiredCount: 1,
      requiredSkills: [],
      ...defaultValues,
    },
  });

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
      <FieldGroup>
        <Field>
          <FieldLabel>Role</FieldLabel>

          <FieldContent>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className=" w-full bg-secondary">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>

                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <FieldError errors={[errors.role]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="requiredCount">Required Count</FieldLabel>

          <FieldContent>
            <Input
              id="requiredCount"
              type="number"
              min={1}
              {...register("requiredCount", {
                valueAsNumber: true,
              })}
            />
            <FieldError errors={[errors.requiredCount]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Required Skills</FieldLabel>

          <FieldContent className=" bg-secondary">
            <Controller
              control={control}
              name="requiredSkills"
              render={({ field }) => (
                <Combobox
                  multiple
                  items={skills}
                  value={field.value}
                  onValueChange={(value, event) => {
                    console.log(value);
                    field.onChange(value, event);
                  }}
                  autoHighlight
                >
                  <ComboboxChips ref={anchor}>
                    <ComboboxValue>
                      {(values) => (
                        <>
                          {values.map((value) => (
                            <ComboboxChip key={value}>{value}</ComboboxChip>
                          ))}

                          <ComboboxChipsInput
                            placeholder={
                              values.length === 0 ? "Select required skills..." : undefined
                            }
                          />
                        </>
                      )}
                    </ComboboxValue>
                  </ComboboxChips>

                  <ComboboxContent anchor={anchor}>
                    <ComboboxEmpty>No skills found.</ComboboxEmpty>

                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item} value={item}>
                          {item}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              )}
            />

            <FieldError errors={[errors.requiredSkills]} />
          </FieldContent>
        </Field>
      </FieldGroup>
      <div className=" flex justify-end">
        <Button type="button" onClick={handleCancel} variant="ghost" className="rounded-xl">
          Cancel
        </Button>
        <Button
          type="submit"
          className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Raise Request
        </Button>
      </div>
    </form>
  );
};

export default RequirementForm;
