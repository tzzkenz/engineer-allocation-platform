import { useState } from "react";

import ProjectFilters from "@/features/projects/components/project-filters/ProjectFIlters";
import ProjectTable from "@/features/projects/components/project-table/ProjectTable";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";

import { mockProjects } from "@features/employees/data/mockData";

import { Button } from "@shared/components/ui/button";

export function ProjectList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleViewClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const filtered = mockProjects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="flex items-end justify-between py-4">
        <div>
          <h1 className="text-[30px] font-bold text-[#2e3040] tracking-tight leading-9">
            Projects
          </h1>
          <p className="text-[14px] font-medium text-[#585a68] mt-0.5">
            Manage enterprise-wide engineering allocation and project milestones.
          </p>
        </div>

        <Button onClick={() => navigate("/projects/create")} className="gap-2 h-11 px-6 rounded-md">
          <Plus className="w-3.5 h-3.5" />
          Create Project
        </Button>
      </div>

      <Card className=" p-0 mb-2">
        <CardContent className=" p-0 ">
          <ProjectFilters
            filters={{ search, status: statusFilter }}
            onFilterChange={(key, value) => {
              if (key === "search") setSearch(value);
              if (key === "status") setStatusFilter(value);
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <ProjectTable employees={filtered} onViewClick={handleViewClick} />
        </CardContent>
      </Card>
    </>
  );
}
