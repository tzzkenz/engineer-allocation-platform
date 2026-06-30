import { type ProjectCreateFormData, projectCreateSchema } from "@/schemas/projectCreate.schema";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import PageSection from "@/shared/components/ui/section";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, CircleAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
export default function ProjectCreate() {
    const navigate=useNavigate()
  const checkForm = useForm<ProjectCreateFormData>({
    resolver: zodResolver(projectCreateSchema),
    defaultValues: {
      projectName: "",
    },
  });
  const onSubmit = (data: ProjectCreateFormData) => {
    console.log(data.projectName);
    navigate('/projects')
  };
  return (
    <>
      <PageSection
        title="Create Project"
        description="Define and create a new project"
        additionalContent={<></>}
      ></PageSection>
      <hr className=" mb-5"></hr>
      <Card className="w-full rounded-2xl shadow-sm ">
        <CardHeader className="py-6">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-primary">
            <CircleAlert className="h-5 w-5" />
            Project Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <form className="space-y-8 " onSubmit={checkForm.handleSubmit(onSubmit)}>
            <div className="md:grid grid-cols-2 gap-8 max-md:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="projectName">PROJECT NAME</Label>

                <Input
                  id="projectName"
                  placeholder="e.g. Helix Cloud Infrastructure"
                  className="h-12"
                  {...checkForm.register("projectName")}
                />
                {checkForm.formState.errors.projectName && (
                    <p className="text-sm text-red-500">{checkForm.formState.errors.projectName.message}</p>
                  )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">DURATION RANGE</Label>

                <div className="relative">
                  <Input
                    id="duration"
                    placeholder="Select start and end dates"
                    className="h-12 pr-12"
                    {...checkForm.register("duration")}
                  />

                  <CalendarDays className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="md:grid grid-cols-2 gap-8 max-md:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="startDate">START DATE (OPTIONAL)</Label>

                <div className="relative">
                  <Input id="startDate" placeholder="mm/dd/yyyy" className="h-12 pr-12"{...checkForm.register("startDate")} />

                  <CalendarDays className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">EXPECTED END DATE</Label>

                <Input
                  id="endDate"
                  disabled
                  placeholder="Calculated from duration"
                  className="h-12"
                  {...checkForm.register("endDate")}
                />
              </div>
            </div>

            <div className="border-t" />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="ghost"
                className="py-4 border-[#C7C4D7] hover:scale-102 active:scale-97 px-4"
              >
                Cancel
              </Button>

              <Button type="submit" className="min-w-40 py-4 hover:scale-102 active:scale-97">
                Create Project
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
