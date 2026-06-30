import { UserPlus } from "lucide-react";

import EngineerTable, {
  type Engineer,
} from "@entities/employee/components/engineer-table/EngineerTable";

import { Button } from "@shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shared/components/ui/dialog";

import AdvancedFilters from "../advanced-filter/AdvancedFilters";

const ALL_ENGINEERS: Engineer[] = [
  {
    id: "e1",
    initials: "SC",
    avatarBg: "bg-primary/10",
    avatarText: "text-primary",
    name: "Sarah Chen",
    email: "sarah.c@helix.com",
    currentRole: "Senior Developer",
    skills: ["Python", "AWS"],
    experience: "6.5 Years",
    activeProjects: 1,
    availability: "AVAILABLE",
  },
  {
    id: "e2",
    initials: "MT",
    avatarBg: "bg-purple-100",
    avatarText: "text-purple-700",
    name: "Marcus Thorne",
    email: "m.thorne@helix.com",
    currentRole: "Cloud Architect",
    skills: ["Azure", "K8s"],
    experience: "9 Years",
    activeProjects: 2,
    availability: "BUSY",
  },
  {
    id: "e3",
    initials: "PK",
    avatarBg: "bg-amber-100",
    avatarText: "text-amber-700",
    name: "Priya Kapoor",
    email: "p.kapoor@helix.com",
    currentRole: "Backend Engineer",
    skills: ["Python", "FastAPI", "PostgreSQL"],
    experience: "5 Years",
    activeProjects: 1,
    availability: "AVAILABLE",
  },
];
type AssignEngineerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign?: (engineer: Engineer) => void;
};

export default function AssignEngineerDialog({ open, onOpenChange }: AssignEngineerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" sm:max-w-7xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <UserPlus className="size-5 text-primary" />
            </div>
            Assign Engineer
          </DialogTitle>

          <DialogDescription>Search and assign an engineer to the project.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="rounded-lg border p-6">
            <AdvancedFilters />
          </div>

          <EngineerTable engineers={ALL_ENGINEERS} onAssign={console.log} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
