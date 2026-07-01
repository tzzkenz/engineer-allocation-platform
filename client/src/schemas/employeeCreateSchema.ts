import { z } from "zod";

export const employeeCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name is too long"),

  email: z
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters"),

  experience: z
    .number()
    .min(0, "Experience cannot be negative"),

  date_of_joining: z
    .string()
    .min(1, "Joining date is required"),

  system_role_id: z.number(),
});

