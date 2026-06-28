import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/lib/utils";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { skillLevelConfig } from "../../utils/styles";

const TABLE_HEADS = [
  { label: "SKILL" },
  { label: "PROFICIENCY", className: " text-right" },
  { label: "ACTIONS", className: " text-right" },
];

const SkillSection = ({ skills }) => {
  return (
    <Card className="flex-1  shadow-sm gap-0">
      <CardHeader className="px-8 pt-8 pb-0 border-b-0">
        <CardTitle>Skills</CardTitle>
        <CardAction>
          <Button variant="secondary" size="sm" className="gap-1.5">
            <Plus className="w-2.5 h-2.5" />
            Add Skill
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="px-8 pb-8 pt-6">
        <div className="flex pb-3">
          {TABLE_HEADS.map((head) => (
            <span
              key={head.label}
              className={cn(
                "flex-1 text-xs font-bold tracking-tight opacity-60 uppercase",
                head.className
              )}
            >
              {head.label}
            </span>
          ))}
        </div>

        <div>
          {skills.map((skill, idx) => {
            const cfg = skillLevelConfig[skill.level];
            return (
              <div key={skill.id}>
                <div className="flex items-center py-4">
                  <span className="flex-1 text-base font-semibold ">{skill.name}</span>
                  <div className="w-48">
                    <Badge
                      className={cn("rounded-full px-3 py-0.5 text-xs font-medium", cfg.badgeClass)}
                    >
                      {cfg.label}
                    </Badge>
                  </div>
                  <div className="w-24 flex items-center justify-end gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8 rounded-sm ">
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
                          className="size-8 rounded-sm text-red-500  hover:text-red-500"
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
