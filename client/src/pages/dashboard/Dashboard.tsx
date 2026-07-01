import PageSection from "@/shared/components/ui/section";
import { AlertTriangle, LayoutGrid, Target, Users } from "lucide-react";

import { EngineerDistribution } from "@features/dashboard/components/EngineerDistribution";
import { ProjectStatusChart } from "@features/dashboard/components/ProjectStatusChart";
import { SkillCoverage } from "@features/dashboard/components/SkillCoverage";
import { StatCard } from "@features/dashboard/components/StatCard";

export function Dashboard() {
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
          value={48}
          sub="40 Active · 8 Closed"
          badge={{ text: "+6%", variant: "success" }}
        />
        <StatCard
          icon={<Users className="size-5 text-blue-600" />}
          iconBg="bg-blue-100"
          label="Total Engineers"
          value={126}
          sub="76 Allocated"
        />
        <StatCard
          icon={<AlertTriangle className="size-5 text-destructive" />}
          iconBg="bg-red-100"
          label="Open Requirements"
          value={18}
          sub="Across 8 Projects"
          badge={{ text: "High", variant: "danger" }}
        />
        <StatCard
          icon={<Target className="size-5 text-green-600" />}
          iconBg="bg-green-100"
          label="Skill Coverage"
          value="82%"
          sub="Current Staffing"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <ProjectStatusChart />
        <EngineerDistribution />
      </div>

      <SkillCoverage />
    </>
  );
}
