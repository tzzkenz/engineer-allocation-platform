import { z } from "zod";

export const employeeUpdateSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name is too long"),

  email: z
    .email("Invalid email address"),


  experience: z
    .number()
    .min(0, "Experience cannot be negative"),

  date_of_joining: z
    .string()
    .min(1, "Joining date is required"),

  system_role_id: z.number(),
});

