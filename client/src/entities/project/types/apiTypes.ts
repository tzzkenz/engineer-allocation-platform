import type { StackRequest } from "@/entities/config/types/apiTypes";
import type {
  BaseEmployeeResponseWithEmail,
  EmployeeResponse,
} from "@/entities/employee/types/apiTypes";

export type ProjectStatus = "NOT_STARTED" | "ONGOING" | "COMPLETED" | "STOPPED" | "DISCARDED";
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
  project_role_name: string;
  requested_count: number;
  assigned_count: number;
  requested_by: number;
  status: RequirementStatus;
  stack_requests: StackRequest[];
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

export type AssignEngineerPayload = {
  requirement_request_id: number;
  employee_ids: number[];
  is_shadow: boolean;
};

export type EmployeeCreateRequest = {
  name: string;
  email: string;
  experience: number;
  date_of_joining: string;
  system_role_id: number;
  password: string;
};
export type EmployeeUpdateRequest = {
  name: string;
  email: string;
  experience: number;
  date_of_joining: string;
  system_role_id: number;
};
export type EmployeeCreateResponse = {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  experience: number;
  date_of_joining: string;
  system_role_id: number;
  system_role_name: string;
};
export type Skill = {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  type: "STACK" | "SKILL" | "STRENGTH" | "AREA_OF_INTEREST";
};

export type AssignedEmployeeResponse = {
  date_assigned: string;
  employee: BaseEmployeeResponseWithEmail;
  id: number;
  is_shadow: boolean;
  project_id: number;
  project_role_id: number;
  project_role_name: string;
  start_date: string;
};
export type GetAllSkillsResponse = Skill[];
