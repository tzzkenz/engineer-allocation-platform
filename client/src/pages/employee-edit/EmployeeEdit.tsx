import FormField from "@/features/employees/components/form-field/FormField";
import SkillSection from "@/features/employees/components/skill-section/SkillSection";
import { Button } from "@/shared/components/ui/button";
import PageSection from "@/shared/components/ui/section";
import { Save } from "lucide-react";

import { mockEmployee } from "@features/employees/data/mockData";
import InterestSection from "@/features/employees/components/interest-section/InterestSection";
export default function EmployeeEdit() {
    const employee= mockEmployee
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
            <Button className=" hover:scale-102 hover:bg-primary active:scale-97">
              <Save className="w-3.5 h-3.5" />
              save changes
            </Button>
          </div>
        }
      ></PageSection>
      <hr className=" mb-5"></hr>
      <div className="lg:flex flex-col w-full gap-5 max-lg:space-y-4">
        <div className="lg:flex w-full max-lg:space-y-4 ">
            <div className="lg:w-[70%] pr-5">
                <FormField/>
            </div>
            <div className="lg:w-[30%] pr-5 ">
                <InterestSection interests={employee.interests}/>

            </div>
        </div>
        <div className="lg:w-[70%] pr-5">
            <SkillSection skills={employee.skills}/>
        </div>
        
      </div>
    </>
    
  );
}
