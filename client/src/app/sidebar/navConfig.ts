import { FolderKanban, LayoutDashboard, type LucideIcon, Settings, Users } from "lucide-react";

export interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
  /** exact match for active detection */
  end?: boolean;
}

export const navConfig: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/", end: true },
  { label: "Projects", icon: FolderKanban, href: "/project" },
  { label: "Employees", icon: Users, href: "/employee" },
  { label: "Settings", icon: Settings, href: "/settings" },
];
