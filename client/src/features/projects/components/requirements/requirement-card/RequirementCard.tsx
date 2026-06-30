import { useState } from "react";

import { Bell, Plus } from "lucide-react";

import type { RequirementResponse } from "@entities/project/types/apiTypes";

import { IconButton } from "@shared/components/icon-button/IconButton";

import AssignEngineerDialog from "../../assigned-engineer-card/AssignedEngineerCard";
import { SectionCard, SectionCardInner, SectionHeader } from "../../section/SectionCard";
import RequirementFormDialog from "../requirement-form-dlalog/requirement-form/RequirementFormDialog";
import { RequirementTable } from "../requirement-table/RequirementTable";

type RequirementsCardProps = {
  requirements: RequirementResponse[];
  projectId: string;
};

export function RequirementsCard({ requirements, projectId }: RequirementsCardProps) {
  const [raiseOpen, setRaiseOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

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
                  label="Raise Request"
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
              setIsAssignDialogOpen(true);
            }}
          />
        </SectionCardInner>
      </SectionCard>

      <RequirementFormDialog projectId={projectId} isOpen={raiseOpen} onOpenChange={setRaiseOpen} />
      <AssignEngineerDialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen} />
    </>
  );
}
