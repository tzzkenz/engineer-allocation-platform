import { TechStackTag } from "@/entities/project/components/TechStack";
import type { RequirementResponse } from "@/entities/project/types/apiTypes";
import { REQUIREMENT_NAME_TO_LABEL } from "@/features/projects/utils/status";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

const TABLE_HEADS = ["Project Role", "Required Expertise", "Assigned", "Status", "Actions"];

type RequirementTableProps = {
  requirements: RequirementResponse[];
  onAssign: (requirement: RequirementResponse) => void;
};

export const RequirementTable = ({ requirements, onAssign }: RequirementTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {TABLE_HEADS.map((head) => (
            <TableHead key={head}>{head}</TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {requirements.map((req) => (
          <TableRow key={req.id}>
            <TableCell>{req.project_role_id}</TableCell>

            <TableCell>
              {req.stack_requests.map((stack) => (
                <TechStackTag key={stack.id} tech={stack.stack_name} />
              ))}
            </TableCell>

            <TableCell>0 / {req.requested_count}</TableCell>

            <TableCell>{REQUIREMENT_NAME_TO_LABEL[req.status]}</TableCell>

            <TableCell>
              <Button
                // variant=""
                // className=" text-primary"
                size="sm"
                onClick={() => onAssign(req)}
              >
                Assign
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
