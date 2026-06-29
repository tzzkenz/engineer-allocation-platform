import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Search } from "lucide-react";

const ProjectFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-primary-foreground">
      <div className="relative flex-1 min-w-3xs ">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5  pointer-events-none" />
        <Input
          type="text"
          placeholder="Quick filter project name..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="pl-9 border-0 shadow-none bg-background focus-visible:ring-0 text-sm h-auto py-2.5"
        />
      </div>

      <Select value={filters.status} onValueChange={(value) => onFilterChange("status", value)}>
        <SelectTrigger className="w-auto border-0 bg-background shadow-none focus-visible:ring-0 gap-2 h-auto py-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="planning">Planning</SelectItem>
          <SelectItem value="on_hold">On Hold</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProjectFilters;
