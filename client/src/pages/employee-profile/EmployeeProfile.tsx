import PermissionGate from "@/entities/auth/components/permission-gate/PermissionGate";
import { SYSTEM_ROLES } from "@/entities/config/lib/roles";
import SkillsTable from "@/entities/project/components/skillsTable/SkillsTable";
import { useGetEmployeeByIdQuery } from "@/features/auth/services/employeeApi";
import { useGetEmployeeSkillsQuery } from "@/features/auth/services/employeeApi";
import InfoField from "@/features/employees/components/info-field/InfoField";
import InterestSection from "@/features/employees/components/interest-section/InterestSection";
import PageSection from "@/shared/components/ui/section";
import type { RootState } from "@/store/store";
import { Pencil } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useParams } from "react-router";

import { Button } from "@shared/components/ui/button";
import { Card, CardContent } from "@shared/components/ui/card";

export function EmployeeProfile() {
  const navigate = useNavigate();

  const { emp_id } = useParams();

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const employeeId = emp_id ? Number(emp_id) : currentUser?.id;

  const { data: currentEmployee, isLoading } = useGetEmployeeByIdQuery(employeeId!, {
    skip: !employeeId,
  });
  const { data: employeeSkillsApi = [] } = useGetEmployeeSkillsQuery(Number(employeeId));
  console.log(employeeSkillsApi);
  const interestNames = employeeSkillsApi
    .filter((skill) => skill.is_interest)
    .map((skill) => skill.name);

  return (
    <div className="w-full">
      <PageSection
        title="Employee Profile"
        description="View and manage employee information"
        additionalContent={
          <div className="md:flex gap-2">
            <PermissionGate requiredRoles={[SYSTEM_ROLES.HR]}>
              <Button
                onClick={() => navigate(`/employee/${currentEmployee?.id}/edit`)}
                className=" px-6 py-6 "
              >
                <Pencil className="w-4 h-4" />
                Edit Profile
              </Button>
            </PermissionGate>
          </div>
        }
      />

      <div className="flex flex-col gap-5 ">
        <div className="lg:flex w-full gap-5 max-lg:space-y-4">
          <div className="lg:w-[70%]">
            <Card className=" w-full h-full flex justify-center">
              <CardContent className="p-8">
                <div className="flex flex-col-reverse sm:flex-row items-center gap-12">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                    <InfoField label="FULL NAME" value={currentEmployee?.name || "N/A"} />
                    <InfoField label="EMAIL ADDRESS" value={currentEmployee?.email || "N/A"} />
                    <InfoField label="CURRENT ROLE" value={currentEmployee?.system_role_name || "N/A"} />
                    <InfoField label="TOTAL EXPERIENCE" value={currentEmployee?.experience || "N/A"} />
                    <InfoField
                      label="DATE OF JOINING"
                      value={currentEmployee?.date_of_joining || "N/A"}
                    />
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-extrabold tracking-[0.5px] opacity-60 uppercase">
                        AVAILABILITY STATUS
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        <span className="text-base">{currentEmployee?.projects_count < 2 ? "Available" : "Not Available"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:w-[30%] lg:pr-2">
            <InterestSection interests={interestNames} />
          </div>
        </div>

        <div className="lg:w-[70%] lg:pr-2">
          <SkillsTable />
        </div>
      </div>
    </div>
  );
}
