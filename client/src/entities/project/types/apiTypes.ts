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

type BaseProjectRequirement = {
  project_role_id: number;
  requested_count: number;
  requested_by: number;
  stack_ids: number[];
};
