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

export type EmployeeCreateRequest={
  name: string;
  email:string;
  experience: number;
  date_of_joining:string;
  system_role_id:number;
  password:string;
}
export type EmployeeUpdateRequest={
  name: string;
  email:string;
  experience: number;
  date_of_joining:string;
  system_role_id:number;
}
export type EmployeeCreateResponse ={
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

export type GetAllSkillsResponse = Skill[];