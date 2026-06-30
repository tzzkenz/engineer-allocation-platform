import type { EmployeeResponse } from "@/entities/employee/types/apiTypes";

export type ProjectStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "STOPPED" | "DISCARDED";
export type RequirementStatus = "PENDING" | "APPROVED" | "REJECTED";
export type FeedbackType = "PERFORMANCE" | "ISSUE" | "GENERAL";

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

export type FeedbackResponse = {
  id: number;
  project_id: number;
  employee_id: number;
  note: string;
  feedback_type: FeedbackType;
  creator: EmployeeResponse;
  created_at: string;
  updated_at: string;
};

export type CreateFeedbackRequest = {
  note: string;
  feedback_type: FeedbackType;
};

export type UpdateFeedbackRequest = {
  feedback?: string;
  rating?: number;
};
