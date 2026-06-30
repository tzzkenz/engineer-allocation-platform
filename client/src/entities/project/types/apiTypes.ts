export type ProjectStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "STOPPED" | "DISCARDED";
export type RequirementStatus = "PENDING" | "APPROVED" | "REJECTED";

export type BaseProject = {
  id: number;
  name: string;
  status: ProjectStatus;
  start_date: string;
  duration: number;
};

export type Project = BaseProject & {};

export type ProjectListResponse = Project[];

export type RequirementResponse = {
  id: number;
  project_id: number;
  project_role_id: number;
  requested_count: number;
  requested_by: number;
  status: RequirementStatus;
  stack_ids: number[];
  created_at: string;
  updated_at: string;
};

export type CreateRequirementRequest = {
  project_role_id: number;
  requested_count: number;
  stack_ids: number[];
};

export type UpdateRequirementRequest = {
  project_role_id?: number;
  requested_count?: number;
  stack_ids?: number[];
};
