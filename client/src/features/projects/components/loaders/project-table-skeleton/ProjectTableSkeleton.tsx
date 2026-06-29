import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { cn } from "@/shared/lib/utils";

const ProjectTableHeads = ["Project Name", "Status", "Duration", "Engineers", "Actions"];

const ROWS = 6;

const ProjectTableSkeleton = () => {
  return (
    <Table className="text-left">
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
        {Array.from({ length: ROWS }).map((_, index) => (
          <TableRow key={index}>
            {/* Project Name */}
            <TableCell className="pr-6 py-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40 rounded-md" />
                <Skeleton className="h-3 w-24 rounded-md" />
              </div>
            </TableCell>

            {/* Status */}
            <TableCell className="pr-6 py-4">
              <Skeleton className="h-6 w-20 rounded-full" />
            </TableCell>

            {/* Duration */}
            <TableCell className="pr-6 py-5">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-3 w-16 rounded-md" />
              </div>
            </TableCell>

            {/* Engineers */}
            <TableCell className="pr-6 py-4">
              <Skeleton className="h-4 w-12 rounded-md" />
            </TableCell>

            {/* Actions */}
            <TableCell className="pr-4 py-4">
              <div className="flex justify-end gap-2">
                <Skeleton className="size-8 rounded-lg" />
                <Skeleton className="size-8 rounded-lg" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProjectTableSkeleton;
