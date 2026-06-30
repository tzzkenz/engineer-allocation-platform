import type { ProjectStatus } from "../types/apiTypes";

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  COMPLETED: "Completed",
  DISCARDED: "Discarded",
  IN_PROGRESS: "In Progress",
  NOT_STARTED: "Not Started",
  STOPPED: "Stopped",
};
