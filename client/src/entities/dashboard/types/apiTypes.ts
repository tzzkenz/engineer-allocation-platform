import type { ProjectStatus } from "@/entities/project/types/apiTypes";

export type DashboardSummaryResponse = {
  employees: {
    total: number;
    by_role: Record<string, number>;
  };
  projects: {
    total: number;
    by_status: Record<ProjectStatus, number>;
  };
  skill_coverage: Record<string, { required: number; filled: number }>;
};
