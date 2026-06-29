import { useState } from "react";

import { Plus } from "lucide-react";
import { useNavigate } from "react-router";

import { mockProjects } from "@features/employees/data/mockData";
import ProjectFilters from "@features/projects/components/project-filters/ProjectFIlters";
import ProjectTable from "@features/projects/components/project-table/ProjectTable";

import { Button } from "@shared/components/ui/button";
import { Card, CardContent } from "@shared/components/ui/card";
import PageSection from "@shared/components/ui/section";

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
      <PageSection
        title="Projects"
        description="Manage your projects and their associated tasks."
        additionalContent={
          <Button
            onClick={() => navigate("/projects/create")}
            className="gap-2 h-11 px-6 rounded-md"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Project
          </Button>
        }
      />

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
