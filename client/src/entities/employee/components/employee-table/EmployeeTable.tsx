import { Button } from "@shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shared/components/ui/table";

import type { EmployeeResponse } from "../../types/apiTypes";
import EmployeeRow from "../employee-row/EmployeeRow";

export type AvailabilityStatus = "available" | "busy" | "on_leave";

type Props = {
  employees: EmployeeResponse[];
  renderActions: (engineer: EmployeeResponse) => React.ReactNode;
};

const tableHeads = ["Engineer", "Role", "Experience", "Projects", "Availability", "Actions"];

export default function EmployeeTable({ employees, renderActions }: Props) {
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
              <EmployeeRow engineer={employee} actions={renderActions(employee)} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
