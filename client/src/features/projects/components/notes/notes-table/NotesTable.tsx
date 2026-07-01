import { Pencil, Trash2 } from "lucide-react";

import type { FeedbackResponse } from "@entities/project/types/apiTypes";

import { Button } from "@shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shared/components/ui/table";
import { formatDate } from "@shared/lib/format";

type ProjectNotesCardProps = {
  notes: FeedbackResponse[];
  onDelete: (note: FeedbackResponse) => void;
  onEdit: (note: FeedbackResponse) => void;
};

const NotesTable = ({ notes, onEdit, onDelete }: ProjectNotesCardProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Added By</TableHead>
          <TableHead>Note</TableHead>
          <TableHead className=" text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {notes.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              No notes yet.
            </TableCell>
          </TableRow>
        ) : (
          notes.map((note) => (
            <TableRow key={note.id}>
              <TableCell>{formatDate(note.created_at)}</TableCell>

              <TableCell>{note.creator.name}</TableCell>

              <TableCell>{note.note}</TableCell>

              <TableCell className=" text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    className=" text-primary"
                    size="icon"
                    onClick={() => onEdit(note)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    className=" hover:bg-red-100 text-red-600"
                    size="icon"
                    onClick={() => onDelete(note)}
                  >
                    <Trash2 className="h-4 w-4 " />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default NotesTable;
