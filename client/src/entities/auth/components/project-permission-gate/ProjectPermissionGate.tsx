import { type ReactNode } from "react";

import { useAppSelector } from "@/store/store";

type ProjectPermissionGateProps = {
  children: ReactNode;
};

const PermissionGate = ({ children }: ProjectPermissionGateProps) => {
  const { user, context } = useAppSelector((state) => state.auth);

  if (!context.projectRole || !user) return;

  const hasPermission = user.system_role_name === "HR" || context.projectRole.includes("LEAD");

  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
};

export default PermissionGate;
