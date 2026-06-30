import { Search } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { Checkbox } from "@shared/components/ui/checkbox";
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
import { Field, FieldContent, FieldGroup, FieldLabel } from "@shared/components/ui/field";
import { Input } from "@shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";

type AssignEngineerFilters = {
  search: string;
  role: string;
  availability: string;
  sortExperience: string;
  sortProficiency: string;
  skills: string[];
  shadowAssignment: boolean;
  startDate: string;
};

const availableSkills = ["React", "TypeScript", "FastAPI", "Python", "AWS", "Docker"];

const AdvancedFilters = () => {
  const anchor = useComboboxAnchor();

  const { register, control, watch } = useForm<AssignEngineerFilters>({
    defaultValues: {
      search: "",
      role: "",
      availability: "available",
      sortExperience: "high-low",
      sortProficiency: "highest",
      skills: [],
      shadowAssignment: false,
      startDate: "",
    },
  });

  const filters = watch();

  return (
    <FieldGroup className="grid grid-cols-4 gap-6">
      <Field className="col-span-2">
        <FieldLabel>Search Engineer</FieldLabel>

        <FieldContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              placeholder="Search by name or email..."
              className="pl-10"
              {...register("search")}
            />
          </div>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Experience</FieldLabel>

        <FieldContent>
          <Controller
            control={control}
            name="sortExperience"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="high-low">Highest → Lowest</SelectItem>

                  <SelectItem value="low-high">Lowest → Highest</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Role</FieldLabel>

        <FieldContent>
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Developer">Developer</SelectItem>

                  <SelectItem value="QA">QA</SelectItem>

                  <SelectItem value="DevOps">DevOps</SelectItem>

                  <SelectItem value="Designer">Designer</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Availability</FieldLabel>

        <FieldContent>
          <Controller
            control={control}
            name="availability"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FieldContent>
      </Field>

      <Field className="col-span-3">
        <FieldLabel>Skills</FieldLabel>

        <FieldContent>
          <Controller
            control={control}
            name="skills"
            render={({ field }) => (
              <Combobox
                multiple
                items={availableSkills}
                value={field.value}
                onValueChange={field.onChange}
                autoHighlight
              >
                <ComboboxChips ref={anchor}>
                  <ComboboxValue>
                    {(values: string[]) => (
                      <>
                        {values.map((skill) => (
                          <ComboboxChip key={skill}>{skill}</ComboboxChip>
                        ))}

                        <ComboboxChipsInput placeholder="Select skills..." />
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
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Proficiency</FieldLabel>

        <FieldContent>
          <Controller
            control={control}
            name="sortProficiency"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="highest">Highest</SelectItem>

                  <SelectItem value="lowest">Lowest</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FieldContent>
      </Field>

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
    </FieldGroup>
  );
};

export default AdvancedFilters;
