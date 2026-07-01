import type { AssignedEmployeeResponse } from "@/entities/project/types/apiTypes";
import { Button } from "@/shared/components/ui/button";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router";

import AssignedEngineerTable from "../assigned-engineer-table/AssignedEngineerTable";
import { SectionCard, SectionCardInner, SectionHeader } from "../section/SectionCard";

type ProjectEmployeesProps = {
  employees: AssignedEmployeeResponse[];
};

const ProjectEmployees = ({ employees }: ProjectEmployeesProps) => {
  const navigate = useNavigate();

  return (
    <>
      <SectionCard>
        <SectionCardInner>
          <SectionHeader title="Project Engineers" />

          <AssignedEngineerTable
            employees={employees}
            renderActions={(engineer) => (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/employee/${engineer.employee.id}`)}
              >
                <Eye />
              </Button>
            )}
          />
        </SectionCardInner>
      </SectionCard>
    </>
  );
};

export default ProjectEmployees;
