import { useGetSkillsQuery } from "@/entities/config/services/configApi";
import type { Skill } from "@/entities/config/types/apiTypes";
import { transformByType } from "@/entities/config/utils/transform";
import type { ProjectStatus } from "@/entities/project/types/apiTypes";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/shared/components/ui/combobox";
import { Search } from "lucide-react";

import { PROJECT_STATUSES, PROJECT_STATUS_LABELS } from "@entities/project/utils/status";

import { Input } from "@shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";

type ProjectFilters = {
  identifier: string;
  skills: Skill[];
  status: ProjectStatus | "all";
};

type ProjectFiltersProps = {
  filters: ProjectFilters;
  onFilterChange: (name: keyof ProjectFilters, value: any) => void;
};

const ProjectFilters = ({ filters, onFilterChange }: ProjectFiltersProps) => {
  const { data: skills = [] } = useGetSkillsQuery();

  const { stacks } = transformByType(skills);

  const anchor = useComboboxAnchor();

  return (
    <div className="flex flex-col justify-center gap-4 p-4 bg-primary-foreground">
      <div className=" flex ">
        <div className="relative flex-1 min-w-3xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2" />

          <Input
            placeholder="Quick filter project name..."
            value={filters.identifier}
            onChange={(e) => onFilterChange("identifier", e.target.value)}
            className="h-auto border-0 bg-background py-2.5 pl-9 shadow-none focus-visible:ring-0"
          />
        </div>

        <Select value={filters.status} onValueChange={(value) => onFilterChange("status", value)}>
          <SelectTrigger className="h-auto w-auto gap-2 border-0 bg-background py-2 shadow-none focus-visible:ring-0">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>

            {PROJECT_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {PROJECT_STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Combobox
        multiple
        items={stacks}
        value={filters.skills}
        onValueChange={(values: Skill[]) => onFilterChange("skills", values)}
        autoHighlight
      >
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values: Skill[]) => (
              <>
                {values.map((skill) => (
                  <ComboboxChip key={skill.id}>{skill.name}</ComboboxChip>
                ))}

                <ComboboxChipsInput placeholder="Technology Stack..." />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>

        <ComboboxContent anchor={anchor}>
          <ComboboxInput placeholder="Search technology..." />

          <ComboboxEmpty>No technologies found.</ComboboxEmpty>

          <ComboboxList>
            {(item: Skill) => (
              <ComboboxItem key={item.id} value={item}>
                {item.name}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
};

export default ProjectFilters;
