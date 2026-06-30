import { useState } from "react";

import { MessageSquarePlus } from "lucide-react";

import { IconButton } from "@shared/components/icon-button/IconButton";

import { type ProjectNote } from "../../../data/data";
import { SectionCard, SectionCardInner, SectionHeader } from "../../section/SectionCard";
import NotesTable from "../notes-table/NotesTable";

// import { DeleteNoteDialog } from "./DeleteNoteDialog";

interface ProjectNotesCardProps {
  notes: ProjectNote[];
}

export function ProjectNotesCard({ notes: initialNotes }: ProjectNotesCardProps) {
  const [notes, setNotes] = useState<ProjectNote[]>(initialNotes);

  const [pendingDelete, setPendingDelete] = useState<ProjectNote | null>(null);

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;

    setNotes((prev) => prev.filter((note) => note.id !== pendingDelete.id));

    setPendingDelete(null);
  };

  return (
    <>
      <SectionCard>
        <SectionCardInner>
          <SectionHeader
            title="Project Notes"
            actions={
              <IconButton
                varient="outline"
                className=" text-primary"
                icon={<MessageSquarePlus className="size-3.5" />}
                label="Add Note"
              />
            }
          />

          <NotesTable notes={notes} onDelete={setPendingDelete} />
        </SectionCardInner>
      </SectionCard>

      {/* <DeleteNoteDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
        noteName={pendingDelete ? `"${pendingDelete.addedBy}'s note"` : undefined}
      /> */}
    </>
  );
}
