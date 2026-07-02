import { useEffect } from "react";

import { attachContext } from "@/features/auth/slice/authReducer";
import ProjectEmployees from "@/features/projects/components/project-employees/ProjectEmployees";
import { useAppSelector } from "@/store/store";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";

import { ProjectNotesCard } from "@features/projects/components/notes/notes-card/NotesCard";
import { ProjectInfoCard } from "@features/projects/components/project-info/ProjectInfoCard";
import { RequirementsCard } from "@features/projects/components/requirements/requirement-card/RequirementCard";
import {
  useGetProjectEmployeesQuery,
  useGetProjectNotesQuery,
  useGetProjectQuery,
  useGetProjectRequirementsQuery,
} from "@features/projects/services/projectApi";

import PageSection from "@shared/components/ui/section";

export function ProjectDetails() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const { user: authUser } = useAppSelector((state) => state.auth);
  const dispatch = useDispatch();

  const {
    data: project,
    isLoading: isProjectLoading,
    isError,
  } = useGetProjectQuery(id!, {
    skip: !id,
  });

  const { data: requirements = [], isLoading: isRequirementsLoading } =
    useGetProjectRequirementsQuery(id!, {
      skip: !id,
    });

  const { data: projectNotes = [], isLoading: isNotesLoading } = useGetProjectNotesQuery(id!, {
    skip: !id,
  });

  const { data: projectEmployees = [], isLoading: isEmployeesLoading } =
    useGetProjectEmployeesQuery(id!, {
      skip: !id,
    });

  useEffect(() => {
    if (isEmployeesLoading || !authUser || !projectEmployees) return;

    const currentEmployeeRoles = projectEmployees
      .filter((employee) => employee.employee.id == authUser.id)
      .map((employee) => employee.project_role_name);
    console.log(currentEmployeeRoles);
    dispatch(attachContext({ projectRole: currentEmployeeRoles }));
  }, [authUser, isEmployeesLoading, projectEmployees]);

  return (
    <div className="flex flex-col gap-8 w-full py-6">
      <PageSection title="Project Details" />

      {project && (
        <ProjectInfoCard project={project} onEdit={() => navigate(`/project/${id}/edit`)} />
      )}

      <ProjectEmployees employees={projectEmployees} />
      <RequirementsCard projectId={id!} requirements={requirements} />

      <ProjectNotesCard projectId={id!} notes={projectNotes} />
    </div>
  );
}
