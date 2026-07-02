import { FolderKanban, LayoutDashboard, type LucideIcon, User, Users } from "lucide-react";

export interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
  /** exact match for active detection */
  end?: boolean;
  allowedRoles: string[] | string;
}

export const navConfig: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/", end: true, allowedRoles: ["HR"] },
  { label: "Projects", icon: FolderKanban, href: "/project", allowedRoles: "*" },
  { label: "Employees", icon: Users, href: "/employee", allowedRoles: "*" },
  { label: "Profile", icon: User, href: "/profile", allowedRoles: "*" },
];

export const getAllowedConfigs = (userRole: string) => {
  return navConfig.filter(
    (eachConfig) => eachConfig.allowedRoles == "*" || eachConfig.allowedRoles.includes(userRole)
  );
};
