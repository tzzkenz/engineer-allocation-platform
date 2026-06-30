import type { ReactNode } from "react";

import { TechStackTag } from "@/entities/project/components/TechStack";
import { TableCell, TableRow } from "@/shared/components/ui/table";

import type { Engineer } from "../engineer-table/EngineerTable";
import StatusBadge from "../status-badge/StatusBadge";

type EngineerRowProps = {
  engineer: Engineer;
  actions?: ReactNode;
};
const EngineerRow = ({ engineer, actions }: EngineerRowProps) => {
  return (
    <TableRow key={engineer.id}>
      <TableCell>
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${engineer.avatarBg} ${engineer.avatarText}`}
          >
            {engineer.initials}
          </div>

          <div>
            <p className="font-medium">{engineer.name}</p>

            <p className="text-xs text-muted-foreground">{engineer.email}</p>
          </div>
        </div>
      </TableCell>

      <TableCell>{engineer.currentRole}</TableCell>

      <TableCell>
        <div className="flex flex-wrap gap-1">
          {engineer.skills.map((skill) => (
            <TechStackTag tech={skill} />
          ))}
        </div>
      </TableCell>

      <TableCell>{engineer.experience}</TableCell>

      <TableCell>{engineer.activeProjects}</TableCell>

      <TableCell>
        <StatusBadge status={engineer.availability} />
      </TableCell>

      <TableCell className="text-right">{actions}</TableCell>
    </TableRow>
  );
};

export default EngineerRow;
