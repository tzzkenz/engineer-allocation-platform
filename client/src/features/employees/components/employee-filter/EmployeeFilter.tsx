import { Input } from "@/shared/components/ui/input";
import { Search } from "lucide-react";

import { useGetSkillsQuery } from "@entities/config/services/configApi";
import { useGetSystemRolesQuery } from "@entities/config/services/configApi";
import type { Skill } from "@entities/config/types/apiTypes";
import type { SystemRoleResponseWithDatesResponse } from "@entities/config/types/apiTypes";
import { transformByType } from "@entities/config/utils/transform";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@shared/components/ui/combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";

export type EmployeeFilters = {
  identifier: string;
  systemRoleId: number | null;
  stacks: Skill[];
  technicals: Skill[];
  nonTechnicals: Skill[];
};

type EmployeeFiltersProps = {
  filters: EmployeeFilters;
  onFilterChange: (name: keyof EmployeeFilters, value: any) => void;
};

const EmployeeFilters = ({ filters, onFilterChange }: EmployeeFiltersProps) => {
  const { data: skills = [] } = useGetSkillsQuery();
  const { data: roles = [] } = useGetSystemRolesQuery();

  const { stacks, technical, nonTechnical } = transformByType(skills);

  const multiSelectConfig = [
    {
      name: "Technical",
      values: technical,
      fieldName: "technicals",
      selected: filters.technicals,
      anchor: useComboboxAnchor(),
    },
    {
      name: "Non Technical",
      values: nonTechnical,
      fieldName: "nonTechnicals",
      selected: filters.nonTechnicals,
      anchor: useComboboxAnchor(),
    },
    {
      name: "Stacks",
      values: stacks,
      fieldName: "stacks",
      selected: filters.stacks,
      anchor: useComboboxAnchor(),
    },
  ];
  return (
    <div className="flex flex-col gap-4 bg-primary-foreground p-4">
      <div className="flex gap-4">
        <div className="relative flex-1 min-w-3xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2" />

          <Input
            placeholder="Search by ID, email or name..."
            value={filters.identifier}
            onChange={(e) => onFilterChange("identifier", e.target.value)}
            className="h-auto border-0 bg-background py-2.5 pl-9 shadow-none focus-visible:ring-0"
          />
        </div>

        <Select
          value={filters.systemRoleId?.toString() ?? "all"}
          onValueChange={(value) =>
            onFilterChange("systemRoleId", value === "all" ? null : Number(value))
          }
        >
          <SelectTrigger className="h-auto w-56 border-0 bg-background py-2 shadow-none focus-visible:ring-0">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>

            {roles.map((role: SystemRoleResponseWithDatesResponse) => (
              <SelectItem key={role.id} value={role.id.toString()}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className=" grid grid-cols-3">
        {multiSelectConfig.map((eachConfig) => (
          <Combobox
            multiple
            items={eachConfig.values}
            value={eachConfig.selected}
            onValueChange={(values: Skill[]) => onFilterChange(eachConfig.fieldName, values)}
            autoHighlight
          >
            <ComboboxChips ref={eachConfig.anchor}>
              <ComboboxValue>
                {(values: Skill[]) => (
                  <>
                    {values.map((skill) => (
                      <ComboboxChip key={skill.id}>{skill.name}</ComboboxChip>
                    ))}

                    <ComboboxChipsInput placeholder={`Filter by ${eachConfig.name}...`} />
                  </>
                )}
              </ComboboxValue>
            </ComboboxChips>

            <ComboboxContent anchor={eachConfig.anchor}>
              <ComboboxInput placeholder="Search technologies..." />

              <ComboboxEmpty>No {eachConfig.name} found.</ComboboxEmpty>

              <ComboboxList>
                {(item: Skill) => (
                  <ComboboxItem key={item.id} value={item}>
                    {item.name}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        ))}
      </div>
    </div>
  );
};

export default EmployeeFilters;
