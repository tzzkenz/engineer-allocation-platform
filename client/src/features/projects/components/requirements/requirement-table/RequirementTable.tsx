import PermissionGate from "@/entities/auth/components/permission-gate/PermissionGate";
import ProjectPermissionGate from "@/entities/auth/components/project-permission-gate/ProjectPermissionGate";
import { SYSTEM_ROLES } from "@/entities/config/lib/roles";
import { Pencil, Trash } from "lucide-react";

import { TechStackTag } from "@entities/project/components/TechStack";
import type { RequirementResponse } from "@entities/project/types/apiTypes";

import { Button } from "@shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shared/components/ui/table";

import { RequirementStatusBadge } from "../requirement-status-badge/RequirementStatusBadge";

const TABLE_HEADS = ["Project Role", "Required Expertise", "Assigned", "Status", "Actions"];

type RequirementTableProps = {
  requirements: RequirementResponse[];
  onAssign: (requirement: RequirementResponse) => void;
  onRemove: (requirement: RequirementResponse) => void;
  onEdit: (requirement: RequirementResponse) => void;
  onApprove: (requirement: RequirementResponse) => void;
};

export const RequirementTable = ({
  requirements,
  onAssign,
  onRemove,
  onApprove,
  onEdit,
}: RequirementTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {TABLE_HEADS.map((head) => (
            <TableHead key={head} className={head === "Actions" ? "text-right" : undefined}>
              {head}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {requirements.map((req) => (
          <TableRow key={req.id}>
            <TableCell>
              {req.project_role_name}
              <p className=" text-xs font-semibold text-muted-foreground ">
                Requested by {req.requested_by_name}
              </p>
            </TableCell>

            <TableCell>
              {req.stack_requests.map((stack) => (
                <TechStackTag key={stack.id} tech={stack.stack_name} />
              ))}
            </TableCell>

            <TableCell>
              {req.assigned_count} / {req.requested_count}
            </TableCell>

            <TableCell>
              <RequirementStatusBadge status={req.status} />
            </TableCell>

            <TableCell className="text-right flex justify-end items-center gap-1">
              <ProjectPermissionGate>
                {req.status === "APPROVED" && (
                  <Button size="sm" onClick={() => onAssign(req)}>
                    Assign
                  </Button>
                )}

                {req.status === "PENDING" && (
                  <>
                    <PermissionGate requiredRoles={[SYSTEM_ROLES.HR]}>
                      <Button
                        variant="ghost"
                        className=" bg-green-100 text-green-600 hover:bg-green-200"
                        size="sm"
                        onClick={() => onApprove(req)}
                      >
                        Approve
                      </Button>
                    </PermissionGate>
                    <ProjectPermissionGate>
                      <Button variant="destructive" size="sm" onClick={() => onRemove(req)}>
                        <Trash />
                      </Button>
                    </ProjectPermissionGate>
                  </>
                )}
                <Button variant="ghost" size="sm" onClick={() => onEdit(req)}>
                  <Pencil />
                </Button>
              </ProjectPermissionGate>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
