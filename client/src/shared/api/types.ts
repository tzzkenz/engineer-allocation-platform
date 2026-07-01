import type { ProjectStatus } from "@/entities/project/types/apiTypes";

export type BaseApiResponse = {
  id: number;
  created_at: string;
  updated_at: string;
};

export type RefreshResponse = {
  access_token: string;
  refresh_token: string;
};
export type LoginRequest = FormData;

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
};

export type CreateProjectRequest = {
  name: string;
  start_date: string;
  duration: number;
  status: ProjectStatus;
};

export type ProjectResponse = BaseApiResponse & {
  name: string;
  start_date: string;
  duration: number;
  status: ProjectStatus;
};
export type UpdateProjectRequest = {
  projectId: string;
  name: string;
  start_date: string;
  duration: number;
  status: ProjectStatus;
};
export type EmployeeSkill = {
  skill_id: number;
  proficiency: number; // 1-5
  is_interest: boolean;
};

export type AddEmployeeSkillsRequest = {
  skills: EmployeeSkill[];
};

export type AddEmployeeSkillsResponse = {
  message: string;
};

export type EmployeeSkillResponse = {
  skill_id: number;
  name: string;
  type: "STACK" | "SKILL" | "STRENGTH" | "AREA_OF_INTEREST";
  proficiency: number;
  is_interest: boolean;
  created_at: string;
  updated_at: string;
};

export type GetEmployeeSkillsResponse = EmployeeSkillResponse[];

export type DeleteEmployeeSkillRequest = {
  employee_id: number;
  skill_id: number;
};

export type DeleteEmployeeSkillResponse = {
  message: string;
};
