import { formatDate } from "@/shared/lib/format";
import { Eye, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router";

import { StatusBadge } from "@features/employees/components/status-badge/StatusBadge";

import type { ProjectListResponse } from "@entities/project/types/apiTypes";

import { Button } from "@shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shared/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@shared/components/ui/tooltip";
import { cn } from "@shared/lib/utils";

import DurationCell from "../duration-cell/DurationCell";

type ProjectTableProps = {
  employees: ProjectListResponse;
  onViewClick: (projectId: number) => void;
};

const ProjectTableHeads = ["Project Name", "Status", "Start Date", "Duration", "Actions"];

const ProjectTable = ({ employees, onViewClick }: ProjectTableProps) => {
  const navigate = useNavigate();
  return (
    <Table className=" text-left">
      <TableHeader>
        <TableRow>
          {ProjectTableHeads.map((head) => (
            <TableHead key={head} className={cn(head === "Actions" && "text-right")}>
              {head}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {employees.map((project) => (
          <TableRow
            key={project.id}
            className=" cursor-pointer group transition-colors"
            onClick={() => navigate(`/project/${project.id}`)}
          >
            <TableCell className="pr-6 py-4">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-[16px] font-bold  leading-6">{project.name}</p>
                  {/* <p className="text-[11px] opacity-60 leading-3.5">{project.description}</p> */}
                </div>
              </div>
            </TableCell>

            <TableCell className="pr-6 py-4">
              <StatusBadge status={project.status} />
            </TableCell>

            <TableCell className="pr-6 py-4">{formatDate(project.start_date) || "N/A"}</TableCell>

            <TableCell className="pr-6 py-5">
              <DurationCell project={project} />
            </TableCell>

            {/* Actions */}
            <TableCell className="pr-4 py-4">
              <div className="flex items-center justify-end gap-1  transition-opacity">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 rounded-lg "
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewClick(project.id);
                      }}
                      aria-label="View project"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View project</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 rounded-lg "
                      onClick={(e) => e.stopPropagation()}
                      aria-label="More options"
                    >
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>More options</TooltipContent>
                </Tooltip>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProjectTable;
