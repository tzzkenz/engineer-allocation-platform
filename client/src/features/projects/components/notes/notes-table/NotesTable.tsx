import type { ProjectNote } from "@/features/projects/data/data";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

type ProjectNotesCardProps = {
  notes: ProjectNote[];
  onDelete: (id: number) => void;
};

const NotesTable = ({ notes, onDelete }: ProjectNotesCardProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Added By</TableHead>
          <TableHead>Note</TableHead>
          <TableHead>Actions</TableHead>
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
              <TableCell>{note.date}</TableCell>

              <TableCell>{note.addedBy}</TableCell>

              <TableCell>{note.note}</TableCell>

              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    className=" text-primary"
                    size="icon"
                    onClick={() => {
                      console.log("Hello world");
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button variant="ghost" size="icon" onClick={() => console.log("Hllo world")}>
                    <Trash2 className="h-4 w-4" />
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
