import { useState } from "react";

import type { RequirementResponse } from "@/entities/project/types/apiTypes";
import { UserPlus } from "lucide-react";

import { useGetSkillsQuery } from "@entities/config/services/configApi";
import EmployeeTable from "@entities/employee/components/employee-table/EmployeeTable";
import type {
  AdvanceSearchEmployeeParams,
  EmployeeResponse,
} from "@entities/employee/types/apiTypes";

import { Button } from "@shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shared/components/ui/dialog";

import { useAssignEmployeeMutation, useGetCandidatesQuery } from "../../services/projectApi";
import AdvancedFilters, { type AssignEngineerFilters } from "../advanced-filter/AdvancedFilters";
import AssignFormDialog, {
  type AssignEngineerFormValues,
} from "../assign-form-dialog/AssignFormDialog";

type AssignEngineerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (engineer: EmployeeResponse) => void;
  requirement: RequirementResponse;
};

const getFormattedFilters = (filters: AssignEngineerFilters): AdvanceSearchEmployeeParams => ({
  identifier: filters.search.trim() == "" ? undefined : filters.search,
  availability: filters.availability,
  skill_ids: filters.skills.length > 0 ? filters.skills.map((skill) => skill.id) : undefined,
  sort_by_experience: filters.sortExperience == "low-high",
  sort_by_proficiency: filters.sortProficiency == "highest",
});

const prepareFilterQueryParams = (
  filters: AssignEngineerFilters,
  requirementId: number
): URLSearchParams => {
  const urlParams = new URLSearchParams();

  const formattedFilters = getFormattedFilters(filters);

  urlParams.set("requirement_request_id", String(requirementId));
  if (formattedFilters.identifier) {
    urlParams.set("identifier", formattedFilters.identifier);
  }

  if (formattedFilters.availability !== undefined) {
    urlParams.set("availability", String(formattedFilters.availability));
  }

  if (formattedFilters.sort_by_experience !== undefined) {
    urlParams.set("sort_by_experience", String(formattedFilters.sort_by_experience));
  }

  if (formattedFilters.sort_by_proficiency !== undefined) {
    urlParams.set("sort_by_proficiency", String(formattedFilters.sort_by_proficiency));
  }

  if (formattedFilters.skill_ids) {
    formattedFilters.skill_ids.forEach((skillId) => {
      urlParams.append("skill_ids", String(skillId));
    });
  }

  return urlParams;
};

export default function AssignEngineerDialog({
  open,
  onOpenChange,
  onAssign,
  requirement,
}: AssignEngineerDialogProps) {
  const [filters, setFilters] = useState<AssignEngineerFilters>({
    search: "",
    availability: "ALL",
    skills: [],
    sortExperience: "low-high",
    sortProficiency: "lowest",
  });

  const [assignEmployee, { isLoading: isAssigningEmployee }] = useAssignEmployeeMutation();
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeResponse | null>(null);

  const {
    data: employees = { items: [], page: 1, limit: 10, total: 0 },
    isLoading: isEmployeeLoading,
  } = useGetCandidatesQuery(prepareFilterQueryParams(filters, requirement.id).toString(), {
    skip: !open,
  });

  const { data: skills = [] } = useGetSkillsQuery();

  const handleClear = () => {
    setSelectedEmployee(null);
  };

  const handleAssignSubmit = async (values: AssignEngineerFormValues) => {
    if (!selectedEmployee) return;

    try {
      await assignEmployee({
        requirement_request_id: requirement.id,
        employees: [
          {
            employee_id: selectedEmployee?.id,
            is_shadow: values.shadowAssignment,
            start_date: values.startDate !== "" ? values.startDate : undefined,
          },
        ],
      }).unwrap();
      onAssign(selectedEmployee);
      handleClear();
    } catch (err) {}
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" sm:max-w-7xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <UserPlus className="size-5 text-primary" />
            </div>
            Assign Engineer
          </DialogTitle>

          <DialogDescription>Search and assign an engineer to the project.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="rounded-lg border p-6">
            <AdvancedFilters onSearch={setFilters} skills={skills} />
          </div>

          <EmployeeTable
            employees={employees.items}
            renderActions={(engineer) => (
              <Button onClick={() => setSelectedEmployee(engineer)}>Assign</Button>
            )}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
      <AssignFormDialog
        open={!!selectedEmployee}
        onOpenChange={handleClear}
        onSubmit={handleAssignSubmit}
        isSubmitting={isAssigningEmployee}
      />
    </Dialog>
  );
}
