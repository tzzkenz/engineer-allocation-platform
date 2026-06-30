import { z } from "zod";

export const projectCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(255, "Project name cannot exceed 255 characters"),

  duration: z
    .number()
    .min(1, "Duration must be at least 1 month")
    .optional(),

  start_date: z
    .string()
    .optional(),

  status: z.enum([
    "NOT_STARTED",
    "IN_PROGRESS",
    "COMPLETED",
    "ON_HOLD",
  ]),
});

export type ProjectCreateFormData = z.infer<typeof projectCreateSchema>;