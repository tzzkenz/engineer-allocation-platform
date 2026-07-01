import FormField from "@/features/employees/components/form-field/FormField";
import InterestSection from "@/features/employees/components/interest-section/InterestSection";
import SkillsTable from "@/entities/project/components/skillsTable/SkillsTable";

import { useGetEmployeeByIdQuery } from "@/features/auth/services/employeeApi";

import { Button } from "@/shared/components/ui/button";
import PageSection from "@/shared/components/ui/section";

import { Save } from "lucide-react";
import { useParams } from "react-router";

export default function EmployeeEdit() {
  const { emp_id } = useParams();

  const { data: employee } = useGetEmployeeByIdQuery(Number(emp_id));

  return (
    <>
      <PageSection
        title="Edit Employee"
        description="Update employee information"
        additionalContent={
          <div className="md:flex gap-2">
            <Button className="bg-secondary border-[#C7C4D7] text-black hover:bg-secondary hover:scale-102 active:scale-97">
              Cancel
            </Button>

            <Button className="hover:scale-102 hover:bg-primary active:scale-97">
              <Save className="w-3.5 h-3.5" />
              Save Changes
            </Button>
          </div>
        }
      />

      <hr className="mb-5" />

      <div className="flex flex-col gap-5">
        <div className="lg:flex w-full gap-5 max-lg:space-y-4">
          <div className="lg:w-[70%]">
            <FormField />
          </div>

          <div className="lg:w-[30%]">
            {/* <InterestSection interests={employee?.interests ?? []} /> */}
          </div>
        </div>

        <div className="lg:w-[70%]">
          <SkillsTable />
        </div>
      </div>
    </>
  );
}