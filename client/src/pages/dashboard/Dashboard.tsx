import { useMemo } from "react";

import type { ProjectStatus } from "@/entities/project/types/apiTypes";
import { PROJECT_STATUS_LABELS } from "@/entities/project/utils/status";
import { useGetDashboardSummaryQuery } from "@/features/dashboard/services/dashboardApi";
import PageSection from "@/shared/components/ui/section";
import { AlertTriangle, LayoutGrid, Target, Users } from "lucide-react";

import { EngineerDistribution } from "@features/dashboard/components/EngineerDistribution";
import { ProjectStatusChart } from "@features/dashboard/components/ProjectStatusChart";
import { SkillCoverage } from "@features/dashboard/components/SkillCoverage";
import { StatCard } from "@features/dashboard/components/StatCard";

export function Dashboard() {
  const { data: dashboardSummary } = useGetDashboardSummaryQuery(undefined, {
    refetchOnMountOrArgChange: false,
  });

  const skillCoverage = (() => {
    if (!dashboardSummary?.skill_coverage) return "0%";

    const values = Object.values(dashboardSummary.skill_coverage);

    const average =
      values.reduce(
        (sum, { required, filled }) => sum + (required > 0 ? (filled / required) * 100 : 0),
        0
      ) / values.length;

    return `${average.toFixed(2)}%`;
  })();

  const skillCoverageData = dashboardSummary?.skill_coverage
    ? Object.entries(dashboardSummary.skill_coverage).map(([skill, { required, filled }]) => ({
        label: skill,
        pct: required > 0 ? (filled / required) * 100 : 0,
        tag: skill,
        tagPct: required > 0 ? (filled / required) * 100 : 0,
      }))
    : [];

  const projectStatusData = dashboardSummary?.projects.by_status
    ? Object.entries(dashboardSummary.projects.by_status).map(([status, value]) => ({
        name: PROJECT_STATUS_LABELS[status as ProjectStatus],
        value,
      }))
    : [];

  const totalProjects = dashboardSummary?.projects.by_status
    ? Object.values(dashboardSummary.projects.by_status).reduce((sum, count) => sum + count, 0)
    : 0;

  const engineerDistributionData = dashboardSummary?.employees.by_role
    ? (() => {
        const roles = dashboardSummary.employees.by_role;
        const max = Math.max(...Object.values(roles));

        return Object.entries(roles).map(([role, count]) => ({
          label: role,
          count,
          max,
        }));
      })()
    : [];

  return (
    <>
      <div className="flex items-start justify-between ">
        <PageSection title="Dashboard" description="Resource allocation and staffing insights." />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<LayoutGrid className="size-5 text-primary" />}
          iconBg="bg-primary/10"
          label="Total Projects"
          value={dashboardSummary?.projects.total ?? 0}
          sub="40 Active · 8 Closed"
          badge={{ text: "+6%", variant: "success" }}
        />
        <StatCard
          icon={<Users className="size-5 text-blue-600" />}
          iconBg="bg-blue-100"
          label="Total Engineers"
          value={dashboardSummary?.employees.total ?? 0}
          sub="76 Allocated"
        />
        <StatCard
          icon={<AlertTriangle className="size-5 text-destructive" />}
          iconBg="bg-red-100"
          label="Open Requirements"
          value={dashboardSummary?.projects.total ?? 0}
          sub="Across 8 Projects"
          badge={{ text: "High", variant: "danger" }}
        />
        <StatCard
          icon={<Target className="size-5 text-green-600" />}
          iconBg="bg-green-100"
          label="Skill Coverage"
          value={skillCoverage}
          sub="Current Staffing"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <ProjectStatusChart data={projectStatusData} total={totalProjects} />
        <EngineerDistribution roles={engineerDistributionData} />
      </div>

      <SkillCoverage skills={skillCoverageData} />
    </>
  );
}
