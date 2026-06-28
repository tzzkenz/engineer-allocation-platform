import { Button } from "@/shared/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/lib/utils";
import { Badge, Pencil, Plus, Trash2 } from "lucide-react";

import { skillLevelConfig } from "../../utils/styles";

const cardStyle: React.CSSProperties = {
  boxShadow: "4px 4px 12px rgba(0,0,0,0.05), -4px -4px 12px rgba(255,255,255,0.8)",
};

const SkillSection = ({ skills }) => {
  return (
    <Card className="flex-1 rounded-[24px] border-[rgba(199,196,215,0.3)] gap-0" style={cardStyle}>
      <CardHeader className="px-8 pt-8 pb-0 border-b-0">
        <CardTitle className="text-[16px] font-normal text-[#2e3040]">Skills</CardTitle>
        <CardAction>
          <Button
            variant="secondary"
            size="sm"
            className="gap-1.5 rounded-[8px] bg-[#f2f3f9] text-[#4648d4] text-[11px] font-bold tracking-[0.55px] shadow-[4px_4px_8px_rgba(0,0,0,0.05),-4px_-4px_8px_rgba(255,255,255,0.8)] hover:bg-[#e6e8ee] hover:text-[#4648d4]"
          >
            <Plus className="w-2.5 h-2.5" />
            Add Skill
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="px-8 pb-8 pt-6">
        {/* Table header */}
        <div className="flex pb-3">
          <span className="flex-1 text-[11px] font-bold tracking-[0.55px] text-[#767586] uppercase">
            SKILL
          </span>
          <span className="w-48 text-[11px] font-bold tracking-[0.55px] text-[#767586] uppercase">
            PROFICIENCY
          </span>
          <span className="w-24 text-right text-[11px] font-bold tracking-[0.55px] text-[#767586] uppercase">
            ACTIONS
          </span>
        </div>
        <Separator className="bg-[rgba(199,196,215,0.3)]" />

        {/* Rows */}
        <div>
          {skills.map((skill, idx) => {
            const cfg = skillLevelConfig[skill.level];
            return (
              <div key={skill.id}>
                {idx > 0 && <Separator className="bg-[rgba(199,196,215,0.2)]" />}
                <div className="flex items-center py-4">
                  <span className="flex-1 text-[14px] font-semibold text-[#2e3040]">
                    {skill.name}
                  </span>
                  <div className="w-48">
                    <Badge
                      className={cn(
                        "rounded-full px-3 py-0.5 text-[14px] font-medium",
                        cfg.badgeClass
                      )}
                    >
                      {cfg.label}
                    </Badge>
                  </div>
                  <div className="w-24 flex items-center justify-end gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-[6px] text-[#767586] hover:bg-[#f2f3f9]"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span className="sr-only">Edit {skill.name}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit skill</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-[6px] text-[#dc2626] hover:bg-[#fef2f2] hover:text-[#dc2626]"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span className="sr-only">Remove {skill.name}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Remove skill</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillSection;
