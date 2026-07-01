import FormField from "@/features/employees/components/form-field/FormField";
import { mockEmployee } from "@features/employees/data/mockData";
import { useGetAllSkillsQuery } from "@/features/auth/services/skillsApi";
import PageSection from "@/shared/components/ui/section";
export default function EmployeeCreate() {
  const employee = mockEmployee;
    const {data: skills,isLoading: isSkillLoading} = useGetAllSkillsQuery();
    console.log(skills);
  return (
    <>
      <PageSection
        title="Create Employee"
        description="Add a new employee to the organization"
        additionalContent={<></>}/>

      <hr className=" mb-5"></hr>
      <div className="h-full">
        <div className="md:flex  space-y-6 w-full  gap-5">
            <div className="w-full">
              <FormField/>
            </div>
        </div>
      </div>
    </>
  );
}
