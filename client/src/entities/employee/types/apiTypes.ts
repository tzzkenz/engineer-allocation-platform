import type { SystemRoleResponse } from "@/entities/config/types/apiTypes";

export type BaseEmployeeResponse = {
  id: 1;
  name: string;
  role: SystemRoleResponse;
};

export type BaseEmployeeResponseWithEmail = BaseEmployeeResponse & {
  email: string;
};

export type EmployeeResponse = BaseEmployeeResponse & {
  email: string;
  experience: number;
  date_of_joining: string;
  system_role_id: number;
  system_role_name: string;
  active_project_count: number;
  created_at: string;
  updated_at: string;
};

export type EmployeeAvailabilityStatus = "AVAILABLE" | "BUSY";

export type AvailabilityFilterType = "ALL" | "AVAILABLE" | "UNAVAILABLE";

export type AdvanceSearchEmployeeParams = {
  identifier?: string;
  skill_ids?: number[];
  availability?: AvailabilityFilterType;
  sort_by_experience?: boolean;
  sort_by_proficiency?: boolean;
  limit?: number;
  offset?: number;
};
