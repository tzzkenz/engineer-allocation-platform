import { useState } from "react";

import { Bell, Plus } from "lucide-react";

import { IconButton } from "@shared/components/icon-button/IconButton";
import { Button } from "@shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shared/components/ui/dialog";

import { type Requirement } from "../../../data/data";
import { SectionCard, SectionCardInner, SectionHeader } from "../../section/SectionCard";
import { RequirementTable } from "../requirement-table/RequirementTable";

interface RequirementsCardProps {
  requirements: Requirement[];
}

export function RequirementsCard({ requirements }: RequirementsCardProps) {
  const [raiseOpen, setRaiseOpen] = useState(false);

  return (
    <>
      <SectionCard>
        <SectionCardInner>
          <SectionHeader
            title="Project Requirements"
            actions={
              <>
                <IconButton
                  varient="outline"
                  icon={<Plus className="size-3.5" />}
                  label="+ Raise Request"
                  onClick={() => setRaiseOpen(true)}
                  className=" text-primary shadow-[6px_6px_12px_rgba(0,0,0,0.05),-6px_-6px_12px_rgba(255,255,255,0.8)]"
                />
                <IconButton
                  varient="outline"
                  icon={<Bell className="size-3.5 text-muted-foreground" />}
                  label="Requests"
                />
              </>
            }
          />
          <RequirementTable
            requirements={requirements}
            onAssign={() => {
              console.log("Assigne clicke");
            }}
          />
        </SectionCardInner>
      </SectionCard>

      {/* Raise Request dialog */}
      <Dialog open={raiseOpen} onOpenChange={setRaiseOpen}>
        <DialogContent className="rounded-3xl max-w-md border-border-strong">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-foreground">
              Raise a Request
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <FormInput label="Role" placeholder="e.g. Developer" />
            <FormInput label="Required Count" type="number" placeholder="1" />
            <FormInput label="Required Skills" placeholder="e.g. Python, React" />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="rounded-xl">
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setRaiseOpen(false)}
            >
              Raise Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function FormInput({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-muted-foreground tracking-wide">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="px-3 py-2.5 rounded-xl bg-secondary text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );
}
