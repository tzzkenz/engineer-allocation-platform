export type ProjectStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "STOPPED" | "DISCARDED";

export type BaseProject = {
  id: number;
  name: string;
  status: ProjectStatus;
  start_date: string;
  duration: number;
};

export type Project = BaseProject & {};

export type ProjectListResponse = Project[];
