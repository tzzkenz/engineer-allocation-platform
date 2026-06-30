export type EngineerStatus = "active" | "shadow";
export type RequirementStatus = "understaffed" | "balanced" | "overstaffed";
export type ProjectStatus = "in_progress" | "planning" | "on_hold" | "completed";

export interface AssignedEngineer {
  id: string;
  name: string;
  initials: string;
  /** tailwind bg class for avatar circle */
  avatarBg: string;
  /** tailwind text class for avatar initials */
  avatarText: string;
  role: string;
  stack: string[];
  status: EngineerStatus;
  startDate: string;
}

export interface Requirement {
  id: string;
  role: string;
  expertise: string[];
  required: number;
  assigned: number;
  status: RequirementStatus;
}

export interface ProjectNote {
  id: string;
  date: string;
  addedBy: string;
  note: string;
}

export interface ProjectDetail {
  id: string;
  name: string;
  status: ProjectStatus;
  duration: string;
  startDate: string;
  endDate: string;
  engineers: AssignedEngineer[];
  requirements: Requirement[];
  notes: ProjectNote[];
}

export const mockProjectDetail: ProjectDetail = {
  id: "1",
  name: "Engineer Allocation System",
  status: "in_progress",
  duration: "4 Months",
  startDate: "01 Jun 2026",
  endDate: "30 Sep 2026",
  engineers: [
    {
      id: "e1",
      name: "Akash Kumar",
      initials: "AK",
      avatarBg: "bg-[#e0e1f4]",
      avatarText: "text-primary",
      role: "Developer",
      stack: ["Python", "React"],
      status: "active",
      startDate: "10 Jun 2026",
    },
    {
      id: "e2",
      name: "Amal Raj",
      initials: "AR",
      avatarBg: "bg-purple-100",
      avatarText: "text-purple-700",
      role: "Developer",
      stack: ["Flutter"],
      status: "shadow",
      startDate: "15 Jun 2026",
    },
  ],
  requirements: [
    {
      id: "r1",
      role: "Developer",
      expertise: ["Python", "React"],
      required: 2,
      assigned: 1,
      status: "understaffed",
    },
    {
      id: "r2",
      role: "QA",
      expertise: [],
      required: 1,
      assigned: 1,
      status: "balanced",
    },
  ],
  notes: [
    {
      id: "n1",
      date: "12 Jun 2026",
      addedBy: "Sarah Chen",
      note: "Initial project setup completed. All environment variables have been configured and CI pipeline is running successfully.",
    },
  ],
};
