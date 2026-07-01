import type { ProjectStatus } from "@/entities/project/types/apiTypes";
import { Ban, CheckCircle, Pause, Play, RotateCcw } from "lucide-react";

type StatusAction = {
  label: string;
  icon: React.ReactNode;
  status: ProjectStatus;
  className: string;
};

export const getProjectStatusAction = (currentStatus: ProjectStatus): StatusAction | null => {
  switch (currentStatus) {
    case "NOT_STARTED":
      return {
        label: "Start Project",
        icon: <Play className="size-3.5" />,
        status: "ONGOING",
        className: "bg-yellow-100 text-yellow-700",
      };

    case "ONGOING":
      return {
        label: "Mark as Completed",
        icon: <CheckCircle className="size-3.5" />,
        status: "COMPLETED",
        className: "bg-green-100 text-green-700",
      };

    case "STOPPED":
      return {
        label: "Resume Project",
        icon: <RotateCcw className="size-3.5" />,
        status: "ONGOING",
        className: "bg-blue-100 text-blue-700",
      };

    case "COMPLETED":
    case "DISCARDED":
      return null;

    default:
      return null;
  }
};
