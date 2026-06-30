import { TechStackTag } from "@/entities/project/components/TechStack";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

const TABLE_HEADS = [
  "Project Role",
  "Required Expertise",
  "Required",
  "Assigned",
  "Status",
  "Actions",
];

type RequirementTableProps = {
  requirements: {
    id: string;
    role: string;
    expertise: string[];
    required: number;
    assigned: number;
    status: string;
  }[];
  onAssign: (requirementId: string) => void;
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
            <TableCell>{req.role}</TableCell>

            <TableCell>
              {req.expertise.length > 0 ? (
                <div>
                  {req.expertise.map((expertise) => (
                    <TechStackTag key={expertise} tech={expertise} />
                  ))}
                </div>
              ) : (
                <span>{req.role === "QA" ? "Manual Testing" : "—"}</span>
              )}
            </TableCell>

            <TableCell>{req.required}</TableCell>

            <TableCell>
              {req.assigned} / {req.required}
            </TableCell>

            <TableCell>{req.status}</TableCell>

            <TableCell>
              <Button
                // variant=""
                // className=" text-primary"
                size="sm"
                onClick={() => onAssign(req.id)}
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
