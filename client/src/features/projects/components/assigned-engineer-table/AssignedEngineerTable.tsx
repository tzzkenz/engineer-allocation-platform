import type { AssignedEmployeeResponse } from "@/entities/project/types/apiTypes";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shared/components/ui/table";

import AssignedEmployeeRow from "../assigned-enginneer-row/AssignedEngineerRow";

export type AvailabilityStatus = "available" | "busy" | "on_leave";

type Props = {
  employees: AssignedEmployeeResponse[];
  renderActions: (engineer: AssignedEmployeeResponse) => React.ReactNode;
};

const tableHeads = ["Engineer", "Role", "Date Assigned", "Start Date", "Actions"];

export default function AssignedEngineerTable({ employees, renderActions }: Props) {
  return (
    <div className=" w-full rounded-lg border">
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
          {employees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                No engineers match your filters.
              </TableCell>
            </TableRow>
          ) : (
            employees.map((employee) => (
              <AssignedEmployeeRow engineer={employee} actions={renderActions(employee)} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
