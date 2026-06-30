import { z } from "zod";

export const projectCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required"),

  duration: z.number(),

  start_date: z.string(),
  status: z.enum([
    "NOT_STARTED",
    "IN_PROGRESS",
    "COMPLETED",
    "ON_HOLD",
  ])
});

export type ProjectCreateFormData = z.infer<typeof projectCreateSchema>;