import { useState } from "react";

import ProjectPermissionGate from "@/entities/auth/components/project-permission-gate/ProjectPermissionGate";
import type { AssignedEmployeeResponse } from "@/entities/project/types/apiTypes";
import DeleteConfirmationDialog from "@/shared/components/confirm-dlalog/DeleteConfirmationDialog";
import { Button } from "@/shared/components/ui/button";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router";

import { useRevokeEmployeeMutation } from "../../services/projectApi";
import AssignedEngineerTable from "../assigned-engineer-table/AssignedEngineerTable";
import { SectionCard, SectionCardInner, SectionHeader } from "../section/SectionCard";

type ProjectEmployeesProps = {
  employees: AssignedEmployeeResponse[];
};

const ProjectEmployees = ({ employees }: ProjectEmployeesProps) => {
  const navigate = useNavigate();

  const [revokeEmployee, { isLoading: isRevokeLoading }] = useRevokeEmployeeMutation();
  const [pendingDelete, setPendingDelete] = useState<AssignedEmployeeResponse | null>(null);

  const handleClear = () => {
    setPendingDelete(null);
  };

  const handleRemoveClick = (employee: AssignedEmployeeResponse) => {
    setPendingDelete(employee);
  };

  const handleConfirmDelete = async () => {
    try {
      await revokeEmployee({
        project_id: pendingDelete!.project_id,
        employee_id: pendingDelete!.employee.id,
        project_role_id: pendingDelete!.project_role_id,
      }).unwrap();

      setPendingDelete(null);
    } catch (err) {}
  };

  return (
    <>
      <SectionCard>
        <SectionCardInner>
          <SectionHeader title="Project Engineers" />

          <AssignedEngineerTable
            employees={employees}
            renderActions={(engineer) => (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/employee/${engineer.employee.id}`)}
                >
                  <Eye />
                </Button>
                <ProjectPermissionGate>
                  <Button variant="destructive" onClick={() => handleRemoveClick(engineer)}>
                    Remove
                  </Button>
                </ProjectPermissionGate>
              </>
            )}
          />
        </SectionCardInner>

        <DeleteConfirmationDialog
          open={!!pendingDelete}
          onConfirm={handleConfirmDelete}
          onOpenChange={handleClear}
          isDeleting={isRevokeLoading}
          title="Remove Employee"
          description={`Are you sure you want to remove ${pendingDelete?.employee.name} from this project? This action cannot be undone.`}
        />
      </SectionCard>
    </>
  );
};

export default ProjectEmployees;
