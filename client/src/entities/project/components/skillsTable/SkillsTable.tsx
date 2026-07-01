import { useEffect, useState } from "react";

import { useGetEmployeeSkillsQuery } from "@/features/auth/services/employeeApi";
import { useAddEmployeeSkillsMutation, useDeleteEmployeeSkillMutation,} from "@/features/auth/services/employeeApi";
import { useGetAllSkillsQuery } from "@/features/auth/services/skillsApi";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useParams } from "react-router";

import { PROFICIENCY_LABELS, PROFICIENCY_OPTIONS } from "./constants";
import type { EmployeeSkillRow } from "./types";

export default function SkillsTable() {
  const { emp_id } = useParams();

  const { data: skills = [] } = useGetAllSkillsQuery();
 const [addEmployeeSkills, { isLoading: isAddingSkill }] =
  useAddEmployeeSkillsMutation();

const [deleteEmployeeSkill, { isLoading: isDeletingSkill }] =
  useDeleteEmployeeSkillMutation();

  const { data: employeeSkillsApi = [] } = useGetEmployeeSkillsQuery(Number(emp_id), {
    skip: !emp_id,
  });

  const [value, setValue] = useState<EmployeeSkillRow[]>([]);

  const [adding, setAdding] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState(false);

  const [selectedSkill, setSelectedSkill] = useState<number>();

  const [selectedProf, setSelectedProf] = useState(3);

  useEffect(() => {
    if (!employeeSkillsApi.length) return;

    setValue(
      employeeSkillsApi.map((skill) => ({
        skill_id: skill.skill_id,
        skill_name: skill.name,
        proficiency: skill.proficiency,
        is_interest: skill.is_interest,
      }))
    );
  }, [employeeSkillsApi]);

  const availableSkills = skills.filter(
    (skill) => !value.some((employeeSkill) => employeeSkill.skill_id === skill.id)
  );

  async function addSkill() {
    if (!selectedSkill || !emp_id) return;

    const skill = availableSkills.find((x) => x.id === selectedSkill);

    if (!skill) return;

    try {
      await addEmployeeSkills({
        employee_id: Number(emp_id),
        body: {
          skills: [
            {
              skill_id: skill.id,
              proficiency: selectedProf,
              is_interest: selectedInterest,
            },
          ],
        },
      }).unwrap();

      setValue((prev) => [
        ...prev,
        {
          skill_id: skill.id,
          skill_name: skill.name,
          proficiency: selectedProf,
          is_interest: selectedInterest,
        },
      ]);

      setAdding(false);
      setSelectedSkill(undefined);
      setSelectedProf(3);
      setSelectedInterest(false);
    } catch (err) {
      console.error(err);
    }
  }

async function deleteSkill(skill_id: number) {
  if (!emp_id) return;

  try {
    await deleteEmployeeSkill({
      employee_id: Number(emp_id),
      skill_id,
    }).unwrap();

    setValue((prev) =>
      prev.filter((skill) => skill.skill_id !== skill_id)
    );
  } catch (err) {
    console.error(err);
  }
}
  return (
    <Card className="rounded-3xl">
      <CardHeader className="flex flex-row justify-between items-center">
        <h2 className="text-xl font-semibold">Skills</h2>

        <Button variant="secondary" disabled={adding} onClick={() => setAdding(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </CardHeader>

      <CardContent>
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-sm text-muted-foreground">
              <th className="pb-4">Skill</th>

              <th className="pb-4">Proficiency</th>

              <th className="pb-4">Interest</th>

              <th className="pb-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {adding && (
              <tr className="border-b">
                <td className="py-4 pr-4">
                  <Select
                    value={selectedSkill ? String(selectedSkill) : undefined}
                    onValueChange={(v) => setSelectedSkill(Number(v))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Skill" />
                    </SelectTrigger>

                    <SelectContent>
                      {availableSkills.map((skill) => (
                        <SelectItem key={skill.id} value={String(skill.id)}>
                          {skill.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>

                <td className="py-4 pr-4">
                  <Select
                    value={String(selectedProf)}
                    onValueChange={(v) => setSelectedProf(Number(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {PROFICIENCY_OPTIONS.map((p) => (
                        <SelectItem key={p.value} value={String(p.value)}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="py-4 pr-4">
                  <Select
                    value={String(selectedInterest)}
                    onValueChange={(v) => setSelectedInterest(v === "true")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="false">Skill</SelectItem>

                      <SelectItem value="true">Interest</SelectItem>
                    </SelectContent>
                  </Select>
                </td>

                <td>
                  <div className="flex justify-center gap-2">
                    <Button size="sm" onClick={addSkill} disabled={isAddingSkill}>
                      {isAddingSkill ? "Saving..." : "Save"}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setAdding(false);
                        setSelectedSkill(undefined);
                        setSelectedProf(3);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </td>
              </tr>
            )}

            {value.map((skill) => (
              <tr key={skill.skill_id} className="border-b">
                <td className="py-5 font-medium">{skill.skill_name}</td>

                <td>
                  <span className="rounded-full bg-violet-100 px-3 py-1 text-xs text-violet-700">
                    {PROFICIENCY_LABELS[skill.proficiency]}
                  </span>
                </td>

                <td>
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      skill.is_interest ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {skill.is_interest ? "Interest" : "Skill"}
                  </span>
                </td>
                <td>
                  <div className="flex justify-center">
                    <Trash2
                      className="h-5 w-5 cursor-pointer text-red-500"
                      onClick={() => deleteSkill(skill.skill_id)}
                    />
                  </div>
                </td>
              </tr>
            ))}

            {value.length === 0 && !adding && (
              <tr>
                <td colSpan={3} className="py-10 text-center text-muted-foreground">
                  No skills added
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
