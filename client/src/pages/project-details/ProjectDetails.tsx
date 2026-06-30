import { ProjectNotesCard } from "@/features/projects/components/notes/notes-card/NotesCard";
import { RequirementsCard } from "@/features/projects/components/requirements/requirement-card/RequirementCard";
import PageSection from "@/shared/components/ui/section";
import { useParams } from "react-router";

import { ProjectInfoCard } from "@features/projects/components/project-info/ProjectInfoCard";
import { mockProjectDetail } from "@features/projects/data/data";

export function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const project = mockProjectDetail;

  return (
    <div className="flex flex-col gap-8 w-full py-6">
      <PageSection title="Project Details" />

      <ProjectInfoCard project={project} />

      <RequirementsCard requirements={project.requirements} />

      <ProjectNotesCard notes={project.notes} />
    </div>
  );
}
