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
