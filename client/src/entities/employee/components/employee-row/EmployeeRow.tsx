import type { ReactNode } from "react";

import { TableCell, TableRow } from "@/shared/components/ui/table";

import type { EmployeeResponse } from "../../types/apiTypes";
import StatusBadge from "../status-badge/StatusBadge";

type EngineerRowProps = {
  engineer: EmployeeResponse;
  actions?: ReactNode;
};
const EmployeeRow = ({ engineer, actions }: EngineerRowProps) => {
  return (
    <TableRow key={engineer.id}>
      <TableCell>
        <div className="flex items-center gap-3">
          <div>
            <p className="font-medium">{engineer.name}</p>

            <p className="text-xs text-muted-foreground">{engineer.email}</p>
          </div>
        </div>
      </TableCell>

      <TableCell>{engineer.system_role_name}</TableCell>

      <TableCell>{engineer.experience}</TableCell>

      <TableCell>{engineer.active_project_count}</TableCell>

      <TableCell>
        <StatusBadge status={engineer.active_project_count < 2 ? "AVAILABLE" : "BUSY"} />
      </TableCell>

      <TableCell className="text-right">{actions}</TableCell>
    </TableRow>
  );
};

export default EmployeeRow;
