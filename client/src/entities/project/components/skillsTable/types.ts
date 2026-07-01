export type EmployeeSkillRow = {
  skill_id: number;
  skill_name: string;
  proficiency: number;
  is_interest: boolean;
};

export type SkillsTableProps = {
  value: EmployeeSkillRow[];
  onChange: (skills: EmployeeSkillRow[]) => void;
};
