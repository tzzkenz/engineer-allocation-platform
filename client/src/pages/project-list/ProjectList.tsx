import { useState } from "react";

import { Plus } from "lucide-react";
import { useNavigate } from "react-router";

import ProjectTableSkeleton from "@features/projects/components/loaders/project-table-skeleton/ProjectTableSkeleton";
import ProjectFilters from "@features/projects/components/project-filters/ProjectFIlters";
import ProjectTable from "@features/projects/components/project-table/ProjectTable";
import { useGetProjectsQuery } from "@features/projects/services/employeeApi";

import ErrorDisplay from "@shared/components/error-display/ErrorDisplay";
import { Button } from "@shared/components/ui/button";
import { Card, CardContent } from "@shared/components/ui/card";
import PageSection from "@shared/components/ui/section";

export function ProjectList() {
  const navigate = useNavigate();

  const { data: projects = [], isLoading, isError, refetch } = useGetProjectsQuery();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleViewClick = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  const filtered = projects.filter((p) => {
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

      {isError ? (
        <div className="px-4">
          <ErrorDisplay
            title="Failed to load projects"
            description="There was an error while fetching the project data. Please try again."
            onRetry={refetch}
          />
        </div>
      ) : (
        <>
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
              {isLoading ? (
                <ProjectTableSkeleton />
              ) : (
                <ProjectTable employees={filtered} onViewClick={handleViewClick} />
              )}
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
}
