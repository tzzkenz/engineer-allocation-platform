import InfoField from "@/features/employees/components/info-field/InfoField";
import InterestSection from "@/features/employees/components/interest-section/InterestSection";
import SkillSection from "@/features/employees/components/skill-section/SkillSection";
import { ChevronRight, Pencil } from "lucide-react";
import { Link } from "react-router";

import { mockEmployee } from "@features/employees/data/mockData";

import { Avatar, AvatarFallback, AvatarImage } from "@shared/components/ui/avatar";
import { Button } from "@shared/components/ui/button";
import { Card, CardContent } from "@shared/components/ui/card";

export function EmployeeProfile() {
  const employee = mockEmployee;

  return (
    <div className="w-full">
      <div className="flex items-end justify-between py-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.55px] mb-2">
            <Link to="/employees" className=" hover:text-primary">
              Employees
            </Link>
            <ChevronRight className="w-2.5 h-2.5 " />
            <span className="text-primary">{employee.name}</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight leading-9">Employee Profile</h1>
        </div>

        <Button className=" px-6 py-6 ">
          <Pencil className="w-4 h-4" />
          Edit Profile
        </Button>
      </div>

      <Card className=" mb-6 gap-0">
        <CardContent className="p-8">
          <div className="flex flex-col-reverse sm:flex-row items-center gap-12">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
              <InfoField label="FULL NAME" value={employee.name} />
              <InfoField label="EMAIL ADDRESS" value={employee.email} />
              <InfoField label="CURRENT ROLE" value={employee.role} />
              <InfoField label="TOTAL EXPERIENCE" value={employee.experience} />

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-extrabold tracking-[0.5px] opacity-60 uppercase">
                  AVAILABILITY STATUS
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-base">Available</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm font-extrabold tracking-[0.5px] opacity-60 uppercase pb-1">
                  ACTIVE PROJECTS
                </span>
                <div className="h-2 rounded-full bg-gray-200 w-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${(employee.activeProjects / employee.maxProjects) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-[11px] font-bold text-primary tracking-[0.55px]">
                  {employee.activeProjects} / {employee.maxProjects} Allocated
                </span>
              </div>
            </div>

            <div className="relative shrink-0">
              <Avatar className="size-48 border-4  shadow-xl">
                <AvatarImage
                  src="https://randomuser.me/api/portraits/men/34.jpg"
                  alt={employee.name}
                />
                <AvatarFallback className="bg-primary text-white text-3xl font-bold">
                  AK
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-2 right-2 w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Pencil className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-8 mb-6">
        <SkillSection skills={employee.skills} />

        <InterestSection interests={employee.interests} />
      </div>
    </div>
  );
}
