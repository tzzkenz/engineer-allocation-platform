import FormField from "@/features/employees/components/form-field/FormField";
import InterestSection from "@/features/employees/components/interest-section/InterestSection";
import SkillSection from "@/features/employees/components/skill-section/SkillSection";
import { Button } from "@/shared/components/ui/button";
import { ChevronRight, SkipBack } from "lucide-react";
import { Link } from "react-router";

import { mockEmployee } from "@features/employees/data/mockData";

export default function EmployeeCreate() {
  const employee = mockEmployee;
  return (
    <>
      <div className="sm:flex justify-between items-center py-5 mb-3">
        <div className="flex  flex-col gap-1">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.55px] mb-2">
            <Link to="/employees" className=" hover:text-primary">
              Engineers
            </Link>
            <ChevronRight className="w-2.5 h-2.5 " />
            <span className="text-primary">Create Employee</span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight leading-9">Create Employee</h1>
          <p>Add a new employee to the organization .</p>
        </div>
        <div className="flex max-sm:flex-col gap-2 pt-4">
          <Button className="bg-white px-5 text-black border-">cancel</Button>
          <Button className="px-5">Create Employee</Button>
        </div>
      </div>
      <hr className=" mb-5"></hr>
      <div className="h-full">
        <div className="md:flex  space-y-6 w-full h-90 gap-5">
            <div className="md:w-[70%] h-full space-y-5">
                <FormField />
                <SkillSection skills={employee.skills}/>
                
            </div>
            <div className="md:w-[30%] h-full">
                 <InterestSection interests={employee.interests} />
                
            </div>
            
            
        </div>
      </div>
    </>
  );
}
