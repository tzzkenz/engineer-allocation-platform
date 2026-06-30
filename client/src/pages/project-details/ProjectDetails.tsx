import { useParams } from "react-router";

import { ProjectNotesCard } from "@features/projects/components/notes/notes-card/NotesCard";
import { ProjectInfoCard } from "@features/projects/components/project-info/ProjectInfoCard";
import { RequirementsCard } from "@features/projects/components/requirements/requirement-card/RequirementCard";
import { mockProjectDetail } from "@features/projects/data/data";
import { useGetProjectQuery } from "@features/projects/services/projectApi";

import PageSection from "@shared/components/ui/section";

export function ProjectDetails() {
  const { id } = useParams<{ id: string }>();

  const {
    data: project,
    isLoading: isProjectLoading,
    isError,
  } = useGetProjectQuery(id!, {
    skip: !id,
  });

  const dummyProject = mockProjectDetail;

  return (
    <div className="flex flex-col gap-8 w-full py-6">
      <PageSection title="Project Details" />

      {project && <ProjectInfoCard project={project} />}

      <RequirementsCard projectId={id!} requirements={dummyProject.requirements} />

      <ProjectNotesCard notes={dummyProject.notes} />
    </div>
  );
}
