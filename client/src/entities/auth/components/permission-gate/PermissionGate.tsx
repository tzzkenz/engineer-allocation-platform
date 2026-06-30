import { type ReactNode } from "react";

type PermissionGateProps = {
  userRoles: string[];
  requiredRoles: string[];
  children: ReactNode;
};

const PermissionGate = ({ userRoles, requiredRoles, children }: PermissionGateProps) => {
  const hasPermission = requiredRoles.some((role) => userRoles.includes(role));

  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
};

export default PermissionGate;
