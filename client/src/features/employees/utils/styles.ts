export const skillLevelConfig: Record<string, { label: string; badgeClass: string }> = {
  advanced: {
    label: "ADVANCED",
    badgeClass:
      "bg-[rgba(70,72,212,0.1)] text-[#4648d4] border-transparent hover:bg-[rgba(70,72,212,0.1)]",
  },
  intermediate: {
    label: "INTERMEDIATE",
    badgeClass:
      "bg-[rgba(91,93,109,0.1)] text-[#5b5d6d] border-transparent hover:bg-[rgba(91,93,109,0.1)]",
  },
  beginner: {
    label: "BEGINNER",
    badgeClass:
      "bg-[rgba(16,185,129,0.1)] text-[#059669] border-transparent hover:bg-[rgba(16,185,129,0.1)]",
  },
  expert: {
    label: "EXPERT",
    badgeClass:
      "bg-[rgba(113,42,226,0.1)] text-[#712ae2] border-transparent hover:bg-[rgba(113,42,226,0.1)]",
  },
};
