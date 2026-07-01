export const SUGGESTION_CHIPS = [
  "Show available Python developers",
  "Find React engineers with 5+ years experience",
  "Which engineers are available next month?",
  "Show understaffed projects",
] as const;

export type SuggestionChip = (typeof SUGGESTION_CHIPS)[number];
