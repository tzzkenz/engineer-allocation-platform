import type { ReactNode } from "react";

import { formatDate } from "@/shared/lib/format";

import type { AssignedEmployeeResponse } from "@entities/project/types/apiTypes";

import { TableCell, TableRow } from "@shared/components/ui/table";

type EngineerRowProps = {
  engineer: AssignedEmployeeResponse;
  actions?: ReactNode;
};
const AssignedEmployeeRow = ({ engineer, actions }: EngineerRowProps) => {
  return (
    <TableRow key={engineer.id}>
      <TableCell>
        <div className="flex items-center gap-3">
          <div>
            <p className="font-medium">{engineer.employee.name}</p>

            <p className="text-xs text-muted-foreground">{engineer.employee.email}</p>
          </div>
        </div>
      </TableCell>

      <TableCell>{engineer.project_role_name}</TableCell>

      <TableCell>{formatDate(engineer.date_assigned)}</TableCell>

      <TableCell>{formatDate(engineer.start_date)}</TableCell>

      <TableCell className="text-right flex justify-end items-center">{actions}</TableCell>
    </TableRow>
  );
};

export default AssignedEmployeeRow;
