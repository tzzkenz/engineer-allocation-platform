import { useEffect } from "react";

import { useGetProjectQuery } from "@/features/projects/services/projectApi";
import { useCreateProjectMutation } from "@/features/projects/services/projectCreateApi";
import { useEditProjectMutation } from "@/features/projects/services/projectEditApi";
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
import { useParams } from "react-router";

export default function ProjectCreate() {
  const { projectId } = useParams();
  const isEdit = !!projectId;
  const [createProject, { isLoading: isCreateLoading }] = useCreateProjectMutation();
  const [editProject, { isLoading: isEditLoading }] = useEditProjectMutation();

  const {
    data: project,
    isLoading: isProjectLoading,
    isError,
  } = useGetProjectQuery(projectId!, {
    skip: !projectId,
  });

  const isLoading = isCreateLoading || isEditLoading;

  const navigate = useNavigate();
  const checkForm = useForm<ProjectCreateFormData>({
    resolver: zodResolver(projectCreateSchema),
    defaultValues: {
      name: "",
      duration: undefined,
      start_date: undefined,
      status: "NOT_STARTED",
    },
  });
  const onSubmit = async (data: ProjectCreateFormData) => {
    console.log("onSubmit called");
    console.log(data);
    if (!isEdit) {
      try {
        const response = await createProject(data).unwrap();

        console.log(response);

        navigate(`/project/${response.id}`);
      } catch (err) {
        console.log("failed");
      }
    }
    if (isEdit) {
      try {
        const response = await editProject({ projectId, ...data }).unwrap();
        console.log(response);
        navigate(`/project/${projectId}`);
      } catch (err) {
        console.log("failed");
      }
    }
  };

  useEffect(() => {
    if (isProjectLoading || isError) return;

    if (!project) return;

    console.log("Runned");
    checkForm.reset({
      name: project.name,
      duration: project.duration,
      start_date: project.start_date,
      status: project.status,
    });
  }, [checkForm, project, isProjectLoading, isError]);
  return (
    <>
      <PageSection
        title={isEdit ? "Edit Project" : "Create Project"}
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
          <form
            className="space-y-8 "
            onSubmit={(e) => {
              console.log(checkForm.formState.errors);
              checkForm.handleSubmit(onSubmit)(e);
            }}
          >
            <div className="md:grid grid-cols-2 gap-8 max-md:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">PROJECT NAME</Label>

                <Input
                  id="name"
                  placeholder="e.g. Helix Cloud Infrastructure"
                  className="h-12"
                  {...checkForm.register("name")}
                />
                {checkForm.formState.errors.name && (
                  <p className="text-sm text-red-500">{checkForm.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">DURATION RANGE</Label>

                <div className="relative">
                  <Input
                    id="duration"
                    type="number"
                    placeholder="Select start and end dates"
                    className="h-12 pr-12"
                    {...checkForm.register("duration", {
                      setValueAs: (value) => (value === "" ? undefined : Number(value)),
                    })}
                  />

                  <CalendarDays className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="md:grid grid-cols-2 gap-8 max-md:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="start_date">START DATE (OPTIONAL)</Label>

                <div className="relative">
                  <Input
                    id="start_date"
                    type="date"
                    placeholder="yyyy-mm-dd"
                    className="h-12 pr-12"
                    {...checkForm.register("start_date")}
                  />

                  <CalendarDays className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">PROJECT STATUS</Label>

                <Input
                  id="status"

                  placeholder="Status of Project"
                  className="h-12"
                  {...checkForm.register("status", {
                    setValueAs: (value) => (value === "" ? undefined : value),
                  })}
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
                {isEdit
                  ? isLoading
                    ? "Updating..."
                    : "Update Project"
                  : isLoading
                    ? "Creating...."
                    : "Create Project"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
