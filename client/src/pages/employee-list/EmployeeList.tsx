import { useState } from "react";

import { Eye, Plus } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";

import EmployeeFilters, {
  type EmployeeFilters as EmployeeFiltersType,
} from "@features/employees/components/employee-filter/EmployeeFilter";
import { useGetEmployeesQuery } from "@features/employees/services/employeeApi";
import ProjectTableSkeleton from "@features/projects/components/loaders/project-table-skeleton/ProjectTableSkeleton";

import EmployeeTable from "@entities/employee/components/employee-table/EmployeeTable";

import ErrorDisplay from "@shared/components/error-display/ErrorDisplay";
import { Paginated } from "@shared/components/paginated/Paginated";
import { Button } from "@shared/components/ui/button";
import { Card, CardContent } from "@shared/components/ui/card";
import PageSection from "@shared/components/ui/section";

const generateEmployeeFilterPayload = (
  urlParams: URLSearchParams,
  filters: EmployeeFiltersType
) => {
  const newParams = new URLSearchParams(urlParams);

  const skills = filters.nonTechnicals.concat(filters.technicals, filters.stacks);
  console.log(skills, "COMBINED SKILLS");
  skills.forEach((skill) => newParams.append("skills", skill.id.toString()));

  if (filters.identifier.trim() !== "") newParams.set("identifier", filters.identifier);

  if (filters.systemRoleId) newParams.set("system_role_id", filters.systemRoleId.toString());

  return newParams;
};

export function EmployeeList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<EmployeeFiltersType>({
    identifier: "",
    technicals: [],
    nonTechnicals: [],
    stacks: [],
    systemRoleId: null,
  });

  const {
    data: employees = { items: [], total_pages: 0, current_page: 1, limit: 10 },
    isLoading,
    isError,
    refetch,
  } = useGetEmployeesQuery(generateEmployeeFilterPayload(searchParams, filters).toString());

  const handleViewClick = (employeeId: number) => {
    navigate(`/employee/${employeeId}`);
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
        title="Employees"
        description="Manage your employees and their associated tasks."
        additionalContent={
          <Button
            onClick={() => navigate("/employee/create")}
            className="gap-2 h-11 px-6 rounded-md"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Employee
          </Button>
        }
      />

      {isError ? (
        <div className="px-4">
          <ErrorDisplay
            title="Failed to load employees"
            description="There was an error while fetching the employee data. Please try again."
            onRetry={refetch}
          />
        </div>
      ) : (
        <>
          <Card>
            <CardContent>
              <EmployeeFilters filters={filters} onFilterChange={handleFilterChange} />

              {isLoading ? (
                <ProjectTableSkeleton />
              ) : (
                <>
                  <EmployeeTable
                    employees={employees.items}
                    renderActions={(employee) => (
                      <Button variant="ghost" onClick={() => handleViewClick(employee.id)}>
                        <Eye />
                      </Button>
                    )}
                  />
                  <Paginated
                    page={
                      searchParams.get("page")
                        ? parseInt(searchParams.get("page") as string, 10)
                        : 1
                    }
                    totalPages={employees.total_pages}
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
