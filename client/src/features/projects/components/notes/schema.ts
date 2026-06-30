import { z } from "zod";

export const noteTypes = ["GENERAL", "PERFORMANCE", "ISSUE"] as const;

export const projectNoteSchema = z.object({
  type: z.enum(noteTypes, {
    error: "Please select a note type.",
  }),

  note: z
    .string()
    .trim()
    .min(1, "Project note is required.")
    .max(1000, "Project note cannot exceed 1000 characters."),
});

export type ProjectNoteFormValues = z.infer<typeof projectNoteSchema>;
