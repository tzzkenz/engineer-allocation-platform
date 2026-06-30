import { useState } from "react";

import {
  useCreateFeedbackMutation,
  useDeleteFeedbackMutation,
  useUpdateFeedbackMutation,
} from "@/features/projects/services/feedbackApi";
import { MessageSquarePlus } from "lucide-react";

import type { FeedbackResponse } from "@entities/project/types/apiTypes";

import DeleteConfirmationDialog from "@shared/components/confirm-dlalog/DeleteConfirmationDialog";
import { IconButton } from "@shared/components/icon-button/IconButton";

import { SectionCard, SectionCardInner, SectionHeader } from "../../section/SectionCard";
import ProjectNoteDialog, { type ProjectNoteFormValues } from "../note-dialog/ProjectNoteDialog";
import NotesTable from "../notes-table/NotesTable";

// import { DeleteNoteDialog } from "./DeleteNoteDialog";

type ProjectNotesCardProps = {
  notes: FeedbackResponse[];
  projectId: string;
};

export function ProjectNotesCard({ projectId, notes }: ProjectNotesCardProps) {
  const [createNote, { isLoading: isNoteCreating }] = useCreateFeedbackMutation();
  const [updateNote, { isLoading: isNoteUpdating }] = useUpdateFeedbackMutation();
  const [deleteNote, { isLoading: isNoteDeleting }] = useDeleteFeedbackMutation();

  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);

  const [pendingDelete, setPendingDelete] = useState<FeedbackResponse | null>(null);
  const [pendingEdit, setPendingEdit] = useState<FeedbackResponse | null>(null);

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;

    deleteNote(pendingDelete.id);

    setPendingDelete(null);
  };

  const handleNoteSubmit = (data: ProjectNoteFormValues) => {
    if (pendingEdit) {
      updateNote({ feedbackId: pendingEdit.id, body: { feedback: data.note } });
    } else {
      createNote({ projectId, body: { note: data.note, feedback_type: data.type } });
    }
  };

  const handleEditClick = (note: FeedbackResponse) => {
    setPendingEdit(note);
    console.log(note);
    setIsNoteDialogOpen(true);
  };

  const handleDialogClose = () => {
    setPendingEdit(null);
    setIsNoteDialogOpen(false);
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
                onClick={() => setIsNoteDialogOpen(true)}
              />
            }
          />

          <NotesTable notes={notes} onDelete={setPendingDelete} onEdit={handleEditClick} />
        </SectionCardInner>
      </SectionCard>

      <ProjectNoteDialog
        open={isNoteDialogOpen}
        onOpenChange={handleDialogClose}
        onSubmit={handleNoteSubmit}
        defaultValues={
          pendingEdit ? { note: pendingEdit.note, type: pendingEdit.feedback_type } : undefined
        }
      />

      <DeleteConfirmationDialog
        title="Delete Note"
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
        description="Are you sure you want to delete this note ?"
        isDeleting={isNoteDeleting}
      />
    </>
  );
}
