import type { Skill } from "../types/apiTypes";

type TransformedSkills = {
  technical: Skill[];
  stacks: Skill[];
  nonTechnical: Skill[];
};

export const transformByType = (skills: Skill[]): TransformedSkills => {
  return skills.reduce<TransformedSkills>(
    (acc, skill) => {
      switch (skill.type) {
        case "TECHNICAL":
          acc.technical.push(skill);
          break;

        case "STACK":
          acc.stacks.push(skill);
          break;

        case "NON_TECHNICAL":
          acc.nonTechnical.push(skill);
          break;
      }

      return acc;
    },
    {
      technical: [],
      stacks: [],
      nonTechnical: [],
    }
  );
};
