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
  description: string | null;
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
