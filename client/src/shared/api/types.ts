export type BaseApiResponse = {
  id: number;
  created_at: string;
  updated_at: string;
};

export type RefreshResponse = {
  access_token: string;
  refresh_token: string;
};
export type LoginRequest=FormData

export type LoginResponse={
  access_token:string;
  refresh_token:string;
}

export type CreateProjectRequest = {
  name: string;
  start_date: string;
  duration: number;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD";
};

export type ProjectResponse = BaseApiResponse & {
  name: string;
  start_date: string;
  duration: number;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD";
};