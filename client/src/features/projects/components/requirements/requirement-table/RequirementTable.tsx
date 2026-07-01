import { TechStackTag } from "@/entities/project/components/TechStack";
import type { RequirementResponse } from "@/entities/project/types/apiTypes";
import { REQUIREMENT_NAME_TO_LABEL } from "@/features/projects/utils/status";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Delete, Edit, Pencil, Trash } from "lucide-react";

import { RequirementStatusBadge } from "../requirement-status-badge/RequirementStatusBadge";

const TABLE_HEADS = ["Project Role", "Required Expertise", "Assigned", "Status", "Actions"];

type RequirementTableProps = {
  requirements: RequirementResponse[];
  onAssign: (requirement: RequirementResponse) => void;
  onRemove: (requirement: RequirementResponse) => void;
  onEdit: (requirement: RequirementResponse) => void;
};

export const RequirementTable = ({
  requirements,
  onAssign,
  onRemove,
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
            <TableCell>{req.project_role_name}</TableCell>

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
              <Button
                // variant=""
                // className=" text-primary"
                size="sm"
                onClick={() => onAssign(req)}
              >
                Assign
              </Button>
              {req.status === "PENDING" && (
                <Button
                  variant="destructive"
                  // className=" text-primary"
                  size="sm"
                  onClick={() => onRemove(req)}
                >
                  <Trash />
                </Button>
              )}
              <Button
                variant="ghost"
                // className=" text-primary"
                size="sm"
                onClick={() => onEdit(req)}
              >
                <Pencil />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
