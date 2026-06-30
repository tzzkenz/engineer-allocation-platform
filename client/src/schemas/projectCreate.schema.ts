import { z } from "zod";

export const projectCreateSchema = z.object({
  projectName: z
    .string()
    .min(1, "Project name is required"),

  duration: z.string().optional(),

  startDate: z.string().optional(),

  endDate: z.string().optional(),
});

export type ProjectCreateFormData = z.infer<typeof projectCreateSchema>;