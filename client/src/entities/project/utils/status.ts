import type { ProjectStatus } from "../types/apiTypes";

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  COMPLETED: "Completed",
  DISCARDED: "Discarded",
  ONGOING: "In Progress",
  NOT_STARTED: "Not Started",
  STOPPED: "Stopped",
};

export const PROJECT_STATUS_BADGE_CLASSES: Record<ProjectStatus, string> = {
  COMPLETED: "#059669", // Green
  DISCARDED: "#ef4444", // Red
  ONGOING: "#facc15", // Yellow
  NOT_STARTED: "#6b7280", // Gray
  STOPPED: "#ef4444", // Red
};
