import { StatusBadge } from "@/features/employees/components/status-badge/StatusBadge";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/lib/utils";
import { Eye, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router";

import DurationCell from "../duration-cell/DurationCell";

const ProjectTable = ({ employees, onViewClick }) => {
  const navigate = useNavigate();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Engineers</TableHead>
          <TableHead className=" text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {employees.map((project) => (
          <TableRow
            key={project.id}
            className=" cursor-pointer group transition-colors"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            <TableCell className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-[16px] font-bold  leading-6">{project.name}</p>
                  <p className="text-[11px] opacity-60 leading-3.5">{project.subtitle}</p>
                </div>
              </div>
            </TableCell>

            <TableCell className="px-6 py-4">
              <StatusBadge status={project.status} />
            </TableCell>

            <TableCell className="px-6 py-5">
              <DurationCell project={project} />
            </TableCell>

            <TableCell className="px-6 py-4">
              {project.engineers.length === 0 ? (
                <span
                  className={cn(
                    "text-[13px] font-bold italic",
                    project.maxEngineers > 0 ? "text-red-600" : "text-gray-200"
                  )}
                >
                  {project.maxEngineers > 0 ? `Needs ${project.maxEngineers}` : "—"}
                </span>
              ) : (
                <span className="text-[13px] font-bold">
                  {project.engineers.length} / {project.maxEngineers}
                </span>
              )}
            </TableCell>

            {/* Actions */}
            <TableCell className="px-4 py-4">
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
