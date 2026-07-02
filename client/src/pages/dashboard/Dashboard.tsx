import { useMemo, useState } from "react";

import type { ProjectStatus } from "@/entities/project/types/apiTypes";
import { PROJECT_STATUS_LABELS } from "@/entities/project/utils/status";
import { InsightDialog } from "@/features/dashboard/components/InsightDialog";
import { Button } from "@/shared/components/ui/button";
import PageSection from "@/shared/components/ui/section";
import {
  AlertTriangle,
  LayoutGrid,
  Loader2,
  RefreshCw,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

import { EngineerDistribution } from "@features/dashboard/components/EngineerDistribution";
import { ProjectStatusChart } from "@features/dashboard/components/ProjectStatusChart";
import { SkillCoverage } from "@features/dashboard/components/SkillCoverage";
import { StatCard } from "@features/dashboard/components/StatCard";
import {
  useGetDashboardSummaryQuery,
  useGetInsightsMutation,
  useLazyGetLatestInsightsSummaryQuery,
} from "@features/dashboard/services/dashboardApi";

export function Dashboard() {
  const { data: dashboardSummary } = useGetDashboardSummaryQuery(undefined, {
    refetchOnMountOrArgChange: false,
  });

  const [generateInsight, { isLoading: isGenerating, data: generatedInsight }] =
    useGetInsightsMutation();
  const [getLatestInsight, { isLoading: isLatestLoading, data: latestInsight }] =
    useLazyGetLatestInsightsSummaryQuery();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"latest" | "generated">("latest");

  const handleGetLatest = async () => {
    setDialogMode("latest");

    try {
      await getLatestInsight().unwrap();
      setDialogOpen(true);
    } catch (err) {}
  };

  /** Simulates a network call to generate a fresh insight, then opens the dialog. */
  const handleGetInsight = async () => {
    setDialogMode("generated");
    try {
      await generateInsight().unwrap();
      setDialogOpen(true);
    } catch (err) {}
  };

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
        status: status as ProjectStatus,
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
        <PageSection
          title="Dashboard"
          description="Resource allocation and staffing insights."
          additionalContent={
            <div className=" w-full flex items-center justify-end gap-2">
              {/* Get Latest Insight */}
              <Button
                variant="outline"
                onClick={handleGetLatest}
                className="gap-2 h-10 px-4 rounded-xl border-border-strong text-sm font-medium hover:bg-secondary"
                disabled={isLatestLoading}
              >
                <RefreshCw className="size-3.5" />
                {isLatestLoading ? "Fetching.." : "Get Latest Insight"}
              </Button>

              {/* Get Insight (generates fresh) */}
              <Button
                onClick={handleGetInsight}
                disabled={isGenerating}
                className="gap-2 h-10 px-4 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 text-sm font-medium shadow-none"
              >
                {isGenerating ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Sparkles className="size-3.5" />
                )}
                {isGenerating ? "Generating…" : "Get Insight"}
              </Button>
            </div>
          }
        />
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

      {dialogOpen && (
        <InsightDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          insight={dialogMode === "generated" ? generatedInsight : latestInsight}
          mode={dialogMode}
        />
      )}
    </>
  );
}
