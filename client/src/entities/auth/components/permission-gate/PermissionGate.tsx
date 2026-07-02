import { type ReactNode } from "react";

import { useAppSelector } from "@/store/store";

type PermissionGateProps = {
  requiredRoles: string[];
  children: ReactNode;
};

const PermissionGate = ({ requiredRoles, children }: PermissionGateProps) => {
  const { user: authUser } = useAppSelector((state) => state.auth);
  const hasPermission = requiredRoles.some((role) => authUser!.system_role_name === role);

  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
};

export default PermissionGate;
