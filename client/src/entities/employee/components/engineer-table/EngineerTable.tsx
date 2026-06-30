import { Button } from "@shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shared/components/ui/table";

import EngineerRow from "../engineer-row/EngineerRow";

export type AvailabilityStatus = "available" | "busy" | "on_leave";

export interface Engineer {
  id: string;
  initials: string;
  avatarBg: string;
  avatarText: string;
  name: string;
  email: string;
  currentRole: string;
  skills: string[];
  experience: string;
  activeProjects: number;
  availability: AvailabilityStatus;
}

type Props = {
  engineers: Engineer[];
  onAssign: (engineer: Engineer) => void;
};

const tableHeads = [
  "Engineer",
  "Role",
  "Skills",
  "Experience",
  "Projects",
  "Availability",
  "Actions",
];

export default function EngineerTable({ engineers, onAssign }: Props) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {tableHeads.map((head) => (
              <TableHead key={head} className={head === "Actions" ? "text-right" : undefined}>
                {head}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {engineers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                No engineers match your filters.
              </TableCell>
            </TableRow>
          ) : (
            engineers.map((engineer) => (
              <EngineerRow
                engineer={engineer}
                actions={<Button onClick={() => onAssign(engineer)}>Assign</Button>}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
