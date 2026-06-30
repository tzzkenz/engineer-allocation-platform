import type { Skill } from "@/entities/config/types/apiTypes";
import type { AvailabilityFilterType } from "@/entities/employee/types/apiTypes";
import { Button } from "@/shared/components/ui/button";
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

export type AssignEngineerFilters = {
  search: string;
  availability: AvailabilityFilterType;
  sortExperience: "high-low" | "low-high";
  sortProficiency: "highest" | "lowest";
  skills: Skill[];
};

const availableSkills = ["React", "TypeScript", "FastAPI", "Python", "AWS", "Docker"];

type AdvancedFiltersProps = {
  onSearch: (filters: AssignEngineerFilters) => void;
  skills: Skill[];
};
const AdvancedFilters = ({ onSearch, skills }: AdvancedFiltersProps) => {
  const anchor = useComboboxAnchor();

  const { register, control, watch, getValues } = useForm<AssignEngineerFilters>({
    defaultValues: {
      search: "",
      availability: "ALL",
      sortExperience: "high-low",
      sortProficiency: "highest",
      skills: [],
    },
  });

  const handleSearch = () => {
    if (onSearch) onSearch(getValues());
  };

  return (
    <div className=" flex flex-col">
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
                    <SelectItem value="ALL">All</SelectItem>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="UNAVAILABLE">Busy</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FieldContent>
        </Field>

        <Field className="col-span-1">
          <FieldLabel>Skills</FieldLabel>

          <FieldContent>
            <Controller
              control={control}
              name="skills"
              render={({ field }) => (
                <Combobox
                  multiple
                  items={skills}
                  value={field.value}
                  onValueChange={field.onChange}
                  autoHighlight
                >
                  <ComboboxChips ref={anchor}>
                    <ComboboxValue>
                      {(values: Skill[]) => (
                        <>
                          {values.map((skill) => (
                            <ComboboxChip key={skill.id}>{skill.name}</ComboboxChip>
                          ))}

                          <ComboboxChipsInput placeholder="Select skills..." />
                        </>
                      )}
                    </ComboboxValue>
                  </ComboboxChips>

                  <ComboboxContent anchor={anchor}>
                    <ComboboxEmpty>No skills found.</ComboboxEmpty>

                    <ComboboxList>
                      {(item: Skill) => (
                        <ComboboxItem key={item.id} value={item}>
                          {item.name}
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
      </FieldGroup>
      <Button className=" w-32 self-end " type="button" onClick={handleSearch}>
        Search
      </Button>
    </div>
  );
};

export default AdvancedFilters;
