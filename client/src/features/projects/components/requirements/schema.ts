import { z } from "zod";

export const requirementSchema = z.object({
  role: z.string().trim().min(1, "Role is required"),

  requiredCount: z.number().int().min(1, "Required count must be at least 1"),

  requiredSkills: z
    .array(z.object({ id: z.number(), name: z.string() }))
    .min(1, "Select at least one skill"),
});
