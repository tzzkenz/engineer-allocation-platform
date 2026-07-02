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

export type DashboardInsightsResponse = {
  id: number;
  period_start: string;
  period_end: string;
  metrics_json: string; // JSON string, parse into DashboardMetrics
  summary_text: string;
  generated_by: string;
  created_at: string;
};
