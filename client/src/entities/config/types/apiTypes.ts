export type SkillType = "TECHNICAL" | "STACK" | "NON_TECHNICAL";

export type ProjectRoleResponse = {
  id: number;
  name: string;
  description: string | null;
};

export type ProjectRoleUpdate = {
  name: string;
  description?: string | null;
};

export type Skill = {
  id: number;
  name: string;
  type: SkillType;
};

export type StackRequest = {
  id: number;
  project_requirement_request_id: number;
  stack_id: number;
  stack_name: string;
};

export type SkillResponse = Skill;

export type CreateSkillPayload = {
  name: string;
  description?: string | null;
};

export type UpdateSkillPayload = {
  name?: string;
  description?: string | null;
};

export type SystemRoleResponse = {
  id: number;
  name: string;
};

export type SystemRoleResponseWithDatesResponse = SystemRoleResponse & {
  created_at: string;
  updated_at: string;
};
