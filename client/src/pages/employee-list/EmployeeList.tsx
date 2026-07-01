import { Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router";

import { useGetEmployeesQuery } from "@features/employees/services/employeeApi";
import ProjectTableSkeleton from "@features/projects/components/loaders/project-table-skeleton/ProjectTableSkeleton";

import EmployeeTable from "@entities/employee/components/employee-table/EmployeeTable";

import ErrorDisplay from "@shared/components/error-display/ErrorDisplay";
import { Button } from "@shared/components/ui/button";
import { Card, CardContent } from "@shared/components/ui/card";
import PageSection from "@shared/components/ui/section";

export function EmployeeList() {
  const navigate = useNavigate();

  const { data: employees = [], isLoading, isError, refetch } = useGetEmployeesQuery();

  const handleViewClick = (employeeId: number) => {
    navigate(`/employee/${employeeId}`);
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
              {isLoading ? (
                <ProjectTableSkeleton />
              ) : (
                <EmployeeTable
                  employees={employees}
                  renderActions={(employee) => (
                    <Button variant="ghost" onClick={() => handleViewClick(employee.id)}>
                      <Eye />
                    </Button>
                  )}
                />
              )}
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
}
