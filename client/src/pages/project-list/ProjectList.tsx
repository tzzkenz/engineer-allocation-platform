import { useRef, useState } from "react";

import { useGetProjectsQuery } from "@/features/projects/services/projectApi";
import { Paginated } from "@/shared/components/paginated/Paginated";
import { Plus } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";

import ProjectTableSkeleton from "@features/projects/components/loaders/project-table-skeleton/ProjectTableSkeleton";
import ProjectFilters from "@features/projects/components/project-filters/ProjectFIlters";
import ProjectTable from "@features/projects/components/project-table/ProjectTable";

import ErrorDisplay from "@shared/components/error-display/ErrorDisplay";
import { Button } from "@shared/components/ui/button";
import { Card, CardContent } from "@shared/components/ui/card";
import PageSection from "@shared/components/ui/section";

const generateProjectFilterPayload = (urlParams: URLSearchParams, filters: ProjectFilters) => {
  const newParams = new URLSearchParams(urlParams);

  filters.skills.forEach((skill) => newParams.append("skills", skill.id.toString()));

  if (filters.identifier.trim() !== "") newParams.set("identifier", filters.identifier);

  if (!(filters.status === "all")) newParams.set("status", filters.status);

  return newParams;
};

export function ProjectList() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<ProjectFilters>({
    identifier: "",
    skills: [],
    status: "all",
  });

  const {
    data: projects = { items: [], total_pages: 0, current_page: 0, limit: 0 },
    isLoading,
    isError,
    refetch,
  } = useGetProjectsQuery(generateProjectFilterPayload(searchParams, filters).toString());

  const handleViewClick = (projectId: number) => {
    navigate(`/project/${projectId}`);
  };

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", page.toString());
      return newParams;
    });
  };

  const handleFilterChange = (name: string, value: any) => {
    console.log(name, value);
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <PageSection
        title="Projects"
        description="Manage your projects and their associated tasks."
        additionalContent={
          <Button
            onClick={() => navigate("/project/create")}
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
              <ProjectFilters filters={filters} onFilterChange={handleFilterChange} />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              {isLoading ? (
                <ProjectTableSkeleton />
              ) : (
                <>
                  <ProjectTable employees={projects.items} onViewClick={handleViewClick} />
                  <Paginated
                    totalPages={projects.total_pages}
                    page={searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
}
