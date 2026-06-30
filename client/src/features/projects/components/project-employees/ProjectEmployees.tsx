import EmployeeTable from "@/entities/employee/components/employee-table/EmployeeTable";
import type { EmployeeResponse } from "@/entities/employee/types/apiTypes";

import { SectionCard, SectionCardInner, SectionHeader } from "../section/SectionCard";

type ProjectEmployeesProps = {
  employees: EmployeeResponse[];
};
const ProjectEmployees = ({ employees }: ProjectEmployeesProps) => {
  return (
    <>
      <SectionCard>
        <SectionCardInner>
          <SectionHeader title="Project Engineers" />

          <EmployeeTable employees={employees} />
        </SectionCardInner>
      </SectionCard>
    </>
  );
};

export default ProjectEmployees;
